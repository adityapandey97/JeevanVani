import db from '../config/db.js';
import { User, BeneficiaryProfile, JobRole, AssessmentSession, Recommendation } from '../models/index.js';

export async function getDashboardStats(req, res, next) {
  try {
    if (db.getDriver() === 'mongodb') {
      const [
        totalBeneficiaries,
        totalAssessments,
        totalRecommendations,
        totalJobRoles,
        popularSectorsAgg,
        eduDistributionAgg,
        prefDistributionAgg,
        topRolesAgg,
      ] = await Promise.all([
        User.countDocuments({ role: 'beneficiary' }),
        AssessmentSession.countDocuments({ status: 'completed' }),
        Recommendation.countDocuments(),
        JobRole.countDocuments(),
        Recommendation.aggregate([
          { $group: { _id: '$sector', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 6 },
          { $project: { _id: 0, sector: '$_id', count: 1 } },
        ]),
        BeneficiaryProfile.aggregate([
          { $group: { _id: { $ifNull: ['$education', 'Not Specified'] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 0, education_level: '$_id', count: 1 } },
        ]),
        BeneficiaryProfile.aggregate([
          { $group: { _id: { $ifNull: ['$employment_preference', 'Both'] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 0, preference: '$_id', count: 1 } },
        ]),
        Recommendation.aggregate([
          {
            $group: {
              _id: '$role_name',
              sector: { $first: '$sector' },
              recommendation_count: { $sum: 1 },
              avg_score: { $avg: '$match_score' },
            },
          },
          { $sort: { recommendation_count: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              role_name: '$_id',
              sector: 1,
              recommendation_count: 1,
              avg_score: { $round: ['$avg_score', 1] },
            },
          },
        ]),
      ]);

      return res.json({
        success: true,
        stats: {
          totalBeneficiaries,
          totalAssessments,
          totalRecommendations,
          totalJobRoles,
          topRecommendedRoles: topRolesAgg,
          popularSectors: popularSectorsAgg,
          educationDistribution: eduDistributionAgg,
          employmentPreferences: prefDistributionAgg,
        },
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    const usersCountRes = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'beneficiary'");
    const totalBeneficiaries = Number(usersCountRes.rows[0]?.count || 0);

    const assessCountRes = await db.query("SELECT COUNT(*) as count FROM assessment_sessions WHERE status = 'completed'");
    const totalAssessments = Number(assessCountRes.rows[0]?.count || 0);

    const recCountRes = await db.query("SELECT COUNT(*) as count FROM recommendations");
    const totalRecommendations = Number(recCountRes.rows[0]?.count || 0);

    const topRolesRes = await db.query(
      `SELECT jr.role_name, jr.sector, COUNT(r.id) as recommendation_count, ROUND(AVG(r.match_score), 1) as avg_score
       FROM recommendations r
       JOIN job_roles jr ON r.job_role_id = jr.id
       GROUP BY jr.id, jr.role_name, jr.sector
       ORDER BY recommendation_count DESC
       LIMIT 5`
    );

    const sectorsRes = await db.query(
      `SELECT jr.sector, COUNT(r.id) as count
       FROM recommendations r
       JOIN job_roles jr ON r.job_role_id = jr.id
       GROUP BY jr.sector
       ORDER BY count DESC
       LIMIT 6`
    );

    const eduRes = await db.query(
      `SELECT COALESCE(education, 'Not Specified') as education_level, COUNT(*) as count
       FROM beneficiary_profiles
       GROUP BY education_level
       ORDER BY count DESC`
    );

    const prefRes = await db.query(
      `SELECT COALESCE(employment_preference, 'Both') as preference, COUNT(*) as count
       FROM beneficiary_profiles
       GROUP BY preference
       ORDER BY count DESC`
    );

    const catalogCountRes = await db.query("SELECT COUNT(*) as count FROM job_roles");
    const totalJobRoles = Number(catalogCountRes.rows[0]?.count || 0);

    res.json({
      success: true,
      stats: {
        totalBeneficiaries,
        totalAssessments,
        totalRecommendations,
        totalJobRoles,
        topRecommendedRoles: topRolesRes.rows,
        popularSectors: sectorsRes.rows,
        educationDistribution: eduRes.rows,
        employmentPreferences: prefRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    if (db.getDriver() === 'mongodb') {
      const beneficiaries = await User.find({ role: 'beneficiary' }).sort({ createdAt: -1 });
      const usersWithProfiles = await Promise.all(
        beneficiaries.map(async (u) => {
          const profile = await BeneficiaryProfile.findOne({ user: u._id });
          const recCount = await Recommendation.countDocuments({ user: u._id });
          return {
            id: u._id,
            name: u.name,
            mobile: u.mobile,
            email: u.email,
            preferred_language: u.preferred_language,
            role: u.role,
            created_at: u.createdAt,
            age: profile?.age,
            education: profile?.education,
            employment_status: profile?.employment_status,
            work_experience: profile?.work_experience,
            preferred_location: profile?.preferred_location,
            willing_to_relocate: profile?.willing_to_relocate,
            employment_preference: profile?.employment_preference,
            profile_completion: profile?.profile_completion || 0,
            recommendations_count: recCount,
          };
        })
      );

      return res.json({
        success: true,
        count: usersWithProfiles.length,
        users: usersWithProfiles,
      });
    }

    // SQL Mode
    const usersRes = await db.query(
      `SELECT u.id, u.name, u.mobile, u.email, u.preferred_language, u.role, u.created_at,
              bp.age, bp.education, bp.employment_status, bp.work_experience, bp.preferred_location,
              bp.willing_to_relocate, bp.employment_preference, bp.profile_completion,
              (SELECT COUNT(*) FROM recommendations r WHERE r.user_id = u.id) as recommendations_count
       FROM users u
       LEFT JOIN beneficiary_profiles bp ON u.id = bp.user_id
       WHERE u.role = 'beneficiary'
       ORDER BY u.created_at DESC`
    );

    res.json({
      success: true,
      count: usersRes.rows.length,
      users: usersRes.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminJobRoles(req, res, next) {
  try {
    if (db.getDriver() === 'mongodb') {
      const roles = await JobRole.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        jobRoles: roles,
      });
    }

    // SQL Mode
    const rolesRes = await db.query('SELECT * FROM job_roles ORDER BY id DESC');
    const roles = [];

    for (const r of rolesRes.rows) {
      const skillsRes = await db.query(
        `SELECT s.id, s.name, s.category, jrs.importance_weight, jrs.required_level
         FROM job_role_skills jrs
         JOIN skills s ON jrs.skill_id = s.id
         WHERE jrs.job_role_id = $1`,
        [r.id]
      );

      let careerPath = [];
      try {
        careerPath = typeof r.career_path === 'string' ? JSON.parse(r.career_path) : r.career_path;
      } catch {}

      roles.push({
        ...r,
        career_path: careerPath,
        skills: skillsRes.rows,
      });
    }

    res.json({
      success: true,
      jobRoles: roles,
    });
  } catch (error) {
    next(error);
  }
}

export async function createJobRole(req, res, next) {
  try {
    const { role_name, sector, nsqf_level, description, required_education, training_duration, career_path, skills = [] } = req.body;

    if (!role_name || !sector || !nsqf_level || !required_education) {
      return res.status(400).json({ success: false, message: 'Role Name, Sector, NSQF Level, and Required Education are mandatory.' });
    }

    if (db.getDriver() === 'mongodb') {
      const newRole = await JobRole.create({
        role_name: role_name.trim(),
        sector: sector.trim(),
        nsqf_level: Number(nsqf_level),
        description: description || '',
        required_education: required_education.trim(),
        training_duration: training_duration || '300 Hours',
        skills: Array.isArray(skills) ? skills : [],
        career_path: Array.isArray(career_path) ? career_path : [],
      });

      return res.status(201).json({
        success: true,
        message: 'NSQF Job Role created successfully in MongoDB.',
        jobRole: newRole,
      });
    }

    // SQL Mode
    const careerPathStr = typeof career_path === 'string' ? career_path : JSON.stringify(career_path || []);

    const insertRes = await db.query(
      `INSERT INTO job_roles (role_name, sector, nsqf_level, description, required_education, training_duration, career_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [role_name.trim(), sector.trim(), Number(nsqf_level), description || '', required_education.trim(), training_duration || '300 Hours', careerPathStr]
    );

    const newRole = insertRes.rows[0];

    if (Array.isArray(skills) && skills.length > 0) {
      for (const sk of skills) {
        if (sk.skill_id) {
          await db.query(
            `INSERT INTO job_role_skills (job_role_id, skill_id, importance_weight, required_level)
             VALUES ($1, $2, $3, $4)`,
            [newRole.id, sk.skill_id, sk.importance_weight || 1.0, sk.required_level || 'Basic']
          );
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'NSQF Job Role created successfully.',
      jobRole: newRole,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateJobRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role_name, sector, nsqf_level, description, required_education, training_duration, career_path } = req.body;

    if (db.getDriver() === 'mongodb') {
      const updateData = {};
      if (role_name) updateData.role_name = role_name;
      if (sector) updateData.sector = sector;
      if (nsqf_level) updateData.nsqf_level = Number(nsqf_level);
      if (description) updateData.description = description;
      if (required_education) updateData.required_education = required_education;
      if (training_duration) updateData.training_duration = training_duration;
      if (career_path) updateData.career_path = Array.isArray(career_path) ? career_path : [];

      const updated = await JobRole.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Job role not found.' });
      }

      return res.json({
        success: true,
        message: 'Job role updated successfully.',
        jobRole: updated,
      });
    }

    // SQL Mode
    const careerPathStr = typeof career_path === 'string' ? career_path : JSON.stringify(career_path || []);

    const updateRes = await db.query(
      `UPDATE job_roles
       SET role_name = COALESCE($1, role_name),
           sector = COALESCE($2, sector),
           nsqf_level = COALESCE($3, nsqf_level),
           description = COALESCE($4, description),
           required_education = COALESCE($5, required_education),
           training_duration = COALESCE($6, training_duration),
           career_path = COALESCE($7, career_path)
       WHERE id = $8 RETURNING *`,
      [role_name, sector, nsqf_level ? Number(nsqf_level) : null, description, required_education, training_duration, careerPathStr, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found.' });
    }

    res.json({
      success: true,
      message: 'Job role updated successfully.',
      jobRole: updateRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteJobRole(req, res, next) {
  try {
    const { id } = req.params;

    if (db.getDriver() === 'mongodb') {
      const deleted = await JobRole.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Job role not found.' });
      }
      return res.json({
        success: true,
        message: 'Job role deleted successfully.',
      });
    }

    // SQL Mode
    const delRes = await db.query('DELETE FROM job_roles WHERE id = $1', [id]);

    if (delRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found.' });
    }

    res.json({
      success: true,
      message: 'Job role deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getDashboardStats,
  getUsers,
  getAdminJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
};

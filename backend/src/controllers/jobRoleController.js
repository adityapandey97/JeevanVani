import db from '../config/db.js';
import { JobRole } from '../models/index.js';

export async function getAllJobRoles(req, res, next) {
  try {
    const { sector, nsqf_level, search } = req.query;

    if (db.getDriver() === 'mongodb') {
      const filter = { is_active: true };

      if (sector) {
        filter.sector = new RegExp(sector, 'i');
      }

      if (nsqf_level) {
        filter.nsqf_level = Number(nsqf_level);
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { role_name: searchRegex },
          { description: searchRegex },
          { sector: searchRegex },
        ];
      }

      const roles = await JobRole.find(filter).sort({ nsqf_level: 1, role_name: 1 });

      return res.json({
        success: true,
        count: roles.length,
        jobRoles: roles,
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    let sql = 'SELECT * FROM job_roles WHERE 1=1';
    const params = [];
    let counter = 1;

    if (sector) {
      sql += ` AND sector LIKE $${counter++}`;
      params.push(`%${sector}%`);
    }

    if (nsqf_level) {
      sql += ` AND nsqf_level = $${counter++}`;
      params.push(Number(nsqf_level));
    }

    if (search) {
      sql += ` AND (role_name LIKE $${counter} OR description LIKE $${counter} OR sector LIKE $${counter})`;
      params.push(`%${search}%`);
      counter++;
    }

    sql += ' ORDER BY nsqf_level ASC, role_name ASC';

    const rolesRes = await db.query(sql, params);

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
      count: roles.length,
      jobRoles: roles,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobRoleById(req, res, next) {
  try {
    const { id } = req.params;

    if (db.getDriver() === 'mongodb') {
      const role = await JobRole.findById(id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Job role not found.' });
      }
      return res.json({
        success: true,
        jobRole: role,
      });
    }

    // SQL Mode
    const roleRes = await db.query('SELECT * FROM job_roles WHERE id = $1', [id]);

    if (roleRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found.' });
    }

    const role = roleRes.rows[0];
    const skillsRes = await db.query(
      `SELECT s.id, s.name, s.category, jrs.importance_weight, jrs.required_level
       FROM job_role_skills jrs
       JOIN skills s ON jrs.skill_id = s.id
       WHERE jrs.job_role_id = $1`,
      [id]
    );

    let careerPath = [];
    try {
      careerPath = typeof role.career_path === 'string' ? JSON.parse(role.career_path) : role.career_path;
    } catch {}

    res.json({
      success: true,
      jobRole: {
        ...role,
        career_path: careerPath,
        skills: skillsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllJobRoles,
  getJobRoleById,
};

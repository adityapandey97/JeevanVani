import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import {
  sampleSkills,
  sampleJobRoles,
  sampleAdminUser,
  sampleBeneficiaryUser,
  sampleJobs,
  sampleCourses,
  sampleKnowledgeDocs
} from '../data/seedData.js';
import { Skill, JobRole, User, BeneficiaryProfile } from '../models/index.js';

export async function seedDatabase() {
  console.log('[Seed] Starting database migration and seeding...');

  try {
    const salt = await bcrypt.genSalt(10);

    // ==========================================
    // MONGODB SEEDING LOGIC
    // ==========================================
    if (db.getDriver() === 'mongodb') {
      console.log(`[Seed] 🍃 Seeding MongoDB via Mongoose...`);

      // 1. Seed Skills
      console.log(`[Seed] Upserting ${sampleSkills.length} NSQF skills...`);
      for (const sk of sampleSkills) {
        await Skill.findOneAndUpdate(
          { name: sk.name },
          { name: sk.name, category: sk.category, description: sk.description },
          { upsert: true, new: true }
        );
      }

      // 2. Seed Job Roles
      console.log(`[Seed] Upserting ${sampleJobRoles.length} NSQF-aligned job roles...`);
      for (const role of sampleJobRoles) {
        let careerPath = [];
        try {
          careerPath = typeof role.career_path === 'string' ? JSON.parse(role.career_path) : role.career_path;
        } catch {
          careerPath = [];
        }

        await JobRole.findOneAndUpdate(
          { role_name: role.role_name },
          {
            role_name: role.role_name,
            sector: role.sector,
            nsqf_level: role.nsqf_level,
            description: role.description,
            required_education: role.required_education,
            training_duration: role.training_duration,
            skills: role.skills || [],
            career_path: careerPath,
            is_active: true,
          },
          { upsert: true, new: true }
        );
      }

      // 3. Seed Admin User
      const adminEmail = sampleAdminUser.email.toLowerCase().trim();
      let admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        const hashedAdminPw = await bcrypt.hash(sampleAdminUser.password, salt);
        admin = await User.create({
          name: sampleAdminUser.name,
          mobile: sampleAdminUser.mobile,
          email: adminEmail,
          password: hashedAdminPw,
          preferred_language: sampleAdminUser.preferred_language,
          role: 'admin',
        });
        console.log(`[Seed] Created MongoDB Admin User: ${adminEmail}`);
      }

      // 4. Seed Beneficiary User
      const beneEmail = sampleBeneficiaryUser.email.toLowerCase().trim();
      let bene = await User.findOne({ email: beneEmail });
      if (!bene) {
        const hashedBenePw = await bcrypt.hash(sampleBeneficiaryUser.password, salt);
        bene = await User.create({
          name: sampleBeneficiaryUser.name,
          mobile: sampleBeneficiaryUser.mobile,
          email: beneEmail,
          password: hashedBenePw,
          preferred_language: sampleBeneficiaryUser.preferred_language,
          role: 'beneficiary',
        });
        console.log(`[Seed] Created MongoDB Beneficiary User: ${beneEmail}`);
      }

      console.log('[Seed] 🍃 MongoDB database seeding completed successfully!');
      return;
    }

    // ==========================================
    // SQL (POSTGRESQL / SQLITE) SEEDING LOGIC
    // ==========================================
    console.log(`[Seed] 💾 Seeding SQL database (${db.getDriver()})...`);

    // 1. Seed Skills
    console.log(`[Seed] Inserting ${sampleSkills.length} NSQF skills...`);
    for (const skill of sampleSkills) {
      const existing = await db.query('SELECT id FROM skills WHERE name = $1', [skill.name]);
      if (existing.rows.length === 0) {
        await db.query(
          'INSERT INTO skills (name, category, description) VALUES ($1, $2, $3)',
          [skill.name, skill.category, skill.description]
        );
      }
    }

    const allSkillsRes = await db.query('SELECT id, name FROM skills');
    const skillMap = new Map(allSkillsRes.rows.map(r => [r.name.toLowerCase().trim(), r.id]));

    // 2. Seed Job Roles & Mappings
    console.log(`[Seed] Inserting ${sampleJobRoles.length} NSQF-aligned job roles...`);
    for (const role of sampleJobRoles) {
      let roleId;
      const existing = await db.query('SELECT id FROM job_roles WHERE role_name = $1', [role.role_name]);
      if (existing.rows.length === 0) {
        const insertRes = await db.query(
          `INSERT INTO job_roles (role_name, sector, nsqf_level, description, required_education, training_duration, career_path)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [role.role_name, role.sector, role.nsqf_level, role.description, role.required_education, role.training_duration, role.career_path]
        );
        roleId = insertRes.rows[0]?.id;
      } else {
        roleId = existing.rows[0].id;
      }

      // Link skills
      if (roleId && role.skills) {
        for (const reqSkill of role.skills) {
          const skillId = skillMap.get(reqSkill.name.toLowerCase().trim());
          if (skillId) {
            const checkLink = await db.query(
              'SELECT id FROM job_role_skills WHERE job_role_id = $1 AND skill_id = $2',
              [roleId, skillId]
            );
            if (checkLink.rows.length === 0) {
              await db.query(
                `INSERT INTO job_role_skills (job_role_id, skill_id, importance_weight, required_level)
                 VALUES ($1, $2, $3, $4)`,
                [roleId, skillId, reqSkill.weight, reqSkill.required_level]
              );
            }
          }
        }
      }
    }

    const allRolesRes = await db.query('SELECT id, role_name FROM job_roles');
    const roleMap = new Map(allRolesRes.rows.map(r => [r.role_name.toLowerCase().trim(), r.id]));

    // 3. Seed Verified Jobs
    console.log(`[Seed] Inserting ${sampleJobs.length} verified livelihood jobs...`);
    for (const job of sampleJobs) {
      const existingJob = await db.query('SELECT id FROM jobs WHERE title = $1 AND organization = $2', [job.title, job.organization]);
      if (existingJob.rows.length === 0) {
        const roleId = roleMap.get(job.job_role_name?.toLowerCase()?.trim()) || null;
        await db.query(
          `INSERT INTO jobs (title, organization, sector, job_role_id, location, eligibility, salary, application_url, source, source_id, required_skills, is_verified, posted_at, expires_at, last_verified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            job.title,
            job.organization,
            job.sector,
            roleId,
            job.location,
            job.eligibility,
            job.salary,
            job.application_url,
            job.source,
            job.source_id,
            job.required_skills,
            job.is_verified,
            job.posted_at,
            job.expires_at,
            job.last_verified_at
          ]
        );
      }
    }

    // 4. Seed Verified NSQF Courses
    console.log(`[Seed] Inserting ${sampleCourses.length} verified NSQF skilling courses...`);
    for (const course of sampleCourses) {
      const existingCourse = await db.query('SELECT id FROM courses WHERE course_name = $1', [course.course_name]);
      if (existingCourse.rows.length === 0) {
        const roleId = roleMap.get(course.job_role_name?.toLowerCase()?.trim()) || null;
        await db.query(
          `INSERT INTO courses (course_name, qualification_pack_id, job_role_id, nsqf_level, duration, eligibility, skills_covered, training_provider, training_center_location, mode, certification_body, rpl_available, enrollment_url, is_verified, source, stipend_info, last_verified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            course.course_name,
            course.qualification_pack_id,
            roleId,
            course.nsqf_level,
            course.duration,
            course.eligibility,
            course.skills_covered,
            course.training_provider,
            course.training_center_location,
            course.mode,
            course.certification_body,
            course.rpl_available,
            course.enrollment_url,
            course.is_verified,
            course.source,
            course.stipend_info,
            course.last_verified_at
          ]
        );
      }
    }

    // 5. Seed Grounded Knowledge Documents
    console.log(`[Seed] Inserting ${sampleKnowledgeDocs.length} grounded knowledge documents...`);
    for (const doc of sampleKnowledgeDocs) {
      const existingDoc = await db.query('SELECT id FROM knowledge_docs WHERE title = $1', [doc.title]);
      if (existingDoc.rows.length === 0) {
        await db.query(
          `INSERT INTO knowledge_docs (title, document_type, nsqf_level, sector, content, source, source_url, keywords, last_verified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            doc.title,
            doc.document_type,
            doc.nsqf_level,
            doc.sector,
            doc.content,
            doc.source,
            doc.source_url,
            doc.keywords,
            doc.last_verified_at
          ]
        );
      }
    }

    // 6. Seed Sample Users (Admin & Beneficiary)
    const adminCheck = await db.query('SELECT id FROM users WHERE email = $1', [sampleAdminUser.email]);
    if (adminCheck.rows.length === 0) {
      const hashedAdminPw = await bcrypt.hash(sampleAdminUser.password, salt);
      await db.query(
        `INSERT INTO users (name, mobile, email, password, preferred_language, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [sampleAdminUser.name, sampleAdminUser.mobile, sampleAdminUser.email, hashedAdminPw, sampleAdminUser.preferred_language, sampleAdminUser.role]
      );
      console.log(`[Seed] Created Admin User: ${sampleAdminUser.email}`);
    }

    const beneCheck = await db.query('SELECT id FROM users WHERE email = $1', [sampleBeneficiaryUser.email]);
    let beneUserId;
    if (beneCheck.rows.length === 0) {
      const hashedBenePw = await bcrypt.hash(sampleBeneficiaryUser.password, salt);
      const userRes = await db.query(
        `INSERT INTO users (name, mobile, email, password, preferred_language, role)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [sampleBeneficiaryUser.name, sampleBeneficiaryUser.mobile, sampleBeneficiaryUser.email, hashedBenePw, sampleBeneficiaryUser.preferred_language, sampleBeneficiaryUser.role]
      );
      beneUserId = userRes.rows[0]?.id;
      console.log(`[Seed] Created Beneficiary User: ${sampleBeneficiaryUser.email}`);
    } else {
      beneUserId = beneCheck.rows[0].id;
    }

    if (beneUserId) {
      const profCheck = await db.query('SELECT id FROM beneficiary_profiles WHERE user_id = $1', [beneUserId]);
      if (profCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO beneficiary_profiles (user_id, age, education, employment_status, work_experience, preferred_location, willing_to_relocate, employment_preference, preferred_sector, profile_completion)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [beneUserId, 23, '10th Pass', 'Unemployed', '1 year helping local electrician', 'Kanpur, UP', 1, 'Both', 'Solar / Green Jobs', 100]
        );

        const basicWiringId = skillMap.get('basic wiring');
        const toolHandlingId = skillMap.get('tool handling');
        if (basicWiringId) {
          await db.query('INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3)', [beneUserId, basicWiringId, 'Intermediate']);
        }
        if (toolHandlingId) {
          await db.query('INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3)', [beneUserId, toolHandlingId, 'Basic']);
        }

        await db.query('INSERT INTO interests (user_id, interest_name) VALUES ($1, $2)', [beneUserId, 'Electrical and Solar Installations']);
      }
    }

    console.log('[Seed] Database seeding completed successfully with verified jobs, courses & knowledge base!');
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
  }
}

if (process.argv[1]?.endsWith('seedRunner.js')) {
  seedDatabase().then(() => {
    console.log('[Seed] Done.');
    process.exit(0);
  });
}

export default seedDatabase;

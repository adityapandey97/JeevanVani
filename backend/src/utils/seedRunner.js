import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { sampleSkills, sampleJobRoles, sampleAdminUser, sampleBeneficiaryUser } from '../data/seedData.js';
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

      // 5. Seed Beneficiary Profile
      let beneProfile = await BeneficiaryProfile.findOne({ user: bene._id });
      if (!beneProfile) {
        await BeneficiaryProfile.create({
          user: bene._id,
          age: 23,
          education: '10th Pass',
          employment_status: 'Unemployed',
          work_experience: '1 year helping local electrician',
          preferred_location: 'Kanpur, UP',
          willing_to_relocate: true,
          employment_preference: 'Both',
          profile_completion: 100,
          skills: [
            { name: 'Basic Wiring', category: 'Electrical', proficiency_level: 'Intermediate' },
            { name: 'Tool Handling', category: 'General', proficiency_level: 'Basic' },
          ],
          interests: ['Electrical and Solar Installations'],
        });
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

    // 3. Seed Sample Users (Admin & Beneficiary)
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
          `INSERT INTO beneficiary_profiles (user_id, age, education, employment_status, work_experience, preferred_location, willing_to_relocate, employment_preference, profile_completion)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [beneUserId, 23, '10th Pass', 'Unemployed', '1 year helping local electrician', 'Kanpur, UP', 1, 'Both', 100]
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

    console.log('[Seed] Database seeding completed successfully!');
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

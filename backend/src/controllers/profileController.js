import db from '../config/db.js';
import { User, BeneficiaryProfile, Skill, AssessmentSession } from '../models/index.js';
import AIService from '../services/aiService.js';

/**
 * Helper to sync answers from assessment session so text answers immediately populate
 * beneficiary profile attributes, skills, and interests in the dashboard.
 */
async function syncFromAssessmentSession(userId, profile, currentSkills = []) {
  try {
    if (db.getDriver() === 'mongodb') {
      const session = await AssessmentSession.findOne({ user: userId });
      if (!session || !session.answers) return;

      const answers = session.answers instanceof Map
        ? Object.fromEntries(session.answers)
        : (session.answers || {});

      const answerKeys = Object.keys(answers);
      if (answerKeys.length === 0) return;

      let bProfile = await BeneficiaryProfile.findOne({ user: userId });
      if (!bProfile) {
        bProfile = await BeneficiaryProfile.create({ user: userId, profile_completion: 0, skills: [], interests: [] });
      }

      const allSkills = await Skill.find({});

      for (const qIdx of answerKeys) {
        const answerText = answers[qIdx];
        if (!answerText) continue;

        const { updates } = await AIService.processAnswer(Number(qIdx), answerText, {}, allSkills);

        if (updates.age !== undefined) bProfile.age = updates.age;
        if (updates.education) bProfile.education = updates.education;
        if (updates.employment_status) bProfile.employment_status = updates.employment_status;
        if (updates.work_experience) bProfile.work_experience = updates.work_experience;
        if (updates.preferred_location) bProfile.preferred_location = updates.preferred_location;
        if (updates.willing_to_relocate !== undefined) bProfile.willing_to_relocate = Boolean(updates.willing_to_relocate);
        if (updates.employment_preference) bProfile.employment_preference = updates.employment_preference;

        if (updates.skills && updates.skills.length > 0) {
          for (const newSkill of updates.skills) {
            if (!bProfile.skills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
              bProfile.skills.push(newSkill);
            }
          }
        }

        if (updates.interests && updates.interests.length > 0) {
          for (const intName of updates.interests) {
            if (!bProfile.interests.includes(intName)) {
              bProfile.interests.push(intName);
            }
          }
        }
      }

      const completion = session.status === 'completed' || answerKeys.length >= 10
        ? 100
        : Math.min(100, Math.round((answerKeys.length / 11) * 100));
      bProfile.profile_completion = Math.max(bProfile.profile_completion || 0, completion);

      await bProfile.save();
      return;
    }

    // SQL Mode (SQLite / PostgreSQL)
    const sessionRes = await db.query('SELECT answers, status FROM assessment_sessions WHERE user_id = $1', [userId]);
    if (sessionRes.rows.length === 0 || !sessionRes.rows[0].answers) return;

    let answers = {};
    try {
      answers = typeof sessionRes.rows[0].answers === 'string'
        ? JSON.parse(sessionRes.rows[0].answers)
        : sessionRes.rows[0].answers;
    } catch {}

    const answerKeys = Object.keys(answers);
    if (answerKeys.length === 0) return;

    const allSkillsRes = await db.query('SELECT id, name, category FROM skills');
    const allSkills = allSkillsRes.rows;

    const profileUpdates = {};

    for (const qIdx of answerKeys) {
      const answerText = answers[qIdx];
      if (!answerText) continue;

      const { updates } = await AIService.processAnswer(Number(qIdx), answerText, {}, allSkills);

      if (updates.age !== undefined) profileUpdates.age = updates.age;
      if (updates.education) profileUpdates.education = updates.education;
      if (updates.employment_status) profileUpdates.employment_status = updates.employment_status;
      if (updates.work_experience) profileUpdates.work_experience = updates.work_experience;
      if (updates.preferred_location) profileUpdates.preferred_location = updates.preferred_location;
      if (updates.willing_to_relocate !== undefined) profileUpdates.willing_to_relocate = updates.willing_to_relocate;
      if (updates.employment_preference) profileUpdates.employment_preference = updates.employment_preference;

      // Sync skills into user_skills
      if (updates.skills && updates.skills.length > 0) {
        for (const sk of updates.skills) {
          let existingSkill = await db.query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [sk.name]);
          let skillId = existingSkill.rows[0]?.id;

          if (!skillId) {
            const newSkillRes = await db.query(
              'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING id',
              [sk.name, sk.category || 'General']
            );
            skillId = newSkillRes.rows[0]?.id;
          }

          if (skillId) {
            const userSkillExists = await db.query(
              'SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2',
              [userId, skillId]
            );
            if (userSkillExists.rows.length === 0) {
              await db.query(
                'INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3)',
                [userId, skillId, sk.proficiency_level || 'Beginner']
              );
            }
          }
        }
      }

      // Sync interests
      if (updates.interests && updates.interests.length > 0) {
        for (const intName of updates.interests) {
          const exInt = await db.query('SELECT id FROM interests WHERE user_id = $1 AND interest_name = $2', [userId, intName]);
          if (exInt.rows.length === 0) {
            await db.query('INSERT INTO interests (user_id, interest_name) VALUES ($1, $2)', [userId, intName]);
          }
        }
      }
    }

    // Determine completion percentage
    const isCompletedSession = sessionRes.rows[0].status === 'completed' || answerKeys.length >= 10;
    const completionPercent = isCompletedSession ? 100 : Math.min(100, Math.round((answerKeys.length / 11) * 100));
    profileUpdates.profile_completion = completionPercent;

    // Apply updates to beneficiary_profiles
    const syncFields = [];
    const syncVals = [];
    let counter = 1;

    for (const [key, val] of Object.entries(profileUpdates)) {
      syncFields.push(`${key} = $${counter++}`);
      syncVals.push(val);
    }

    if (syncFields.length > 0) {
      syncVals.push(userId);
      await db.query(
        `UPDATE beneficiary_profiles SET ${syncFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${counter}`,
        syncVals
      );
    }
  } catch (err) {
    console.warn('[Profile Controller] Assessment sync error:', err.message);
  }
}

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    if (db.getDriver() === 'mongodb') {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      let profile = await BeneficiaryProfile.findOne({ user: userId });
      if (!profile) {
        profile = await BeneficiaryProfile.create({ user: userId, profile_completion: 0, skills: [], interests: [] });
      }

      // Synchronize latest details from session answers
      await syncFromAssessmentSession(userId, profile);
      profile = await BeneficiaryProfile.findOne({ user: userId });

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          preferred_language: user.preferred_language,
          role: user.role,
          created_at: user.createdAt,
        },
        profile: {
          id: profile._id,
          age: profile.age,
          education: profile.education,
          employment_status: profile.employment_status,
          work_experience: profile.work_experience,
          preferred_location: profile.preferred_location,
          willing_to_relocate: profile.willing_to_relocate,
          employment_preference: profile.employment_preference,
          profile_completion: profile.profile_completion || 0,
        },
        skills: profile.skills || [],
        interests: profile.interests || [],
      });
    }

    // SQL Mode (PostgreSQL / SQLite)
    const userRes = await db.query(
      'SELECT id, name, mobile, email, preferred_language, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Ensure beneficiary_profiles row exists
    let profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    if (profileRes.rows.length === 0) {
      await db.query('INSERT INTO beneficiary_profiles (user_id, profile_completion) VALUES ($1, 0)', [userId]);
      profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    }

    // Always synchronize latest assessment session details into profile & skills
    await syncFromAssessmentSession(userId, profileRes.rows[0]);

    // Re-fetch updated profile and skills
    profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const skillsRes = await db.query(
      `SELECT s.id, s.name, s.category, s.description, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );

    // Fetch interests
    const interestsRes = await db.query('SELECT id, interest_name FROM interests WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      user: userRes.rows[0],
      profile: profileRes.rows[0] || null,
      skills: skillsRes.rows,
      interests: interestsRes.rows.map(r => r.interest_name)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      name,
      mobile,
      preferred_language,
      age,
      education,
      employment_status,
      work_experience,
      preferred_location,
      willing_to_relocate,
      employment_preference,
      skills: newSkills,
      interests: newInterests,
    } = req.body;

    if (db.getDriver() === 'mongodb') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (preferred_language) user.preferred_language = preferred_language;
      await user.save();

      let profile = await BeneficiaryProfile.findOne({ user: userId });
      if (!profile) {
        profile = new BeneficiaryProfile({ user: userId });
      }

      if (age !== undefined) profile.age = age;
      if (education !== undefined) profile.education = education;
      if (employment_status !== undefined) profile.employment_status = employment_status;
      if (work_experience !== undefined) profile.work_experience = work_experience;
      if (preferred_location !== undefined) profile.preferred_location = preferred_location;
      if (willing_to_relocate !== undefined) profile.willing_to_relocate = willing_to_relocate;
      if (employment_preference !== undefined) profile.employment_preference = employment_preference;

      if (Array.isArray(newSkills)) {
        profile.skills = newSkills.map((s) => (typeof s === 'string' ? { name: s } : s));
      }

      if (Array.isArray(newInterests)) {
        profile.interests = newInterests;
      }

      let filledCount = 0;
      const totalAttributes = 7;
      if (profile.age) filledCount++;
      if (profile.education) filledCount++;
      if (profile.employment_status) filledCount++;
      if (profile.work_experience) filledCount++;
      if (profile.preferred_location) filledCount++;
      if (profile.willing_to_relocate !== undefined) filledCount++;
      if (profile.employment_preference) filledCount++;

      profile.profile_completion = Math.min(100, Math.round((filledCount / totalAttributes) * 100));
      await profile.save();

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        profile: {
          id: profile._id,
          age: profile.age,
          education: profile.education,
          employment_status: profile.employment_status,
          work_experience: profile.work_experience,
          preferred_location: profile.preferred_location,
          willing_to_relocate: profile.willing_to_relocate,
          employment_preference: profile.employment_preference,
          profile_completion: profile.profile_completion,
        },
        skills: profile.skills,
        interests: profile.interests,
      });
    }

    // SQL Mode (PostgreSQL / SQLite)
    const userUpdates = [];
    const userValues = [];
    let userParam = 1;

    if (name) {
      userUpdates.push(`name = $${userParam++}`);
      userValues.push(name);
    }
    if (mobile) {
      userUpdates.push(`mobile = $${userParam++}`);
      userValues.push(mobile);
    }
    if (preferred_language) {
      userUpdates.push(`preferred_language = $${userParam++}`);
      userValues.push(preferred_language);
    }

    if (userUpdates.length > 0) {
      userValues.push(userId);
      await db.query(
        `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userParam}`,
        userValues
      );
    }

    // Update beneficiary_profiles
    const profUpdates = [];
    const profValues = [];
    let profParam = 1;

    if (age !== undefined) {
      profUpdates.push(`age = $${profParam++}`);
      profValues.push(age);
    }
    if (education !== undefined) {
      profUpdates.push(`education = $${profParam++}`);
      profValues.push(education);
    }
    if (employment_status !== undefined) {
      profUpdates.push(`employment_status = $${profParam++}`);
      profValues.push(employment_status);
    }
    if (work_experience !== undefined) {
      profUpdates.push(`work_experience = $${profParam++}`);
      profValues.push(work_experience);
    }
    if (preferred_location !== undefined) {
      profUpdates.push(`preferred_location = $${profParam++}`);
      profValues.push(preferred_location);
    }
    if (willing_to_relocate !== undefined) {
      profUpdates.push(`willing_to_relocate = $${profParam++}`);
      profValues.push(willing_to_relocate);
    }
    if (employment_preference !== undefined) {
      profUpdates.push(`employment_preference = $${profParam++}`);
      profValues.push(employment_preference);
    }

    if (profUpdates.length > 0) {
      profValues.push(userId);
      await db.query(
        `UPDATE beneficiary_profiles
         SET ${profUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $${profParam}`,
        profValues
      );
    }

    // Manage user_skills
    if (Array.isArray(newSkills)) {
      await db.query('DELETE FROM user_skills WHERE user_id = $1', [userId]);

      for (const sk of newSkills) {
        const skillName = typeof sk === 'string' ? sk : sk.name;
        const skillCategory = (typeof sk === 'object' && sk.category) || 'General';
        const profLevel = (typeof sk === 'object' && sk.proficiency_level) || 'Beginner';

        let existingSkill = await db.query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [skillName]);
        let skillId = existingSkill.rows[0]?.id;

        if (!skillId) {
          const newSk = await db.query(
            'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING id',
            [skillName, skillCategory]
          );
          skillId = newSk.rows[0]?.id;
        }

        if (skillId) {
          await db.query(
            'INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3)',
            [userId, skillId, profLevel]
          );
        }
      }
    }

    // Recalculate profile completion
    const pCheck = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const pRow = pCheck.rows[0];
    let filledCount = 0;
    const totalAttributes = 7;
    if (pRow?.age) filledCount++;
    if (pRow?.education) filledCount++;
    if (pRow?.employment_status) filledCount++;
    if (pRow?.work_experience) filledCount++;
    if (pRow?.preferred_location) filledCount++;
    if (pRow?.willing_to_relocate !== null && pRow?.willing_to_relocate !== undefined) filledCount++;
    if (pRow?.employment_preference) filledCount++;

    const completion = Math.min(100, Math.round((filledCount / totalAttributes) * 100));
    await db.query('UPDATE beneficiary_profiles SET profile_completion = $1 WHERE user_id = $2', [completion, userId]);

    // Return updated profile
    const finalProf = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const finalSkills = await db.query(
      `SELECT s.id, s.name, s.category, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: finalProf.rows[0],
      skills: finalSkills.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfileSkills(req, res, next) {
  try {
    const userId = req.user.id;

    if (db.getDriver() === 'mongodb') {
      const profile = await BeneficiaryProfile.findOne({ user: userId });
      return res.json({
        success: true,
        skills: profile?.skills || [],
      });
    }

    const skillsRes = await db.query(
      `SELECT s.id, s.name, s.category, s.description, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      skills: skillsRes.rows,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getProfile,
  updateProfile,
  getProfileSkills,
};

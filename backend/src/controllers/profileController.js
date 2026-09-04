import db from '../config/db.js';

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch user basic details
    const userRes = await db.query(
      'SELECT id, name, mobile, email, preferred_language, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch profile
    const profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);

    // Fetch skills
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
      employment_preference
    } = req.body;

    // Update users table if name/mobile/language provided
    if (name || mobile || preferred_language) {
      await db.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             mobile = COALESCE($2, mobile),
             preferred_language = COALESCE($3, preferred_language)
         WHERE id = $4`,
        [name, mobile, preferred_language, userId]
      );
    }

    // Update profile table
    const relocateVal = willing_to_relocate === true || willing_to_relocate === 1 || willing_to_relocate === 'true' ? 1 : 0;

    await db.query(
      `UPDATE beneficiary_profiles
       SET age = COALESCE($1, age),
           education = COALESCE($2, education),
           employment_status = COALESCE($3, employment_status),
           work_experience = COALESCE($4, work_experience),
           preferred_location = COALESCE($5, preferred_location),
           willing_to_relocate = $6,
           employment_preference = COALESCE($7, employment_preference),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $8`,
      [age, education, employment_status, work_experience, preferred_location, relocateVal, employment_preference, userId]
    );

    const updatedProfile = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfileSkills(req, res, next) {
  try {
    const userId = req.user.id;

    const userSkillsRes = await db.query(
      `SELECT s.id, s.name, s.category, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );

    const allSkillsRes = await db.query('SELECT id, name, category, description FROM skills ORDER BY category, name');

    res.json({
      success: true,
      userSkills: userSkillsRes.rows,
      allCatalogSkills: allSkillsRes.rows
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getProfile,
  updateProfile,
  getProfileSkills
};

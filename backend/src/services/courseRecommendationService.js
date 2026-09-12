import db from '../config/db.js';

export class CourseRecommendationService {
  /**
   * Match courses to bridge identified skill gaps for a user
   */
  static async getRecommendedCoursesForUser(userId, limit = 6) {
    const profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const profile = profileRes.rows[0] || {};

    const userSkillsRes = await db.query(
      `SELECT s.name FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );
    const userSkills = userSkillsRes.rows.map(r => r.name.toLowerCase().trim());

    // Get missing skills from recommendations
    const recRes = await db.query(
      `SELECT missing_skills, job_role_id FROM recommendations WHERE user_id = $1 ORDER BY match_score DESC LIMIT 1`,
      [userId]
    );

    let targetMissingSkills = [];
    if (recRes.rows.length > 0 && recRes.rows[0].missing_skills) {
      try {
        targetMissingSkills = typeof recRes.rows[0].missing_skills === 'string'
          ? JSON.parse(recRes.rows[0].missing_skills)
          : recRes.rows[0].missing_skills;
      } catch {
        targetMissingSkills = [];
      }
    }

    const coursesRes = await db.query('SELECT * FROM courses ORDER BY id ASC');
    const allCourses = coursesRes.rows;

    const ranked = allCourses.map(course => {
      let coveredSkills = [];
      try {
        coveredSkills = typeof course.skills_covered === 'string'
          ? JSON.parse(course.skills_covered)
          : (course.skills_covered || []);
      } catch {
        coveredSkills = [];
      }

      // Check how many missing skills this course covers
      let gapOverlapCount = 0;
      for (const skill of coveredSkills) {
        const sLower = skill.toLowerCase().trim();
        if (targetMissingSkills.some(tSkill => tSkill.toLowerCase().trim() === sLower || sLower.includes(tSkill.toLowerCase().trim()))) {
          gapOverlapCount++;
        }
      }

      // Calculate match score
      let score = 65;
      if (gapOverlapCount > 0) {
        score += Math.min(30, gapOverlapCount * 12);
      } else {
        // Sector relevance
        const prefSector = (profile.preferred_sector || '').toLowerCase();
        if (prefSector && course.course_name.toLowerCase().includes(prefSector)) {
          score += 15;
        }
      }

      // RPL suitability: If candidate has > 1 year experience, RPL orientation (12 hrs) is strongly recommended
      const hasExp = (profile.work_experience || '').toLowerCase().includes('year') ||
                     (profile.work_experience || '').toLowerCase().includes('साल');
      const rplRecommended = Boolean(course.rpl_available && hasExp);

      return {
        id: course.id,
        course_name: course.course_name,
        qualification_pack_id: course.qualification_pack_id,
        job_role_id: course.job_role_id,
        nsqf_level: course.nsqf_level,
        duration: course.duration,
        eligibility: course.eligibility,
        skills_covered: coveredSkills,
        training_provider: course.training_provider,
        training_center_location: course.training_center_location,
        mode: course.mode,
        certification_body: course.certification_body,
        rpl_available: Boolean(course.rpl_available),
        rpl_recommended: rplRecommended,
        enrollment_url: course.enrollment_url || 'https://www.skillindiadigital.gov.in/courses',
        is_verified: Boolean(course.is_verified),
        source: course.source,
        stipend_info: course.stipend_info || '100% Free under PM-AJAY GIA Component',
        last_verified_at: course.last_verified_at,
        matchScore: Math.min(98, score),
        skillsBridged: coveredSkills.filter(s =>
          targetMissingSkills.some(t => t.toLowerCase().trim() === s.toLowerCase().trim())
        ),
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);
    return ranked.slice(0, limit);
  }
}

export default CourseRecommendationService;

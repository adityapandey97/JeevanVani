import db from '../config/db.js';
import { JobRole, BeneficiaryProfile, User, Recommendation } from '../models/index.js';

export const SCORING_WEIGHTS = {
  interest: 0.30,
  skill: 0.25,
  eligibility: 0.20,
  experience: 0.15,
  location: 0.10,
};

const EDUCATION_LEVEL_ORDER = {
  'below 5th pass': 1,
  '5th pass': 2,
  '8th pass': 3,
  '10th pass': 4,
  '12th pass': 5,
  'iti': 5.5,
  'diploma': 6,
  'graduate': 7,
};

export class RecommendationService {
  /**
   * Calculate eligibility score based on required education
   */
  static calculateEligibilityScore(userEducation, requiredEducation) {
    if (!requiredEducation) return 90;
    const userRank = EDUCATION_LEVEL_ORDER[userEducation?.toLowerCase()?.trim()] || 3;

    let reqRank = 4; // default 10th pass
    const reqLower = requiredEducation.toLowerCase();
    if (reqLower.includes('graduate')) reqRank = 7;
    else if (reqLower.includes('diploma')) reqRank = 6;
    else if (reqLower.includes('12th') || reqLower.includes('iti')) reqRank = 5;
    else if (reqLower.includes('10th')) reqRank = 4;
    else if (reqLower.includes('8th')) reqRank = 3;
    else if (reqLower.includes('5th')) reqRank = 2;

    if (userRank >= reqRank) {
      return 100;
    } else if (userRank === reqRank - 1) {
      return 75; // Close match, eligible under RPL (Recognition of Prior Learning)
    } else {
      return 50; // Needs foundational bridge training
    }
  }

  /**
   * Calculate interest score based on user interests, preferred sector, and employment preference
   */
  static calculateInterestScore(userInterests, userPreferredSector, jobRole, employmentPreference) {
    let score = 40; // baseline
    const roleSector = (jobRole.sector || '').toLowerCase();
    const roleName = (jobRole.role_name || '').toLowerCase();

    if (userPreferredSector) {
      const prefLower = userPreferredSector.toLowerCase();
      if (roleSector.includes(prefLower) || prefLower.includes(roleSector)) {
        score += 35;
      } else {
        const words = prefLower.split(/[\s,]+/);
        if (words.some(w => w.length > 3 && (roleSector.includes(w) || roleName.includes(w)))) {
          score += 25;
        }
      }
    }

    if (userInterests && userInterests.length > 0) {
      for (const item of userInterests) {
        const intName = (item.interest_name || item || '').toLowerCase();
        if (roleSector.includes(intName) || roleName.includes(intName) || intName.includes(roleSector)) {
          score += 25;
          break;
        }
      }
    }

    if (employmentPreference) {
      const prefLower = employmentPreference.toLowerCase();
      if (prefLower.includes('both')) {
        score += 10;
      } else if (prefLower.includes('self') && roleName.includes('contractor')) {
        score += 15;
      } else if (prefLower.includes('job') && !roleName.includes('contractor')) {
        score += 10;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Calculate skill score based on required vs acquired skills
   */
  static calculateSkillScore(userSkillNames = [], roleSkills = []) {
    if (!roleSkills || roleSkills.length === 0) {
      return { score: 75, matchingSkills: [], missingSkills: [] };
    }

    const matchingSkills = [];
    const missingSkills = [];
    const normalizedUserSkills = userSkillNames.map(s => s.toLowerCase().trim());

    let earnedWeight = 0;
    let totalWeight = 0;

    for (const req of roleSkills) {
      const weight = Number(req.importance_weight) || 1.0;
      totalWeight += weight;

      const reqLower = req.name.toLowerCase().trim();
      const isMatched = normalizedUserSkills.some(uSkill => {
        return (
          uSkill === reqLower ||
          uSkill.includes(reqLower) ||
          reqLower.includes(uSkill) ||
          uSkill.split(' ').some(word => word.length > 3 && reqLower.includes(word))
        );
      });

      if (isMatched) {
        matchingSkills.push(req.name);
        earnedWeight += weight;
      } else {
        missingSkills.push(req.name);
      }
    }

    let score = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 50;

    if (score < 40 && matchingSkills.length === 0) {
      score = 40; // Entry-level foundational baseline for skilling candidates
    }

    return {
      score: Math.round(score),
      matchingSkills,
      missingSkills,
    };
  }

  /**
   * Calculate experience score
   */
  static calculateExperienceScore(workExperience) {
    if (!workExperience) return 65;
    const lower = workExperience.toLowerCase();

    if (lower.includes('year') || lower.includes('साल') || lower.includes('2') || lower.includes('3') || lower.includes('4') || lower.includes('5')) {
      return 95;
    }
    if (lower.includes('helper') || lower.includes('month') || lower.includes('महीने') || lower.includes('assist') || lower.includes('काम किया')) {
      return 85;
    }
    if (lower.includes('fresh') || lower.includes('no experience') || lower.includes('कोई अनुभव नहीं')) {
      return 70;
    }
    return 75;
  }

  /**
   * Calculate location score
   */
  static calculateLocationScore(willingToRelocate, preferredLocation) {
    if (willingToRelocate) return 95;
    if (preferredLocation && preferredLocation.trim().length > 0) return 85;
    return 75;
  }

  /**
   * Generate human-friendly rationale for why this role is recommended
   */
  static generateWhyRecommended(role, scores, matchingSkills, userProfile, lang = 'hi') {
    const reasons = [];

    if (lang === 'hi') {
      if (scores.interest >= 75) {
        reasons.push(`आपके पसंदीदा क्षेत्र (${role.sector}) में यह जॉब रोल अत्यधिक मांग में है।`);
      } else {
        reasons.push(`${role.sector} क्षेत्र में PM-AJAY योजना के तहत उत्कृष्ट रोजगार और स्वरोजगार के अवसर उपलब्ध हैं।`);
      }

      if (scores.eligibility >= 90) {
        reasons.push(`आपकी शैक्षणिक योग्यता (${userProfile.education || '10वीं'}) इस कोर्स के लिए पूरी तरह अनुकूल है।`);
      }

      if (matchingSkills.length > 0) {
        reasons.push(`आपके पास पहले से ${matchingSkills.slice(0, 2).join(', ')} का बुनियादी अनुभव है, जिससे आप तेजी से सीख सकते हैं।`);
      } else {
        reasons.push(`यह कोर्स शुरुआती शिक्षार्थियों के लिए विशेष रूप से डिज़ाइन किया गया है जिसमें प्रैक्टिकल टूल हैंडलिंग शामिल है।`);
      }

      reasons.push(`प्रशिक्षण की अवधि केवल ${role.training_duration} है, जिसके तुरंत बाद सरकारी प्रमाणन व प्लेसमेंट सहायता दी जाती है।`);
    } else {
      if (scores.interest >= 75) {
        reasons.push(`Strong alignment with your interest in the ${role.sector} sector.`);
      } else {
        reasons.push(`High demand career role in ${role.sector} with PM-AJAY skilling and placement support.`);
      }

      if (scores.eligibility >= 90) {
        reasons.push(`Your education level (${userProfile.education || '10th Pass'}) fully satisfies the official NSQF entry prerequisites.`);
      }

      if (matchingSkills.length > 0) {
        reasons.push(`You already possess foundational capability in ${matchingSkills.slice(0, 2).join(', ')}.`);
      } else {
        reasons.push(`Designed specifically for quick onboarding with practical, hands-on workshop training.`);
      }

      reasons.push(`Short training duration (${role.training_duration}) followed by government-certified placement or self-employment credit linkage.`);
    }

    return reasons;
  }

  /**
   * Generate recommendations for a user
   */
  static async generateRecommendations(userId, customWeights = SCORING_WEIGHTS) {
    if (db.getDriver() === 'mongodb') {
      const [profile, user, allRoles] = await Promise.all([
        BeneficiaryProfile.findOne({ user: userId }),
        User.findById(userId),
        JobRole.find({ is_active: true }),
      ]);

      const lang = user?.preferred_language || 'hi';
      const userSkillNames = (profile?.skills || []).map(s => s.name);
      const userInterests = profile?.interests || [];

      const rankedRoles = [];

      for (const role of allRoles) {
        const roleSkills = role.skills || [];
        const interestScore = this.calculateInterestScore(userInterests, profile?.preferred_sector, role, profile?.employment_preference);
        const { score: skillScore, matchingSkills, missingSkills } = this.calculateSkillScore(userSkillNames, roleSkills);
        const eligibilityScore = this.calculateEligibilityScore(profile?.education, role.required_education);
        const experienceScore = this.calculateExperienceScore(profile?.work_experience);
        const locationScore = this.calculateLocationScore(profile?.willing_to_relocate, profile?.preferred_location);

        const weights = customWeights;
        const finalMatchScore = (
          (weights.interest * interestScore) +
          (weights.skill * skillScore) +
          (weights.eligibility * eligibilityScore) +
          (weights.experience * experienceScore) +
          (weights.location * locationScore)
        );

        const roundedScore = Math.min(98, Math.max(50, Math.round(finalMatchScore)));

        const whyRecommended = this.generateWhyRecommended(role, {
          interest: interestScore,
          skill: skillScore,
          eligibility: eligibilityScore,
          experience: experienceScore,
          location: locationScore,
        }, matchingSkills, profile || {}, lang);

        rankedRoles.push({
          user: userId,
          job_role: role._id,
          job_role_id: role._id,
          role_name: role.role_name,
          sector: role.sector,
          nsqf_level: role.nsqf_level,
          description: role.description,
          required_education: role.required_education,
          training_duration: role.training_duration,
          career_path: role.career_path || [],
          match_score: roundedScore,
          why_recommended: whyRecommended,
          matching_skills: matchingSkills,
          missing_skills: missingSkills,
        });
      }

      rankedRoles.sort((a, b) => b.match_score - a.match_score);
      const top3 = rankedRoles.slice(0, 3);

      await Recommendation.deleteMany({ user: userId });
      await Recommendation.insertMany(top3);

      return top3;
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    const profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

    const profile = profileRes.rows[0] || {};
    const user = userRes.rows[0] || {};
    const lang = user.preferred_language || 'hi';

    const userSkillsRes = await db.query(
      `SELECT s.name FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );
    const userSkillNames = userSkillsRes.rows.map(r => r.name);

    const userInterestsRes = await db.query('SELECT interest_name FROM interests WHERE user_id = $1', [userId]);
    const userInterests = userInterestsRes.rows.map(r => r.interest_name);

    const rolesRes = await db.query('SELECT * FROM job_roles ORDER BY id ASC');
    const allRoles = rolesRes.rows;

    const rankedRoles = [];

    for (const role of allRoles) {
      const roleSkillsRes = await db.query(
        `SELECT s.name, jrs.importance_weight, jrs.required_level
         FROM job_role_skills jrs
         JOIN skills s ON jrs.skill_id = s.id
         WHERE jrs.job_role_id = $1`,
        [role.id]
      );
      const roleSkills = roleSkillsRes.rows;

      const interestScore = this.calculateInterestScore(userInterests, profile.preferred_sector || profile.preferred_location, role, profile.employment_preference);
      const { score: skillScore, matchingSkills, missingSkills } = this.calculateSkillScore(userSkillNames, roleSkills);
      const eligibilityScore = this.calculateEligibilityScore(profile.education, role.required_education);
      const experienceScore = this.calculateExperienceScore(profile.work_experience);
      const locationScore = this.calculateLocationScore(profile.willing_to_relocate, profile.preferred_location);

      const weights = customWeights;
      const finalMatchScore = (
        (weights.interest * interestScore) +
        (weights.skill * skillScore) +
        (weights.eligibility * eligibilityScore) +
        (weights.experience * experienceScore) +
        (weights.location * locationScore)
      );

      const roundedScore = Math.min(98, Math.max(50, Math.round(finalMatchScore)));

      // Confidence score computation
      const profileCompleteness = Number(profile.profile_completion || 70);
      const confidence = Math.min(96, Math.max(55, Math.round(
        (roundedScore * 0.4) + (profileCompleteness * 0.4) + (skillScore >= 50 ? 20 : 10)
      )));

      const whyRecommended = this.generateWhyRecommended(role, {
        interest: interestScore,
        skill: skillScore,
        eligibility: eligibilityScore,
        experience: experienceScore,
        location: locationScore
      }, matchingSkills, profile, lang);

      let careerPath = [];
      try {
        careerPath = typeof role.career_path === 'string' ? JSON.parse(role.career_path) : role.career_path;
      } catch {
        careerPath = [];
      }

      rankedRoles.push({
        job_role_id: role.id,
        role_name: role.role_name,
        sector: role.sector,
        nsqf_level: role.nsqf_level,
        description: role.description,
        required_education: role.required_education,
        training_duration: role.training_duration,
        career_path: careerPath,
        match_score: roundedScore,
        confidence_score: confidence,
        interest_score: Math.round(interestScore),
        skill_score: Math.round(skillScore),
        eligibility_score: Math.round(eligibilityScore),
        experience_score: Math.round(experienceScore),
        location_score: Math.round(locationScore),
        why_recommended: whyRecommended,
        matching_skills: matchingSkills,
        missing_skills: missingSkills,
      });
    }

    rankedRoles.sort((a, b) => b.match_score - a.match_score);
    const top3 = rankedRoles.slice(0, 3);

    await db.query('DELETE FROM recommendations WHERE user_id = $1', [userId]);

    for (const rec of top3) {
      const insertRec = await db.query(
        `INSERT INTO recommendations
         (user_id, job_role_id, match_score, interest_score, skill_score, eligibility_score, experience_score, location_score, confidence_score, why_recommended, matching_skills, missing_skills)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          userId,
          rec.job_role_id,
          rec.match_score,
          rec.interest_score,
          rec.skill_score,
          rec.eligibility_score,
          rec.experience_score,
          rec.location_score,
          rec.confidence_score,
          JSON.stringify(rec.why_recommended),
          JSON.stringify(rec.matching_skills),
          JSON.stringify(rec.missing_skills),
        ]
      );

      // If low confidence (<65%), flag for human review queue
      if (rec.confidence_score < 65) {
        const recId = insertRec?.rows?.[0]?.id || null;
        await db.query(
          `INSERT INTO human_reviews (user_id, recommendation_id, confidence_score, flag_reason, status)
           VALUES ($1, $2, $3, $4, 'pending')`,
          [userId, recId, rec.confidence_score, 'Low skill/profile data match confidence']
        ).catch(() => {});
      }
    }

    return top3;
  }

  /**
   * Fetch existing recommendations for a user
   */
  static async getRecommendationsForUser(userId) {
    if (db.getDriver() === 'mongodb') {
      const recs = await Recommendation.find({ user: userId })
        .sort({ match_score: -1 })
        .limit(3);

      if (!recs || recs.length === 0) {
        return await this.generateRecommendations(userId);
      }

      return recs.map(r => ({
        id: r._id,
        job_role_id: r.job_role,
        role_name: r.role_name,
        sector: r.sector,
        nsqf_level: r.nsqf_level,
        description: r.description,
        required_education: r.required_education,
        training_duration: r.training_duration,
        career_path: r.career_path || [],
        match_score: r.match_score,
        why_recommended: r.why_recommended || [],
        matching_skills: r.matching_skills || [],
        missing_skills: r.missing_skills || [],
        created_at: r.createdAt,
      }));
    }

    // SQL Mode
    const res = await db.query(
      `SELECT r.*, jr.role_name, jr.sector, jr.nsqf_level, jr.description, jr.required_education, jr.training_duration, jr.career_path
       FROM recommendations r
       JOIN job_roles jr ON r.job_role_id = jr.id
       WHERE r.user_id = $1
       ORDER BY r.match_score DESC
       LIMIT 3`,
      [userId]
    );

    if (res.rows.length === 0) {
      return await this.generateRecommendations(userId);
    }

    return res.rows.map(row => {
      let careerPath = [];
      let why = [];
      let matched = [];
      let missing = [];

      try { careerPath = typeof row.career_path === 'string' ? JSON.parse(row.career_path) : row.career_path; } catch {}
      try { why = typeof row.why_recommended === 'string' ? JSON.parse(row.why_recommended) : row.why_recommended; } catch { why = [row.why_recommended]; }
      try { matched = typeof row.matching_skills === 'string' ? JSON.parse(row.matching_skills) : row.matching_skills; } catch {}
      try { missing = typeof row.missing_skills === 'string' ? JSON.parse(row.missing_skills) : row.missing_skills; } catch {}

      return {
        id: row.id,
        job_role_id: row.job_role_id,
        role_name: row.role_name,
        sector: row.sector,
        nsqf_level: row.nsqf_level,
        description: row.description,
        required_education: row.required_education,
        training_duration: row.training_duration,
        career_path: careerPath,
        match_score: Number(row.match_score),
        confidence_score: Number(row.confidence_score || 85),
        why_recommended: Array.isArray(why) ? why : [why],
        matching_skills: Array.isArray(matched) ? matched : [],
        missing_skills: Array.isArray(missing) ? missing : [],
        created_at: row.created_at
      };
    });
  }
}

export default RecommendationService;

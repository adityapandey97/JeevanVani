import db from '../config/db.js';

export const JOB_MATCHING_WEIGHTS = {
  skill: 0.30,
  education: 0.20,
  location: 0.15,
  interest: 0.15,
  experience: 0.10,
  trainingFeasibility: 0.10,
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

export class JobMatchingService {
  /**
   * Deterministic 6-factor matching for a job opportunity against a beneficiary profile
   */
  static matchJob(job, profile, userSkills = [], userInterests = [], weights = JOB_MATCHING_WEIGHTS) {
    // 1. Skill Score (30%)
    let reqSkills = [];
    try {
      reqSkills = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : (job.required_skills || []);
    } catch {
      reqSkills = [];
    }

    const normUserSkills = (userSkills || []).map(s => (typeof s === 'string' ? s : s.name || '').toLowerCase().trim());
    const matchedSkills = [];
    const missingSkills = [];

    for (const rSkill of reqSkills) {
      const rLower = rSkill.toLowerCase().trim();
      const hasMatch = normUserSkills.some(uSkill =>
        uSkill === rLower || uSkill.includes(rLower) || rLower.includes(uSkill)
      );
      if (hasMatch) {
        matchedSkills.push(rSkill);
      } else {
        missingSkills.push(rSkill);
      }
    }

    const skillScore = reqSkills.length > 0
      ? Math.round((matchedSkills.length / reqSkills.length) * 100)
      : 70;

    // 2. Education Score (20%)
    const userEduRank = EDUCATION_LEVEL_ORDER[profile?.education?.toLowerCase()?.trim()] || 3;
    let reqEduRank = 4; // default 10th pass
    const reqEduLower = (job.eligibility || '').toLowerCase();
    if (reqEduLower.includes('graduate')) reqEduRank = 7;
    else if (reqEduLower.includes('diploma')) reqEduRank = 6;
    else if (reqEduLower.includes('12th') || reqEduLower.includes('iti')) reqEduRank = 5;
    else if (reqEduLower.includes('10th')) reqEduRank = 4;
    else if (reqEduLower.includes('8th')) reqEduRank = 3;

    let educationScore = 50;
    if (userEduRank >= reqEduRank) educationScore = 100;
    else if (userEduRank === reqEduRank - 1) educationScore = 80;

    // 3. Location Score (15%)
    let locationScore = 65;
    const prefLoc = (profile?.preferred_location || '').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();
    if (profile?.willing_to_relocate) {
      locationScore = 95;
    } else if (prefLoc && (jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc))) {
      locationScore = 100;
    } else if (jobLoc.includes('up') || jobLoc.includes('uttar pradesh') || jobLoc.includes('nearby')) {
      locationScore = 80;
    }

    // 4. Interest & Sector Score (15%)
    let interestScore = 60;
    const prefSector = (profile?.preferred_sector || '').toLowerCase();
    const jobSector = (job.sector || '').toLowerCase();
    if (prefSector && (jobSector.includes(prefSector) || prefSector.includes(jobSector))) {
      interestScore = 95;
    } else {
      const intNames = (userInterests || []).map(i => (typeof i === 'string' ? i : i.interest_name || '').toLowerCase());
      const hasIntMatch = intNames.some(iName => jobSector.includes(iName) || (job.title || '').toLowerCase().includes(iName));
      if (hasIntMatch) interestScore = 90;
    }

    // 5. Experience Score (10%)
    let experienceScore = 70;
    const expStr = (profile?.work_experience || '').toLowerCase();
    if (expStr.includes('year') || expStr.includes('साल') || expStr.includes('2') || expStr.includes('3')) {
      experienceScore = 95;
    } else if (expStr.includes('helper') || expStr.includes('month') || expStr.includes('महीने')) {
      experienceScore = 85;
    }

    // 6. Training Feasibility Score (10%)
    const trainingFeasibilityScore = skillScore > 50 ? 90 : (educationScore >= 80 ? 80 : 70);

    // Final Total Score
    const finalScore = Math.round(
      (weights.skill * skillScore) +
      (weights.education * educationScore) +
      (weights.location * locationScore) +
      (weights.interest * interestScore) +
      (weights.experience * experienceScore) +
      (weights.trainingFeasibility * trainingFeasibilityScore)
    );

    const clampedTotal = Math.min(98, Math.max(45, finalScore));

    // Confidence Calculation
    const profileCompleteness = Number(profile?.profile_completion || 70);
    const confidence = Math.min(98, Math.max(55, Math.round(
      (clampedTotal * 0.45) + (profileCompleteness * 0.35) + (job.is_verified ? 20 : 10)
    )));

    // Rationale Generation (Why this job?)
    const whyRecommended = [];
    if (matchedSkills.length > 0) {
      whyRecommended.push(`Your prior experience with ${matchedSkills.slice(0, 2).join(' & ')} satisfies key job duties.`);
    }
    if (educationScore >= 80) {
      whyRecommended.push(`Your education (${profile?.education || '10th Pass'}) meets the minimum eligibility requirements.`);
    }
    if (locationScore >= 80) {
      whyRecommended.push(`Opportunity matches your geographic or mobility preference in ${job.location}.`);
    }
    if (interestScore >= 80) {
      whyRecommended.push(`Direct alignment with your interest in the ${job.sector} industry.`);
    }
    whyRecommended.push(`Verified official listing under ${job.source}.`);

    return {
      totalScore: clampedTotal,
      confidenceScore: confidence,
      scores: {
        skillScore,
        educationScore,
        locationScore,
        interestScore,
        experienceScore,
        trainingFeasibilityScore,
      },
      weights,
      matchedSkills,
      missingSkills,
      whyRecommended,
    };
  }

  /**
   * Get recommended jobs for a user sorted by match score
   */
  static async getRecommendedJobsForUser(userId, limit = 6) {
    const profileRes = await db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]);
    const profile = profileRes.rows[0] || {};

    const userSkillsRes = await db.query(
      `SELECT s.name FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );
    const userSkills = userSkillsRes.rows.map(r => r.name);

    const userInterestsRes = await db.query('SELECT interest_name FROM interests WHERE user_id = $1', [userId]);
    const userInterests = userInterestsRes.rows.map(r => r.interest_name);

    const jobsRes = await db.query('SELECT * FROM jobs ORDER BY id ASC');
    const allJobs = jobsRes.rows;

    const ranked = allJobs.map(job => {
      const match = this.matchJob(job, profile, userSkills, userInterests);
      let reqSkills = [];
      try {
        reqSkills = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : (job.required_skills || []);
      } catch {
        reqSkills = [];
      }

      return {
        id: job.id,
        title: job.title,
        organization: job.organization,
        sector: job.sector,
        location: job.location,
        eligibility: job.eligibility,
        salary: job.salary,
        application_url: job.application_url,
        source: job.source,
        source_id: job.source_id,
        is_verified: Boolean(job.is_verified),
        posted_at: job.posted_at,
        expires_at: job.expires_at,
        last_verified_at: job.last_verified_at,
        required_skills: reqSkills,
        matchScore: match.totalScore,
        confidenceScore: match.confidenceScore,
        scoreComponents: match.scores,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        whyRecommended: match.whyRecommended,
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);
    return ranked.slice(0, limit);
  }
}

export default JobMatchingService;

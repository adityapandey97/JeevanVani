import RecommendationService from '../services/recommendationService.js';
import db from '../config/db.js';

export async function generateRecommendations(req, res, next) {
  try {
    const userId = req.user.id;
    const recommendations = await RecommendationService.generateRecommendations(userId);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    const userId = req.user.id;
    let recommendations = await RecommendationService.getRecommendationsForUser(userId);

    // If no recommendations exist yet, generate them dynamically
    if (recommendations.length === 0) {
      recommendations = await RecommendationService.generateRecommendations(userId);
    }

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendationById(req, res, next) {
  try {
    const { id } = req.params;
    const resRole = await db.query(
      `SELECT r.*, jr.role_name, jr.sector, jr.nsqf_level, jr.description, jr.required_education, jr.training_duration, jr.career_path
       FROM recommendations r
       JOIN job_roles jr ON r.job_role_id = jr.id
       WHERE r.id = $1`,
      [id]
    );

    if (resRole.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recommendation not found.' });
    }

    const row = resRole.rows[0];
    let careerPath = [];
    let why = [];
    let matched = [];
    let missing = [];

    try { careerPath = JSON.parse(row.career_path); } catch {}
    try { why = JSON.parse(row.why_recommended); } catch { why = [row.why_recommended]; }
    try { matched = JSON.parse(row.matching_skills); } catch {}
    try { missing = JSON.parse(row.missing_skills); } catch {}

    res.json({
      success: true,
      recommendation: {
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
        interest_score: Number(row.interest_score),
        skill_score: Number(row.skill_score),
        eligibility_score: Number(row.eligibility_score),
        experience_score: Number(row.experience_score),
        location_score: Number(row.location_score),
        why_recommended: why,
        matching_skills: matched,
        missing_skills: missing,
        created_at: row.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  generateRecommendations,
  getRecommendations,
  getRecommendationById
};

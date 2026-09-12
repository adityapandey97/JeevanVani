import db from '../config/db.js';
import RAGService from '../services/ragService.js';

export async function submitFeedback(req, res, next) {
  try {
    const userId = req.user.id;
    const { recommendationType, targetId, rating, comment } = req.body;

    if (!recommendationType || !targetId) {
      return res.status(400).json({ success: false, message: 'recommendationType and targetId are required.' });
    }

    await db.query(
      `INSERT INTO recommendation_feedback (user_id, recommendation_type, target_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, recommendationType, targetId, rating || 5, comment || 'Helpful recommendation']
    );

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping improve JeevanVaani recommendations!'
    });
  } catch (error) {
    next(error);
  }
}

export async function getHumanReviewQueue(req, res, next) {
  try {
    const reviewsRes = await db.query(
      `SELECT hr.*, u.name as user_name, u.email as user_email, u.mobile as user_mobile,
              bp.education, bp.work_experience, bp.preferred_sector
       FROM human_reviews hr
       JOIN users u ON hr.user_id = u.id
       LEFT JOIN beneficiary_profiles bp ON u.id = bp.user_id
       ORDER BY hr.created_at DESC`
    );

    res.json({
      success: true,
      count: reviewsRes.rows.length,
      queue: reviewsRes.rows
    });
  } catch (error) {
    next(error);
  }
}

export async function updateHumanReview(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reviewerNotes } = req.body;

    await db.query(
      `UPDATE human_reviews
       SET status = $1, reviewer_notes = $2, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [status || 'approved', reviewerNotes || 'Approved by State Admin Officer', id]
    );

    res.json({
      success: true,
      message: 'Human review decision recorded successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendationExplanation(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const lang = req.headers['x-language'] || 'en';

    const [recRes, profRes] = await Promise.all([
      db.query('SELECT r.*, jr.role_name, jr.sector FROM recommendations r JOIN job_roles jr ON r.job_role_id = jr.id WHERE r.id = $1', [id]),
      db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId])
    ]);

    if (recRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recommendation record not found' });
    }

    const rationale = await RAGService.generateExplainableRationale(recRes.rows[0], profRes.rows[0] || {}, 'job_role', lang);

    res.json({
      success: true,
      explanation: rationale
    });
  } catch (error) {
    next(error);
  }
}

export default { submitFeedback, getHumanReviewQueue, updateHumanReview, getRecommendationExplanation };

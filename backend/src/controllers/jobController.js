import db from '../config/db.js';
import JobMatchingService from '../services/jobMatchingService.js';

export async function getJobs(req, res, next) {
  try {
    const { sector, location, verifiedOnly, search } = req.query;
    let queryText = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    let counter = 1;

    if (sector) {
      queryText += ` AND LOWER(sector) LIKE LOWER($${counter++})`;
      params.push(`%${sector}%`);
    }

    if (location) {
      queryText += ` AND LOWER(location) LIKE LOWER($${counter++})`;
      params.push(`%${location}%`);
    }

    if (verifiedOnly === 'true' || verifiedOnly === '1') {
      queryText += ` AND is_verified = 1`;
    }

    if (search) {
      queryText += ` AND (LOWER(title) LIKE LOWER($${counter}) OR LOWER(organization) LIKE LOWER($${counter}))`;
      params.push(`%${search}%`);
      counter++;
    }

    queryText += ' ORDER BY id ASC';
    const result = await db.query(queryText, params);

    const jobs = result.rows.map(job => {
      let reqSkills = [];
      try {
        reqSkills = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : (job.required_skills || []);
      } catch {
        reqSkills = [];
      }

      return {
        ...job,
        required_skills: reqSkills,
        is_verified: Boolean(job.is_verified)
      };
    });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedJobs(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit || 6);
    const recommended = await JobMatchingService.getRecommendedJobsForUser(userId, limit);

    res.json({
      success: true,
      count: recommended.length,
      recommendations: recommended
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job opportunity not found' });
    }

    const job = result.rows[0];
    let reqSkills = [];
    try {
      reqSkills = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : (job.required_skills || []);
    } catch {
      reqSkills = [];
    }

    res.json({
      success: true,
      job: {
        ...job,
        required_skills: reqSkills,
        is_verified: Boolean(job.is_verified)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function applyToJob(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { notes } = req.body;

    const jobCheck = await db.query('SELECT id, title, organization FROM jobs WHERE id = $1', [id]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check existing application
    const existing = await db.query(
      'SELECT id FROM job_applications WHERE user_id = $1 AND job_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already registered interest for this opportunity.' });
    }

    await db.query(
      'INSERT INTO job_applications (user_id, job_id, status, notes) VALUES ($1, $2, $3, $4)',
      [userId, id, 'submitted', notes || 'Application submitted via JeevanVaani PM-AJAY portal']
    );

    res.status(201).json({
      success: true,
      message: 'Interest registered successfully. Your PM-AJAY profile has been forwarded to the verified provider.',
      job: jobCheck.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export default { getJobs, getRecommendedJobs, getJobById, applyToJob };

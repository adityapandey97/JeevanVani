import db from '../config/db.js';
import ProfileExtractionService from '../services/profileExtractionService.js';

/**
 * ApplicationController
 * Tracks beneficiary job applications, course enrollments, and holistic livelihood progress
 */

export async function getUserApplications(req, res, next) {
  try {
    const userId = req.user.id;

    const [jobsRes, coursesRes] = await Promise.all([
      db.query(
        `SELECT ja.*, j.title, j.organization, j.sector, j.location, j.salary, j.source, j.application_url
         FROM job_applications ja
         JOIN jobs j ON ja.job_id = j.id
         WHERE ja.user_id = $1
         ORDER BY ja.applied_at DESC`,
        [userId]
      ),
      db.query(
        `SELECT ce.*, c.course_name, c.qualification_pack_id, c.nsqf_level, c.duration, c.training_provider, c.mode, c.enrollment_url, c.stipend_info
         FROM course_enrollments ce
         JOIN courses c ON ce.course_id = c.id
         WHERE ce.user_id = $1
         ORDER BY ce.enrolled_at DESC`,
        [userId]
      )
    ]);

    res.json({
      success: true,
      data: {
        jobApplications: jobsRes.rows,
        courseEnrollments: coursesRes.rows,
        summary: {
          totalJobsApplied: jobsRes.rows.length,
          totalCoursesEnrolled: coursesRes.rows.length,
          activeOpportunities: jobsRes.rows.filter(j => j.status !== 'rejected').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function submitApplication(req, res, next) {
  try {
    const userId = req.user.id;
    const { type, targetId, notes = '' } = req.body;

    if (!type || !targetId) {
      return res.status(400).json({ success: false, message: 'Application type (job | course) and targetId are required.' });
    }

    if (type === 'job') {
      const jobCheck = await db.query('SELECT id, title, organization FROM jobs WHERE id = $1', [targetId]);
      if (jobCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      const existing = await db.query('SELECT id FROM job_applications WHERE user_id = $1 AND job_id = $2', [userId, targetId]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'You have already applied for this job opportunity.' });
      }

      await db.query(
        'INSERT INTO job_applications (user_id, job_id, status, notes) VALUES ($1, $2, $3, $4)',
        [userId, targetId, 'submitted', notes || 'Direct registration via JeevanVaani PM-AJAY portal']
      );

      return res.status(201).json({
        success: true,
        message: 'Job application registered successfully under PM-AJAY candidate referral.',
        job: jobCheck.rows[0]
      });
    }

    if (type === 'course') {
      const courseCheck = await db.query('SELECT id, course_name FROM courses WHERE id = $1', [targetId]);
      if (courseCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const existing = await db.query('SELECT id FROM course_enrollments WHERE user_id = $1 AND course_id = $2', [userId, targetId]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
      }

      await db.query(
        'INSERT INTO course_enrollments (user_id, course_id, status, enrollment_type, completion_percent) VALUES ($1, $2, $3, $4, 0)',
        [userId, targetId, 'enrolled', notes || 'Fresh PM-AJAY Training']
      );

      return res.status(201).json({
        success: true,
        message: 'Enrollment initiated successfully with 100% PM-AJAY GIA grant fee subsidy.',
        course: courseCheck.rows[0]
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid application type. Allowed: "job" or "course".' });
  } catch (error) {
    next(error);
  }
}

export async function getBeneficiaryProgress(req, res, next) {
  try {
    const userId = req.user.id;

    const [profRes, skillsRes, recRes, enrRes, appRes, sessionRes] = await Promise.all([
      db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]),
      db.query('SELECT s.name FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = $1', [userId]),
      db.query('SELECT COUNT(*) as count FROM recommendations WHERE user_id = $1', [userId]),
      db.query('SELECT COUNT(*) as count FROM course_enrollments WHERE user_id = $1', [userId]),
      db.query('SELECT COUNT(*) as count FROM job_applications WHERE user_id = $1', [userId]),
      db.query('SELECT current_question_index, status FROM assessment_sessions WHERE user_id = $1', [userId])
    ]);

    const profile = profRes.rows[0] || {};
    const skills = skillsRes.rows.map(r => r.name);
    const completeness = ProfileExtractionService.calculateCompleteness(profile, skills);

    res.json({
      success: true,
      data: {
        profileCompleteness: completeness.percent,
        isProfileComplete: completeness.isComplete,
        missingFields: completeness.missingFields,
        assessmentStatus: sessionRes.rows[0]?.status || 'not_started',
        assessmentProgress: {
          currentQuestion: sessionRes.rows[0]?.current_question_index || 0,
          totalQuestions: 15
        },
        metrics: {
          skillsIdentified: skills.length,
          recommendationsCount: Number(recRes.rows[0]?.count || 0),
          coursesEnrolled: Number(enrRes.rows[0]?.count || 0),
          jobsApplied: Number(appRes.rows[0]?.count || 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export default { getUserApplications, submitApplication, getBeneficiaryProgress };

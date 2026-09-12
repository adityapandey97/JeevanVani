import db from '../config/db.js';
import CourseRecommendationService from '../services/courseRecommendationService.js';

export async function getCourses(req, res, next) {
  try {
    const { nsqfLevel, rplOnly, search } = req.query;
    let queryText = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    let counter = 1;

    if (nsqfLevel) {
      queryText += ` AND nsqf_level = $${counter++}`;
      params.push(Number(nsqfLevel));
    }

    if (rplOnly === 'true' || rplOnly === '1') {
      queryText += ` AND rpl_available = 1`;
    }

    if (search) {
      queryText += ` AND (LOWER(course_name) LIKE LOWER($${counter}) OR LOWER(training_provider) LIKE LOWER($${counter}))`;
      params.push(`%${search}%`);
      counter++;
    }

    queryText += ' ORDER BY id ASC';
    const result = await db.query(queryText, params);

    const courses = result.rows.map(c => {
      let skills = [];
      try {
        skills = typeof c.skills_covered === 'string' ? JSON.parse(c.skills_covered) : (c.skills_covered || []);
      } catch {
        skills = [];
      }

      return {
        ...c,
        skills_covered: skills,
        rpl_available: Boolean(c.rpl_available),
        is_verified: Boolean(c.is_verified)
      };
    });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedCourses(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit || 6);
    const recommended = await CourseRecommendationService.getRecommendedCoursesForUser(userId, limit);

    res.json({
      success: true,
      count: recommended.length,
      courses: recommended
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const c = result.rows[0];
    let skills = [];
    try {
      skills = typeof c.skills_covered === 'string' ? JSON.parse(c.skills_covered) : (c.skills_covered || []);
    } catch {
      skills = [];
    }

    res.json({
      success: true,
      course: {
        ...c,
        skills_covered: skills,
        rpl_available: Boolean(c.rpl_available),
        is_verified: Boolean(c.is_verified)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function enrollCourse(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { enrollmentType = 'Fresh Training' } = req.body;

    const courseCheck = await db.query('SELECT id, course_name, enrollment_url FROM courses WHERE id = $1', [id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existing = await db.query(
      'SELECT id FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You are already enrolled or have applied for this course.' });
    }

    await db.query(
      'INSERT INTO course_enrollments (user_id, course_id, status, enrollment_type, completion_percent) VALUES ($1, $2, $3, $4, 0)',
      [userId, id, 'enrolled', enrollmentType]
    );

    res.status(201).json({
      success: true,
      message: 'Enrollment initiated under PM-AJAY GIA 100% subsidized scheme.',
      course: courseCheck.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export default { getCourses, getRecommendedCourses, getCourseById, enrollCourse };

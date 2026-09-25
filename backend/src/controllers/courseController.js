import db from '../config/db.js';
import CourseRecommendationService from '../services/courseRecommendationService.js';
import { skillIndiaAdapter } from '../integrations/index.js';

export async function getCourses(req, res, next) {
  try {
    const { nsqfLevel, rplOnly, search, sector } = req.query;

    // Fetch verified real courses from Skill India Digital Hub adapter
    let adapterCourses = [];
    try {
      const adapterRes = await skillIndiaAdapter.getVerifiedCourses();
      adapterCourses = adapterRes.records || [];
    } catch (e) {
      console.warn('[Courses] SkillIndia adapter warning:', e.message);
    }

    // Query local DB courses
    let dbCourses = [];
    try {
      const result = await db.query('SELECT * FROM courses ORDER BY id ASC');
      dbCourses = result.rows.map(c => {
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
    } catch (err) {
      console.warn('[Courses] DB query warning:', err.message);
    }

    // Combine adapter courses and DB courses, giving priority to real SIDH adapter courses
    const courseMap = new Map();
    for (const c of adapterCourses) {
      courseMap.set((c.course_name || '').toLowerCase().trim(), c);
    }
    for (const c of dbCourses) {
      const key = (c.course_name || '').toLowerCase().trim();
      if (!courseMap.has(key)) {
        courseMap.set(key, c);
      }
    }

    let allCourses = Array.from(courseMap.values());

    // Filter by NSQF Level
    if (nsqfLevel) {
      allCourses = allCourses.filter(c => Number(c.nsqf_level) === Number(nsqfLevel));
    }
    // Filter by RPL
    if (rplOnly === 'true' || rplOnly === '1') {
      allCourses = allCourses.filter(c => Boolean(c.rpl_available));
    }
    // Filter by Sector
    if (sector) {
      allCourses = allCourses.filter(c => (c.sector || '').toLowerCase().includes(sector.toLowerCase()));
    }
    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase();
      allCourses = allCourses.filter(c =>
        (c.course_name || '').toLowerCase().includes(q) ||
        (c.training_provider || '').toLowerCase().includes(q) ||
        (c.sector || '').toLowerCase().includes(q) ||
        (c.qualification_pack_id || '').toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: allCourses.length,
      courses: allCourses
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedCourses(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit || 12);
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

    // Check adapter courses first
    try {
      const { records } = await skillIndiaAdapter.getVerifiedCourses();
      const match = records.find(c => String(c.id) === String(id) || c.qualification_pack_id === id);
      if (match) {
        return res.json({ success: true, course: match });
      }
    } catch (e) {
      console.warn('[Courses] Adapter lookup error:', e.message);
    }

    const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
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
    const courseId = req.params.id;
    const { enrollmentType } = req.body;

    // Record enrollment in database
    await db.query(
      `INSERT INTO course_enrollments (user_id, course_id, status, enrollment_type, completion_percent)
       VALUES ($1, $2, 'enrolled', $3, 0)`,
      [userId, courseId, enrollmentType || 'Fresh Training']
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course under PM-AJAY GIA Component.',
      enrollment: {
        userId,
        courseId,
        enrollmentType,
        status: 'enrolled',
        stipend_linked: true,
        toolkit_grant_eligible: true
      }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getCourses,
  getRecommendedCourses,
  getCourseById,
  enrollCourse
};

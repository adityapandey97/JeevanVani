import db from '../config/db.js';

export async function getCareerRoadmap(req, res, next) {
  try {
    const userId = req.user.id;

    const [profileRes, recRes, enrollmentRes, appRes] = await Promise.all([
      db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]),
      db.query('SELECT r.*, jr.role_name, jr.sector, jr.nsqf_level FROM recommendations r JOIN job_roles jr ON r.job_role_id = jr.id WHERE r.user_id = $1 ORDER BY r.match_score DESC LIMIT 1', [userId]),
      db.query('SELECT ce.*, c.course_name, c.duration FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id WHERE ce.user_id = $1 ORDER BY ce.id DESC LIMIT 1', [userId]),
      db.query('SELECT ja.*, j.title FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE ja.user_id = $1 ORDER BY ja.id DESC LIMIT 1', [userId]),
    ]);

    const profile = profileRes.rows[0] || {};
    const topRec = recRes.rows[0] || null;
    const enrollment = enrollmentRes.rows[0] || null;
    const application = appRes.rows[0] || null;

    const isAssessmentComplete = (profile.profile_completion || 0) >= 100;
    const hasSkillGapsComputed = Boolean(topRec);
    const hasEnrollment = Boolean(enrollment);
    const hasCertification = enrollment?.status === 'certified' || (enrollment?.completion_percent || 0) >= 100;
    const hasAppliedJob = Boolean(application);

    // Count matching jobs
    const jobsCountRes = await db.query('SELECT COUNT(*) as cnt FROM jobs WHERE is_verified = 1');
    const availableJobsCount = Number(jobsCountRes.rows[0]?.cnt || 8);

    const steps = [
      {
        step: 1,
        title: 'Profile & Skills Assessment',
        title_hi: 'प्रोफ़ाइल व कौशल मूल्यांकन',
        status: isAssessmentComplete ? 'completed' : 'in_progress',
        description: isAssessmentComplete
          ? 'Completed via JeevanVaani voice assistant.'
          : 'Answer 14 simple voice/text questions to build your verified PM-AJAY profile.',
        actionLabel: isAssessmentComplete ? 'View Profile' : 'Complete Assessment',
        actionUrl: isAssessmentComplete ? '/dashboard' : '/assessment'
      },
      {
        step: 2,
        title: 'Skill Gap & Pathway Mapping',
        title_hi: 'कौशल अंतराल व मार्ग विश्लेषण',
        status: hasSkillGapsComputed ? 'completed' : 'pending',
        description: hasSkillGapsComputed
          ? `Benchmarked against NSQF Level ${topRec?.nsqf_level || 4} for ${topRec?.role_name || 'selected role'}.`
          : 'Awaiting profile completion to compute skill gap breakdown.',
        actionLabel: 'View Skill Gaps',
        actionUrl: '/skill-gap'
      },
      {
        step: 3,
        title: 'Complete Free PM-AJAY Skilling / RPL',
        title_hi: 'मुफ्त PM-AJAY कौशल प्रशिक्षण या RPL प्रमाणन',
        status: hasCertification ? 'completed' : (hasEnrollment ? 'in_progress' : 'pending'),
        description: hasEnrollment
          ? `Enrolled in: ${enrollment?.course_name}. Duration: ${enrollment?.duration || '3 months'}.`
          : '100% government-funded training with daily stipend support.',
        actionLabel: hasEnrollment ? 'Training Dashboard' : 'Explore Courses',
        actionUrl: '/courses'
      },
      {
        step: 4,
        title: 'Practical Assessment & NCVET Exam',
        title_hi: 'प्रैक्टिकल मूल्यांकन व NCVET परीक्षा',
        status: hasCertification ? 'completed' : (hasEnrollment ? 'scheduled' : 'pending'),
        description: 'Hands-on trade assessment by authorized Sector Skill Council assessors.',
        actionLabel: 'Assessment Guidelines',
        actionUrl: '/courses'
      },
      {
        step: 5,
        title: 'Government NSQF Certification',
        title_hi: 'सरकारी NSQF प्रमाण पत्र',
        status: hasCertification ? 'completed' : 'pending',
        description: 'Digital verifiable QR-enabled certificate recognized nationally across India.',
        actionLabel: hasCertification ? 'Download Certificate' : 'Pending Completion',
        actionUrl: '/dashboard'
      },
      {
        step: 6,
        title: 'Apply for Verified Jobs & Rozgar Melas',
        title_hi: 'सत्यापित नौकरियों व रोजगार मेले में आवेदन',
        status: hasAppliedJob ? 'completed' : (hasSkillGapsComputed ? 'ready' : 'pending'),
        description: `${availableJobsCount} verified opportunities actively matching your profile.`,
        actionLabel: 'View Jobs',
        actionUrl: '/jobs'
      },
      {
        step: 7,
        title: 'Tool-Kit Subsidy & Credit Linkage',
        title_hi: 'टूल-किट सब्सिडी व ऋण सहायता लिंकेज',
        status: 'pending',
        description: 'PM-AJAY GIA tool-kit assistance (up to ₹50,000) and NSFDC/Mudra credit linkages for micro-enterprises.',
        actionLabel: 'Scheme Linkages',
        actionUrl: '/career-path'
      }
    ];

    res.json({
      success: true,
      targetRole: topRec?.role_name || 'Vocational Pathway',
      targetSector: topRec?.sector || 'General',
      steps
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillGaps(req, res, next) {
  try {
    const userId = req.user.id;
    const { roleId } = req.query;

    const userSkillsRes = await db.query(
      `SELECT s.name, s.category, us.proficiency_level FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );
    const userSkills = userSkillsRes.rows;
    const userSkillNames = userSkills.map(s => s.name.toLowerCase().trim());

    // Find target role (either specified roleId or top recommendation)
    let role;
    if (roleId) {
      const rRes = await db.query('SELECT * FROM job_roles WHERE id = $1', [roleId]);
      role = rRes.rows[0];
    }
    if (!role) {
      const topRecRes = await db.query(
        'SELECT jr.* FROM recommendations r JOIN job_roles jr ON r.job_role_id = jr.id WHERE r.user_id = $1 ORDER BY r.match_score DESC LIMIT 1',
        [userId]
      );
      role = topRecRes.rows[0];
    }
    if (!role) {
      const firstRoleRes = await db.query('SELECT * FROM job_roles ORDER BY id ASC LIMIT 1');
      role = firstRoleRes.rows[0];
    }

    if (!role) {
      return res.status(404).json({ success: false, message: 'No job roles found to analyze.' });
    }

    // Role required skills
    const roleSkillsRes = await db.query(
      `SELECT s.name, s.category, jrs.importance_weight, jrs.required_level
       FROM job_role_skills jrs
       JOIN skills s ON jrs.skill_id = s.id
       WHERE jrs.job_role_id = $1`,
      [role.id]
    );
    const requiredSkills = roleSkillsRes.rows;

    const skillAnalysis = requiredSkills.map(req => {
      const rLower = req.name.toLowerCase().trim();
      const matched = userSkills.find(u => {
        const uLower = u.name.toLowerCase().trim();
        return uLower === rLower || uLower.includes(rLower) || rLower.includes(uLower);
      });

      let currentProficiency = 0;
      if (matched) {
        if (matched.proficiency_level === 'Advanced') currentProficiency = 95;
        else if (matched.proficiency_level === 'Intermediate') currentProficiency = 75;
        else currentProficiency = 50;
      }

      const requiredProficiency = req.required_level === 'Advanced' ? 90 : (req.required_level === 'Intermediate' ? 75 : 60);
      const gapPercent = Math.max(0, requiredProficiency - currentProficiency);

      return {
        skillName: req.name,
        category: req.category,
        importanceWeight: Number(req.importance_weight) || 1.0,
        requiredLevel: req.required_level,
        requiredProficiency,
        currentProficiency,
        isAcquired: Boolean(matched),
        gapPercent,
      };
    });

    const acquiredCount = skillAnalysis.filter(s => s.isAcquired).length;
    const readinessPercent = requiredSkills.length > 0
      ? Math.round((acquiredCount / requiredSkills.length) * 100)
      : 50;

    // Find bridging courses
    const bridgeCoursesRes = await db.query(
      'SELECT id, course_name, duration, training_provider, enrollment_url FROM courses WHERE job_role_id = $1 LIMIT 2',
      [role.id]
    );

    res.json({
      success: true,
      targetRole: {
        id: role.id,
        role_name: role.role_name,
        sector: role.sector,
        nsqf_level: role.nsqf_level,
        description: role.description
      },
      readinessPercent,
      acquiredCount,
      totalRequiredCount: requiredSkills.length,
      skills: skillAnalysis,
      prioritizedGaps: skillAnalysis.filter(s => s.gapPercent > 0).sort((a, b) => b.gapPercent - a.gapPercent),
      recommendedCourses: bridgeCoursesRes.rows
    });
  } catch (error) {
    next(error);
  }
}

export default { getCareerRoadmap, getSkillGaps };

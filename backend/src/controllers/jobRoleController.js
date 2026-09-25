import db from '../config/db.js';
import { JobRole } from '../models/index.js';
import { nsdcAdapter } from '../integrations/index.js';

export async function getAllJobRoles(req, res, next) {
  try {
    const { sector, nsqf_level, search } = req.query;

    // Fetch verified real NSQF Qualification Packs from NSDC adapter
    let adapterRoles = [];
    try {
      const qpRes = await nsdcAdapter.getQualifications();
      const rawQps = qpRes.records || [];
      adapterRoles = rawQps.map((qp, idx) => ({
        id: `nsqf-${qp.qp_code.replace(/[\/\s]/g, '-')}`,
        role_name: qp.title,
        qp_code: qp.qp_code,
        sector: qp.sector,
        nsqf_level: Number(qp.nsqf_level),
        description: `Official NSQF Qualification Pack (${qp.qp_code}) accredited under ${qp.ssc}. Aligned for PM-AJAY GIA wage skilling and RPL.`,
        required_education: qp.entry_qualification,
        training_duration: `${qp.nos_count * 75} Hours (approx. 3 Months)`,
        career_path: [
          {
            stage: 1,
            title: `Trainee / Helper (${qp.title})`,
            experience: '0 - 1 year',
            wage_range: '₹12,000 - ₹15,000 / month',
            description: 'Foundational entry role under PMKVY / PM-AJAY apprenticeship.'
          },
          {
            stage: 2,
            title: `Certified ${qp.title} (NSQF Level ${qp.nsqf_level})`,
            experience: '1 - 3 years',
            wage_range: '₹16,000 - ₹24,000 / month',
            description: 'Independent certified technician with NCVET / NSDC certificate.'
          },
          {
            stage: 3,
            title: `Senior Technician / Supervisor`,
            experience: '3 - 5 years',
            wage_range: '₹25,000 - ₹38,000 / month',
            description: 'Team lead managing on-site installations, safety, and training juniors.'
          },
          {
            stage: 4,
            title: `Master Artisan / Independent Contractor`,
            experience: '5+ years',
            wage_range: '₹40,000 - ₹70,000 / month',
            description: 'Self-employed enterprise contractor supported with PM-AJAY toolkit grant and NSFDC credit linkage.'
          }
        ],
        skills: (qp.nos_list || []).map((n, i) => ({
          id: i + 1,
          name: n.name,
          category: 'Core Competency',
          importance_weight: 1.0,
          required_level: qp.nsqf_level
        })),
        rpl_available: Boolean(qp.rpl_pathway_available),
        official_qp_pdf: qp.official_qp_pdf,
        source: 'National Skill Development Corporation (NSDC)'
      }));
    } catch (e) {
      console.warn('[JobRoles] NSDC adapter warning:', e.message);
    }

    // Query local DB roles
    let dbRoles = [];
    try {
      const rolesRes = await db.query('SELECT * FROM job_roles ORDER BY nsqf_level ASC, role_name ASC');
      for (const r of rolesRes.rows) {
        const skillsRes = await db.query(
          `SELECT s.id, s.name, s.category, jrs.importance_weight, jrs.required_level
           FROM job_role_skills jrs
           JOIN skills s ON jrs.skill_id = s.id
           WHERE jrs.job_role_id = $1`,
          [r.id]
        );

        let careerPath = [];
        try {
          careerPath = typeof r.career_path === 'string' ? JSON.parse(r.career_path) : r.career_path;
        } catch {}

        dbRoles.push({
          ...r,
          career_path: careerPath,
          skills: skillsRes.rows,
        });
      }
    } catch (err) {
      console.warn('[JobRoles] DB query warning:', err.message);
    }

    // Combine: NSDC adapter roles merged with DB roles
    const roleMap = new Map();
    for (const r of adapterRoles) {
      roleMap.set((r.role_name || '').toLowerCase().trim(), r);
    }
    for (const r of dbRoles) {
      const key = (r.role_name || '').toLowerCase().trim();
      if (!roleMap.has(key)) {
        roleMap.set(key, r);
      }
    }

    let allRoles = Array.from(roleMap.values());

    // Apply filters
    if (sector) {
      allRoles = allRoles.filter(r => (r.sector || '').toLowerCase().includes(sector.toLowerCase()));
    }
    if (nsqf_level) {
      allRoles = allRoles.filter(r => Number(r.nsqf_level) === Number(nsqf_level));
    }
    if (search) {
      const q = search.toLowerCase();
      allRoles = allRoles.filter(r =>
        (r.role_name || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.sector || '').toLowerCase().includes(q) ||
        (r.qp_code || '').toLowerCase().includes(q)
      );
    }

    allRoles.sort((a, b) => Number(a.nsqf_level) - Number(b.nsqf_level));

    res.json({
      success: true,
      count: allRoles.length,
      jobRoles: allRoles,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobRoleById(req, res, next) {
  try {
    const { id } = req.params;

    // Check adapter qualifications first
    try {
      const qpRes = await nsdcAdapter.getQualifications();
      const rawQps = qpRes.records || [];
      const match = rawQps.find(q =>
        String(q.qp_code).toLowerCase() === String(id).toLowerCase() ||
        `nsqf-${q.qp_code.replace(/[\/\s]/g, '-')}`.toLowerCase() === String(id).toLowerCase()
      );

      if (match) {
        return res.json({
          success: true,
          jobRole: {
            id: `nsqf-${match.qp_code.replace(/[\/\s]/g, '-')}`,
            role_name: match.title,
            qp_code: match.qp_code,
            sector: match.sector,
            nsqf_level: Number(match.nsqf_level),
            description: `Official NSQF Qualification Pack (${match.qp_code}) accredited under ${match.ssc}. Aligned for PM-AJAY GIA wage skilling and RPL.`,
            required_education: match.entry_qualification,
            training_duration: `${match.nos_count * 75} Hours (approx. 3 Months)`,
            skills: (match.nos_list || []).map((n, i) => ({
              id: i + 1,
              name: n.name,
              category: 'Core Competency',
              importance_weight: 1.0,
              required_level: match.nsqf_level
            })),
            career_path: [
              {
                stage: 1,
                title: `Trainee / Helper (${match.title})`,
                experience: '0 - 1 year',
                wage_range: '₹12,000 - ₹15,000 / month',
                description: 'Foundational entry role under PMKVY / PM-AJAY apprenticeship.'
              },
              {
                stage: 2,
                title: `Certified ${match.title} (NSQF Level ${match.nsqf_level})`,
                experience: '1 - 3 years',
                wage_range: '₹16,000 - ₹24,000 / month',
                description: 'Independent certified technician with NCVET / NSDC certificate.'
              },
              {
                stage: 3,
                title: `Senior Technician / Supervisor`,
                experience: '3 - 5 years',
                wage_range: '₹25,000 - ₹38,000 / month',
                description: 'Team lead managing on-site installations, safety, and training juniors.'
              },
              {
                stage: 4,
                title: `Master Artisan / Independent Contractor`,
                experience: '5+ years',
                wage_range: '₹40,000 - ₹70,000 / month',
                description: 'Self-employed enterprise contractor supported with PM-AJAY toolkit grant and NSFDC credit linkage.'
              }
            ],
            rpl_available: Boolean(match.rpl_pathway_available),
            official_qp_pdf: match.official_qp_pdf,
            source: 'National Skill Development Corporation (NSDC)'
          }
        });
      }
    } catch (e) {
      console.warn('[JobRoles] Adapter lookup error:', e.message);
    }

    // SQL Mode DB lookup
    const roleRes = await db.query('SELECT * FROM job_roles WHERE id = $1', [id]);
    if (roleRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found.' });
    }

    const role = roleRes.rows[0];
    const skillsRes = await db.query(
      `SELECT s.id, s.name, s.category, jrs.importance_weight, jrs.required_level
       FROM job_role_skills jrs
       JOIN skills s ON jrs.skill_id = s.id
       WHERE jrs.job_role_id = $1`,
      [id]
    );

    let careerPath = [];
    try {
      careerPath = typeof role.career_path === 'string' ? JSON.parse(role.career_path) : role.career_path;
    } catch {}

    res.json({
      success: true,
      jobRole: {
        ...role,
        career_path: careerPath,
        skills: skillsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllJobRoles,
  getJobRoleById,
};

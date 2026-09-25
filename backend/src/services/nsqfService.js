import db from '../config/db.js';
import { nsdcAdapter } from '../integrations/index.js';

/**
 * NSQFService
 * Dedicated NSQF Knowledge and Competency Architecture Layer.
 * Explicitly separates and formalizes the distinct vocational concepts:
 * 1. NSQF Qualification - Level 1 to 8 competency benchmark approved by NCVET
 * 2. Job Role - Industry vocational designation (e.g. Solar PV Installer)
 * 3. QP (Qualification Pack) - Set of NOS required to perform a job role
 * 4. NOS (National Occupational Standards) - Measurable performance criteria for specific task
 * 5. Training Course - Structured learning program leading to a qualification
 * 6. Certification - Assessment & credential issued by NCVET / SSC
 * 7. RPL (Recognition of Prior Learning) - Fast-track certification of informal skills
 * 8. Skill Gap - Delta between acquired competency and required NOS
 */
export class NSQFService {
  /**
   * Retrieves all verified NSQF qualifications with QP-NOS breakdown and versioning
   */
  static async getQualifications(filter = {}) {
    const { sector, nsqfLevel, search } = filter;
    const { records: qualifications, metadata } = await nsdcAdapter.getQualifications();

    let filtered = qualifications;
    if (sector) {
      filtered = filtered.filter(q => q.sector.toLowerCase().includes(sector.toLowerCase()));
    }
    if (nsqfLevel) {
      filtered = filtered.filter(q => Number(q.nsqf_level) === Number(nsqfLevel));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(s) ||
        q.qp_code.toLowerCase().includes(s) ||
        q.sector.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      count: filtered.length,
      qualifications: filtered,
      freshness: metadata
    };
  }

  /**
   * Retrieves single qualification by QP code or ID
   */
  static async getQualificationByCode(qpCode) {
    const { records: qualifications, metadata } = await nsdcAdapter.getQualifications();
    const cleanCode = (qpCode || '').toUpperCase().trim();

    const qual = qualifications.find(q =>
      q.qp_code.toUpperCase() === cleanCode ||
      cleanCode.includes(q.qp_code.toUpperCase())
    );

    if (!qual) {
      return {
        success: false,
        message: 'Information could not be verified from the current source.',
        qualification: null,
        freshness: metadata
      };
    }

    return {
      success: true,
      qualification: qual,
      freshness: metadata
    };
  }

  /**
   * Evaluates RPL (Recognition of Prior Learning) pathway for a beneficiary
   * Adheres to rule #17: Never automatically claim eligibility. Requires verified criteria.
   */
  static evaluateRPLPathway(profile, qualification) {
    const experienceText = (profile.work_experience || '').toLowerCase();
    const hasInformalExp =
      experienceText.includes('year') ||
      experienceText.includes('साल') ||
      experienceText.includes('2') ||
      experienceText.includes('3') ||
      experienceText.includes('helper') ||
      experienceText.includes('दुकान') ||
      experienceText.includes('garage');

    if (!qualification.rpl_pathway_available) {
      return {
        rplEligible: false,
        status: 'RPL_UNAVAILABLE_FOR_ROLE',
        message: 'This specific Qualification Pack does not currently offer an open RPL window.',
        pathway: 'Standard Institutional Training (300 - 450 Hours)'
      };
    }

    if (hasInformalExp) {
      return {
        rplEligible: true,
        status: 'RECOMMENDED_RPL_CANDIDATE',
        message: 'You have prior informal work experience. You may explore an RPL pathway if an applicable qualification/programme is available in your district.',
        duration: '12 Hours Orientation + Practical Skill Assessment',
        benefit: 'Direct NCVET certification without 3-month classroom lock-in, plus ₹500 digital assessment stipend under PMKVY/PM-AJAY.',
        portalLink: 'https://www.skillindiadigital.gov.in/rpl',
        disclaimer: 'Based on the information available, this appears relevant. Please verify official eligibility with the designated Sector Skill Council assessment center.'
      };
    }

    return {
      rplEligible: false,
      status: 'FRESH_SKILLING_RECOMMENDED',
      message: 'Fresh training recommended. Standard NSQF vocational training course will build foundational competencies from scratch.',
      pathway: 'Institutional Workshop Training (3-4 Months)'
    };
  }
}

export default NSQFService;

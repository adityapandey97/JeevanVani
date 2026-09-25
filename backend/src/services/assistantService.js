import db from '../config/db.js';
import { RAGService } from './ragService.js';
import { pmajayAdapter } from '../integrations/index.js';

/**
 * AssistantService
 * Contextual, Anti-Hallucinatory Career & Skilling Assistant for JeevanVaani.
 * Grounded in official PM-AJAY GIA regulations, NSQF qualifications, and verified job/course registries.
 */
export class AssistantService {
  /**
   * Generates a grounded, contextual response to a user query
   * @param {Object} params
   * @param {string} params.message - Beneficiary question
   * @param {number} params.userId - Authenticated user ID
   * @param {string} [params.language='hi'] - User language ('hi' | 'en')
   * @param {Array} [params.conversationHistory=[]] - Previous turns
   */
  static async handleUserMessage({ message, userId, language = 'hi', conversationHistory = [] }) {
    const cleanQuery = (message || '').trim();
    if (!cleanQuery) {
      return {
        reply: language === 'hi' ? 'कृपया अपना प्रश्न पूछें।' : 'Please ask a question.',
        groundedFacts: [],
        sources: [],
        suggestedActions: []
      };
    }

    const queryLower = cleanQuery.toLowerCase();

    // 1. Load active user context (profile, top recommendation, enrollments, applications)
    let profile = {};
    let topRecommendation = null;
    let enrollments = [];
    let applications = [];

    if (userId) {
      try {
        const [profRes, recRes, enrRes, appRes] = await Promise.all([
          db.query('SELECT * FROM beneficiary_profiles WHERE user_id = $1', [userId]),
          db.query(
            `SELECT r.*, jr.role_name, jr.sector, jr.nsqf_level
             FROM recommendations r
             JOIN job_roles jr ON r.job_role_id = jr.id
             WHERE r.user_id = $1 ORDER BY r.match_score DESC LIMIT 1`,
            [userId]
          ),
          db.query(
            `SELECT ce.*, c.course_name FROM course_enrollments ce
             JOIN courses c ON ce.course_id = c.id
             WHERE ce.user_id = $1`,
            [userId]
          ),
          db.query(
            `SELECT ja.*, j.title FROM job_applications ja
             JOIN jobs j ON ja.job_id = j.id
             WHERE ja.user_id = $1`,
            [userId]
          )
        ]);

        profile = profRes.rows[0] || {};
        topRecommendation = recRes.rows[0] || null;
        enrollments = enrRes.rows || [];
        applications = appRes.rows || [];
      } catch (err) {
        console.warn('[AssistantService] Context fetch warning:', err.message);
      }
    }

    // 2. Strict Anti-Hallucination Guard Rails: Guaranteed Job Queries
    const isJobGuaranteeQuery =
      queryLower.includes('guarantee') ||
      queryLower.includes('गारंटी') ||
      queryLower.includes('पक्की नौकरी') ||
      queryLower.includes('सरकारी नौकरी मिलेगी') ||
      queryLower.includes('job guarantee');

    if (isJobGuaranteeQuery) {
      const reply = language === 'hi'
        ? `महत्वपूर्ण स्पष्टीकरण: कोई भी सरकारी योजना या प्रशिक्षण संस्थान शत-प्रतिशत सरकारी नौकरी की गारंटी नहीं देता है।\n\nPM-AJAY GIA घटक के तहत आपको:\n1. 100% मुफ्त NSQF-मान्यता प्राप्त कौशल प्रशिक्षण दिया जाता है।\n2. प्रमाणन के बाद स्वरोजगार के लिए ₹50,000 तक की टूल-किट सब्सिडी सहायता मिलती है।\n3. निजी व औद्योगिक कंपनियों में रोजगार मेलों के माध्यम से प्लेसमेंट सहायता प्रदान की जाती है।`
        : `Important Clarification: No government scheme or training program guarantees government employment.\n\nUnder PM-AJAY GIA Component, you receive:\n1. 100% subsidized NSQF-accredited practical skilling.\n2. Tool-kit grants up to ₹50,000 for self-employment enterprise setup.\n3. Placement facilitation and Rozgar Mela interviews with verified industry employers.`;

      return {
        reply,
        groundedFacts: [
          'Government schemes provide accredited vocational training and placement assistance, not guaranteed government appointments.',
          'PM-AJAY GIA provides up to ₹50,000 tool-kit subsidy for certified SC beneficiaries establishing micro-enterprises.'
        ],
        sources: [
          { title: 'PM-AJAY GIA Guidelines', url: 'https://pmajay.dosje.gov.in' }
        ],
        suggestedActions: [
          { label: language === 'hi' ? 'उपलब्ध नौकरियां देखें' : 'View Verified Jobs', url: '/jobs' },
          { label: language === 'hi' ? 'मुफ्त कोर्स देखें' : 'Explore Free Courses', url: '/courses' }
        ]
      };
    }

    // 3. Official Eligibility Queries
    const isEligibilityQuery =
      queryLower.includes('eligible') ||
      queryLower.includes('पात्र') ||
      queryLower.includes('पात्रता') ||
      queryLower.includes('am i eligible');

    if (isEligibilityQuery) {
      const relevance = pmajayAdapter.evaluatePreliminaryRelevance(profile);
      const reply = language === 'hi'
        ? `आपकी दर्ज जानकारी (${profile.education || '10वीं पास'}, ${profile.preferred_location || 'उत्तर प्रदेश'}) के आधार पर आप PM-AJAY GIA योजना के लिए प्रारंभिक रूप से उपयुक्त प्रतीत होते हैं।\n\nकृपया ध्यान दें: यह एक प्रारंभिक AI मिलान है। अंतिम सरकारी पात्रता आपके जिले के जिला समाज कल्याण अधिकारी / PM-AJAY कार्यान्वयन सेल द्वारा जाति प्रमाण पत्र (SC) व आय सत्यापन के पश्चात ही निर्धारित की जाती है।`
        : `Based on your recorded profile details (${profile.education || '10th Pass'}, ${profile.preferred_location || 'Home District'}), your profile indicates preliminary relevance for PM-AJAY GIA vocational skilling.\n\nOfficial Caveat: This is an algorithmic assessment. Official eligibility is verified by your District Social Welfare Officer / PM-AJAY Implementation Cell upon presentation of valid SC caste and income documentation.`;

      return {
        reply,
        groundedFacts: relevance.reasons,
        sources: [
          { title: 'PM-AJAY Eligibility Norms', url: relevance.portalUrl }
        ],
        suggestedActions: [
          { label: language === 'hi' ? 'मेरी प्रोफ़ाइल देखें' : 'View My Profile', url: '/dashboard' },
          { label: language === 'hi' ? 'करियर रोडमैप' : 'Career Roadmap', url: '/roadmap' }
        ]
      };
    }

    // 4. RPL (Recognition of Prior Learning) Queries
    const isRPLQuery =
      queryLower.includes('rpl') ||
      queryLower.includes('पूर्व अनुभव') ||
      queryLower.includes('prior learning') ||
      queryLower.includes('पुराना अनुभव');

    if (isRPLQuery) {
      const reply = language === 'hi'
        ? `RPL (पूर्व ज्ञान की मान्यता) NCVET और स्किल इंडिया की एक विशेष पहल है। यदि आपके पास पहले से अनौपचारिक काम (जैसे बिजली वायरिंग, सिलाई, या मोटर मैकेनिक) का 1-2 वर्ष का अनुभव है, तो आपको 3 महीने की लंबी क्लास करने की आवश्यकता नहीं है।\n\nआपको 12 घंटे का ओरिएंटेशन और प्रैक्टिकल परीक्षा देकर सीधा सरकारी NSQF प्रमाण पत्र मिल सकता है।`
        : `RPL (Recognition of Prior Learning) is an MSDE/NCVET pathway designed for individuals with informal work experience. If you already have 1-2 years of practical experience, you do not need 3-4 months of classroom attendance.\n\nYou can complete a 12-hour orientation, take the practical assessment, and receive an authentic NSQF certificate recognized across India.`;

      return {
        reply,
        groundedFacts: [
          'RPL recognizes informal skills without requiring full-duration classroom attendance.',
          'RPL candidates receive NCVET-approved certification and a ₹500 digital assessment stipend upon passing.'
        ],
        sources: [
          { title: 'NCVET RPL Guidelines', url: 'https://www.skillindiadigital.gov.in/rpl' }
        ],
        suggestedActions: [
          { label: language === 'hi' ? 'RPL कोर्स देखें' : 'Browse RPL Courses', url: '/courses?rplOnly=true' }
        ]
      };
    }

    // 5. Grounded RAG Search over Scheme & NSQF Knowledge Documents
    const retrievedDocs = await RAGService.retrieveContext(cleanQuery, 2);

    let groundedReply = '';
    const factList = [];
    const sourceList = [];

    if (retrievedDocs.length > 0) {
      retrievedDocs.forEach(d => {
        sourceList.push({ title: d.title, url: d.source_url || 'https://pmajay.dosje.gov.in' });
        factList.push(d.content.slice(0, 150) + '...');
      });

      const topDoc = retrievedDocs[0];
      groundedReply = language === 'hi'
        ? `आधिकारिक PM-AJAY और कौशल विकास अभिलेखों के अनुसार:\n${topDoc.content}\n\n(स्रोत: ${topDoc.source})`
        : `According to verified PM-AJAY and NSQF guidelines:\n${topDoc.content}\n\n(Source: ${topDoc.source})`;
    } else {
      groundedReply = language === 'hi'
        ? `नमस्ते! मैं जीवनवाणी PM-AJAY करियर और कौशल सहायक हूँ। मैं आपकी प्रोफ़ाइल (${profile.education || '10वीं पास'}, लक्ष्य: ${topRecommendation?.role_name || 'कौशल विकास'}) के अनुसार सर्वोत्तम कोर्स, नौकरी और योजना सब्सिडी खोजने में आपकी सहायता कर सकता हूँ। आप मुझसे अपने कोर्स, स्किल गैप, या PM-AJAY योजना नियमों के बारे में पूछ सकते हैं।`
        : `Hello! I am your JeevanVaani PM-AJAY Career & Skilling Assistant. Based on your current profile (${profile.education || '10th Pass'}, target: ${topRecommendation?.role_name || 'Vocational Skilling'}), I can help guide your skilling trajectory, tool-kit linkages, and verified job applications.`;
    }

    return {
      reply: groundedReply,
      groundedFacts: factList,
      sources: sourceList,
      suggestedActions: [
        { label: language === 'hi' ? 'अनुशंसित कोर्स' : 'Recommended Courses', url: '/courses' },
        { label: language === 'hi' ? 'सत्यापित नौकरियां' : 'Verified Jobs', url: '/jobs' },
        { label: language === 'hi' ? 'स्किल गैप विश्लेषण' : 'Skill Gap Analysis', url: '/skill-gap' }
      ]
    };
  }
}

export default AssistantService;

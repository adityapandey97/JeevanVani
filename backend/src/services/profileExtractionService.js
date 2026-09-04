/**
 * Entity Extraction and Natural Language Parsing Service
 * Parses conversational answers in Hindi, Hinglish, and English
 * to extract structured attributes for the beneficiary profile.
 */

export class ProfileExtractionService {
  /**
   * Extract age from text
   */
  static extractAge(text) {
    if (!text) return null;
    const match = text.match(/\b(1[6-9]|[2-6][0-9])\b/);
    if (match) return parseInt(match[1], 10);
    return null;
  }

  /**
   * Normalize education levels to standard NSQF benchmarks
   */
  static extractEducation(text) {
    if (!text) return null;
    const lower = text.toLowerCase();

    if (lower.includes('graduate') || lower.includes('degree') || lower.includes('ba') || lower.includes('b.com') || lower.includes('b.sc') || lower.includes('btech') || lower.includes('स्नातक') || lower.includes('ग्रेजुएट')) {
      return 'Graduate';
    }
    if (lower.includes('diploma') || lower.includes('पॉलिटेक्निक') || lower.includes('डिप्लोमा')) {
      return 'Diploma';
    }
    if (lower.includes('iti') || lower.includes('आईटीआई')) {
      return 'ITI';
    }
    if (lower.includes('12') || lower.includes('twelfth') || lower.includes('inter') || lower.includes('barahvi') || lower.includes('12वीं') || lower.includes('बारहवीं') || lower.includes('higher secondary')) {
      return '12th Pass';
    }
    if (lower.includes('10') || lower.includes('tenth') || lower.includes('matric') || lower.includes('dasvi') || lower.includes('10वीं') || lower.includes('दसवीं') || lower.includes('secondary')) {
      return '10th Pass';
    }
    if (lower.includes('8') || lower.includes('eighth') || lower.includes('aathvi') || lower.includes('8वीं') || lower.includes('आठवीं')) {
      return '8th Pass';
    }
    if (lower.includes('5') || lower.includes('fifth') || lower.includes('panchvi') || lower.includes('5वीं') || lower.includes('पांचवीं') || lower.includes('primary') || lower.includes('प्राथमिक')) {
      return '5th Pass';
    }
    if (lower.includes('illiterate') || lower.includes('no school') || lower.includes('कभी स्कूल नहीं गया') || lower.includes('अशिक्षित')) {
      return 'Below 5th Pass';
    }
    return text.trim();
  }

  /**
   * Normalize employment status
   */
  static extractEmploymentStatus(text) {
    if (!text) return null;
    const lower = text.toLowerCase();

    if (lower.includes('unemploy') || lower.includes('jobless') || lower.includes('बेरोजगार') || lower.includes('कोई काम नहीं') || lower.includes('no work')) {
      return 'Unemployed';
    }
    if (lower.includes('self') || lower.includes('own business') || lower.includes('दुकान') || lower.includes('स्वरोजगार') || lower.includes('खुद का काम') || lower.includes('freelance')) {
      return 'Self-Employed';
    }
    if (lower.includes('daily wage') || lower.includes('mazdoor') || lower.includes('मजदूरी') || lower.includes('contract') || lower.includes('helper') || lower.includes('दिहाड़ी')) {
      return 'Employed (Informal/Daily Wage)';
    }
    if (lower.includes('student') || lower.includes('पढ़ रहा') || lower.includes('विद्यार्थी') || lower.includes('studying')) {
      return 'Student';
    }
    if (lower.includes('employed') || lower.includes('job') || lower.includes('नौकरी') || lower.includes('company')) {
      return 'Employed (Full-Time)';
    }
    return 'Unemployed';
  }

  /**
   * Normalize job preference
   */
  static extractEmploymentPreference(text) {
    if (!text) return 'Both';
    const lower = text.toLowerCase();

    if (lower.includes('both') || lower.includes('दोनों') || lower.includes('kuch bhi') || lower.includes('either') || lower.includes('कोई भी')) {
      return 'Both';
    }
    if (lower.includes('self') || lower.includes('business') || lower.includes('अपना काम') || lower.includes('स्वरोजगार') || lower.includes('own shop') || lower.includes('enterprise')) {
      return 'Self-employment';
    }
    if (lower.includes('job') || lower.includes('नौकरी') || lower.includes('service') || lower.includes('private job') || lower.includes('company')) {
      return 'Job';
    }
    return 'Both';
  }

  /**
   * Extract willingness to relocate
   */
  static extractRelocationWillingness(text) {
    if (!text) return false;
    const lower = text.toLowerCase();

    if (lower.includes('yes') || lower.includes('haan') || lower.includes('हाँ') || lower.includes('ready') || lower.includes('anywhere') || lower.includes('कहीं भी') || lower.includes('willing') || lower.includes('बाहर जा सकता')) {
      return true;
    }
    if (lower.includes('no') || lower.includes('nahi') || lower.includes('नहीं') || lower.includes('only home') || lower.includes('घर के पास') || lower.includes('local')) {
      return false;
    }
    return false;
  }

  /**
   * Extract skills and keyword matches from natural speech/text
   */
  static matchSkills(text, availableSkills = []) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const matched = [];

    for (const skill of availableSkills) {
      const skillLower = skill.name.toLowerCase();
      // Match exact or significant token overlap
      if (lower.includes(skillLower)) {
        matched.push(skill);
        continue;
      }

      // Keyword associations
      const keywords = skillLower.split(/[\s&/]+/);
      const isMatch = keywords.some(kw => kw.length > 3 && lower.includes(kw));
      if (isMatch) {
        matched.push(skill);
      }
    }

    // Additional common Hindi/English colloquial mappings
    const colloquialMap = [
      { trigger: ['तार', 'बिजली', 'वायरिंग', 'electric', 'wiring', 'switch'], skillCategory: 'Electrical' },
      { trigger: ['सौर', 'धूप', 'सोलर', 'solar', 'panel'], skillCategory: 'Green Jobs' },
      { trigger: ['मरीज', 'अस्पताल', 'दवा', 'patient', 'hospital', 'nurse', 'doctor'], skillCategory: 'Healthcare' },
      { trigger: ['कंप्यूटर', 'टाइपिंग', 'ऑफिस', 'computer', 'typing', 'excel', 'data'], skillCategory: 'IT/ITeS' },
      { trigger: ['दुकान', 'सेल्स', 'दुकानदार', 'sales', 'retail', 'billing', 'customer'], skillCategory: 'Retail' },
      { trigger: ['बाइक', 'गाड़ी', 'मैकेनिक', 'bike', 'motorcycle', 'engine', 'garage'], skillCategory: 'Automotive' },
      { trigger: ['राजमिस्त्री', 'दीवार', 'सीमेंट', 'mason', 'plaster', 'brick', 'building'], skillCategory: 'Construction' },
      { trigger: ['ड्रिप', 'खेत', 'सिंचाई', 'irrigation', 'farming', 'motor', 'pump'], skillCategory: 'Agriculture' },
      { trigger: ['ब्यूटी', 'मेकअप', 'सैलून', 'beauty', 'parlour', 'facial', 'hair'], skillCategory: 'Beauty' },
      { trigger: ['सिलाई', 'कपड़े', 'टेलर', 'tailor', 'stitching', 'embroidery', 'sewing'], skillCategory: 'Apparel' },
    ];

    for (const mapping of colloquialMap) {
      if (mapping.trigger.some(trig => lower.includes(trig))) {
        const catSkills = availableSkills.filter(s => s.category.toLowerCase().includes(mapping.skillCategory.toLowerCase()));
        catSkills.forEach(s => {
          if (!matched.some(m => m.id === s.id)) {
            matched.push(s);
          }
        });
      }
    }

    return matched;
  }
}

export default ProfileExtractionService;

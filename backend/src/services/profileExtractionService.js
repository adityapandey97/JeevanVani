/**
 * Advanced In-Built NLP and Entity Extraction Service
 * Parses conversational natural language text/speech in Hindi, Hinglish, and English
 * without any external API calls.
 */

export class ProfileExtractionService {
  /**
   * Extract age from text (supports digits, Hindi written numbers, English written numbers)
   */
  static extractAge(text) {
    if (!text) return null;
    const clean = text.trim();

    // 1. Direct digit matching: 16 to 75
    const digitMatch = clean.match(/\b(1[6-9]|[2-6][0-9]|7[0-5])\b/);
    if (digitMatch) {
      return parseInt(digitMatch[1], 10);
    }

    // 2. Hindi number words
    const hindiNumberMap = {
      'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'अट्ठारह': 18, 'उन्नीस': 19,
      'बीस': 20, 'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24,
      'पच्चीस': 25, 'छब्बीस': 26, 'सत्ताईस': 27, 'अट्ठाईस': 28, 'उनतीस': 29,
      'तीस': 30, 'इकतीस': 31, 'बत्तीस': 32, 'तैंतीस': 33, 'चौंतीस': 34,
      'पैंतीस': 35, 'छत्तीस': 36, 'सैंतीस': 37, 'अड़तीस': 38, 'उनतालीस': 39,
      'चालीस': 40, 'पैंतालीस': 45, 'पचास': 50
    };

    for (const [word, val] of Object.entries(hindiNumberMap)) {
      if (clean.includes(word)) {
        return val;
      }
    }

    // 3. English words
    const engNumberMap = {
      'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'twenty one': 21,
      'twenty two': 22, 'twenty three': 23, 'twenty four': 24, 'twenty five': 25,
      'twenty six': 26, 'twenty seven': 27, 'twenty eight': 28, 'twenty nine': 29,
      'thirty': 30, 'thirty five': 35, 'forty': 40
    };

    const lower = clean.toLowerCase();
    for (const [word, val] of Object.entries(engNumberMap)) {
      if (lower.includes(word)) {
        return val;
      }
    }

    return null;
  }

  /**
   * Normalize education levels to standard NSQF benchmarks
   */
  static extractEducation(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    // Guard against age utterances mistakenly sent
    if (lower.includes('आयु') || lower.includes('उम्र') || lower.includes('साल का')) {
      if (!lower.includes('पास') && !lower.includes('कक्षा') && !lower.includes('class') && !lower.includes('th')) {
        return null;
      }
    }

    if (
      lower.includes('graduate') ||
      lower.includes('degree') ||
      lower.includes('bachelor') ||
      lower.includes('post graduate') ||
      lower.includes('स्नातक') ||
      lower.includes('ग्रेजुएट') ||
      lower.includes('ग्रेजुएशन') ||
      lower.includes('बीए') ||
      lower.includes('बी.ए') ||
      lower.includes('बीकॉम') ||
      lower.includes('बी.कॉम') ||
      lower.includes('बीएससी') ||
      lower.includes('बी.एससी') ||
      lower.includes('btech') ||
      lower.includes('b.tech') ||
      lower.includes('b.a') ||
      lower.includes('b.com') ||
      lower.includes('b.sc') ||
      /\bba\b/.test(lower) ||
      /\bmba\b/.test(lower)
    ) {
      return 'Graduate';
    }

    if (
      lower.includes('diploma') ||
      lower.includes('polytechnic') ||
      lower.includes('पॉलिटेक्निक') ||
      lower.includes('डिप्लोमा')
    ) {
      return 'Diploma';
    }

    if (
      lower.includes('iti') ||
      lower.includes('आई टी आई') ||
      lower.includes('आईटीआई') ||
      lower.includes('vocational')
    ) {
      return 'ITI';
    }

    if (
      lower.includes('12') ||
      lower.includes('twelfth') ||
      lower.includes('inter') ||
      lower.includes('इंटर') ||
      lower.includes('barahvi') ||
      lower.includes('12वीं') ||
      lower.includes('12th') ||
      lower.includes('बारहवीं') ||
      lower.includes('बारहवी') ||
      lower.includes('+2') ||
      lower.includes('higher secondary')
    ) {
      return '12th Pass';
    }

    if (
      lower.includes('10') ||
      lower.includes('tenth') ||
      lower.includes('matric') ||
      lower.includes('मैट्रिक') ||
      lower.includes('dasvi') ||
      lower.includes('10वीं') ||
      lower.includes('10th') ||
      lower.includes('दसवीं') ||
      lower.includes('दसवी') ||
      lower.includes('हाईस्कूल') ||
      lower.includes('high school') ||
      lower.includes('secondary')
    ) {
      return '10th Pass';
    }

    if (
      lower.includes('8') ||
      lower.includes('eighth') ||
      lower.includes('aathvi') ||
      lower.includes('8वीं') ||
      lower.includes('8th') ||
      lower.includes('आठवीं') ||
      lower.includes('आठवी') ||
      lower.includes('मिडिल')
    ) {
      return '8th Pass';
    }

    if (
      lower.includes('5') ||
      lower.includes('fifth') ||
      lower.includes('panchvi') ||
      lower.includes('5वीं') ||
      lower.includes('5th') ||
      lower.includes('पांचवीं') ||
      lower.includes('पांचवी') ||
      lower.includes('primary') ||
      lower.includes('प्राथमिक')
    ) {
      return '5th Pass';
    }

    if (
      lower.includes('illiterate') ||
      lower.includes('no school') ||
      lower.includes('कभी स्कूल नहीं') ||
      lower.includes('अशिक्षित') ||
      lower.includes('अनपढ़') ||
      lower.includes('पढ़ा लिखा नहीं')
    ) {
      return 'Below 5th Pass';
    }

    return text.trim();
  }

  /**
   * Normalize employment status
   */
  static extractEmploymentStatus(text) {
    if (!text) return 'Unemployed';
    const lower = text.toLowerCase().trim();

    if (
      lower.includes('unemploy') ||
      lower.includes('jobless') ||
      lower.includes('बेरोजगार') ||
      lower.includes('कोई काम नहीं') ||
      lower.includes('काम नहीं है') ||
      lower.includes('खाली') ||
      lower.includes('घर पर रहता') ||
      lower.includes('fresher') ||
      lower.includes('फ्रेशर') ||
      lower.includes('no work')
    ) {
      return 'Unemployed';
    }

    if (
      lower.includes('self') ||
      lower.includes('own business') ||
      lower.includes('दुकान') ||
      lower.includes('स्वरोजगार') ||
      lower.includes('खुद का काम') ||
      lower.includes('अपना काम') ||
      lower.includes('व्यापार') ||
      lower.includes('खेती') ||
      lower.includes('किसान') ||
      lower.includes('freelance')
    ) {
      return 'Self-Employed';
    }

    if (
      lower.includes('daily wage') ||
      lower.includes('mazdoor') ||
      lower.includes('मजदूरी') ||
      lower.includes('मजदूर') ||
      lower.includes('contract') ||
      lower.includes('ठेका') ||
      lower.includes('helper') ||
      lower.includes('सहायक') ||
      lower.includes('हेल्पर') ||
      lower.includes('दिहाड़ी')
    ) {
      return 'Employed (Informal/Daily Wage)';
    }

    if (
      lower.includes('student') ||
      lower.includes('पढ़ रहा') ||
      lower.includes('पढ़ाई') ||
      lower.includes('विद्यार्थी') ||
      lower.includes('छात्र') ||
      lower.includes('studying')
    ) {
      return 'Student';
    }

    if (
      lower.includes('employed') ||
      lower.includes('नौकरी') ||
      lower.includes('job') ||
      lower.includes('company') ||
      lower.includes('कंपनी') ||
      lower.includes('वेतन')
    ) {
      return 'Employed (Full-Time)';
    }

    return 'Unemployed';
  }

  /**
   * Clean and extract work experience
   */
  static extractWorkExperience(text) {
    if (!text) return 'कोई पूर्व अनुभव नहीं (फ्रेशर)';
    const clean = text.trim();
    const lower = clean.toLowerCase();

    if (
      lower === 'no' ||
      lower.includes('नहीं है') ||
      lower.includes('कोई अनुभव नहीं') ||
      lower.includes('अनुभव नहीं') ||
      lower.includes('fresher') ||
      lower.includes('फ्रेशर') ||
      lower.includes('कुछ नहीं किया') ||
      lower.includes('none')
    ) {
      return 'कोई पूर्व अनुभव नहीं (फ्रेशर)';
    }

    return clean;
  }

  /**
   * Normalize job vs self-employment preference
   */
  static extractEmploymentPreference(text) {
    if (!text) return 'Both';
    const lower = text.toLowerCase().trim();

    if (
      lower.includes('both') ||
      lower.includes('दोनों') ||
      lower.includes('दोनो') ||
      lower.includes('kuch bhi') ||
      lower.includes('either') ||
      lower.includes('कोई भी') ||
      (lower.includes('नौकरी') && lower.includes('दुकान')) ||
      (lower.includes('job') && lower.includes('business'))
    ) {
      return 'Both';
    }

    if (
      lower.includes('self') ||
      lower.includes('business') ||
      lower.includes('अपना काम') ||
      lower.includes('स्वरोजगार') ||
      lower.includes('own shop') ||
      lower.includes('enterprise') ||
      lower.includes('दुकान') ||
      lower.includes('व्यापार')
    ) {
      return 'Self-employment';
    }

    if (
      lower.includes('job') ||
      lower.includes('नौकरी') ||
      lower.includes('service') ||
      lower.includes('company') ||
      lower.includes('कंपनी') ||
      lower.includes('वेतन')
    ) {
      return 'Job';
    }

    return 'Both';
  }

  /**
   * Extract willingness to relocate
   */
  static extractRelocationWillingness(text) {
    if (!text) return false;
    const lower = text.toLowerCase().trim();

    if (
      lower.includes('yes') ||
      lower.includes('haan') ||
      lower.includes('हाँ') ||
      lower.includes('हां') ||
      lower.includes('हाँजी') ||
      lower.includes('ready') ||
      lower.includes('तैयार') ||
      lower.includes('anywhere') ||
      lower.includes('कहीं भी') ||
      lower.includes('willing') ||
      lower.includes('बाहर') ||
      lower.includes('जा सकते') ||
      lower.includes('जा सकता') ||
      lower.includes('जान को तैयार') ||
      lower.includes('जाने को तैयार') ||
      lower.includes('बिल्कुल') ||
      lower.includes('sure')
    ) {
      return true;
    }

    if (
      lower.includes('no') ||
      lower.includes('nahi') ||
      lower.includes('नहीं') ||
      lower.includes('ना') ||
      lower.includes('only home') ||
      lower.includes('घर के पास') ||
      lower.includes('घर पर') ||
      lower.includes('local') ||
      lower.includes('लोकल')
    ) {
      return false;
    }

    return false;
  }

  /**
   * Clean and normalize preferred location
   */
  static extractLocation(text) {
    if (!text) return 'Home District';
    let loc = text.trim();

    // Strip common Hindi prepositions / postpositions attached or spaced
    loc = loc
      .replace(/में$/i, '')
      .replace(/\s+में$/i, '')
      .replace(/me$/i, '')
      .replace(/\s+me$/i, '')
      .replace(/mein$/i, '')
      .replace(/\s+mein$/i, '')
      .replace(/\s+से$/i, '')
      .replace(/\s+में\s+रहता\s+हूँ$/i, '')
      .replace(/\s+में\s+रहते\s+हैं$/i, '')
      .trim();

    if (!loc || loc.length < 2) return 'Home District';
    return loc;
  }

  /**
   * High-Precision In-Built NLP Semantic Skill Matcher
   * Matches beneficiary input against catalog skills using tokenization,
   * Hindi/English semantic concept expansion, and synonym graphs.
   */
  static matchSkills(text, availableSkills = []) {
    if (!text) return [];
    // Normalization: clean punctuation and convert to lowercase
    const normalized = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const matchedMap = new Map();

    const addMatchedSkill = (skill, reason = 'match') => {
      if (skill && !matchedMap.has(skill.id || skill.name)) {
        matchedMap.set(skill.id || skill.name, skill);
      }
    };

    // 1. Direct Catalog Skill Matching
    for (const skill of availableSkills) {
      const skillLower = skill.name.toLowerCase();
      // Match full skill name
      if (normalized.includes(skillLower)) {
        addMatchedSkill(skill, 'full_name');
        continue;
      }

      // Match individual keywords with length >= 4
      const keywords = skillLower.split(/[\s&/()+-]+/).filter(w => w.length >= 4);
      const matchedKwCount = keywords.filter(kw => normalized.includes(kw)).length;
      if (keywords.length > 0 && matchedKwCount >= Math.min(2, keywords.length)) {
        addMatchedSkill(skill, 'keyword_overlap');
      }
    }

    // 2. Comprehensive Hindi & English Domain Concept Semantic Dictionary
    const domainKnowledgeBase = [
      {
        triggers: [
          'कंप्यूटर', 'कम्प्यूटर', 'टाइपिंग', 'डाटा', 'डाटा एंट्री', 'टाइप', 'कंप्यूटरटाइपिंग',
          'computer', 'typing', 'data entry', 'excel', 'word', 'ms office', 'docs',
          'ddeo', 'internet', 'email', 'ऑफिस', 'कीबोर्ड'
        ],
        categories: ['IT/ITeS', 'IT/ITeS & Digital Services', 'IT'],
        targetSkillNames: [
          'Typing Speed (30+ WPM)',
          'MS Office & Google Docs',
          'Data Entry & Verification',
          'Internet Navigation & Email'
        ]
      },
      {
        triggers: [
          'बिजली', 'वायरिंग', 'तार', 'स्विच', 'बोर्ड', 'करंट', 'इलेक्ट्रिक', 'लाइनमैन',
          'electric', 'wiring', 'switch', 'electrical', 'wireman', 'fuse', 'tester', 'multimeter'
        ],
        categories: ['Electrical', 'Power & Electrical Maintenance', 'Construction'],
        targetSkillNames: [
          'Basic Wiring',
          'Tool Handling',
          'Electrical Safety',
          'Multimeter & Testing Equipment',
          'Inverter & Battery Wiring'
        ]
      },
      {
        triggers: [
          'सौर', 'सोलर', 'धूप', 'पैनल', 'रूफटॉप', 'solar', 'panel', 'rooftop', 'pv cell', 'solar energy'
        ],
        categories: ['Green Jobs', 'Solar Energy', 'Renewable Energy'],
        targetSkillNames: [
          'Solar PV Cell Basics',
          'Mounting & Mechanical Assembly',
          'Inverter & Battery Wiring',
          'Tool Handling'
        ]
      },
      {
        triggers: [
          'बाइक', 'गाड़ी', 'मोटरसाइकिल', 'मैकेनिक', 'इंजन', 'ऑटोमोबाइल', 'ब्रेक', 'सर्विसिंग',
          'bike', 'motorcycle', 'scooter', 'automotive', 'engine', 'brake', 'garage', 'mechanic'
        ],
        categories: ['Automotive'],
        targetSkillNames: [
          'Two-Wheeler Servicing',
          'Engine Diagnostics',
          'Brake & Suspension',
          'Tool Handling'
        ]
      },
      {
        triggers: [
          'सिलाई', 'कढ़ाई', 'कपड़ा', 'कपड़े', 'टेलर', 'सूट', 'कटिंग', 'धागा', 'मशीन',
          'tailoring', 'stitching', 'sewing', 'garment', 'apparel', 'embroidery', 'cloth'
        ],
        categories: ['Apparel', 'Apparel & Handicrafts', 'Textile'],
        targetSkillNames: [
          'Machine Stitching',
          'Fabric Cutting',
          'Pattern Making',
          'Garment Assembly'
        ]
      },
      {
        triggers: [
          'अस्पताल', 'मरीज', 'दवा', 'नर्स', 'डॉक्टर', 'स्वास्थ्य', 'केयर', 'वार्ड', 'मरीज की देखभाल',
          'patient', 'hospital', 'nurse', 'health', 'healthcare', 'first aid', 'gda', 'clinic'
        ],
        categories: ['Healthcare'],
        targetSkillNames: [
          'Patient Assistance',
          'Vital Signs Monitoring',
          'First Aid',
          'Hygiene & Sanitation'
        ]
      },
      {
        triggers: [
          'दुकान', 'काउंटर', 'बिलिंग', 'ग्राहक', 'बिक्री', 'सेल्स', 'शोरूम', 'माल',
          'retail', 'sales', 'billing', 'customer', 'counter', 'cashier', 'store', 'shop'
        ],
        categories: ['Retail', 'Sales'],
        targetSkillNames: [
          'Customer Assistance',
          'Billing & Cash Handling',
          'Inventory Stocking',
          'Product Display'
        ]
      },
      {
        triggers: [
          'राजमिस्त्री', 'मिस्त्री', 'दीवार', 'सीमेंट', 'ईंट', 'चिनाई', 'प्लास्टर',
          'mason', 'brick', 'cement', 'plaster', 'construction', 'building'
        ],
        categories: ['Construction'],
        targetSkillNames: [
          'Masonry & Brickwork',
          'Plastering',
          'Measurement & Leveling',
          'Tool Handling'
        ]
      },
      {
        triggers: [
          'खेत', 'खेती', 'सिंचाई', 'पंप', 'मोटर', 'ड्रिप', 'किसान', 'मिट्टी', 'पानी',
          'agriculture', 'farming', 'pump', 'irrigation', 'sprinkler', 'soil'
        ],
        categories: ['Agriculture'],
        targetSkillNames: [
          'Drip & Sprinkler Installation',
          'Pump & Filter Maintenance',
          'Soil & Moisture Assessment',
          'Tool Handling'
        ]
      },
      {
        triggers: [
          'ब्यूटी', 'सैलून', 'मेकअप', 'बाल', 'कटिंग', 'पार्लर', 'फेशियल',
          'beauty', 'salon', 'makeup', 'haircut', 'facial', 'skin'
        ],
        categories: ['Beauty', 'Beauty & Wellness'],
        targetSkillNames: [
          'Hair Styling & Basic Cutting',
          'Skin Care Basics',
          'Hygiene & Tool Sterilization'
        ]
      }
    ];

    for (const domain of domainKnowledgeBase) {
      const isTriggered = domain.triggers.some(trig => {
        // Also support words joined without spaces, e.g. "कंप्यूटरटाइपिंग" contains "कंप्यूटर" and "टाइपिंग"
        return normalized.includes(trig);
      });

      if (isTriggered) {
        // Find skills in availableSkills that match target skill names or categories
        for (const targetName of domain.targetSkillNames) {
          const found = availableSkills.find(s => s.name.toLowerCase() === targetName.toLowerCase());
          if (found) {
            addMatchedSkill(found, 'domain_target');
          }
        }

        for (const cat of domain.categories) {
          const foundSkills = availableSkills.filter(s => s.category.toLowerCase().includes(cat.toLowerCase()));
          for (const s of foundSkills) {
            addMatchedSkill(s, 'domain_category');
          }
        }
      }
    }

    return Array.from(matchedMap.values());
  }
}

export default ProfileExtractionService;

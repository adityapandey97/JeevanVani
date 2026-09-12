import ProfileExtractionService from './profileExtractionService.js';

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'preferred_language',
    index: 0,
    field: 'preferred_language',
    en: "Namaste! Welcome to JeevanVaani. Which language do you prefer for our conversation and training guidance?",
    hi: "नमस्ते! जीवनवाणी में आपका स्वागत है। आप हमारे संवाद और प्रशिक्षण मार्गदर्शन के लिए कौन सी भाषा पसंद करेंगे?",
    quickReplies: {
      en: ['Hindi (हिंदी)', 'English', 'Both / Bilingual'],
      hi: ['हिंदी (Hindi)', 'English', 'दोनों (द्विभाषी)']
    }
  },
  {
    id: 'name',
    index: 1,
    field: 'name',
    en: "What is your full name?",
    hi: "कृपया अपना पूरा नाम बताएं?",
    quickReplies: {
      en: ['My name is on record', 'Rahul Kumar', 'Pooja Rani'],
      hi: ['मेरा नाम दर्ज है', 'राहुल कुमार', 'पूजा रानी']
    }
  },
  {
    id: 'age',
    index: 2,
    field: 'age',
    en: "To recommend the best PM-AJAY skilling opportunities, could you please tell me your age?",
    hi: "PM-AJAY योजना के तहत सबसे उपयुक्त अवसर खोजने के लिए, कृपया अपनी आयु (उम्र) बताएं?",
    quickReplies: {
      en: ['18 - 21 years', '22 - 25 years', '26 - 30 years', 'Above 30 years'],
      hi: ['18 - 21 वर्ष', '22 - 25 वर्ष', '26 - 30 वर्ष', '30 वर्ष से अधिक']
    }
  },
  {
    id: 'preferred_location',
    index: 3,
    field: 'preferred_location',
    en: "Which city, district, or home area are you currently located in or prefer to train in?",
    hi: "वर्तमान में आप किस शहर, जिले या क्षेत्र में रहते हैं जहाँ आप प्रशिक्षण या काम करना चाहते हैं?",
    quickReplies: {
      en: ['Kanpur, UP', 'Lucknow, UP', 'Varanasi, UP', 'Agra, UP', 'My Home District'],
      hi: ['कानपुर, उत्तर प्रदेश', 'लखनऊ, उत्तर प्रदेश', 'वाराणसी, उत्तर प्रदेश', 'आगरा, उत्तर प्रदेश', 'मेरा गृह जिला']
    }
  },
  {
    id: 'education',
    index: 4,
    field: 'education',
    en: "What is your highest educational qualification?",
    hi: "आपकी उच्चतम शिक्षा (पढ़ाई) कहाँ तक हुई है?",
    quickReplies: {
      en: ['8th Pass', '10th Pass', '12th Pass', 'ITI / Diploma', 'Graduate'],
      hi: ['8वीं पास', '10वीं पास', '12वीं पास', 'ITI / डिप्लोमा', 'ग्रेजुएट']
    }
  },
  {
    id: 'employment_status',
    index: 5,
    field: 'employment_status',
    en: "What is your current work or employment status right now?",
    hi: "वर्तमान में आपकी रोजगार स्थिति क्या है? क्या आप बेरोजगार हैं, छात्र हैं, या दैनिक मजदूरी करते हैं?",
    quickReplies: {
      en: ['Currently Unemployed', 'Daily Wage / Helper', 'Self-Employed / Small Shop', 'Student'],
      hi: ['वर्तमान में बेरोजगार', 'दिहाड़ी मजदूरी / हेल्पर', 'स्वरोजगार / छोटी दुकान', 'छात्र / विद्यार्थी']
    }
  },
  {
    id: 'work_experience',
    index: 6,
    field: 'work_experience',
    en: "Do you have any prior work experience? If yes, please describe what kind of work and for how long.",
    hi: "क्या आपके पास पहले किसी काम का अनुभव है? यदि हाँ, तो कृपया बताएं कि आपने किस प्रकार का काम और कितने समय किया है?",
    quickReplies: {
      en: ['No prior experience (Fresher)', 'Less than 1 year (Helper)', '1 - 2 years work', 'More than 2 years'],
      hi: ['कोई पूर्व अनुभव नहीं (फ्रेशर)', '1 वर्ष से कम (सहायक/हेल्पर)', '1 - 2 वर्ष का अनुभव', '2 वर्ष से अधिक']
    }
  },
  {
    id: 'skills',
    index: 7,
    field: 'skills',
    en: "What practical or technical skills do you already know? (e.g. basic wiring, vehicle repair, typing, tailoring, farming, etc.)",
    hi: "आप कौन से व्यावहारिक या तकनीकी कौशल पहले से जानते हैं? (जैसे: बिजली का तार जोड़ना, वाहन रिपेयर, टाइपिंग, सिलाई, खेती, आदि)",
    quickReplies: {
      en: ['Basic Wiring & Tools', 'Computer & Typing', 'Tailoring & Stitching', 'Bike / Motor Repair', 'Ready to learn from scratch'],
      hi: ['बिजली का काम व टूल्स', 'कंप्यूटर व टाइपिंग', 'सिलाई व कढ़ाई', 'बाइक / मोटर मैकेनिक', 'शुरुआत से सीखने को तैयार']
    }
  },
  {
    id: 'interests',
    index: 8,
    field: 'interests',
    en: "What kind of work or subjects are you most interested in learning or doing?",
    hi: "आपको किस प्रकार का काम सीखने या करने में सबसे अधिक रुचि है?",
    quickReplies: {
      en: ['Electrical & Solar Energy', 'Healthcare & Patient Care', 'Computers & Digital Work', 'Automobiles & Mechanics', 'Retail & Customer Service'],
      hi: ['बिजली व सोलर ऊर्जा', 'स्वास्थ्य सेवा व अस्पताल', 'कंप्यूटर व डिजिटल कार्य', 'ऑटोमोबाइल व मशीनें', 'दुकान व सेल्स']
    }
  },
  {
    id: 'preferred_sector',
    index: 9,
    field: 'preferred_sector',
    en: "Which industry sector would you prefer for your vocational career?",
    hi: "आप अपने करियर के लिए किस उद्योग या सेक्टर को प्राथमिकता देंगे?",
    quickReplies: {
      en: ['Solar / Green Jobs', 'Construction & Electrical', 'IT / Digital Services', 'Healthcare', 'Automotive', 'Apparel & Handicrafts'],
      hi: ['सोलर व ग्रीन जॉब्स', 'इलेक्ट्रिकल व निर्माण', 'आईटी व डिजिटल सेवा', 'स्वास्थ्य सेवा (Healthcare)', 'ऑटोमोबाइल', 'कपड़ा व हस्तशिल्प']
    }
  },
  {
    id: 'employment_preference',
    index: 10,
    field: 'employment_preference',
    en: "What is your career preference: A salaried job in a company, starting your own enterprise (self-employment), or open to both?",
    hi: "आपकी क्या प्राथमिकता है: किसी कंपनी में वेतन वाली नौकरी, अपनी खुद की दुकान/व्यवसाय (स्वरोजगार), या दोनों?",
    quickReplies: {
      en: ['Salaried Job', 'Self-Employment / Business', 'Open to Both (Job & Business)'],
      hi: ['वेतन वाली नौकरी (Job)', 'स्वरोजगार / अपनी दुकान (Self-Employment)', 'दोनों के लिए तैयार (Job व स्वरोजगार)']
    }
  },
  {
    id: 'training_preference',
    index: 11,
    field: 'training_preference',
    en: "What type of training schedule works best for you under PM-AJAY?",
    hi: "PM-AJAY योजना के तहत आपके लिए किस प्रकार का प्रशिक्षण कार्यक्रम सबसे उपयुक्त रहेगा?",
    quickReplies: {
      en: ['Full-Time Hands-on (3 months)', 'Part-Time / Evening Batch', 'With Daily Stipend Allowance', 'RPL Fast-Track Certification'],
      hi: ['फुल-टाइम प्रैक्टिकल (3 महीने)', 'पार्ट-टाइम / शाम का बैच', 'दैनिक वजीफा (Stipend) सहित', 'RPL फास्ट-ट्रैक प्रमाणन']
    }
  },
  {
    id: 'willing_to_relocate',
    index: 12,
    field: 'willing_to_relocate',
    en: "Are you willing to travel or relocate to another district/city for higher wages and placement?",
    hi: "यदि बेहतर वेतन और नौकरी का अवसर मिले, तो क्या आप दूसरे जिले या शहर जाने को तैयार हैं?",
    quickReplies: {
      en: ['Yes, completely willing', 'No, strictly prefer near home', 'Only within my home state'],
      hi: ['हाँ, पूरी तरह तैयार हूँ', 'नहीं, केवल घर के पास', 'केवल अपने राज्य के भीतर']
    }
  },
  {
    id: 'constraints',
    index: 13,
    field: 'constraints',
    en: "Do you have any personal constraints or special considerations we should plan for? (e.g. family care, transport limitations, or none)",
    hi: "क्या कोई व्यक्तिगत मजबूरी या परिस्थिति है जिसका हमें ध्यान रखना चाहिए? (जैसे: परिवार की देखभाल, आने-जाने की समस्या, या कोई नहीं)?",
    quickReplies: {
      en: ['No constraints (Fully available)', 'Need transport assistance', 'Need morning batch only', 'Family commitments'],
      hi: ['कोई बाधा नहीं (पूरी तरह उपलब्ध)', 'आने-जाने के साधन की आवश्यकता', 'केवल सुबह का बैच चाहिए', 'पारिवारिक जिम्मेदारियां']
    }
  },
  {
    id: 'consent',
    index: 14,
    field: 'consent',
    en: "Finally, do you consent to storing your livelihood profile under PM-AJAY GIA for certified skilling and employment matching?",
    hi: "अंत में, क्या आप प्रमाणित कौशल और रोजगार सहायता के लिए PM-AJAY GIA योजना के तहत अपनी प्रोफ़ाइल दर्ज करने की सहमति देते हैं?",
    quickReplies: {
      en: ['Yes, I consent', 'I agree to PM-AJAY terms'],
      hi: ['हाँ, मैं सहमति देता हूँ', 'मुझे PM-AJAY शर्तें स्वीकार हैं']
    }
  }
];

export class AIService {
  static getQuestion(index) {
    if (index >= 0 && index < ASSESSMENT_QUESTIONS.length) {
      return ASSESSMENT_QUESTIONS[index];
    }
    return null;
  }

  static getTotalQuestions() {
    return ASSESSMENT_QUESTIONS.length;
  }

  /**
   * Process a single answer using in-built NLP and extract structured attributes
   * Fully offline, deterministic, and instant processing in Hindi and English.
   */
  static async processAnswer(questionIndex, answerText, currentProfile = {}, availableSkills = []) {
    const question = this.getQuestion(questionIndex);
    if (!question) return { profileUpdates: {}, nextQuestionIndex: questionIndex };

    const updates = {};
    const cleanText = (answerText || '').trim();

    switch (question.id) {
      case 'preferred_language': {
        const lower = cleanText.toLowerCase();
        const isHindi = lower.includes('hindi') || lower.includes('हिंदी') || lower.includes('दोनों');
        updates.preferred_language = isHindi ? 'hi' : 'en';
        break;
      }

      case 'name': {
        if (cleanText && !cleanText.includes('दर्ज') && !cleanText.includes('record')) {
          updates.name = cleanText.replace(/^(my name is|मेरा नाम|नाम है)/gi, '').trim();
        }
        break;
      }

      case 'age': {
        const age = ProfileExtractionService.extractAge(cleanText);
        if (age) updates.age = age;
        break;
      }

      case 'preferred_location': {
        updates.preferred_location = ProfileExtractionService.extractLocation(cleanText);
        break;
      }

      case 'education': {
        const edu = ProfileExtractionService.extractEducation(cleanText);
        if (edu) updates.education = edu;
        break;
      }

      case 'employment_status': {
        const emp = ProfileExtractionService.extractEmploymentStatus(cleanText);
        if (emp) updates.employment_status = emp;
        break;
      }

      case 'work_experience': {
        updates.work_experience = ProfileExtractionService.extractWorkExperience(cleanText);
        break;
      }

      case 'skills': {
        const matched = ProfileExtractionService.matchSkills(cleanText, availableSkills);
        if (matched.length > 0) {
          updates.skills = matched;
          updates.extracted_skills = matched;
        } else if (cleanText.length > 2 && !cleanText.toLowerCase().includes('नहीं') && !cleanText.toLowerCase().includes('no')) {
          const custom = [{ name: cleanText, category: 'General', proficiency_level: 'Beginner' }];
          updates.skills = custom;
          updates.extracted_skills = custom;
        }
        break;
      }

      case 'interests': {
        updates.interest_name = cleanText;
        updates.interests = [cleanText];
        break;
      }

      case 'preferred_sector': {
        updates.preferred_sector = cleanText;
        break;
      }

      case 'employment_preference': {
        const pref = ProfileExtractionService.extractEmploymentPreference(cleanText);
        updates.employment_preference = pref;
        break;
      }

      case 'training_preference': {
        updates.training_preference = cleanText;
        break;
      }

      case 'willing_to_relocate': {
        const relocate = ProfileExtractionService.extractRelocationWillingness(cleanText);
        updates.willing_to_relocate = relocate ? 1 : 0;
        break;
      }

      case 'constraints': {
        updates.constraints = cleanText;
        break;
      }

      case 'consent': {
        updates.consent_granted = 1;
        break;
      }

      default:
        break;
    }

    const nextIndex = questionIndex + 1;
    const isComplete = nextIndex >= ASSESSMENT_QUESTIONS.length;

    return {
      field: question.field,
      updates,
      nextQuestionIndex: nextIndex,
      isComplete,
    };
  }

  /**
   * Generate conversational assistant confirmation message in Hindi or English
   */
  static generateAcknowledgement(questionIndex, answerText, lang = 'en') {
    const acks = {
      en: [
        "Language set! Let's build your profile step by step.",
        "Noted your name. Pleasure to assist you!",
        "Got it, recorded your age.",
        "Saved your preferred location.",
        "Education details saved successfully.",
        "Noted your current work status.",
        "Understood your work background.",
        "Great skills! Mapped to our NSQF catalog.",
        "Noted your career interests.",
        "Saved your preferred sector.",
        "Understood your employment preference.",
        "Noted your training preferences.",
        "Location and mobility preference saved.",
        "Noted any personal constraints.",
        "Thank you! Consent verified. Preparing your customized PM-AJAY skilling pathway now!"
      ],
      hi: [
        "भाषा सेट हो गई! आइए चरण दर चरण आपकी प्रोफ़ाइल बनाते हैं।",
        "आपका नाम नोट कर लिया गया है।",
        "आपकी आयु सुरक्षित कर ली गई है।",
        "पसंदीदा स्थान और जिला दर्ज हो गया।",
        "आपकी शैक्षणिक योग्यता सुरक्षित कर ली गई है।",
        "आपकी वर्तमान रोजगार स्थिति नोट कर ली गई है।",
        "आपका कार्य अनुभव सुरक्षित कर लिया गया है।",
        "उत्तम कौशल! इन्हें NSQF कैटलॉग से जोड़ दिया गया है।",
        "आपकी करियर रुचि नोट कर ली गई है।",
        "पसंदीदा सेक्टर सुरक्षित कर लिया गया है।",
        "आपकी रोजगार प्राथमिकता नोट कर ली गई है।",
        "प्रशिक्षण संबंधी प्राथमिकता सुरक्षित हो गई।",
        "यात्रा व स्थानांतरण संबंधी विकल्प दर्ज हो गया।",
        "आपकी विशेष परिस्थितियां नोट कर ली गई हैं।",
        "धन्यवाद! सहमति प्राप्त हुई। आपकी PM-AJAY करियर और स्किलिंग योजना तैयार की जा रही है!"
      ]
    };

    const list = acks[lang] || acks.en;
    return list[questionIndex % list.length];
  }
}

export default AIService;

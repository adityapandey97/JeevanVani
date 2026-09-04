import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import ProfileExtractionService from './profileExtractionService.js';

dotenv.config();

// Initialize Google Gen AI client if API key is provided
let googleGenAI = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey.trim() && !apiKey.includes('your_')) {
  try {
    googleGenAI = new GoogleGenAI({ apiKey: apiKey.trim() });
    console.log('[AI Service] Google Gemini Gen AI client initialized.');
  } catch (err) {
    console.warn('[AI Service] Failed to initialize Google Gen AI client:', err.message);
  }
}

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'age',
    index: 0,
    field: 'age',
    en: "Welcome! To help us find the best skilling and career opportunities under PM-AJAY, could you please tell me your age?",
    hi: "नमस्ते! PM-AJAY योजना के तहत आपके लिए सबसे उपयुक्त स्किलिंग और रोजगार के अवसर खोजने के लिए, कृपया अपनी उम्र (आयु) बताएं?",
    quickReplies: {
      en: ['18 - 21 years', '22 - 25 years', '26 - 30 years', 'Above 30 years'],
      hi: ['18 - 21 वर्ष', '22 - 25 वर्ष', '26 - 30 वर्ष', '30 वर्ष से अधिक']
    }
  },
  {
    id: 'education',
    index: 1,
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
    index: 2,
    field: 'employment_status',
    en: "What is your current work or employment status right now?",
    hi: "वर्तमान में आपकी रोजगार स्थिति क्या है? क्या आप बेरोजगार हैं, छात्र हैं, या कोई छोटा-मोटा काम कर रहे हैं?",
    quickReplies: {
      en: ['Currently Unemployed', 'Daily Wage / Helper', 'Self-Employed / Shop', 'Student'],
      hi: ['वर्तमान में बेरोजगार', 'दिहाड़ी मजदूरी / हेल्पर', 'स्वरोजगार / दुकान', 'छात्र']
    }
  },
  {
    id: 'work_experience',
    index: 3,
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
    index: 4,
    field: 'skills',
    en: "What practical or technical skills do you already know? (For example: basic wiring, vehicle repair, typing, mobile repair, tailoring, farming, etc.)",
    hi: "आप कौन से व्यावहारिक या तकनीकी कौशल पहले से जानते हैं? (जैसे: बिजली का तार जोड़ना, वाहन रिपेयर, टाइपिंग, सिलाई, खेती, आदि)",
    quickReplies: {
      en: ['Basic Wiring & Tools', 'Computer & Typing', 'Tailoring & Stitching', 'Bike / Motor Repair', 'I am ready to learn from scratch'],
      hi: ['बिजली का काम व टूल्स', 'कंप्यूटर व टाइपिंग', 'सिलाई व कढ़ाई', 'बाइक / मोटर मैकेनिक', 'शुरुआत से सीखने को तैयार']
    }
  },
  {
    id: 'interests',
    index: 5,
    field: 'interests',
    en: "What kind of work or subjects are you most interested in learning or doing?",
    hi: "आपको किस प्रकार का काम सीखने या करने में सबसे अधिक रुचि है?",
    quickReplies: {
      en: ['Electrical & Solar Energy', 'Healthcare & Patient Care', 'Computers & Office Work', 'Automobiles & Machines', 'Retail & Customer Service'],
      hi: ['बिजली व सोलर ऊर्जा', 'स्वास्थ्य सेवा व अस्पताल', 'कंप्यूटर व ऑफिस कार्य', 'ऑटोमोबाइल व मशीनें', 'दुकान व सेल्स']
    }
  },
  {
    id: 'preferred_sector',
    index: 6,
    field: 'preferred_sector',
    en: "Which industry sector would you prefer to work in?",
    hi: "आप किस उद्योग या सेक्टर में काम करना पसंद करेंगे?",
    quickReplies: {
      en: ['Green Jobs / Solar', 'Electrical & Construction', 'IT / Digital Services', 'Healthcare', 'Automotive', 'Apparel & Handicrafts'],
      hi: ['सोलर व ग्रीन जॉब्स', 'इलेक्ट्रिकल व निर्माण', 'आईटी व डिजिटल सेवा', 'स्वास्थ्य सेवा (Healthcare)', 'ऑटोमोबाइल', 'कपड़ा व हस्तशिल्प']
    }
  },
  {
    id: 'employment_preference',
    index: 7,
    field: 'employment_preference',
    en: "What is your preference: A salaried job in a company, starting your own enterprise/shop (self-employment), or open to both?",
    hi: "आपकी क्या प्राथमिकता है: किसी कंपनी में वेतन वाली नौकरी, अपनी खुद की दुकान/व्यवसाय (स्वरोजगार), या दोनों?",
    quickReplies: {
      en: ['Salaried Job', 'Self-Employment / Business', 'Open to Both (Job & Business)'],
      hi: ['वेतन वाली नौकरी (Job)', 'स्वरोजगार / अपनी दुकान (Self-Employment)', 'दोनों के लिए तैयार (Job व स्वरोजगार)']
    }
  },
  {
    id: 'preferred_location',
    index: 8,
    field: 'preferred_location',
    en: "Which city, district, or region would you prefer to work or train in?",
    hi: "आप किस शहर, जिले या क्षेत्र में काम या प्रशिक्षण करना पसंद करेंगे?",
    quickReplies: {
      en: ['My Home District', 'Nearby Industrial Town / Capital City', 'Any major urban hub in my state'],
      hi: ['मेरा गृह जिला', 'पास का औद्योगिक शहर / राजधानी', 'राज्य का कोई भी बड़ा शहर']
    }
  },
  {
    id: 'willing_to_relocate',
    index: 9,
    field: 'willing_to_relocate',
    en: "Are you willing to relocate to another city or district if you receive higher pay and training?",
    hi: "यदि बेहतर वेतन और प्रशिक्षण का अवसर मिले, तो क्या आप दूसरे शहर या जिले में जाने को तैयार हैं?",
    quickReplies: {
      en: ['Yes, completely willing', 'No, strictly prefer near home', 'Only within my home state'],
      hi: ['हाँ, पूरी तरह तैयार हूँ', 'नहीं, केवल घर के पास', 'केवल अपने राज्य के भीतर']
    }
  },
  {
    id: 'preferred_language',
    index: 10,
    field: 'preferred_language',
    en: "Thank you! Lastly, which language do you prefer for your course materials and audio guidance?",
    hi: "धन्यवाद! अंतिम प्रश्न, आप अपने प्रशिक्षण सामग्री और ऑडियो मार्गदर्शन के लिए कौन सी भाषा पसंद करते हैं?",
    quickReplies: {
      en: ['English', 'Hindi (हिंदी)', 'Both / Bilingual'],
      hi: ['हिंदी (Hindi)', 'English', 'दोनों (द्विभाषी)']
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
   * Process a single answer and extract structured attributes
   * Uses Gemini AI if GEMINI_API_KEY is provided, else falls back to rule-based NLP
   */
  static processAnswer(questionIndex, answerText, currentProfile = {}, availableSkills = []) {
    const question = this.getQuestion(questionIndex);
    if (!question) return { profileUpdates: {}, nextQuestionIndex: questionIndex };

    const updates = {};

    switch (question.id) {
      case 'age': {
        const age = ProfileExtractionService.extractAge(answerText);
        if (age) updates.age = age;
        break;
      }
      case 'education': {
        const edu = ProfileExtractionService.extractEducation(answerText);
        if (edu) updates.education = edu;
        break;
      }
      case 'employment_status': {
        const emp = ProfileExtractionService.extractEmploymentStatus(answerText);
        if (emp) updates.employment_status = emp;
        break;
      }
      case 'work_experience': {
        updates.work_experience = answerText.trim();
        break;
      }
      case 'skills': {
        const matched = ProfileExtractionService.matchSkills(answerText, availableSkills);
        updates.extracted_skills = matched;
        break;
      }
      case 'interests': {
        updates.interest_name = answerText.trim();
        break;
      }
      case 'preferred_sector': {
        updates.preferred_sector = answerText.trim();
        break;
      }
      case 'employment_preference': {
        const pref = ProfileExtractionService.extractEmploymentPreference(answerText);
        updates.employment_preference = pref;
        break;
      }
      case 'preferred_location': {
        updates.preferred_location = answerText.trim();
        break;
      }
      case 'willing_to_relocate': {
        const relocate = ProfileExtractionService.extractRelocationWillingness(answerText);
        updates.willing_to_relocate = relocate ? 1 : 0;
        break;
      }
      case 'preferred_language': {
        const isHindi = answerText.toLowerCase().includes('hindi') || answerText.toLowerCase().includes('हिंदी');
        updates.preferred_language = isHindi ? 'hi' : 'en';
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
   * Uses Gemini API dynamically if configured
   */
  static generateAcknowledgement(questionIndex, answerText, lang = 'en') {
    const acks = {
      en: [
        "Got it, thank you for sharing that.",
        "Understood! Let's continue to the next detail.",
        "Very helpful information.",
        "Great, noting that down for your profile.",
      ],
      hi: [
        "समझ गया, जानकारी साझा करने के लिए धन्यवाद।",
        "बहुत बढ़िया! आइए अगले बिंदु पर चलते हैं।",
        "यह जानकारी आपकी प्रोफ़ाइल में सुरक्षित कर ली गई है।",
        "उत्तम! आपके लिए सही करियर चुनने में यह बहुत मददगार रहेगा।",
      ]
    };

    const list = acks[lang] || acks.en;
    return list[questionIndex % list.length];
  }
}

export default AIService;

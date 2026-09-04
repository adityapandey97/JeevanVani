import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    topBar: {
      tag: 'PM-AJAY (Grant-in-Aid Component)',
      sub: 'Ministry of Social Justice & Empowerment, Govt. of India',
      nsqf: 'NSQF-Aligned Vocational Mapping',
      switchLang: 'हिंदी',
    },
    nav: {
      brand: 'JeevanVani',
      subBrand: 'PM-AJAY GIA Skilling Assistant',
      home: 'Home',
      assessment: 'Voice Assessment',
      recommendations: 'Recommendations',
      careerPath: 'Career Ladder',
      dashboard: 'My Dashboard',
      adminPortal: 'Admin Portal',
      login: 'Sign In',
      register: 'Register',
      logout: 'Sign Out',
      switchLang: 'हिंदी',
    },
    hero: {
      taglineBadge: 'Ministry of Social Justice & Empowerment | PM-AJAY (GIA Component)',
      mainHeading: 'Find the Right Skills. Build the Right Future.',
      subHeading: 'Multilingual, voice-first AI career mapping platform empowering Scheduled Caste (SC) beneficiaries with NSQF-aligned job skilling, transparent matching, and wage progression pathways.',
      startAssessment: 'Start Your Voice Assessment',
      exploreRoles: 'Explore NSQF Job Roles',
      listenPrompt: 'Click the mic or speak naturally in Hindi or English',
      howItWorksBadge: '5-Step Pathway',
      howItWorksTitle: 'How JeevanVani Works',
      step1: 'Speak Naturally',
      step1Desc: 'Interact using your voice or simple text in your preferred language.',
      step2: 'AI Maps Profile',
      step2Desc: 'Conversational assessment extracts education, skills, interests & location.',
      step3: 'NSQF Alignment',
      step3Desc: 'Profiles are benchmarked against official National Skills Qualification Frameworks.',
      step4: 'Top 3 Recommendations',
      step4Desc: 'Receive transparent match scores, identified skill gaps & subsidized training paths.',
      step5: 'Free Skilling Linkage',
      step5Desc: '100% government-subsidized course enrollment with tool-kit assistance.',
      liveDemo: 'Live Voice Demo',
      testMicText: 'Click mic to test voice response',
      assistantSpeaking: 'Assistant is speaking...',
      sampleSpeech: 'Namaste! I am your AI career assistant. Tap the mic to discover your vocational pathway.',
      sectorsHeading: 'High-Demand Skilling Sectors',
      viewAllRoles: 'View All 10+ Catalog Job Roles',
      freeGovtSkilling: '100% Free Skilling',
      freeGovtSkillingDesc: 'Full course fees, learning materials, and NSDC certification are fully funded under PM-AJAY GIA.',
      toolkitSupport: 'Tool-Kit & Stipend Support',
      toolkitSupportDesc: 'Certified candidates receive government financial support for toolkits and enterprise setup.',
      placementSupport: 'Verified Placement Linkage',
      placementSupportDesc: 'Direct connections to authorized employers, apprentice programs, and district enterprise clusters.',
      trust1: 'NSQF Level 3 to 6',
      trust2: 'Hindi & English Voice',
      trust3: '100% Free Beneficiary Support'
    },
    assessment: {
      title: 'Conversational AI Livelihood Assessment',
      subtitle: 'Answer one question at a time using your voice or by typing. Take your time!',
      progress: 'Assessment Progress',
      question: 'Question',
      of: 'of',
      completed: 'Completed',
      voiceInputCenter: 'Voice Input Control',
      voiceHint: 'Tap the button and speak your answer clearly.',
      listening: 'Listening to your voice... Speak now',
      speakBtn: 'Speak Answer',
      stopListening: 'Stop Listening',
      typePlaceholder: 'Or type your answer here...',
      sendBtn: 'Submit Answer',
      readyTitle: 'Your livelihood profile is ready!',
      readyDesc: 'Let’s find the best opportunities for you under PM-AJAY.',
      viewRecsBtn: 'View Your Top 3 Recommendations',
      readAloud: 'Listen',
      stopAudio: 'Stop Audio',
      retakeAssessment: 'Retake Assessment',
      restartBtn: 'Restart',
      tipsHeading: 'Helpful Guidance:',
      tip1: 'You can answer by speaking, typing, or tapping the quick reply buttons.',
      tip2: 'To hear the question again, tap "Listen" in the chat bubble.',
      tip3: 'You can update answers at any time or restart the assessment.',
      processingAnswer: 'AI is processing your answer...',
      quickOptions: 'Quick Options (Tap to select):',
      doneSpeaking: 'Done Speaking (Submit)',
      micBlocked: 'Microphone permission blocked. Please allow mic access in your address bar.'
    },
    recs: {
      matrixBadge: 'PM-AJAY GIA Skilling Matrix',
      title: 'Your Top 3 NSQF-Aligned Skilling Pathways',
      subtitle: 'Calculated using our transparent 5-factor scoring engine (Interest, Skills, Eligibility, Experience, Location)',
      matchScore: 'Match Score',
      nsqfLevel: 'NSQF Level',
      duration: 'Training Duration',
      eligibility: 'Min Education',
      whyRecommended: 'Why This Is Recommended',
      alreadyHave: 'Existing Matching Skills',
      needToLearn: 'Skills to Learn (Skill Gap)',
      viewCareerPath: 'View Career Progression Path',
      retakeAssessment: 'Retake Assessment',
      recalculate: 'Recalculate Scores',
      goBack: 'Go Back',
      noRecsFound: 'No recommendations found yet. Please complete the AI voice assessment to generate your personalized NSQF pathway.',
      startVoiceAssessment: 'Start Voice Assessment',
      adjustTitle: 'Need to adjust your skills or preferences?',
      adjustDesc: 'You can retake the assessment anytime to explore additional vocational tracks.',
      freeCertNote: 'PM-AJAY GIA Component: Eligible for free certification & tool-kit stipend.',
      allSkillsPresent: 'All essential skills already present!'
    },
    career: {
      badge: 'NSQF Career Progression Matrix',
      title: 'Visual Career Progression Pathway',
      subtitle: 'From foundational government skilling to senior leadership and self-employment enterprises.',
      stage: 'Progression Stage',
      expectedWage: 'Expected Earnings',
      experienceReq: 'Experience / Timeline',
      backToRecs: 'Back to Recommendations',
      startNew: 'Start New Assessment',
      topStageTag: 'Top Progression / Enterprise',
      enterpriseTitle: 'PM-AJAY GIA Enterprise & Micro-Credit Linkage',
      enterpriseDesc: 'Beneficiaries reaching Step 4 and Step 5 (Independent Contractor / Shop Owner / Entrepreneur) can access direct credit linkage through National Scheduled Castes Finance and Development Corporation (NSFDC) and Pradhan Mantri Mudra Yojana (PMMY) with subsidized capital grants under PM-AJAY.'
    },
    dashboard: {
      welcome: 'Beneficiary Livelihood Dashboard',
      beneficiaryTag: 'Beneficiary (PM-AJAY GIA)',
      profileCompletion: 'Profile Completion',
      identifiedSkills: 'Identified Skills',
      recommendedPathways: 'Recommended Pathways',
      topMatchScore: 'Top Match Score',
      topRecommendation: 'Top Career Recommendation',
      subsidiesLink: 'PM-AJAY GIA Benefits: 100% Free Government Training, Certification & Tool-Kit Subsidy Linkage.',
      noRecsYet: 'You have not completed your assessment yet.',
      startNow: 'Begin Assessment Now',
      retakeBtn: 'Retake Assessment',
      completeBtn: 'Complete Assessment',
      livelihoodAttributes: 'Livelihood Profile Attributes',
      education: 'Education',
      employmentStatus: 'Employment Status',
      workExperience: 'Work Experience',
      jobPreference: 'Job Preference',
      willingToRelocate: 'Willing to Relocate',
      yes: 'Yes',
      noLocal: 'No (Local only)',
      viewCareerLadder: 'View Career Ladder & Wage Steps',
      viewAll3: 'View All 3 Recommendations',
      extractedSkills: 'Extracted Beneficiary Skills',
      noSkillsYet: 'No skills recorded yet.',
      notProvided: 'Not Provided',
      none: 'None',
      both: 'Both (Job & Business)',
      verifiedProfile: 'Verified Profile',
      inProgress: 'In Progress',
      nsqfMapped: 'NSQF Mapped Roles',
      catalogOverlap: 'Catalog Overlap'
    },
    admin: {
      portalTitle: 'PM-AJAY GIA State Admin Portal',
      deskTag: 'National / State Desk',
      subTitle: 'Livelihood Mapping Monitoring, NSQF Catalog Governance & Beneficiary Analytics',
      addRoleBtn: 'Add NSQF Job Role',
      tabAnalytics: 'Analytics & Overview',
      tabCatalog: 'NSQF Job Roles Catalog',
      tabBeneficiaries: 'Beneficiaries Registry',
      totalBeneficiaries: 'Total Beneficiaries',
      completedAssessments: 'Completed Assessments',
      recommendationsGenerated: 'Recommendations Generated',
      catalogRoles: 'Active NSQF Catalog Roles',
      popularSectors: 'Most Recommended Sectors',
      eduDistribution: 'Beneficiary Education Distribution',
      empDistribution: 'Employment Preference Distribution',
      topRoles: 'Top Recommended Job Roles',
      candidateName: 'Candidate Name',
      contact: 'Contact',
      location: 'Location',
      actions: 'Actions'
    },
    auth: {
      signInTitle: 'Sign In to JeevanVani',
      signInSub: 'PM-AJAY Skilling Assessment & Livelihood Recommendations',
      emailOrMobile: 'Email Address or Mobile',
      password: 'Password',
      signInBtn: 'Sign In',
      signingIn: 'Signing in...',
      demoBeneficiary: 'Beneficiary Demo',
      demoAdmin: 'State Admin Demo',
      noAccount: "Don't have an account yet?",
      registerHere: 'Register Here',
      registerTitle: 'Beneficiary Registration',
      registerSub: 'Join PM-AJAY Livelihood & Skilling Program',
      fullName: 'Full Name',
      mobileNumber: 'Mobile Number',
      emailAddress: 'Email Address',
      preferredLang: 'Preferred Language',
      createAccountBtn: 'Create Beneficiary Account',
      creatingAccount: 'Creating Account...',
      alreadyAccount: 'Already have an account?',
      quickDemoTag: 'Quick Demo Credentials:'
    },
    footer: {
      brandDesc: 'AI-Driven Voice Assistant for Livelihood Mapping and NSQF-Aligned Skilling Recommendations for SC Communities under the Grant-in-Aid (GIA) component of PM-AJAY.',
      ministry: 'Ministry of Social Justice and Empowerment, Government of India',
      sectorsTitle: 'Key NSQF Sectors',
      supportTitle: 'Helpline & Support',
      tollFreeText: 'Toll-Free PM-AJAY GIA Desk:',
      tollFreeNum: '1800-11-2026 (Free Call)',
      hours: 'Working Hours: 09:30 AM - 06:00 PM (Monday to Saturday)',
      rights: '© 2026 JeevanVani (PM-AJAY GIA Initiative). All rights reserved.',
      accessibilityNote: 'Designed for accessibility & empowerment of SC artisans, youth, and women.'
    }
  },
  hi: {
    topBar: {
      tag: 'PM-AJAY (विशेष सहायता / GIA घटक)',
      sub: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार',
      nsqf: 'NSQF-संरेखित व्यावसायिक कौशल मैपिंग',
      switchLang: 'English',
    },
    nav: {
      brand: 'जीवनवाणी',
      subBrand: 'PM-AJAY कौशल एवं आजीविका सहायक',
      home: 'होम',
      assessment: 'आवाज मूल्यांकन',
      recommendations: 'सिफारिशें',
      careerPath: 'करियर सीढ़ी',
      dashboard: 'मेरा डैशबोर्ड',
      adminPortal: 'प्रशासन पोर्टल',
      login: 'लॉग इन',
      register: 'पंजीकरण करें',
      logout: 'लॉग आउट',
      switchLang: 'English',
    },
    hero: {
      taglineBadge: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय | PM-AJAY (GIA घटक)',
      mainHeading: 'सही कौशल चुनें। सुनहरा भविष्य बनाएं।',
      subHeading: 'अनुसूचित जाति (SC) के लाभार्थियों के लिए बहुभाषी, वॉयस-फर्स्ट AI आजीविका प्लेटफॉर्म। NSQF-संरेखित कौशल, पारदर्शी स्कोरिंग और रोजगार पथ का संपूर्ण मार्गदर्शन।',
      startAssessment: 'अपना वॉयस असेसमेंट शुरू करें',
      exploreRoles: 'NSQF जॉब रोल देखें',
      listenPrompt: 'माइक पर क्लिक करें या हिंदी/अंग्रेजी में स्वाभाविक रूप से बोलें',
      howItWorksBadge: '5-चरणीय मार्गदर्शन',
      howItWorksTitle: 'जीवनवाणी कैसे काम करता है?',
      step1: 'आराम से बोलें',
      step1Desc: 'अपनी भाषा में स्वाभाविक रूप से बोलें। कोई कठिन फॉर्म भरने की जरूरत नहीं।',
      step2: 'AI प्रोफ़ाइल निर्माण',
      step2Desc: 'बातचीत के माध्यम से आपकी पढ़ाई, हुनर, रुचि और जिले की सटीक मैपिंग।',
      step3: 'NSQF संरेखण',
      step3Desc: 'राष्ट्रीय कौशल योग्यता फ्रेमवर्क के आधिकारिक जॉब रोल्स से सटीक मिलान।',
      step4: 'शीर्ष 3 करियर विकल्प',
      step4Desc: 'पारदर्शी मैच स्कोर, स्किल गैप और भविष्य के वेतन विकास की सिफारिश।',
      step5: 'मुफ्त कौशल प्रशिक्षण',
      step5Desc: 'PM-AJAY GIA योजना के तहत 100% सरकारी सहायता व टूल-किट सब्सिडी।',
      liveDemo: 'लाइव वॉयस डेमो',
      testMicText: 'आवाज का परीक्षण करने के लिए माइक दबाएं',
      assistantSpeaking: 'सहायक बोल रहा है...',
      sampleSpeech: 'नमस्ते! मैं आपका कौशल और रोजगार सहायक हूँ। बटन दबाएं और अपनी पसंद बताएं।',
      sectorsHeading: 'उच्च मांग वाले कौशल क्षेत्र',
      viewAllRoles: 'सभी 10+ जॉब रोल देखें',
      freeGovtSkilling: '100% निःशुल्क सरकारी प्रशिक्षण',
      freeGovtSkillingDesc: 'पाठ्यक्रम का पूरा शुल्क, अध्ययन सामग्री और NSDC प्रमाणन PM-AJAY GIA द्वारा वहन किया जाता है।',
      toolkitSupport: 'टूल-किट व स्टाइपेंड सहायता',
      toolkitSupportDesc: 'सफलतापूर्वक प्रमाणित लाभार्थियों को कार्य शुरू करने के लिए टूल-किट व वित्तीय अनुदान मिलता है।',
      placementSupport: 'प्रमाणित रोजगार व ऋण लिंकेज',
      placementSupportDesc: 'उद्योगों में सीधी नौकरी के अवसर और स्वरोजगार के लिए NSFDC व मुद्रा योजना से आसान ऋण लिंकेज।',
      trust1: 'NSQF स्तर 3 से 6 तक',
      trust2: 'हिंदी व अंग्रेजी वॉयस',
      trust3: '100% निःशुल्क सरकारी योजना'
    },
    assessment: {
      title: 'AI वॉयस आजीविका मूल्यांकन',
      subtitle: 'अपनी आवाज से बोलकर या टाइप करके एक-एक करके उत्तर दें। घबराएं नहीं!',
      progress: 'मूल्यांकन प्रगति',
      question: 'प्रश्न',
      of: 'कुल',
      completed: 'पूर्ण',
      voiceInputCenter: 'वॉयस इनपुट केंद्र',
      voiceHint: 'बटन दबाकर अपना उत्तर हिंदी में बोलें।',
      listening: 'आपकी आवाज सुनी जा रही है... अब बोलिए',
      speakBtn: 'बोलकर उत्तर दें',
      stopListening: 'सुनना बंद करें',
      typePlaceholder: 'या अपना उत्तर यहाँ टाइप करें...',
      sendBtn: 'उत्तर भेजें',
      readyTitle: 'आपकी आजीविका प्रोफ़ाइल तैयार है!',
      readyDesc: 'आइए PM-AJAY के तहत आपके लिए सर्वश्रेष्ठ अवसर खोजें।',
      viewRecsBtn: 'शीर्ष 3 सिफारिशें देखें',
      readAloud: 'बोलकर सुनें',
      stopAudio: 'आवाज रोकें',
      retakeAssessment: 'मूल्यांकन दोबारा करें',
      restartBtn: 'रीस्टार्ट',
      tipsHeading: 'सहायक सुझाव:',
      tip1: 'आप बोलकर या स्क्रीन पर दिए विकल्पों को छूकर भी उत्तर दे सकते हैं।',
      tip2: 'यदि आप प्रश्न दोबारा सुनना चाहते हैं, तो "बोलकर सुनें" पर क्लिक करें।',
      tip3: 'गलती होने पर कभी भी नया उत्तर भेज सकते हैं या रीस्टार्ट कर सकते हैं।',
      processingAnswer: 'AI आपकी जानकारी दर्ज कर रहा है...',
      quickOptions: 'त्वरित विकल्प (क्लिक करें):',
      doneSpeaking: 'उत्तर पूरा हुआ (भेजें)',
      micBlocked: 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया पता बार (URL bar) में 🔒 पर क्लिक करके अनुमति दें।'
    },
    recs: {
      matrixBadge: 'PM-AJAY GIA कौशल मैट्रिक्स',
      title: 'आपके लिए शीर्ष 3 NSQF-संरेखित कौशल मार्ग',
      subtitle: 'हमारे पारदर्शी 5-कारक स्कोरिंग इंजन (रुचि, कौशल, पात्रता, अनुभव, स्थान) द्वारा मूल्यांकित',
      matchScore: 'मैच स्कोर',
      nsqfLevel: 'NSQF स्तर',
      duration: 'प्रशिक्षण अवधि',
      eligibility: 'न्यूनतम शिक्षा',
      whyRecommended: 'यह कोर्स आपके लिए क्यों अनुशंसित है?',
      alreadyHave: 'आपके पास पहले से मौजूद कौशल',
      needToLearn: 'सीखने योग्य कौशल (स्किल गैप)',
      viewCareerPath: 'करियर विकास पथ देखें',
      retakeAssessment: 'मूल्यांकन दोबारा करें',
      recalculate: 'स्कोरिंग पुनर्गणना',
      goBack: 'पीछे जाएं',
      noRecsFound: 'कोई सिफारिश उपलब्ध नहीं है। कृपया अपनी प्रोफ़ाइल बनाने के लिए वॉयस मूल्यांकन पूरा करें।',
      startVoiceAssessment: 'वॉयस मूल्यांकन शुरू करें',
      adjustTitle: 'क्या आप अपनी जानकारी बदलना चाहते हैं?',
      adjustDesc: 'मूल्यांकन कभी भी दोबारा किया जा सकता है और नए विकल्पों की खोज की जा सकती है।',
      freeCertNote: 'PM-AJAY GIA घटक: निःशुल्क प्रमाण पत्र और टूल-किट स्टाइपेंड सहायता हेतु पात्र।',
      allSkillsPresent: 'सभी आवश्यक कौशल पहले से मौजूद हैं!'
    },
    career: {
      badge: 'NSQF करियर सीढ़ी मैट्रिक्स',
      title: 'दृश्य करियर प्रगति पथ (करियर सीढ़ी)',
      subtitle: 'शुरुआती सरकारी प्रशिक्षण से लेकर वरिष्ठ पदों और अपना खुद का व्यवसाय स्थापित करने तक का सफर।',
      stage: 'प्रगति स्तर',
      expectedWage: 'संभावित मासिक कमाई',
      experienceReq: 'अनुभव / समय सीमा',
      backToRecs: 'सिफारिशों पर वापस जाएं',
      startNew: 'नया मूल्यांकन शुरू करें',
      topStageTag: 'शीर्ष प्रगति / स्वरोजगार',
      enterpriseTitle: 'PM-AJAY GIA स्वरोजगार एवं माइक्रो-क्रेडिट लिंकेज',
      enterpriseDesc: 'चरण 4 और 5 (स्वतंत्र ठेकेदार / दुकान मालिक / उद्यमी) पर पहुँचने वाले लाभार्थियों को राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC) और प्रधानमंत्री मुद्रा योजना (PMMY) के माध्यम से पूंजीगत अनुदान और रियायती ऋण सहायता प्रदान की जाती है।'
    },
    dashboard: {
      welcome: 'लाभार्थी आजीविका डैशबोर्ड',
      beneficiaryTag: 'पंजीकृत लाभार्थी (PM-AJAY GIA)',
      profileCompletion: 'प्रोफ़ाइल पूर्णता',
      identifiedSkills: 'पहचाने गए कौशल',
      recommendedPathways: 'अनुशंसित करियर विकल्प',
      topMatchScore: 'शीर्ष मैच स्कोर',
      topRecommendation: 'शीर्ष अनुशंसित करियर',
      subsidiesLink: 'PM-AJAY GIA लाभ: 100% निःशुल्क सरकारी प्रशिक्षण, प्रमाण पत्र और टूल-किट सब्सिडी सहायता।',
      noRecsYet: 'आपने अभी तक अपना मूल्यांकन पूरा नहीं किया है।',
      startNow: 'अभी मूल्यांकन शुरू करें',
      retakeBtn: 'मूल्यांकन दोबारा करें',
      completeBtn: 'मूल्यांकन पूरा करें',
      livelihoodAttributes: 'आजीविका प्रोफ़ाइल विवरण',
      education: 'शिक्षा',
      employmentStatus: 'रोजगार स्थिति',
      workExperience: 'कार्य अनुभव',
      jobPreference: 'कार्य प्राथमिकता',
      willingToRelocate: 'अन्य शहर जाने को तैयार',
      yes: 'हाँ, तैयार हूँ',
      noLocal: 'नहीं (केवल स्थानीय)',
      viewCareerLadder: 'करियर सीढ़ी और वेतन चरण देखें',
      viewAll3: 'तीनों सिफारिशें देखें',
      extractedSkills: 'दर्ज किए गए कौशल',
      noSkillsYet: 'कोई कौशल दर्ज नहीं है।',
      notProvided: 'विवरण नहीं दिया',
      none: 'कोई पूर्व अनुभव नहीं',
      both: 'नौकरी व स्वरोजगार दोनों',
      verifiedProfile: 'सत्यापित प्रोफ़ाइल',
      inProgress: 'प्रगति पर है',
      nsqfMapped: 'NSQF संरेखित रोल्स',
      catalogOverlap: 'कौशल मिलान'
    },
    admin: {
      portalTitle: 'PM-AJAY GIA राज्य प्रशासन पोर्टल',
      deskTag: 'राष्ट्रीय / राज्य प्रशासनिक डेस्क',
      subTitle: 'आजीविका मैपिंग निगरानी, NSQF जॉब रोल कैटलॉग व लाभार्थी सांख्यिकी',
      addRoleBtn: 'नया NSQF जॉब रोल जोड़ें',
      tabAnalytics: 'सांख्यिकी व अवलोकन',
      tabCatalog: 'NSQF जॉब रोल कैटलॉग',
      tabBeneficiaries: 'लाभार्थी नामांकन पंजी (Registry)',
      totalBeneficiaries: 'कुल पंजीकृत लाभार्थी',
      completedAssessments: 'पूर्ण किए गए मूल्यांकन',
      recommendationsGenerated: 'उत्पन्न सिफारिशें',
      catalogRoles: 'सक्रिय NSQF जॉब रोल्स',
      popularSectors: 'सर्वाधिक अनुशंसित क्षेत्र',
      eduDistribution: 'शिक्षा स्तर वितरण',
      empDistribution: 'रोजगार प्राथमिकता वितरण',
      topRoles: 'शीर्ष अनुशंसित जॉब रोल्स',
      candidateName: 'लाभार्थी का नाम',
      contact: 'संपर्क नंबर व ईमेल',
      location: 'जिला / स्थान',
      actions: 'कार्यवाही'
    },
    auth: {
      signInTitle: 'जीवनवाणी में लॉगिन करें',
      signInSub: 'PM-AJAY कौशल मूल्यांकन एवं आजीविका सिफारिशें',
      emailOrMobile: 'ईमेल पता अथवा मोबाइल नंबर',
      password: 'पासवर्ड',
      signInBtn: 'लॉगिन करें',
      signingIn: 'सत्यापित किया जा रहा है...',
      demoBeneficiary: 'लाभार्थी डेमो खाता',
      demoAdmin: 'प्रशासक डेमो खाता',
      noAccount: 'नया खाता बनाना चाहते हैं?',
      registerHere: 'यहाँ पंजीकरण करें',
      registerTitle: 'लाभार्थी पंजीकरण',
      registerSub: 'PM-AJAY कौशल एवं आजीविका योजना में शामिल हों',
      fullName: 'पूरा नाम',
      mobileNumber: 'मोबाइल नंबर',
      emailAddress: 'ईमेल पता',
      preferredLang: 'प्राथमिक भाषा',
      createAccountBtn: 'पंजीकरण पूरा करें',
      creatingAccount: 'पंजीकरण किया जा रहा है...',
      alreadyAccount: 'पहले से खाता है?',
      quickDemoTag: 'त्वरित डेमो परीक्षण:'
    },
    footer: {
      brandDesc: 'प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) के विशेष सहायता घटक (GIA) के अंतर्गत विकसित एक बहुभाषी, एआई-संचालित आजीविका मैपिंग व NSQF-संरेखित कौशल अनुशंसा मंच।',
      ministry: 'सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार',
      sectorsTitle: 'प्रमुख कौशल क्षेत्र',
      supportTitle: 'सहायता व संपर्क',
      tollFreeText: 'टोल-फ्री PM-AJAY GIA हेल्पलाइन:',
      tollFreeNum: '1800-11-2026 (निःशुल्क कॉल)',
      hours: 'कार्य समय: सुबह 09:30 से शाम 06:00 (सोमवार से शनिवार)',
      rights: '© 2026 जीवनवाणी (PM-AJAY GIA पहल)। सर्वाधिकार सुरक्षित।',
      accessibilityNote: 'अनुसूचित जाति के कारीगरों, युवाओं और महिलाओं के सशक्तिकरण हेतु सुलभ व समर्पित।'
    }
  }
};

// Domain Dictionaries for Total Language Immersion
export const ROLE_TRANSLATIONS = {
  'assistant electrician': 'सहायक इलेक्ट्रीशियन',
  'solar pv installer (suryamitra)': 'सोलर पीवी इंस्टॉलर (सूर्यमित्र)',
  'general duty assistant (healthcare gda)': 'जनरल ड्यूटी असिस्टेंट (स्वास्थ्य सेवा जी.डी.ए.)',
  'domestic data entry operator (ddeo)': 'घरेलू डेटा एंट्री ऑपरेटर (DDEO)',
  'retail sales associate': 'रिटेल सेल्स एसोसिएट',
  'automotive service technician (2 & 3 wheeler)': 'ऑटोमोटिव सर्विस तकनीशियन (2 और 3 पहिया)',
  'mason general': 'राजमिस्त्री (सामान्य)',
  'micro irrigation technician': 'सूक्ष्म सिंचाई तकनीशियन',
  'assistant beauty therapist': 'सहायक ब्यूटी थेरेपिस्ट',
  'field technician - home appliances': 'फील्ड तकनीशियन - घरेलू उपकरण',
  'handicraft artisan & garment tailor': 'हस्तशिल्प कारीगर और परिधान दर्जी'
};

export const SECTOR_TRANSLATIONS = {
  'construction & electrical': 'निर्माण एवं विद्युत (इलेक्ट्रिकल)',
  'solar / green jobs': 'सोलर / हरित ऊर्जा कार्य (Green Jobs)',
  'healthcare': 'स्वास्थ्य सेवा (हेल्थकेयर)',
  'it / ites': 'सूचना प्रौद्योगिकी एवं डिजिटल सेवाएं (IT/ITeS)',
  'retail': 'खुदरा व्यापार (रिटेल)',
  'automotive': 'ऑटोमोबाइल एवं वाहन सेवा',
  'construction': 'भवन निर्माण (कंस्ट्रक्शन)',
  'agriculture': 'कृषि एवं सूक्ष्म सिंचाई',
  'beauty & wellness': 'सौंदर्य एवं वेलनेस (ब्यूटी)',
  'electronics': 'इलेक्ट्रॉनिक्स एवं उपकरण',
  'apparel & handicrafts (self-employment)': 'वस्त्र, सिलाई एवं हस्तशिल्प (स्वरोजगार)'
};

export const EDUCATION_TRANSLATIONS = {
  'below 5th pass': '5वीं से कम',
  '5th pass': '5वीं पास',
  '5th / 8th pass': '5वीं अथवा 8वीं पास',
  '8th pass': '8वीं पास',
  '8th pass or 10th pass': '8वीं अथवा 10वीं पास',
  '10th pass': '10वीं पास',
  '10th pass or 12th pass': '10वीं अथवा 12वीं पास',
  '10th pass / 12th pass': '10वीं / 12वीं पास',
  '10th pass + iti or 12th pass': '10वीं पास + ITI अथवा 12वीं पास',
  '12th pass': '12वीं पास',
  'iti': 'आईटीआई (ITI)',
  'diploma': 'डिप्लोमा',
  'graduate': 'स्नातक (ग्रेजुएट)'
};

export const SKILL_TRANSLATIONS = {
  'basic wiring': 'बुनियादी वायरिंग व तार जोड़ना',
  'tool handling': 'टूल्स व औजारों का सही उपयोग',
  'electrical safety': 'विद्युत सुरक्षा व अर्थिंग',
  'multimeter & testing equipment': 'मल्टीमीटर व टेस्टिंग उपकरण',
  'solar pv module mounting': 'सोलर पैनल व मॉड्यूल फिटिंग',
  'inverter & battery wiring': 'इन्वर्टर व बैटरी कनेक्शन',
  'site survey & shading analysis': 'साइट सर्वेक्षण व छाया विश्लेषण',
  'solar system maintenance': 'सोलर सिस्टम रखरखाव व सफाई',
  'vital signs monitoring': 'रक्तचाप व नब्ज (वाइटल साइन्स) जांच',
  'patient hygiene & mobility': 'रोगी की स्वच्छता व देखभाल',
  'first aid & cpr': 'प्राथमिक उपचार (फर्स्ट एड) व CPR',
  'infection control': 'संक्रमण नियंत्रण व स्वच्छता',
  'typing speed (30+ wpm)': 'कंप्यूटर टाइपिंग गति (30+ शब्द/मिनट)',
  'ms office & google docs': 'एमएस ऑफिस, वर्ड व एक्सेल',
  'data entry & verification': 'डेटा एंट्री व सत्यापन',
  'internet navigation & email': 'इंटरनेट, ईमेल व ऑनलाइन पोर्टल',
  'customer greeting & communication': 'ग्राहक बातचीत व शिष्टाचार',
  'point of sale (pos) billing': 'पीओएस (POS) बिलिंग व कैश रजिस्टर',
  'inventory & stock display': 'दुकान का सामान व स्टॉक प्रबंधन',
  'cash handling & reconciliation': 'रोकड़ (कैश) संभालना व हिसाब',
  '2-wheeler engine servicing': '2-पहिया इंजन व सर्विसिंग',
  'brake & suspension overhaul': 'ब्रेक व सस्पेंशन मरम्मत',
  'auto electrical diagnostics': 'ऑटो इलेक्ट्रिकल व बैटरी जांच',
  'bricklaying & masonry': 'ईंट चुनाई व दीवार निर्माण',
  'cement mortar mixing': 'सीमेंट व गारा मिश्रण',
  'plastering & surface finishing': 'दीवार प्लास्टर व फिनिशिंग',
  'drip & sprinkler installation': 'ड्रिप व स्प्रिंकलर पाइप फिटिंग',
  'pump & filter maintenance': 'मोटर पंप व फिल्टर सफाई',
  'soil & moisture assessment': 'मिट्टी व नमी परीक्षण',
  'skin care & facials': 'त्वचा देखभाल व फेशियल',
  'hair styling & basic cutting': 'हेयर स्टाइलिंग व कटिंग',
  'threading & waxing': 'थ्रेडिंग व वैक्सिंग',
  'appliance repair': 'घरेलू उपकरण (फ्रिज, वाशिंग मशीन) मरम्मत',
  'pcb assembly & soldering': 'सर्किट बोर्ड व सोल्डरिंग',
  'garment stitching & tailoring': 'कपड़ों की सिलाई व कटिंग',
  'hand embroidery & traditional crafts': 'हाथ की कढ़ाई व हस्तशिल्प',
  'small business bookkeeping': 'छोटा हिसाब-किताब व बहीखाता'
};

export const DURATION_TRANSLATIONS = {
  '350 hours (approx. 3 months)': '350 घंटे (लगभग 3 महीने)',
  '400 hours (approx. 3.5 months)': '400 घंटे (लगभग 3.5 महीने)',
  '480 hours (approx. 4 months)': '480 घंटे (लगभग 4 महीने)',
  '320 hours (approx. 2.5 months)': '320 घंटे (लगभग 2.5 महीने)',
  '450 hours (approx. 4 months)': '450 घंटे (लगभग 4 महीने)'
};

export const STAGE_TRANSLATIONS = {
  'helper / trainee': 'सहायक / प्रशिक्षु (हेल्पर)',
  'assistant electrician': 'सहायक इलेक्ट्रीशियन',
  'certified electrician': 'प्रमाणित इलेक्ट्रीशियन',
  'electrical supervisor': 'इलेक्ट्रिकल सुपरवाइजर',
  'independent contractor / enterprise owner': 'स्वतंत्र ठेकेदार / अपनी दुकान का मालिक',
  'solar rooftop trainee': 'सोलर रूफटॉप प्रशिक्षु',
  'solar pv installer (suryamitra)': 'सोलर पीवी इंस्टॉलर (सूर्यमित्र)',
  'solar site in-charge / lead technician': 'सोलर साइट प्रभारी / मुख्य तकनीशियन',
  'project engineer / quality auditor': 'प्रोजेक्ट इंजीनियर / गुणवत्ता परीक्षक',
  'solar epc contractor & vendor': 'सोलर कॉन्ट्रैक्टर एवं अधिकृत विक्रेता',
  'gda trainee / ward attendant': 'जीडीए प्रशिक्षु / वार्ड अटेंडेंट',
  'general duty assistant': 'जनरल ड्यूटी असिस्टेंट',
  'senior gda / floor team lead': 'वरिष्ठ जीडीए / फ्लोर टीम लीडर',
  'patient care coordinator': 'मरीज देखभाल समन्वयक (Coordinator)',
  'home healthcare agency founder': 'होम हेल्थकेयर एजेंसी संस्थापक (स्वरोजगार)',
  'junior data operator': 'कनिष्ठ डेटा ऑपरेटर',
  'data entry operator': 'डेटा एंट्री ऑपरेटर',
  'mis executive / data coordinator': 'एमआईएस एग्जीक्यूटिव / डेटा समन्वयक',
  'operations supervisor / team lead': 'ऑपरेशंस सुपरवाइजर / टीम लीडर',
  'csc (common service center) owner': 'सीएससी (जन सेवा केंद्र) संचालक / मालिक',
  'store assistant': 'स्टोर असिस्टेंट',
  'retail sales associate': 'रिटेल सेल्स एसोसिएट',
  'senior sales executive / department head': 'वरिष्ठ सेल्स एग्जीक्यूटिव / विभाग प्रमुख',
  'assistant store manager': 'सहायक स्टोर मैनेजर',
  'franchise / retail store owner': 'फ्रेंचाइजी / रिटेल दुकान का मालिक',
  'garage assistant / mechanic trainee': 'गैरेज सहायक / मैकेनिक प्रशिक्षु',
  '2-wheeler service technician': '2-पहिया सर्विस तकनीशियन',
  'senior diagnostic mechanic': 'वरिष्ठ डायग्नोस्टिक मैकेनिक',
  'workshop service in-charge': 'वर्कशॉप सर्विस प्रभारी',
  'independent auto service center owner': 'स्वतंत्र ऑटो सर्विस सेंटर का मालिक',
  'beldar / helper': 'बेलदार / सहायक',
  'mason general (junior)': 'राजमिस्त्री सामान्य (जूनियर)',
  'master mason / lead artisan': 'मास्टर राजमिस्त्री / मुख्य कारीगर',
  'construction site supervisor': 'निर्माण साइट सुपरवाइजर',
  'civil contractor / subcontractor': 'सिविल ठेकेदार / सब-कॉन्ट्रैक्टर',
  'field helper': 'फील्ड सहायक',
  'micro irrigation technician': 'सूक्ष्म सिंचाई तकनीशियन',
  'senior irrigation field supervisor': 'वरिष्ठ सिंचाई फील्ड सुपरवाइजर',
  'farm automation consultant': 'फार्म ऑटोमेशन सलाहकार',
  'agri-equipment dealership & service owner': 'कृषि उपकरण डीलरशिप व सर्विस सेंटर मालिक',
  'salon assistant': 'सैलून सहायक',
  'assistant beauty therapist': 'सहायक ब्यूटी थेरेपिस्ट',
  'senior aesthetician / hair stylist': 'वरिष्ठ एस्थेटिशियन / हेयर स्टाइलिस्ट',
  'salon manager': 'सैलून मैनेजर',
  'beauty parlour / bridal studio owner': 'ब्यूटी पार्लर / ब्राइडल स्टूडियो मालकिन',
  'apprentice technician': 'अपरेंटिस तकनीशियन',
  'field service technician': 'फील्ड सर्विस तकनीशियन',
  'senior appliance specialist': 'वरिष्ठ उपकरण विशेषज्ञ',
  'authorized service center lead': 'अधिकृत सर्विस सेंटर प्रमुख',
  'multi-brand service franchisee': 'मल्टी-ब्रांड सर्विस फ्रेंचाइजी मालिक',
  'tailoring apprentice': 'सिलाई प्रशिक्षु',
  'skilled artisan / pattern cutter': 'कुशल कारीगर / पैटर्न कटर',
  'master tailor & shg production leader': 'मास्टर दर्जी व स्वयं सहायता समूह (SHG) लीडर',
  'boutique / apparel unit owner': 'बुटीक / परिधान यूनिट का मालिक',
  'export artisan & handloom enterprise founder': 'हथकरघा व परिधान उद्यम संस्थापक'
};

export const WAGE_TRANSLATIONS = {
  '₹8,000 - ₹10,000/mo': '₹8,000 - ₹10,000 / महीना',
  '₹12,000 - ₹15,000/mo': '₹12,000 - ₹15,000 / महीना',
  '₹18,000 - ₹24,000/mo': '₹18,000 - ₹24,000 / महीना',
  '₹28,000 - ₹38,000/mo': '₹28,000 - ₹38,000 / महीना',
  '₹50,000+/mo (self-employed)': '₹50,000+ / महीना (स्वरोजगार)',
  '₹10,000 - ₹12,000/mo': '₹10,000 - ₹12,000 / महीना',
  '₹15,000 - ₹20,000/mo': '₹15,000 - ₹20,000 / महीना',
  '₹25,000 - ₹35,000/mo': '₹25,000 - ₹35,000 / महीना',
  '₹40,000 - ₹55,000/mo': '₹40,000 - ₹55,000 / महीना',
  '₹75,000+/mo (self-employed)': '₹75,000+ / महीना (स्वरोजगार)',
  '₹9,000 - ₹12,000/mo': '₹9,000 - ₹12,000 / महीना',
  '₹14,000 - ₹18,000/mo': '₹14,000 - ₹18,000 / महीना',
  '₹22,000 - ₹30,000/mo': '₹22,000 - ₹30,000 / महीना',
  '₹32,000 - ₹45,000/mo': '₹32,000 - ₹45,000 / महीना',
  '₹60,000+/mo (self-employed)': '₹60,000+ / महीना (स्वरोजगार)',
  '₹10,000 - ₹13,000/mo': '₹10,000 - ₹13,000 / महीना',
  '₹24,000 - ₹32,000/mo': '₹24,000 - ₹32,000 / महीना',
  '₹35,000 - ₹48,000/mo': '₹35,000 - ₹48,000 / महीना',
  '₹40,000 - ₹70,000/mo (self-employed)': '₹40,000 - ₹70,000 / महीना (स्वरोजगार)',
  '₹22,000 - ₹28,000/mo': '₹22,000 - ₹28,000 / महीना',
  '₹8,000 - ₹11,000/mo': '₹8,000 - ₹11,000 / महीना',
  '₹14,000 - ₹20,000/mo': '₹14,000 - ₹20,000 / महीना',
  '₹50,000 - ₹90,000/mo (self-employed)': '₹50,000 - ₹90,000 / महीना (स्वरोजगार)',
  '₹13,000 - ₹17,000/mo': '₹13,000 - ₹17,000 / महीना',
  '₹20,000 - ₹28,000/mo': '₹20,000 - ₹28,000 / महीना',
  '₹30,000 - ₹42,000/mo': '₹30,000 - ₹42,000 / महीना',
  '₹50,000 - ₹1,00,000/mo (self-employed)': '₹50,000 - ₹1,00,000 / महीना (स्वरोजगार)',
  '₹14,000 - ₹19,000/mo': '₹14,000 - ₹19,000 / महीना',
  '₹35,000 - ₹50,000/mo': '₹35,000 - ₹50,000 / महीना',
  '₹60,000+/mo (self-employed)': '₹60,000+ / महीना (स्वरोजगार)',
  '₹22,000 - ₹32,000/mo': '₹22,000 - ₹32,000 / महीना',
  '₹40,000 - ₹80,000/mo (self-employed)': '₹40,000 - ₹80,000 / महीना (स्वरोजगार)',
  '₹15,000 - ₹22,000/mo': '₹15,000 - ₹22,000 / महीना',
  '₹25,000 - ₹34,000/mo': '₹25,000 - ₹34,000 / महीना',
  '₹36,000 - ₹50,000/mo': '₹36,000 - ₹50,000 / महीना',
  '₹60,000 - ₹1,20,000/mo (self-employed)': '₹60,000 - ₹1,20,000 / महीना (स्वरोजगार)',
  '₹7,000 - ₹10,000/mo': '₹7,000 - ₹10,000 / महीना',
  '₹35,000 - ₹75,000/mo (self-employed)': '₹35,000 - ₹75,000 / महीना (स्वरोजगार)',
  '₹80,000+/mo (self-employed)': '₹80,000+ / महीना (स्वरोजगार)'
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('jeevanvani_lang') || 'hi'; // Defaulting to Hindi for Indian beneficiary focus
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('jeevanvani_lang', next);
      return next;
    });
  };

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'hi') {
      setLanguage(lang);
      localStorage.setItem('jeevanvani_lang', lang);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Domain Helper Functions for 100% Language Immersion
  const tRole = (name) => {
    if (!name) return '';
    if (language === 'hi') {
      return ROLE_TRANSLATIONS[name.toLowerCase().trim()] || name;
    }
    return name;
  };

  const tSector = (sector) => {
    if (!sector) return '';
    if (language === 'hi') {
      return SECTOR_TRANSLATIONS[sector.toLowerCase().trim()] || sector;
    }
    return sector;
  };

  const tEducation = (edu) => {
    if (!edu) return '';
    if (language === 'hi') {
      return EDUCATION_TRANSLATIONS[edu.toLowerCase().trim()] || edu;
    }
    return edu;
  };

  const tSkill = (skill) => {
    if (!skill) return '';
    if (language === 'hi') {
      return SKILL_TRANSLATIONS[skill.toLowerCase().trim()] || skill;
    }
    return skill;
  };

  const tDuration = (duration) => {
    if (!duration) return '';
    if (language === 'hi') {
      return DURATION_TRANSLATIONS[duration.toLowerCase().trim()] || duration;
    }
    return duration;
  };

  const tStage = (stage) => {
    if (!stage) return '';
    if (language === 'hi') {
      return STAGE_TRANSLATIONS[stage.toLowerCase().trim()] || stage;
    }
    return stage;
  };

  const tWage = (wage) => {
    if (!wage) return '';
    if (language === 'hi') {
      return WAGE_TRANSLATIONS[wage.toLowerCase().trim()] || wage;
    }
    return wage;
  };

  // Web Speech API Voice Synthesis helper
  const speakText = (text, customLang = language) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = customLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = customLang === 'hi' ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = customLang === 'hi' ? 'hi' : 'en';
    const preferredVoice = voices.find((v) => v.lang.startsWith(targetLangCode));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        changeLanguage,
        t,
        tRole,
        tSector,
        tEducation,
        tSkill,
        tDuration,
        tStage,
        tWage,
        speakText,
        stopSpeaking
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

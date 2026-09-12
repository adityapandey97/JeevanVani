import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const LanguageContext = createContext(null);

export const TRANSLATIONS = { en, hi };

// Domain dictionary for catalog terms
const ROLE_NAMES = {
  'Assistant Electrician': 'सहायक इलेक्ट्रीशियन (Assistant Electrician)',
  'Solar PV Installer (Suryamitra)': 'सोलर पीवी इंस्टॉलर - सूर्यमित्र (Solar PV Installer)',
  'General Duty Assistant (Healthcare GDA)': 'जनरल ड्यूटी असिस्टेंट - जीडीए (General Duty Assistant)',
  'Domestic Data Entry Operator (DDEO)': 'डेटा एंट्री ऑपरेटर (Data Entry Operator)',
  'Retail Sales Associate': 'रिटेल सेल्स एसोसिएट (Retail Sales Associate)',
  'Automotive Service Technician (2 & 3 Wheeler)': 'ऑटोमोटिव सर्विस मैकेनिक (2 & 3 Wheeler Mechanic)',
  'Mason General': 'राजमिस्त्री / मेसन (Mason General)',
  'Micro Irrigation Technician': 'सूक्ष्म सिंचाई तकनीशियन (Micro Irrigation Technician)',
  'Assistant Beauty Therapist': 'ब्यूटी थेरेपिस्ट (Assistant Beauty Therapist)',
  'Field Technician - Home Appliances': 'होम अप्लायंसेज फील्ड तकनीशियन (Home Appliances Technician)',
  'Handicraft Artisan & Garment Tailor': 'हस्तशिल्प व गारमेंट टेलर (Handicraft & Tailor)',
};

const SECTOR_NAMES = {
  'Construction & Electrical': 'निर्माण व इलेक्ट्रिकल',
  'Solar / Green Jobs': 'सोलर व हरित ऊर्जा (Green Jobs)',
  'Healthcare': 'स्वास्थ्य सेवा (Healthcare)',
  'IT / ITeS': 'आईटी व डिजिटल सेवा (IT/ITeS)',
  'Retail': 'रिटेल व बिक्री (Retail)',
  'Automotive': 'ऑटोमोबाइल (Automotive)',
  'Construction': 'भवन निर्माण (Construction)',
  'Agriculture': 'कृषि (Agriculture)',
  'Beauty & Wellness': 'सौंदर्य व कल्याण (Beauty & Wellness)',
  'Electronics': 'इलेक्ट्रॉनिक्स (Electronics)',
  'Apparel & Handicrafts': 'परिधान व हस्तशिल्प (Apparel & Handicrafts)',
};

const EDUCATION_NAMES = {
  'Below 5th Pass': '5वीं से कम',
  '5th Pass': '5वीं पास',
  '8th Pass': '8वीं पास',
  '10th Pass': '10वीं पास',
  '12th Pass': '12वीं पास',
  'ITI': 'आईटीआई (ITI)',
  'Diploma': 'डिप्लोमा (Diploma)',
  'Graduate': 'स्नातक (Graduate)',
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('jeevanvani_language') || 'hi';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('jeevanvani_language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Dual-mode translation helper:
  // Can be called as a function: t('jobs.title', 'Default Title')
  // OR accessed as an object: t.jobs.title
  const t = (keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const parts = keyPath.split('.');
    let val = currentDict;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) {
        val = val[p];
      } else {
        return fallback || keyPath;
      }
    }
    return typeof val === 'string' ? val : (fallback || keyPath);
  };

  // Attach dict properties directly to t for backwards compatibility with t.dashboard.welcome
  Object.assign(t, currentDict);

  const tRole = (name) => {
    if (!name) return '';
    return language === 'hi' ? (ROLE_NAMES[name] || name) : name;
  };

  const tSector = (sector) => {
    if (!sector) return '';
    return language === 'hi' ? (SECTOR_NAMES[sector] || sector) : sector;
  };

  const tEducation = (edu) => {
    if (!edu) return '';
    return language === 'hi' ? (EDUCATION_NAMES[edu] || edu) : edu;
  };

  const tSkill = (skill) => skill;

  // Web Speech API text-to-speech
  const speakText = (text, onEnd) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    const voices = window.speechSynthesis.getVoices();
    const voiceLang = language === 'hi' ? 'hi' : 'en';
    const matchedVoice = voices.find(v => v.lang.startsWith(voiceLang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
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
        setLanguage,
        toggleLanguage,
        t,
        tRole,
        tSector,
        tEducation,
        tSkill,
        speakText,
        stopSpeaking,
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

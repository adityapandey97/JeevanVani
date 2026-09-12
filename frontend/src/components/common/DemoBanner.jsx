import React from 'react';
import { Sparkles, UserCheck, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function DemoBanner({ active, onToggle, onSelectPersona, selectedPersona }) {
  const { language } = useLanguage();

  if (!active) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-terracotta-600 to-amber-700 text-white text-xs py-2 px-4 shadow-md sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold">
          <span className="p-1 rounded bg-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </span>
          <span className="uppercase tracking-wider font-extrabold text-[11px] bg-white text-terracotta-700 px-2 py-0.5 rounded-full">
            SIH 2026 Demo Mode
          </span>
          <span className="hidden sm:inline text-amber-100 font-medium">
            {language === 'hi'
              ? 'प्रस्तुति परिदृश्य: आवाज आधारित ऑनबोर्डिंग, NSQF कोर्स व सत्यापित नौकरियां'
              : 'Presentation Scenario: Voice Onboarding, NSQF Courses & Verified Jobs'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-200 text-[11px] font-semibold hidden md:inline">
            {language === 'hi' ? 'परीक्षण प्रोफ़ाइल:' : 'Test Persona:'}
          </span>

          <button
            type="button"
            onClick={() => onSelectPersona && onSelectPersona('rahul')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              selectedPersona === 'rahul'
                ? 'bg-white text-terracotta-800 shadow-sm'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Rahul (12th Solar/Electrician)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPersona && onSelectPersona('pooja')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              selectedPersona === 'pooja'
                ? 'bg-white text-terracotta-800 shadow-sm'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Pooja (10th Healthcare)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPersona && onSelectPersona('amit')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              selectedPersona === 'amit'
                ? 'bg-white text-terracotta-800 shadow-sm'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Amit (8th Auto RPL)</span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label="Exit demo mode"
            className="p-1 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoBanner;

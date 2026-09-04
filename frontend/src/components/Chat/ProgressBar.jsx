import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function ProgressBar({ currentStep, totalSteps = 11 }) {
  const { language } = useLanguage();
  const percentage = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {language === 'hi' ? `कदम ${currentStep + 1} / ${totalSteps}` : `Question ${currentStep + 1} of ${totalSteps}`}
        </span>
        <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60 font-bold">
          {percentage}% {language === 'hi' ? 'पूर्ण' : 'Completed'}
        </span>
      </div>

      {/* Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Tiny step markers */}
      <div className="flex justify-between items-center mt-2 px-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentStep ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;

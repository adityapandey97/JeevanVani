import React from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function SkillGapList({ matchingSkills = [], missingSkills = [] }) {
  const { language, t, tSkill } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
      {/* Already Have */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.recs.alreadyHave}</span>
        </div>
        {matchingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {matchingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
              >
                <span>✓</span>
                <span>{tSkill(skill)}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {language === 'hi' ? 'कोई पूर्व कौशल दर्ज नहीं (शुरुआती स्तर)' : 'No prior matching skills recorded (Foundational)'}
          </p>
        )}
      </div>

      {/* Missing Skills / Skills to Learn */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.recs.needToLearn}</span>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800"
              >
                <span>+</span>
                <span>{tSkill(skill)}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {t.recs.allSkillsPresent}
          </p>
        )}
      </div>
    </div>
  );
}

export default SkillGapList;

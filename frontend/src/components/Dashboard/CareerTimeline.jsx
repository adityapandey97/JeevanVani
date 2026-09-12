import React from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function CareerTimeline({ careerPath = [], roleTitle: _roleTitle = '' }) {
  const { language, t, tStage, tWage } = useLanguage();

  if (!careerPath || careerPath.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/70">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {language === 'hi' ? 'करियर पथ का विवरण उपलब्ध नहीं है।' : 'Career pathway steps are not specified for this role.'}
        </p>
      </div>
    );
  }

  const formatExperience = (exp) => {
    if (!exp) return '';
    if (language === 'hi') {
      return exp
        .replace(/months/gi, 'महीने')
        .replace(/month/gi, 'महीना')
        .replace(/years/gi, 'वर्ष')
        .replace(/year/gi, 'वर्ष');
    }
    return exp;
  };

  return (
    <div className="py-6">
      <div className="relative border-l-2 border-amber-300 dark:border-amber-700/60 ml-4 sm:ml-8 space-y-8">
        {careerPath.map((step, idx) => {
          const isFinal = idx === careerPath.length - 1;
          const isEntry = idx === 0;

          return (
            <div key={idx} className="relative pl-6 sm:pl-8 group">
              {/* Step indicator circle on timeline */}
              <div
                className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 ${
                  isFinal
                    ? 'bg-emerald-600 text-white border-white dark:border-slate-900 ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : isEntry
                    ? 'bg-amber-500 text-white border-white dark:border-slate-900 ring-4 ring-amber-100 dark:ring-amber-950'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-amber-500 ring-2 ring-slate-100 dark:ring-slate-800'
                }`}
              >
                {idx + 1}
              </div>

              {/* Step Content Card */}
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                  isFinal
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800/80'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {t.career.stage} {idx + 1}
                    </span>
                    {isFinal && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {t.career.topStageTag}
                      </span>
                    )}
                  </div>

                  {step.wage_range && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70 self-start sm:self-auto">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{tWage(step.wage_range)}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {tStage(step.title)}
                </h4>

                {step.experience && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t.career.experienceReq}: {formatExperience(step.experience)}</span>
                  </p>
                )}

                {step.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CareerTimeline;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import roadmapService from '../services/roadmapService';

export function SkillGap() {
  const { language, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGaps() {
      setLoading(true);
      try {
        const res = await roadmapService.getSkillGaps();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load skill gaps:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGaps();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = data?.targetRole || {};
  const skills = data?.skills || [];
  const readiness = data?.readinessPercent || 0;
  const bridgeCourses = data?.recommendedCourses || [];
  const prioritizedGaps = data?.prioritizedGaps || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-terracotta-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-terracotta-500/20 text-terracotta-300 border border-terracotta-400/30 tracking-wider">
              {t('skillGap.badge', 'Competency Mapping Engine')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              NSQF Level {role.nsqf_level || 4} Alignment
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('skillGap.title', 'Visual Skill Gap & Competency Analysis')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t('skillGap.subtitle', 'Compare your acquired skills against official industry qualification standards to become 100% job-ready.')}
          </p>
        </div>

        {/* Target Role & Readiness Score Highlight */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('skillGap.targetRole', 'Target Occupation')}:
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{role.role_name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-terracotta-100 dark:bg-terracotta-950 text-terracotta-700 dark:text-terracotta-300">
                {role.sector}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {role.description}
            </p>
          </div>

          <div className="md:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-terracotta-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 border border-terracotta-200 dark:border-slate-700 text-center space-y-1">
            <span className="text-xs font-bold text-terracotta-800 dark:text-terracotta-300 uppercase tracking-wider">
              {t('skillGap.readinessScore', 'Overall Role Readiness')}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-terracotta-600 dark:text-terracotta-400">
              {readiness}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {data?.acquiredCount || 0} of {data?.totalRequiredCount || 0} required skills verified
            </p>
          </div>
        </div>

        {/* Skill Bars Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-terracotta-600" />
              <span>{language === 'hi' ? 'कौशल क्षमता बनाम उद्योग मानक' : 'Current Skills vs Industry Benchmark'}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Target: 80%+ for certification
            </span>
          </div>

          <div className="space-y-5">
            {skills.map((s, idx) => {
              const current = s.currentProficiency || 0;
              const required = s.requiredProficiency || 75;
              const isAcquired = s.isAcquired;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">
                        {s.skillName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {s.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        Required: <strong className="text-slate-700 dark:text-slate-200">{required}%</strong>
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isAcquired
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {current}% ({isAcquired ? 'Verified' : 'Gap'})
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar (Current vs Required) */}
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    {/* Required marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10"
                      style={{ left: `${required}%` }}
                      title={`Benchmark: ${required}%`}
                    />
                    {/* Current progress fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isAcquired ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-terracotta-500'
                      }`}
                      style={{ width: `${current}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prioritized Bridge Actions */}
        {prioritizedGaps.length > 0 && (
          <div className="bg-gradient-to-br from-amber-500/10 via-terracotta-500/10 to-transparent border border-amber-300/40 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta-600" />
              <span>{t('skillGap.toBecomeReady', 'To Become Job-Ready (Prioritized Focus Areas)')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prioritizedGaps.slice(0, 3).map((gap, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-terracotta-100 dark:bg-terracotta-950 text-terracotta-700 dark:text-terracotta-300 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      -{gap.gapPercent}% Gap
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {gap.skillName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Target benchmark: {gap.requiredLevel} ({gap.requiredProficiency}% proficiency)
                  </p>
                </div>
              ))}
            </div>

            {/* Recommended Bridge Courses CTA */}
            {bridgeCourses.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'कौशल अंतराल भरने हेतु अनुशंसित पाठ्यक्रम' : 'Bridging NSQF Skilling Available'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {bridgeCourses[0]?.course_name} ({bridgeCourses[0]?.duration})
                  </p>
                </div>

                <Link
                  to="/courses"
                  className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
                >
                  <span>{language === 'hi' ? 'मुफ्त कोर्स देखें' : 'View Subsidized Course'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillGap;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import roadmapService from '../services/roadmapService';

export function Roadmap() {
  const { language, t } = useLanguage();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      setLoading(true);
      try {
        const res = await roadmapService.getCareerRoadmap();
        if (res.success) {
          setRoadmap(res.roadmap);
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">
            {language === 'hi' ? 'करियर रोडमैप तैयार हो रहा है...' : 'Building your 7-step career progression roadmap...'}
          </p>
        </div>
      </div>
    );
  }

  const role = roadmap?.targetRole || 'NSQF Livelihood Pathway';
  const currentStep = roadmap?.currentStep || 2;
  const steps = roadmap?.steps || [];

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400">
                PM-AJAY GIA 7-Step Career Progression Ladder
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {role}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'hi'
                  ? 'शून्य लागत सरकारी प्रशिक्षण से उद्यमशीलता और स्थिर आजीविका तक की यात्रा।'
                  : 'From 100% subsidized skilling to verified placement and enterprise setup.'}
              </p>
            </div>

            <div className="p-4 bg-terracotta-50 dark:bg-terracotta-950/40 rounded-2xl border border-terracotta-200 dark:border-terracotta-800 text-center shrink-0">
              <span className="text-[10px] font-bold text-terracotta-700 dark:text-terracotta-300 uppercase tracking-wider block">
                Current Stage
              </span>
              <span className="text-2xl font-black text-terracotta-800 dark:text-terracotta-200">
                Step {currentStep} of 7
              </span>
            </div>
          </div>
        </div>

        {/* 7-Step Dynamic Journey Timeline */}
        <div className="space-y-6">
          {steps.map((item) => {

            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in_progress';
            const isReady = item.status === 'ready';

            return (
              <div
                key={item.step}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-200 relative ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-950/60'
                    : isInProgress || isReady
                    ? 'border-terracotta-300 dark:border-terracotta-800 ring-2 ring-terracotta-500/10'
                    : 'border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Step Number Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : isInProgress || isReady
                          ? 'bg-terracotta-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : item.step}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {t('roadmap.step', 'Step')} {item.step}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : isInProgress
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                              : isReady
                              ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200 dark:bg-terracotta-950/40 dark:text-terracotta-300'
                              : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {isCompleted
                            ? t('roadmap.statusCompleted', 'Completed')
                            : isInProgress
                            ? t('roadmap.statusInProgress', 'In Progress')
                            : isReady
                            ? t('roadmap.statusReady', 'Action Ready')
                            : t('roadmap.statusPending', 'Pending')}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {language === 'hi' ? item.title_hi || item.title : item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  {item.actionUrl && (
                    <div className="sm:shrink-0 pt-2 sm:pt-0">
                      <Link
                        to={item.actionUrl}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition ${
                          isInProgress || isReady
                            ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise & Subsidy Note */}
        <div className="bg-gradient-to-r from-forest-900 via-slate-900 to-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-forest-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              {language === 'hi' ? 'PM-AJAY टूल-किट व स्वरोजगार सहायता' : 'PM-AJAY GIA Tool-Kit & Enterprise Linkage'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'चरण 5 में सरकारी NSQF प्रमाणन प्राप्त करने के पश्चात, लाभार्थी स्वरोजगार टूल-किट हेतु ₹50,000 तक की वित्तीय अनुदान सहायता के पात्र होते हैं। साथ ही NSFDC व प्रधानमंत्री मुद्रा योजना (PMMY) के तहत 4-6% की रियायती ब्याज दर पर आसान ऋण सहायता उपलब्ध कराई जाती है।'
              : 'Upon attaining official NSQF certification at Step 5, certified beneficiaries are eligible for up to ₹50,000 in direct tool-kit capital grants under PM-AJAY GIA. Soft credit linkages with NSFDC and Mudra loans at 4-6% interest are also facilitated directly through district livelihood cells.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;

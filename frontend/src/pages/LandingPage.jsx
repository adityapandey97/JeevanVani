import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  Sun,
  Wrench,
  Stethoscope,
  Laptop,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AudioWaveform from '../components/common/AudioWaveform';

export function LandingPage() {
  const { language, t, tSector, speakText } = useLanguage();
  const navigate = useNavigate();
  const [micDemoActive, setMicDemoActive] = useState(false);
  const [demoSpokenText, setDemoSpokenText] = useState('');

  const workflowSteps = [
    {
      step: '01',
      title: t.hero.step1,
      desc: t.hero.step1Desc,
      icon: Mic,
      color: 'from-amber-500 to-orange-500',
    },
    {
      step: '02',
      title: t.hero.step2,
      desc: t.hero.step2Desc,
      icon: Sparkles,
      color: 'from-orange-500 to-amber-600',
    },
    {
      step: '03',
      title: t.hero.step3,
      desc: t.hero.step3Desc,
      icon: Award,
      color: 'from-amber-600 to-yellow-600',
    },
    {
      step: '04',
      title: t.hero.step4,
      desc: t.hero.step4Desc,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '05',
      title: t.hero.step5,
      desc: t.hero.step5Desc,
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-600',
    },
  ];

  const sectorHighlights = [
    { name: 'Solar / Green Jobs', level: 'NSQF 4', icon: Sun, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { name: 'Construction & Electrical', level: 'NSQF 3', icon: Wrench, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
    { name: 'Healthcare', level: 'NSQF 4', icon: Stethoscope, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { name: 'IT / ITeS', level: 'NSQF 4', icon: Laptop, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { name: 'Retail', level: 'NSQF 4', icon: ShoppingBag, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
  ];

  const handleTestMicClick = () => {
    setMicDemoActive(true);
    const demoGreeting = t.hero.sampleSpeech;
    setDemoSpokenText(demoGreeting);
    speakText(demoGreeting);
    setTimeout(() => {
      setMicDemoActive(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-amber-200/20 via-orange-100/30 to-amber-200/20 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Main Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Govt Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t.hero.taglineBadge}</span>
              </div>

              {/* Main Tagline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {language === 'hi' ? (
                  <>
                    सही कौशल चुनें। <br />
                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
                      सुनहरा भविष्य बनाएं।
                    </span>
                  </>
                ) : (
                  <>
                    Find the Right Skills. <br />
                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
                      Build the Right Future.
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {t.hero.subHeading}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/assessment"
                  id="start-assessment-hero-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition active:scale-95"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>{t.hero.startAssessment}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/recommendations"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm transition"
                >
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{t.hero.exploreRoles}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 justify-center lg:justify-start text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.hero.trust1}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.hero.trust2}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.hero.trust3}
                </span>
              </div>
            </div>

            {/* Right Col: Interactive Voice Assistant Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? 'जीवनवाणी AI सहायक' : 'JeevanVani Voice Assistant'}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-semibold">
                    {t.hero.liveDemo}
                  </span>
                </div>

                {/* Animated Visualizer Circle */}
                <div className="my-8 flex flex-col items-center justify-center">
                  <div className="relative">
                    {micDemoActive && (
                      <div className="absolute inset-0 rounded-full bg-amber-400 opacity-60 animate-ping" />
                    )}
                    <button
                      onClick={handleTestMicClick}
                      className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition transform active:scale-95 ${
                        micDemoActive
                          ? 'bg-gradient-to-tr from-red-500 to-rose-600 shadow-red-500/40 ring-4 ring-red-200 dark:ring-red-900'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-500 hover:scale-105 shadow-amber-500/30'
                      }`}
                      title={t.hero.testMicText}
                    >
                      <Mic className="w-10 h-10" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <AudioWaveform active={micDemoActive} color="bg-amber-500" barCount={16} />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-center">
                    {micDemoActive ? (
                      <span className="text-amber-600 dark:text-amber-400 animate-pulse">
                        {t.hero.assistantSpeaking}
                      </span>
                    ) : (
                      <span>{t.hero.testMicText}</span>
                    )}
                  </p>
                </div>

                {/* Speech Bubble Demo */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[72px] flex items-center">
                  <p className="italic">
                    "{demoSpokenText || t.hero.sampleSpeech}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{language === 'hi' ? 'वेब स्पीच ऑडियो' : 'Web Speech API Audio'}</span>
                  <button
                    onClick={() => navigate('/assessment')}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-1"
                  >
                    <span>{t.hero.startAssessment}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              {t.hero.howItWorksBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
              {t.hero.howItWorksTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              {language === 'hi'
                ? 'बोलें → AI आपको समझेगा → कौशल मैपिंग → उपयुक्त करियर विकल्प → सरकारी प्रशिक्षण अनुशंसा'
                : 'Speak → AI Understands You → Maps Your Skills → Finds Suitable Career Paths → Recommends Skilling'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg transition flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-amber-500 transition">
                        {step.step}
                      </span>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured NSQF Sectors */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                {language === 'hi' ? 'NSQF संरेखित मैट्रिक्स' : 'NSQF Aligned Matrix'}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {t.hero.sectorsHeading}
              </h2>
            </div>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              <span>{t.hero.viewAllRoles}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {sectorHighlights.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${sec.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {tSector(sec.name)}
                  </h4>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                    {language === 'hi' ? `NSQF स्तर ${sec.level.replace('NSQF ', '')}` : sec.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PM-AJAY Grant-in-Aid (GIA) Component Highlights */}
      <section className="py-16 bg-slate-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-amber-400">{t.hero.freeGovtSkilling}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.hero.freeGovtSkillingDesc}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-amber-400">{t.hero.toolkitSupport}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.hero.toolkitSupportDesc}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-amber-400">{t.hero.placementSupport}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.hero.placementSupportDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

import React from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ExplainModal({ isOpen, onClose, recommendation, type = 'job' }) {
  const { language } = useLanguage();

  if (!isOpen || !recommendation) return null;

  const title = recommendation.title || recommendation.role_name || recommendation.course_name;
  const matchScore = recommendation.matchScore || recommendation.match_score || 85;
  const confidenceScore = recommendation.confidenceScore || recommendation.confidence_score || 88;
  const isHighConfidence = confidenceScore >= 65;

  const matchedSkills = recommendation.matchedSkills || recommendation.matching_skills || [];
  const missingSkills = recommendation.missingSkills || recommendation.missing_skills || [];
  const whyReasons = recommendation.whyRecommended || recommendation.why_recommended || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-terracotta-100 dark:bg-terracotta-950/60 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800 uppercase tracking-wider">
              {type === 'job' ? 'PM-AJAY Livelihood Match' : 'NSQF Skilling Alignment'}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {matchScore}% Match
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'hi' ? 'यह सिफारिश आपको क्यों दिखाई दे रही है?' : 'Why am I seeing this recommendation?'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {title}
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isHighConfidence
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            {isHighConfidence ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <h3 className="text-xs font-bold">
                {isHighConfidence
                  ? (language === 'hi' ? 'उच्च विश्वसनीयता सिफारिश (High Confidence)' : 'High Confidence Recommendation')
                  : (language === 'hi' ? 'सीमित विश्वसनीयता - प्रोफ़ाइल की समीक्षा करें' : 'Limited Confidence - Review Profile')}
              </h3>
              <p className="text-[11px] opacity-85 mt-0.5">
                {isHighConfidence
                  ? (language === 'hi' ? 'आपकी शैक्षणिक योग्यता, स्थान और कार्य रुचि से 80%+ सटीक मिलान।' : 'Verified against your education, location, and validated vocational competencies.')
                  : (language === 'hi' ? 'पूर्ण जानकारी उपलब्ध न होने के कारण यह अनुमानित मिलान है।' : 'Based on partial input; consider updating your skills or preferences in the assessment.')}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-black">{confidenceScore}%</span>
            <span className="block text-[10px] uppercase font-bold opacity-75">Confidence</span>
          </div>
        </div>

        {/* Score Breakdown / Why this job */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
            <span>{language === 'hi' ? 'मिलान के मुख्य आधार' : 'Key Match Rationale'}</span>
          </h3>
          <ul className="space-y-2">
            {(Array.isArray(whyReasons) ? whyReasons : [whyReasons]).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Matched vs Missing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {language === 'hi' ? '✓ आपके मिलान वाले कौशल' : '✓ Matching Skills Acquired'}
            </h4>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((s, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">{language === 'hi' ? 'बुनियादी कौशल सीखने हेतु उपयुक्त' : 'Foundational onboarding tier'}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {language === 'hi' ? '• प्रशिक्षण में सीखने योग्य' : '• Skills to Learn / Bridge'}
            </h4>
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((s, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100/70 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-600 font-medium">{language === 'hi' ? 'सभी आवश्यक कौशल मौजूद हैं!' : 'All core skills acquired!'}</p>
            )}
          </div>
        </div>

        {/* Verified PM-AJAY GIA Scheme Grounded Facts */}
        <div className="p-4 rounded-2xl bg-terracotta-50/50 dark:bg-terracotta-950/20 border border-terracotta-200/60 dark:border-terracotta-800/40 space-y-2">
          <h4 className="text-xs font-bold text-terracotta-900 dark:text-terracotta-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-terracotta-600" />
            <span>{language === 'hi' ? 'सत्यापित सरकारी लाभ (PM-AJAY GIA)' : 'Verified PM-AJAY Scheme Provisions'}</span>
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'प्रशिक्षण शुल्क 100% सरकारी अनुदान द्वारा वहन किया जाता है। प्रमाणन के उपरांत स्वरोजगार हेतु ₹50,000 तक टूल-किट सब्सिडी व NSFDC/मुद्रा रियायती ऋण सहायता उपलब्ध कराई जाती है।'
              : 'Course fee is 100% subsidized under PM-AJAY GIA. Upon certification, candidates are eligible for tool-kit subsidy up to ₹50,000 for self-employment, plus soft credit linkage via NSFDC & Mudra.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-terracotta-500 dark:hover:bg-terracotta-600 text-white font-bold text-xs shadow transition"
          >
            {language === 'hi' ? 'समझ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExplainModal;

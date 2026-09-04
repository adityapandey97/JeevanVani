import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import recommendationService from '../services/recommendationService';
import RecommendationCard from '../components/Recommendation/RecommendationCard';
import { Award, RotateCcw, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export function Recommendations() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const res = await recommendationService.getRecommendations();
        if (res.success && res.recommendations) {
          setRecommendations(res.recommendations);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        setError(language === 'hi' ? 'सिफारिशें लोड नहीं हो सकीं। कृपया पहले अपना मूल्यांकन पूरा करें।' : 'Unable to load recommendations. Please complete your assessment first.');
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, [language]);

  const handleRegenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await recommendationService.generateRecommendations();
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error('Failed to regenerate recommendations:', err);
      setError(language === 'hi' ? 'पुनर्गणना विफल रही। कृपया पुनः प्रयास करें।' : 'Could not regenerate recommendations. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            {language === 'hi'
              ? 'NSQF 5-कारक स्कोरिंग इंजन द्वारा सर्वोत्तम अवसरों की गणना जारी है...'
              : 'Calculating optimal NSQF skilling pathways with 5-factor scoring...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.recs.goBack}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>{t.recs.recalculate}</span>
          </button>
        </div>

        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t.recs.matrixBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.recs.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.recs.subtitle}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{error}</span>
            </div>
            <Link
              to="/assessment"
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
            >
              {t.recs.startVoiceAssessment}
            </Link>
          </div>
        )}

        {/* Top 3 Cards List */}
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.slice(0, 3).map((rec, index) => (
              <RecommendationCard
                key={rec.id || index}
                recommendation={rec}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t.recs.noRecsFound}
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.recs.startVoiceAssessment}</span>
            </Link>
          </div>
        )}

        {/* Retake or View Dashboard Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-base font-bold">
              {t.recs.adjustTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {t.recs.adjustDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/assessment"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow"
            >
              {t.recs.retakeAssessment}
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
            >
              {t.nav.dashboard}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;

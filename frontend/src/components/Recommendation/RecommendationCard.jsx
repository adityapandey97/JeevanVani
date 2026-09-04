import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import SkillGapList from './SkillGapList';
import { useLanguage } from '../../context/LanguageContext';

export function RecommendationCard({ recommendation, rank = 1 }) {
  const navigate = useNavigate();
  const { language, t, tRole, tSector, tEducation, tDuration } = useLanguage();

  const rankBadges = {
    1: {
      label: language === 'hi' ? '#1 शीर्ष विकल्प' : '#1 Top Match',
      bg: 'from-amber-500 to-amber-600'
    },
    2: {
      label: language === 'hi' ? '#2 वैकल्पिक मार्ग' : '#2 Alternative Path',
      bg: 'from-slate-700 to-slate-800'
    },
    3: {
      label: language === 'hi' ? '#3 उच्च संभावना' : '#3 High Potential',
      bg: 'from-orange-600 to-amber-700'
    },
  };

  const currentRank = rankBadges[rank] || rankBadges[2];

  const handleViewCareer = () => {
    navigate(`/career-path?roleId=${recommendation.job_role_id || recommendation.id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
      {/* Top Banner Accent */}
      <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

      <div className="p-6 sm:p-8">
        {/* Header Row: Rank, Badges, Match Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${currentRank.bg} shadow-sm`}>
              {currentRank.label}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {tSector(recommendation.sector)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {t.recs.nsqfLevel} {recommendation.nsqf_level}
            </span>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 px-4 py-2 rounded-xl self-start sm:self-auto">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                {t.recs.matchScore}
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white leading-none">
                {recommendation.match_score}%
              </div>
            </div>
          </div>
        </div>

        {/* Job Role Title and Description */}
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
            {tRole(recommendation.role_name)}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        {/* Meta Info Grid (Education & Duration) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-normal">{t.recs.eligibility}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{tEducation(recommendation.required_education)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-normal">{t.recs.duration}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{tDuration(recommendation.training_duration)}</span>
            </div>
          </div>
        </div>

        {/* Why Recommended Section */}
        {recommendation.why_recommended && recommendation.why_recommended.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{t.recs.whyRecommended}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {recommendation.why_recommended.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skill Gap Component */}
        <SkillGapList
          matchingSkills={recommendation.matching_skills || []}
          missingSkills={recommendation.missing_skills || []}
        />

        {/* Action Button: View Career Path */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t.recs.freeCertNote}
          </div>
          <button
            type="button"
            onClick={handleViewCareer}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 shadow transition group-hover:bg-amber-600 dark:group-hover:bg-amber-400"
          >
            <span>{t.recs.viewCareerPath}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;

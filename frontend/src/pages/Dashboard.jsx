import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import recommendationService from '../services/recommendationService';
import MetricCard from '../components/Dashboard/MetricCard';
import SkillGapList from '../components/Recommendation/SkillGapList';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Briefcase,
  BookOpen,
  Compass
} from 'lucide-react';


export function Dashboard() {
  const { user } = useAuth();
  const { language, t, tRole, tSector, tEducation } = useLanguage();

  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profRes, recRes] = await Promise.all([
          recommendationService.getProfile(),
          recommendationService.getRecommendations(),
        ]);

        if (profRes.success) {
          setProfileData(profRes);
        }
        if (recRes.success && recRes.recommendations) {
          setRecommendations(recRes.recommendations);
        }
      } catch (err) {
        console.error('Failed to load beneficiary dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const skills = profileData?.skills || [];
  const topRec = recommendations[0] || null;
  const completion = profile.profile_completion || 0;

  const translateEmployment = (status) => {
    if (!status) return t('dashboard.notProvided', 'Not Provided');
    if (language === 'hi') {
      if (status.includes('Unemployed')) return 'वर्तमान में बेरोजगार';
      if (status.includes('Self')) return 'स्वरोजगार / अपनी दुकान';
      if (status.includes('Daily') || status.includes('Informal')) return 'दिहाड़ी मजदूरी / हेल्पर';
      if (status.includes('Student')) return 'विद्यार्थी / छात्र';
      if (status.includes('Employed')) return 'वेतनभोगी नौकरी';
    }
    return status;
  };

  const translatePreference = (pref) => {
    if (!pref) return t('dashboard.both', 'Both (Job & Business)');
    if (language === 'hi') {
      if (pref === 'Both') return 'नौकरी व स्वरोजगार दोनों';
      if (pref === 'Job') return 'वेतन वाली नौकरी';
      if (pref === 'Self-employment') return 'स्वरोजगार / व्यवसाय';
    }
    return pref;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-terracotta-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-terracotta-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-amber-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">
                  Namaste, {user?.name || 'Beneficiary'} 👋
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-terracotta-500/30 text-terracotta-200 font-extrabold uppercase border border-terracotta-400/40">
                  {t('dashboard.beneficiaryTag', 'Beneficiary (PM-AJAY GIA)')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-3 flex-wrap">
                <span>{user?.email}</span>
                <span>•</span>
                <span>{user?.mobile}</span>
                {profile.preferred_location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-terracotta-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.preferred_location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-emerald-300 font-semibold">
                  Lang: {user?.preferred_language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-terracotta-500 to-amber-500 hover:from-terracotta-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-terracotta-500/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{completion < 100 ? t('dashboard.completeBtn', 'Complete Assessment') : t('dashboard.retakeBtn', 'Retake Assessment')}</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('dashboard.profileCompletion', 'Profile Completion')}
            value={`${completion}%`}
            subtitle={completion >= 100 ? t('dashboard.verifiedProfile', 'Verified Profile') : t('dashboard.inProgress', 'In Progress')}
            icon={CheckCircle2}
            color="emerald"
          />

          <MetricCard
            title={t('dashboard.identifiedSkills', 'Identified Skills')}
            value={skills.length}
            subtitle={t('dashboard.catalogOverlap', 'Catalog Overlap')}
            icon={Award}
            color="amber"
          />

          <MetricCard
            title={t('dashboard.recommendedPathways', 'Recommended Pathways')}
            value={recommendations.length}
            subtitle={t('dashboard.nsqfMapped', 'NSQF Mapped Roles')}
            icon={TrendingUp}
            color="blue"
          />

          <MetricCard
            title={t('dashboard.topMatchScore', 'Top Match Score')}
            value={topRec ? `${topRec.match_score}%` : 'N/A'}
            subtitle={topRec ? tRole(topRec.role_name) : t('dashboard.noRecsYet', 'No recommendations yet')}
            icon={Sparkles}
            color="purple"
          />
        </div>

        {/* Quick Action Navigation Hub */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-terracotta-600" />
            <span>{t('dashboard.quickActions', 'Quick Action Hub')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/jobs"
              className="p-4 rounded-2xl bg-gradient-to-br from-terracotta-50 to-amber-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-terracotta-200/60 dark:border-slate-700 hover:border-terracotta-400 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('jobs.title', 'Jobs & Livelihoods')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Verified NCS opportunities matching your skills.
              </p>
            </Link>

            <Link
              to="/courses"
              className="p-4 rounded-2xl bg-gradient-to-br from-forest-50 to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-forest-200/60 dark:border-slate-700 hover:border-forest-400 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('courses.title', 'Courses & Skilling')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                NSQF certified courses & RPL pathways.
              </p>
            </Link>

            <Link
              to="/skill-gap"
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-blue-200/60 dark:border-slate-700 hover:border-blue-400 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('skillGap.title', 'Skill Gap Analysis')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Competency benchmarks & bridge learning.
              </p>
            </Link>

            <Link
              to="/roadmap"
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-purple-200/60 dark:border-slate-700 hover:border-purple-400 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('roadmap.title', 'Career Roadmap')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                7-step dynamic journey to employment.
              </p>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Top Recommendation Highlight & Skill Gaps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
                  <span>{t('dashboard.topRecommendation', 'Top Career Recommendation')}</span>
                </h2>
                {topRec && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-terracotta-100 dark:bg-terracotta-950/60 text-terracotta-900 dark:text-terracotta-300 font-bold border border-terracotta-200">
                    {topRec.match_score}% Match
                  </span>
                )}
              </div>

              {topRec ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                        {tSector(topRec.sector)}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/60">
                        NSQF Level {topRec.nsqf_level}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {tRole(topRec.role_name)}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {topRec.description}
                    </p>
                  </div>

                  {/* Skill Gap breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {language === 'hi' ? 'इस रोल के लिए कौशल अंतराल विश्लेषण' : 'Skill Gap Analysis for This Role'}
                    </h4>
                    <SkillGapList
                      matchingSkills={topRec.matching_skills || []}
                      missingSkills={topRec.missing_skills || []}
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link
                      to={`/career-path?roleId=${topRec.job_role_id || topRec.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700"
                    >
                      <span>{t('dashboard.viewCareerLadder', 'View Career Ladder & Wage Steps')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/recommendations"
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-terracotta-500 hover:bg-slate-800 dark:hover:bg-terracotta-600 text-white font-semibold text-xs shadow transition"
                    >
                      {t('dashboard.viewAll3', 'View All 3 Recommendations')}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.noRecsYet', 'You have not completed your assessment yet.')}</p>
                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow"
                  >
                    <span>{t('dashboard.startNow', 'Begin Assessment Now')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Extracted Profile Attributes & Skills */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <User className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
                <span>{t('dashboard.livelihoodAttributes', 'Livelihood Profile Attributes')}</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{t('dashboard.education', 'Education')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{tEducation(profile.education) || t('dashboard.notProvided', 'Not Provided')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{t('dashboard.employmentStatus', 'Employment Status')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{translateEmployment(profile.employment_status)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{t('dashboard.workExperience', 'Work Experience')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.work_experience || t('dashboard.none', 'None')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{t('dashboard.jobPreference', 'Job Preference')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{translatePreference(profile.employment_preference)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('dashboard.willingToRelocate', 'Willing to Relocate')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.willing_to_relocate ? t('dashboard.yes', 'Yes') : t('dashboard.noLocal', 'No (Local only)')}</span>
                </div>
              </div>

              {/* Verified Identified Skills */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('dashboard.extractedSkills', 'Extracted Beneficiary Skills')} ({skills.length})
                </h3>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-terracotta-50 dark:bg-slate-800 text-terracotta-800 dark:text-terracotta-300 border border-terracotta-200/60 dark:border-slate-700"
                      >
                        {typeof s === 'string' ? s : s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">{t('dashboard.noSkillsYet', 'No skills recorded yet.')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

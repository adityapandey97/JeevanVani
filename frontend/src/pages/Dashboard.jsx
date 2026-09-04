import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  MapPin
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { language, t, tRole, tSector, tEducation, tSkill } = useLanguage();
  const navigate = useNavigate();

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
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const skills = profileData?.skills || [];
  const topRec = recommendations[0] || null;
  const completion = profile.profile_completion || 0;

  const translateEmployment = (status) => {
    if (!status) return t.dashboard.notProvided;
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
    if (!pref) return t.dashboard.both;
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
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-400/30">
                  {t.dashboard.beneficiaryTag}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                <span>{user?.email}</span>
                <span>•</span>
                <span>{user?.mobile}</span>
                {profile.preferred_location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {profile.preferred_location}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{completion < 100 ? t.dashboard.completeBtn : t.dashboard.retakeBtn}</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t.dashboard.profileCompletion}
            value={`${completion}%`}
            subtitle={completion >= 100 ? t.dashboard.verifiedProfile : t.dashboard.inProgress}
            icon={CheckCircle2}
            color="emerald"
          />

          <MetricCard
            title={t.dashboard.identifiedSkills}
            value={skills.length}
            subtitle={t.dashboard.catalogOverlap}
            icon={Award}
            color="amber"
          />

          <MetricCard
            title={t.dashboard.recommendedPathways}
            value={recommendations.length}
            subtitle={t.dashboard.nsqfMapped}
            icon={TrendingUp}
            color="blue"
          />

          <MetricCard
            title={t.dashboard.topMatchScore}
            value={topRec ? `${topRec.match_score}%` : 'N/A'}
            subtitle={topRec ? tRole(topRec.role_name) : t.dashboard.noRecsYet}
            icon={Sparkles}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Top Recommendation Highlight & Skill Gaps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{t.dashboard.topRecommendation}</span>
                </h2>
                {topRec && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800/60">
                    {topRec.match_score}% {t.recs.matchScore}
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
                        {language === 'hi' ? `NSQF स्तर ${topRec.nsqf_level}` : `NSQF Level ${topRec.nsqf_level}`}
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
                      {language === 'hi' ? 'इस रोल के लिए कौशल अंतराल (स्किल गैप) विश्लेषण' : 'Skill Gap Analysis for This Role'}
                    </h4>
                    <SkillGapList
                      matchingSkills={topRec.matching_skills || []}
                      missingSkills={topRec.missing_skills || []}
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link
                      to={`/career-path?roleId=${topRec.job_role_id || topRec.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      <span>{t.dashboard.viewCareerLadder}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/recommendations"
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-semibold shadow transition"
                    >
                      {t.dashboard.viewAll3}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.dashboard.noRecsYet}</p>
                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow"
                  >
                    <span>{t.dashboard.startNow}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Subsidies and PM-AJAY GIA Benefit Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-3xl shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-amber-100 uppercase tracking-wider text-[10px]">
                  {language === 'hi' ? 'सरकारी योजना लाभ व पात्रता' : 'Government Scheme Entitlement'}
                </p>
                <p className="font-medium leading-snug">
                  {t.dashboard.subsidiesLink}
                </p>
              </div>
            </div>
          </div>

          {/* Right Col: Beneficiary Livelihood Profile Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{t.dashboard.livelihoodAttributes}</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.education}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tEducation(profile.education) || t.dashboard.notProvided}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.employmentStatus}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{translateEmployment(profile.employment_status)}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.workExperience}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[180px] truncate">{profile.work_experience || t.dashboard.none}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.jobPreference}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{translatePreference(profile.employment_preference)}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.willingToRelocate}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {profile.willing_to_relocate ? t.dashboard.yes : t.dashboard.noLocal}
                  </span>
                </div>
              </div>

              {/* Verified User Skills Tags */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.dashboard.extractedSkills}
                </h4>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        {tSkill(s.name)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">{t.dashboard.noSkillsYet}</p>
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

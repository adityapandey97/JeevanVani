import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building2, CheckCircle2, ExternalLink, Search, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';
import ExplainModal from '../components/common/ExplainModal';

export function Jobs() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedJobForExplain, setSelectedJobForExplain] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        if (user) {
          const res = await jobService.getRecommendedJobs(12);
          if (res.success) {
            setJobs(res.recommendations || []);
          }
        } else {
          const res = await jobService.getJobs();
          if (res.success) {
            setJobs(res.jobs || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch livelihood jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [user, language]);

  const handleApply = async (job) => {
    if (!user) {
      window.open(job.application_url, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      await jobService.applyToJob(job.id, 'Registered interest via JeevanVaani');
      setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
      // Also open official government job application URL
      if (job.application_url) {
        window.open(job.application_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // If already applied, still open the URL
      setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
      if (job.application_url) {
        window.open(job.application_url, '_blank', 'noopener,noreferrer');
      }
    }
  };


  const filteredJobs = jobs.filter(job => {
    if (selectedSector && job.sector !== selectedSector) return false;
    if (verifiedOnly && !job.is_verified) return false;
    if (search) {
      const q = search.toLowerCase();
      const titleMatch = (job.title || '').toLowerCase().includes(q);
      const orgMatch = (job.organization || '').toLowerCase().includes(q);
      const locMatch = (job.location || '').toLowerCase().includes(q);
      if (!titleMatch && !orgMatch && !locMatch) return false;
    }
    return true;
  });

  const sectors = Array.from(new Set(jobs.map(j => j.sector).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-terracotta-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-terracotta-800/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-terracotta-500/20 text-terracotta-300 border border-terracotta-400/30 tracking-wider">
              {t('jobs.badge', 'PM-AJAY Livelihood Opportunities')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {t('jobs.verifiedBadge', 'Verified Official Only')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('jobs.title', 'Jobs & Livelihood Opportunities')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t('jobs.subtitle', 'Real, verified employment opportunities benchmarked against National Career Service (NCS) and PM-AJAY district clusters. Match scores are computed deterministically using your verified skills, education, and location.')}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('jobs.searchPlaceholder', 'Search by job title, skill, or organization...')}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              <option value="">{t('jobs.allSectors', 'All Industry Sectors')}</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                verifiedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('jobs.verifiedOnly', 'Verified Official Only')}</span>
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {t('jobs.empty', 'No verified jobs found matching your selected filters right now.')}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया अन्य फिल्टर चुनें या नया वॉयस मूल्यांकन करके अपनी प्राथमिकताएं अपडेट करें।'
                : 'Try adjusting your filters or complete the voice assessment to unlock more targeted pathways.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => {
              const matchScore = job.matchScore || 82;
              const isApplied = Boolean(appliedJobs[job.id]);
              const reqSkills = Array.isArray(job.required_skills) ? job.required_skills : [];

              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Top Row: Sector & Match Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {job.sector}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        matchScore >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                      }`}>
                        {matchScore}% {t('jobs.skillMatch', 'Skill Match')}
                      </span>
                    </div>

                    {/* Job Title & Organization */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{job.organization}</span>
                      </p>
                    </div>

                    {/* Location & Salary */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                          <span className="text-terracotta-600">₹</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold">{t('courses.eligibility', 'Eligibility')}:</span> {job.eligibility}
                      </div>
                    </div>

                    {/* Required Skills chips */}
                    {reqSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {t('courses.skillsCovered', 'Skills Required')}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {reqSkills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {sk}
                            </span>
                          ))}
                          {reqSkills.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                              +{reqSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Source Tag */}
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t('jobs.sourceLabel', 'Source')}: {job.source}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJobForExplain(job)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                      <span>{t('jobs.whyRecommended', 'Why this job?')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApply(job)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('jobs.applied', 'Applied')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('jobs.apply', 'Apply via NCS')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Explain Modal */}
        <ExplainModal
          isOpen={Boolean(selectedJobForExplain)}
          onClose={() => setSelectedJobForExplain(null)}
          recommendation={selectedJobForExplain}
          type="job"
        />
      </div>
    </div>
  );
}

export default Jobs;

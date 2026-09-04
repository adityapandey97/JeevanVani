import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import recommendationService from '../services/recommendationService';
import CareerTimeline from '../components/Dashboard/CareerTimeline';
import { TrendingUp, ArrowLeft, Clock, GraduationCap, Landmark } from 'lucide-react';

export function CareerPath() {
  const { language, t, tRole, tSector, tEducation, tDuration } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleIdParam = searchParams.get('roleId');
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await recommendationService.getJobRoles();
        if (res.success && res.jobRoles) {
          setAllRoles(res.jobRoles);

          let target = null;
          if (roleIdParam) {
            target = res.jobRoles.find((r) => String(r.id) === String(roleIdParam));
          }
          if (!target && res.jobRoles.length > 0) {
            target = res.jobRoles[0];
          }
          setSelectedRole(target);
        }
      } catch (err) {
        console.error('Failed to load career path roles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [roleIdParam, language]);

  const handleSelectRole = (id) => {
    setSearchParams({ roleId: id });
    const target = allRoles.find((r) => String(r.id) === String(id));
    if (target) setSelectedRole(target);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/recommendations')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.career.backToRecs}</span>
          </button>

          <Link
            to="/assessment"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
          >
            {t.career.startNew}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.career.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.career.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t.career.subtitle}
          </p>
        </div>

        {/* Role Selector Tabs / Pills */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {allRoles.map((role) => {
              const isSelected = selectedRole?.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tRole(role.role_name)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Role Meta Card */}
        {selectedRole && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                    {language === 'hi' ? `NSQF स्तर ${selectedRole.nsqf_level}` : `NSQF Level ${selectedRole.nsqf_level}`}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tSector(selectedRole.sector)}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {tRole(selectedRole.role_name)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {selectedRole.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{tEducation(selectedRole.required_education)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{tDuration(selectedRole.training_duration)}</span>
                </div>
              </div>
            </div>

            {/* Visual Timeline component */}
            <CareerTimeline
              careerPath={selectedRole.career_path}
              roleTitle={selectedRole.role_name}
            />

            {/* PM-AJAY GIA Financial & Entrepreneurship Linkage Note */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/40 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm flex-shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <h4 className="font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wide">
                  {t.career.enterpriseTitle}
                </h4>
                <p className="leading-relaxed">
                  {t.career.enterpriseDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerPath;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Award,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export function ApplicationsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'courses'
  const [applications, setApplications] = useState({ jobApplications: [], courseEnrollments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const res = await api.get('/applications');
        if (res.data?.success && res.data?.data) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'certified':
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            {language === 'hi' ? 'प्रमाणित / चयनित' : 'Certified / Selected'}
          </span>
        );
      case 'enrolled':
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3 h-3" />
            {language === 'hi' ? 'नामांकित / समीक्षाधीन' : 'Enrolled / Under Review'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            {language === 'hi' ? 'आवेदन दर्ज' : 'Submitted'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const jobs = applications.jobApplications || [];
  const courses = applications.courseEnrollments || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-400" />
              <span>{language === 'hi' ? 'मेरे आवेदन व प्रशिक्षण नामांकन' : 'My Applications & Course Enrollments'}</span>
            </h1>
            <p className="text-xs text-amber-200/80 mt-1">
              {language === 'hi'
                ? 'PM-AJAY GIA घटक के तहत दर्ज नौकरी आवेदन और 100% मुफ्त कौशल प्रशिक्षण ट्रैकिंग'
                : 'Track PM-AJAY subsidized vocational course enrollments and verified livelihood applications'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
              <span className="text-amber-300">{jobs.length}</span> {language === 'hi' ? 'नौकरियां' : 'Jobs'} •{' '}
              <span className="text-amber-300">{courses.length}</span> {language === 'hi' ? 'कोर्स' : 'Courses'}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition border-b-2 ${
              activeTab === 'jobs'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{language === 'hi' ? 'नौकरी आवेदन' : 'Job Applications'} ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition border-b-2 ${
              activeTab === 'courses'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रशिक्षण नामांकन व RPL' : 'Training Enrollments & RPL'} ({courses.length})</span>
          </button>
        </div>

        {/* Tab 1: Job Applications */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/50 transition duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{item.title}</h3>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span>{item.organization}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.applied_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{item.salary || 'Competitive Stipend'}</span>
                      <span>•</span>
                      <span className="text-slate-500">{item.source}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.application_url && (
                      <a
                        href={item.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                      >
                        <span>{language === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  {language === 'hi' ? 'कोई नौकरी आवेदन दर्ज नहीं है' : 'No Job Applications Yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'अपनी प्रोफ़ाइल और कौशल के अनुसार सत्यापित सरकारी और निजी नौकरी के अवसरों का अन्वेषण करें।'
                    : 'Explore verified livelihood opportunities matched to your skill profile.'}
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  <span>{language === 'hi' ? 'नौकरियां खोजें' : 'Browse Verified Jobs'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Course Enrollments & RPL */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/50 transition duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{item.course_name}</h3>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span>{item.training_provider}</span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400">NSQF Level {item.nsqf_level}</span>
                      <span>•</span>
                      <span>{item.duration}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.stipend_info || '100% Free under PM-AJAY GIA'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.enrollment_url && (
                      <a
                        href={item.enrollment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
                      >
                        <span>{language === 'hi' ? 'स्किल इंडिया पोर्टल' : 'Skill India Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  {language === 'hi' ? 'कोई कोर्स नामांकन नहीं है' : 'No Active Course Enrollments'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'PM-AJAY GIA घटक के तहत 100% सरकारी अनुदानित कौशल और RPL प्रमाणन कोर्स में नामांकन करें।'
                    : 'Enroll in 100% government-funded NSQF skill courses and RPL pathways.'}
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  <span>{language === 'hi' ? 'कोर्स देखें' : 'Explore Subsidized Courses'}</span>
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

export default ApplicationsPage;

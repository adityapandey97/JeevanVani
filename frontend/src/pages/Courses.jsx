import React, { useState, useEffect } from 'react';
import { GraduationCap, Clock, Award, ShieldCheck, ExternalLink, Search, Sparkles, Check, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import ExplainModal from '../components/common/ExplainModal';

export function Courses() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [rplOnly, setRplOnly] = useState(false);
  const [selectedCourseForExplain, setSelectedCourseForExplain] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState({});

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        if (user) {
          const res = await courseService.getRecommendedCourses(12);
          if (res.success) {
            setCourses(res.courses || []);
          }
        } else {
          const res = await courseService.getCourses();
          if (res.success) {
            setCourses(res.courses || []);
          }
        }
      } catch (err) {
        console.error('Failed to load NSQF courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [user, language]);

  const handleEnroll = async (course) => {
    if (!user) {
      window.open(course.enrollment_url || 'https://www.skillindiadigital.gov.in/courses', '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      await courseService.enrollCourse(course.id, course.rpl_recommended ? 'RPL Fast-Track' : 'Fresh Training');
      setEnrolledCourses(prev => ({ ...prev, [course.id]: true }));
      if (course.enrollment_url) {
        window.open(course.enrollment_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setEnrolledCourses(prev => ({ ...prev, [course.id]: true }));
      if (course.enrollment_url) {
        window.open(course.enrollment_url, '_blank', 'noopener,noreferrer');
      }
    }
  };


  const filteredCourses = courses.filter(c => {
    if (selectedLevel && Number(c.nsqf_level) !== Number(selectedLevel)) return false;
    if (rplOnly && !c.rpl_available) return false;
    if (search) {
      const q = search.toLowerCase();
      const nameMatch = (c.course_name || '').toLowerCase().includes(q);
      const provMatch = (c.training_provider || '').toLowerCase().includes(q);
      if (!nameMatch && !provMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-forest-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-forest-800/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-forest-500/20 text-emerald-300 border border-emerald-400/30 tracking-wider">
              {t('courses.badge', 'National Skills Qualification Framework (NSQF)')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              100% Free under PM-AJAY GIA
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('courses.title', 'Courses & Skilling Pathways')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t('courses.subtitle', 'Government-certified training courses aligned with official NCVET qualification packs. Includes both comprehensive foundational training and Recognition of Prior Learning (RPL) fast-track certification for experienced artisans.')}
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
              placeholder={t('courses.searchPlaceholder', 'Search courses, qualifications, or providers...')}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="">{t('courses.allLevels', 'All NSQF Levels')}</option>
              <option value="3">NSQF Level 3 (Foundational)</option>
              <option value="4">NSQF Level 4 (Technician)</option>
              <option value="5">NSQF Level 5 (Specialist)</option>
            </select>

            <button
              type="button"
              onClick={() => setRplOnly(!rplOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                rplOnly
                  ? 'bg-forest-600 text-white border-forest-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t('courses.rplOnly', 'RPL Fast-Track Available')}</span>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {t('courses.empty', 'No matching NSQF skilling courses found for this category.')}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया अन्य फिल्टर चुनें या सभी स्तर देखें।'
                : 'Try adjusting your search criteria or explore other qualification levels.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const isEnrolled = Boolean(enrolledCourses[course.id]);
              const skills = Array.isArray(course.skills_covered) ? course.skills_covered : [];

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Level & QP Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-emerald-300 border border-forest-300">
                        NSQF Level {course.nsqf_level}
                      </span>
                      {course.qualification_pack_id && (
                        <span className="text-[10px] font-semibold text-slate-500 font-mono">
                          QP: {course.qualification_pack_id}
                        </span>
                      )}
                    </div>

                    {/* Course Name & Provider */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2">
                        {course.course_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 shrink-0 text-forest-600" />
                        <span className="truncate">{course.training_provider}</span>
                      </p>
                    </div>

                    {/* Duration & Mode */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                        <span>{course.duration}</span>
                        <span className="text-slate-400">•</span>
                        <span>{course.mode || 'Hands-on'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold">{t('courses.eligibility', 'Eligibility')}:</span> {course.eligibility}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold">Certifying Body:</span> {course.certification_body || 'NCVET / NSDC'}
                      </div>
                    </div>

                    {/* RPL Highlight Badge */}
                    {course.rpl_available && (
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-300 font-medium flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{t('courses.rplOption', 'RPL Fast-Track: Orientation + ₹500 Stipend')}</span>
                      </div>
                    )}

                    {/* Skills Covered Chips */}
                    {skills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {t('courses.skillsCovered', 'Skills Covered')}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {sk}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                              +{skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stipend / Free Tag */}
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{course.stipend_info}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForExplain(course)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                      <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEnroll(course)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                        isEnrolled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-forest-600 hover:bg-forest-700 text-white'
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('courses.enrolled', 'Enrolled')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('courses.enrollBtn', 'Enroll / Apply')}</span>
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
          isOpen={Boolean(selectedCourseForExplain)}
          onClose={() => setSelectedCourseForExplain(null)}
          recommendation={selectedCourseForExplain}
          type="course"
        />
      </div>
    </div>
  );
}

export default Courses;

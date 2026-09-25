import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Award,
  Plus,
  Trash2,
  Save,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function ProfilePage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    education: '',
    employment_status: '',
    work_experience: '',
    preferred_location: '',
    willing_to_relocate: false,
    employment_preference: 'Both',
    preferred_sector: '',
    training_preference: '',
    constraints: '',
    career_goal: ''
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      if (res.data?.success) {
        const p = res.data.profile || {};
        const u = res.data.user || {};
        setProfileData(p);
        setSkills(res.data.skills || []);
        setInterests(res.data.interests || []);

        setFormData({
          name: u.name || '',
          mobile: u.mobile || '',
          age: p.age || '',
          education: p.education || '',
          employment_status: p.employment_status || '',
          work_experience: p.work_experience || '',
          preferred_location: p.preferred_location || '',
          willing_to_relocate: Boolean(p.willing_to_relocate),
          employment_preference: p.employment_preference || 'Both',
          preferred_sector: p.preferred_sector || '',
          training_preference: p.training_preference || '',
          constraints: p.constraints || '',
          career_goal: p.career_goal || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await api.put('/profile', {
        ...formData,
        skills,
        interests
      });

      if (res.data?.success) {
        setFeedbackMsg({ type: 'success', text: language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!' });
        setIsEditing(false);
        fetchProfile();
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: language === 'hi' ? 'प्रोफ़ाइल अपडेट करने में त्रुटि हुई।' : 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    const clean = newSkillInput.trim();
    if (!clean) return;
    if (!skills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === clean.toLowerCase())) {
      setSkills(prev => [...prev, { name: clean, category: 'General', proficiency_level: 'Intermediate' }]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillIndex) => {
    setSkills(prev => prev.filter((_, idx) => idx !== skillIndex));
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completion = profileData?.profile_completion || 75;
  const isComplete = completion >= 85;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with Completeness & Actions */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{user?.name || 'Beneficiary Profile'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PM-AJAY GIA
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1 flex items-center gap-2">
                <span>{formData.mobile ? `+91 ${formData.mobile}` : user?.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सत्यापित SC लाभार्थी' : 'Verified Beneficiary'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Visual Completeness Gauge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <div className="text-right">
                <p className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                  {language === 'hi' ? 'प्रोफ़ाइल पूर्णता' : 'Completeness'}
                </p>
                <p className="text-xl font-black text-amber-400">{completion}%</p>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-amber-400/40 border-t-amber-400 flex items-center justify-center text-xs font-bold">
                {completion >= 85 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : `${completion}%`}
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? (language === 'hi' ? 'रद्द करें' : 'Cancel') : (language === 'hi' ? 'संशोधन करें' : 'Edit Profile')}</span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Missing Information Alert Banner (Section 6) */}
        {!isComplete && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  {language === 'hi' ? 'कुछ विवरण अभी अपूर्ण हैं' : 'Profile Information Incomplete'}
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                  {language === 'hi'
                    ? 'सर्वोत्तम सरकारी छात्रवृत्ति, टूल-किट सब्सिडी और NSQF कोर्स अनुशंसाओं के लिए अपना प्रोफ़ाइल पूरा करें।'
                    : 'Complete your profile to unlock 100% subsidized PM-AJAY GIA training and tool-kit grant matching.'}
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition"
            >
              <span>{language === 'hi' ? 'वॉइस द्वारा पूरा करें' : 'Complete with Voice'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Core Attributes with AI Confidence */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'hi' ? 'शैक्षणिक व आजीविका गुण' : 'Livelihood & Skilling Attributes'}</span>
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>AI Confidence: 92%</span>
                </span>
              </h2>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'आयु (वर्ष)' : 'Age (Years)'}
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'शैक्षणिक योग्यता' : 'Highest Education'}
                      </label>
                      <select
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="">{language === 'hi' ? '-- चयन करें --' : '-- Select --'}</option>
                        <option value="Below 5th Pass">Below 5th Pass</option>
                        <option value="5th Pass">5th Pass</option>
                        <option value="8th Pass">8th Pass</option>
                        <option value="10th Pass">10th Pass</option>
                        <option value="12th Pass">12th Pass</option>
                        <option value="ITI">ITI</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'वर्तमान रोजगार स्थिति' : 'Employment Status'}
                      </label>
                      <select
                        value={formData.employment_status}
                        onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="Unemployed">Currently Unemployed</option>
                        <option value="Employed (Informal/Daily Wage)">Daily Wage / Helper</option>
                        <option value="Self-Employed">Self-Employed / Small Business</option>
                        <option value="Student">Student</option>
                        <option value="Employed (Full-Time)">Full-Time Salaried</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'पसंदीदा जिला / स्थान' : 'Preferred Location / District'}
                      </label>
                      <input
                        type="text"
                        value={formData.preferred_location}
                        onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'कार्य प्राथमिकता' : 'Career Preference'}
                      </label>
                      <select
                        value={formData.employment_preference}
                        onChange={(e) => setFormData({ ...formData, employment_preference: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="Both">Both (Job & Self-Employment)</option>
                        <option value="Job">Salaried Job in Industry</option>
                        <option value="Self-employment">Self-Employment / Micro-Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'पूर्व कार्य अनुभव' : 'Prior Work Experience'}
                    </label>
                    <textarea
                      value={formData.work_experience}
                      onChange={(e) => setFormData({ ...formData, work_experience: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="relocateCheck"
                      checked={formData.willing_to_relocate}
                      onChange={(e) => setFormData({ ...formData, willing_to_relocate: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="relocateCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? 'उच्च वेतन के लिए दूसरे जिले जाने को तैयार हैं' : 'Willing to travel/relocate to other districts for higher placement'}
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? (language === 'hi' ? 'सुरक्षित हो रहा है...' : 'Saving...') : (language === 'hi' ? 'सुरक्षित करें' : 'Save Changes')}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-semibold">{language === 'hi' ? 'शैक्षणिक स्तर' : 'Education'}</p>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-1">
                      {formData.education || (language === 'hi' ? 'दर्ज नहीं' : 'Not Provided')}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Verified NSQF Tier
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-semibold">{language === 'hi' ? 'रोजगार स्थिति' : 'Employment Status'}</p>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-1">
                      {formData.employment_status || (language === 'hi' ? 'दर्ज नहीं' : 'Not Provided')}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      GIA Target Priority
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-semibold">{language === 'hi' ? 'पसंदीदा स्थान' : 'Preferred Location'}</p>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-1">
                      {formData.preferred_location || (language === 'hi' ? 'गृह जिला' : 'Home District')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formData.willing_to_relocate ? (language === 'hi' ? 'स्थानांतरण के लिए तैयार' : 'Mobility: Relocate Anywhere') : (language === 'hi' ? 'केवल स्थानीय' : 'Mobility: Local District Only')}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-semibold">{language === 'hi' ? 'करियर प्राथमिकता' : 'Career Preference'}</p>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-1">
                      {formData.employment_preference}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Job & Enterprise Linked
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-semibold">{language === 'hi' ? 'कार्य अनुभव विवरण' : 'Work Experience Background'}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {formData.work_experience || (language === 'hi' ? 'कोई औपचारिक अनुभव नहीं (फ्रेशर)' : 'No prior experience reported')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Skills & Interests Management */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'hi' ? 'सत्यापित कौशल' : 'Recorded Skills'} ({skills.length})</span>
                </span>
              </h2>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder={language === 'hi' ? 'नया कौशल जोड़ें...' : 'Add a skill...'}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.length > 0 ? (
                  skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-200/70 dark:border-slate-700 group"
                    >
                      <span>{typeof s === 'string' ? s : s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {language === 'hi' ? 'कोई कौशल दर्ज नहीं है। ऊपर जोड़ें।' : 'No skills recorded yet. Add above.'}
                  </p>
                )}
              </div>
            </div>

            {/* Linkage to Voice Assessment */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? 'पुनः वॉइस मूल्यांकन' : 'Re-run Voice Assessment'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी प्रोफ़ाइल जानकारी को बोलकर अपडेट करने या नए कौशल जोड़ने के लिए वॉइस सहायक से बात करें।'
                  : 'Update your livelihood mapping by answering 15 voice-first conversational questions in Hindi or English.'}
              </p>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
              >
                <span>{language === 'hi' ? 'वॉइस ऑनबोर्डिंग शुरू करें' : 'Start Voice Onboarding'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

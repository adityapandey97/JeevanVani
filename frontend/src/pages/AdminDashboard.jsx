import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import recommendationService from '../services/recommendationService';
import MetricCard from '../components/Dashboard/MetricCard';
import {
  ShieldCheck,
  Users,
  Award,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  PieChart,
  BarChart2,
  Briefcase,
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CheckSquare,
  FileText,
  ExternalLink,
  Check
} from 'lucide-react';

export function AdminDashboard() {
  const { user: _user } = useAuth();
  const { language: _language } = useLanguage();

  // Active Tab: 'overview' | 'beneficiaries' | 'jobRoles' | 'jobs' | 'courses' | 'skills' | 'reviews' | 'knowledge'
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [knowledgeList, setKnowledgeList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');


  // Review modal / action state
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewAction, setReviewAction] = useState('approved');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [isProcessingReview, setIsProcessingReview] = useState(false);

  // Modal states for creating/editing job roles
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    role_name: '',
    sector: '',
    nsqf_level: 4,
    description: '',
    required_education: '10th Pass',
    training_duration: '350 Hours (approx. 3 months)',
    career_path: JSON.stringify([
      { title: 'Trainee', experience: '0 months', wage_range: '₹10,000/mo' },
      { title: 'Technician', experience: '1 year', wage_range: '₹16,000/mo' },
      { title: 'Supervisor / Entrepreneur', experience: '3+ years', wage_range: '₹35,000+/mo' }
    ], null, 2)
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, rolesRes, usersRes, skillsRes, jobsRes, coursesRes, reviewsRes, knowRes] = await Promise.all([
        recommendationService.getAdminDashboard().catch(() => ({ success: false })),
        recommendationService.getAdminJobRoles().catch(() => ({ success: false })),
        recommendationService.getAdminUsers().catch(() => ({ success: false })),
        recommendationService.getAdminSkills().catch(() => ({ success: false })),
        recommendationService.getAdminJobs().catch(() => ({ success: false })),
        recommendationService.getAdminCourses().catch(() => ({ success: false })),
        recommendationService.getAdminHumanReviews().catch(() => ({ success: false })),
        recommendationService.getAdminKnowledge().catch(() => ({ success: false })),
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (rolesRes.success) setJobRoles(rolesRes.jobRoles || []);
      if (usersRes.success) setUsersList(usersRes.users || []);
      if (skillsRes.success) setSkillsList(skillsRes.skills || []);
      if (jobsRes.success) setJobsList(jobsRes.jobs || []);
      if (coursesRes.success) setCoursesList(coursesRes.courses || []);
      if (reviewsRes.success) setReviewsList(reviewsRes.reviews || []);
      if (knowRes.success) setKnowledgeList(knowRes.docs || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleForm({
      role_name: '',
      sector: '',
      nsqf_level: 4,
      description: '',
      required_education: '10th Pass',
      training_duration: '350 Hours (approx. 3 months)',
      career_path: JSON.stringify([
        { title: 'Trainee', experience: '0 months', wage_range: '₹10,000/mo' },
        { title: 'Technician', experience: '1 year', wage_range: '₹16,000/mo' },
        { title: 'Supervisor / Entrepreneur', experience: '3+ years', wage_range: '₹35,000+/mo' }
      ], null, 2)
    });
    setShowRoleModal(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleForm({
      role_name: role.role_name,
      sector: role.sector,
      nsqf_level: role.nsqf_level,
      description: role.description,
      required_education: role.required_education,
      training_duration: role.training_duration,
      career_path: typeof role.career_path === 'string'
        ? role.career_path
        : JSON.stringify(role.career_path, null, 2)
    });
    setShowRoleModal(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await recommendationService.updateAdminJobRole(editingRole.id, roleForm);
        setFeedbackMsg('NSQF Job Role updated successfully.');
      } else {
        await recommendationService.createAdminJobRole(roleForm);
        setFeedbackMsg('New NSQF Job Role added successfully.');
      }
      setShowRoleModal(false);
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save role:', err);
      alert(err.response?.data?.message || 'Error saving job role.');
    }
  };

  const handleDeleteRole = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the NSQF catalog?`)) {
      try {
        await recommendationService.deleteAdminJobRole(id);
        setFeedbackMsg(`Role "${name}" deleted.`);
        fetchData();
        setTimeout(() => setFeedbackMsg(''), 4000);
      } catch (err) {
        console.error('Failed to delete role:', err);
        alert('Failed to delete job role.');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;
    setIsProcessingReview(true);
    try {
      await recommendationService.updateAdminHumanReview(selectedReview.id, {
        status: reviewAction,
        reviewerNotes: reviewerNotes || `Actioned as ${reviewAction} by State Admin Officer`,
      });
      setFeedbackMsg(`Review decision recorded: recommendation ${reviewAction}.`);
      setSelectedReview(null);
      setReviewerNotes('');
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to record review decision.');
    } finally {
      setIsProcessingReview(false);
    }
  };

  const pendingReviewsCount = reviewsList.filter((r) => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading PM-AJAY GIA State Admin Desk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-800/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  PM-AJAY GIA State Desk & Governance Portal
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Live MoSJE Dashboard
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1">
                Livelihood Mapping Monitoring, NSQF Catalog Governance, Grounded RAG Knowledge & Human-in-the-Loop Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add NSQF Job Role</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'beneficiaries'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Beneficiaries ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobRoles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'jobRoles'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>NSQF Catalog ({jobRoles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>NCS & PM-AJAY Jobs ({jobsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Skill India Courses ({coursesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skills Catalog ({skillsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
              activeTab === 'reviews'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Human Review Queue</span>
            {pendingReviewsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                {pendingReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'knowledge'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>RAG Knowledge Base ({knowledgeList.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-fadeIn">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Beneficiaries"
                value={stats.totalBeneficiaries}
                subtitle="Registered SC Candidates"
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Completed Assessments"
                value={stats.totalAssessments}
                subtitle="14-Question Voice Sessions"
                icon={Award}
                color="emerald"
              />
              <MetricCard
                title="Recommendations Generated"
                value={stats.totalRecommendations}
                subtitle="6-Factor Scored Matches"
                icon={TrendingUp}
                color="amber"
              />
              <MetricCard
                title="Human Review Items"
                value={pendingReviewsCount}
                subtitle="Low-Confidence (<65%) Queued"
                icon={AlertCircle}
                color="purple"
              />
            </div>

            {/* Analytics Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Popular Sectors Distribution */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-600" />
                  <span>Most Recommended Sectors</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {stats.popularSectors.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{sec.sector}</span>
                        <span className="text-slate-500 dark:text-slate-400">{sec.count} recommendations</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (sec.count / Math.max(1, stats.totalRecommendations)) * 100 * 3)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Distribution */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  <span>Beneficiary Education Distribution</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {stats.educationDistribution.map((edu, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{edu.education_level}</span>
                        <span className="text-slate-500 dark:text-slate-400">{edu.count} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (edu.count / Math.max(1, stats.totalBeneficiaries)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job vs Self-Employment Preference */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span>Employment Preference Distribution</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  {stats.employmentPreferences.map((pref, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{pref.count}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{pref.preference}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recommended Roles */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Top Recommended Job Roles</span>
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.topRecommendedRoles.map((role, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{role.role_name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{role.sector}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Avg {role.avg_score}%
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{role.recommendation_count} times</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BENEFICIARIES REGISTRY */}
        {activeTab === 'beneficiaries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Beneficiaries Enrollment Registry</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official registry of candidates mapped under PM-AJAY GIA.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3.5">Candidate Name</th>
                      <th className="px-5 py-3.5">Contact Details</th>
                      <th className="px-5 py-3.5">Education</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Profile Completion</th>
                      <th className="px-5 py-3.5">Recommendations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                          <span className="block text-[11px] text-slate-400 capitalize">
                            {u.preferred_language === 'hi' ? 'Hindi Voice Preferred' : 'English Voice Preferred'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{u.mobile}</span>
                          <span className="block text-[11px] text-slate-400">{u.email}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{u.education || 'Not Specified'}</td>
                        <td className="px-5 py-3.5">{u.preferred_location || 'Not Specified'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{u.profile_completion || 0}%</span>
                            <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${u.profile_completion || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                            {u.recommendations_count || 0} pathways
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NSQF JOB ROLE MANAGEMENT */}
        {activeTab === 'jobRoles' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">National Skills Qualification Framework (NSQF) Catalog</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add, edit, or govern qualification packs and skilling curricula.</p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Job Role</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3.5">Role Name</th>
                      <th className="px-5 py-3.5">Sector</th>
                      <th className="px-5 py-3.5">NSQF Level</th>
                      <th className="px-5 py-3.5">Min Education</th>
                      <th className="px-5 py-3.5">Training Duration</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {jobRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          {role.role_name}
                        </td>
                        <td className="px-5 py-3.5">{role.sector}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                            Level {role.nsqf_level}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{role.required_education}</td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{role.training_duration}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(role)}
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition"
                              title="Edit Role"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id, role.role_name)}
                              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 transition"
                              title="Delete Role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VERIFIED NCS & PM-AJAY JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Verified NCS & PM-AJAY Livelihood Opportunities
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grounded vacancies linked directly to the National Career Service (ncs.gov.in) with zero fabricated postings.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3.5">Job Title & Employer</th>
                      <th className="px-5 py-3.5">Sector & NSQF</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Monthly Wage</th>
                      <th className="px-5 py-3.5">Portal Verification</th>
                      <th className="px-5 py-3.5 text-right">Official Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {jobsList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-900 dark:text-white">{j.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{j.company}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{j.sector}</span>
                          <span className="block text-[10px] text-slate-400">Level {j.nsqf_level}</span>
                        </td>
                        <td className="px-5 py-3.5">{j.location}</td>
                        <td className="px-5 py-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                          {j.salary_range}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{j.source} ({j.source_job_id})</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <a
                            href={j.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
                          >
                            <span>View NCS</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NSQF COURSES (SKILL INDIA DIGITAL) */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                NSQF-Aligned Skilling Courses (Skill India Digital)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% government-subsidized courses under PM-AJAY GIA with verified Skill India Digital registration links.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coursesList.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Level {c.nsqf_level}
                      </span>
                      {c.is_rpl_eligible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          RPL Fast-Track
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sector: <span className="font-medium text-slate-700 dark:text-slate-300">{c.sector}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Duration: {c.duration_hours}h</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {c.stipend_amount ? `₹${c.stipend_amount}/mo Stipend` : '100% Free'}
                      </span>
                    </div>
                    <a
                      href={c.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                    >
                      <span>Open Skill India Digital</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SKILLS CATALOG */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Official Skills Master Catalog</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Categorized competency skills used in deterministic 6-factor job matching.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3.5">Skill Name</th>
                      <th className="px-5 py-3.5">Sector</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">NSQF Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {skillsList.map((sk) => (
                      <tr key={sk.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{sk.name}</td>
                        <td className="px-5 py-3.5">{sk.sector}</td>
                        <td className="px-5 py-3.5 font-medium">{sk.category}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            Level {sk.nsqf_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HUMAN REVIEW QUEUE */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-600" />
                  <span>Human-in-the-Loop Review Queue</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Low-confidence recommendations (&lt; 65% match) auto-flagged for human counselor review and certification under GIA guidelines.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                {reviewsList.length} Total In Queue ({pendingReviewsCount} Pending)
              </span>
            </div>

            {reviewsList.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Review Queue Is Empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All beneficiary recommendations meet high algorithmic confidence thresholds (&gt;65%).
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-5 py-3.5">Beneficiary</th>
                        <th className="px-5 py-3.5">Education & Sector</th>
                        <th className="px-5 py-3.5">Match Score</th>
                        <th className="px-5 py-3.5">Reason Flagged</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {reviewsList.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 dark:text-white">{rev.user_name || `Beneficiary #${rev.user_id}`}</p>
                            <p className="text-[11px] text-slate-400">{rev.user_mobile || rev.user_email}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{rev.education || 'Not Specified'}</p>
                            <p className="text-[11px] text-slate-500">{rev.preferred_sector || 'General'}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              {rev.confidence_score}%
                            </span>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs text-slate-700 dark:text-slate-300">
                            {rev.reason}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                rev.status === 'pending'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                  : rev.status === 'approved'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {rev.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {rev.status === 'pending' ? (
                              <button
                                onClick={() => setSelectedReview(rev)}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
                              >
                                Review Now
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: RAG KNOWLEDGE BASE & SCHEME DOCUMENTS */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grounded RAG Knowledge Base</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative scheme documents and ministry guidelines used by the LLM reasoning pipeline to eliminate hallucinations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {knowledgeList.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {doc.category || 'PM-AJAY GIA'}
                    </span>
                    <a
                      href={doc.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{doc.source}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {doc.content}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1 text-[10px]">
                    {(doc.keywords || '').split(',').map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        #{kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: HUMAN REVIEW DECISION MODAL */}
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-600" />
                  <span>State Officer Review Decision</span>
                </h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-slate-900 dark:text-white">Beneficiary:</strong>{' '}
                  {selectedReview.user_name || `#${selectedReview.user_id}`}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Flagged Reason:</strong>{' '}
                  {selectedReview.reason}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Score:</strong>{' '}
                  <span className="font-bold text-amber-600">{selectedReview.confidence_score}%</span>
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Decision Action
                  </label>
                  <select
                    value={reviewAction}
                    onChange={(e) => setReviewAction(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="approved">Approve Recommendation (Affirm Suitability)</option>
                    <option value="modified">Modify & Approve (Adjusted with Field Counselor Guidance)</option>
                    <option value="rejected">Reject (Re-assign to Alternative NSQF Role)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Reviewer Notes / Counseling Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="e.g. Beneficiary has strong manual aptitude; subsidized electrical batch recommended at district center."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingReview}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md disabled:opacity-50"
                  >
                    {isProcessingReview ? 'Submitting...' : 'Confirm Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT NSQF JOB ROLE */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingRole ? 'Edit NSQF Job Role' : 'Add New NSQF Job Role'}
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={roleForm.role_name}
                      onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                      placeholder="e.g. Solar PV Installation Technician"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider mb-1">Sector</label>
                    <input
                      type="text"
                      required
                      value={roleForm.sector}
                      onChange={(e) => setRoleForm({ ...roleForm, sector: e.target.value })}
                      placeholder="e.g. Green Jobs / Solar Energy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider mb-1">NSQF Level</label>
                    <select
                      value={roleForm.nsqf_level}
                      onChange={(e) => setRoleForm({ ...roleForm, nsqf_level: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value={3}>NSQF Level 3</option>
                      <option value={4}>NSQF Level 4</option>
                      <option value={5}>NSQF Level 5</option>
                      <option value={6}>NSQF Level 6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider mb-1">Required Education</label>
                    <input
                      type="text"
                      required
                      value={roleForm.required_education}
                      onChange={(e) => setRoleForm({ ...roleForm, required_education: e.target.value })}
                      placeholder="e.g. 10th Pass"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider mb-1">Training Duration</label>
                    <input
                      type="text"
                      required
                      value={roleForm.training_duration}
                      onChange={(e) => setRoleForm({ ...roleForm, training_duration: e.target.value })}
                      placeholder="e.g. 350 Hours"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1">Role Description</label>
                  <textarea
                    rows={3}
                    required
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Provide overview of duties and industry context..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1">
                    Career Progression Path (JSON format)
                  </label>
                  <textarea
                    rows={5}
                    value={roleForm.career_path}
                    onChange={(e) => setRoleForm({ ...roleForm, career_path: e.target.value })}
                    placeholder='[{"title":"Trainee","experience":"0m","wage_range":"₹10,000/mo"}]'
                    className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow"
                  >
                    {editingRole ? 'Save Changes' : 'Create NSQF Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;


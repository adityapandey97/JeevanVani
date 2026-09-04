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
  AlertCircle
} from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobRoles' | 'beneficiaries'
  const [stats, setStats] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

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
    try {
      const [dashRes, rolesRes, usersRes] = await Promise.all([
        recommendationService.getAdminDashboard(),
        recommendationService.getAdminJobRoles(),
        recommendationService.getAdminUsers(),
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (rolesRes.success) setJobRoles(rolesRes.jobRoles);
      if (usersRes.success) setUsersList(usersRes.users);
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

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 dark:from-purple-950 dark:via-slate-950 dark:to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-800/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">PM-AJAY GIA State Admin Portal</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  National / State Desk
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-1">
                Livelihood Mapping Monitoring, NSQF Catalog Governance & Beneficiary Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add NSQF Job Role</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-purple-900 dark:bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('jobRoles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'jobRoles'
                ? 'bg-purple-900 dark:bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>NSQF Job Roles Catalog ({jobRoles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'beneficiaries'
                ? 'bg-purple-900 dark:bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Beneficiaries Registry ({usersList.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
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
                subtitle="Conversational AI Sessions"
                icon={Award}
                color="emerald"
              />
              <MetricCard
                title="Recommendations Generated"
                value={stats.totalRecommendations}
                subtitle="5-Factor Scored Matches"
                icon={TrendingUp}
                color="amber"
              />
              <MetricCard
                title="Active NSQF Catalog Roles"
                value={stats.totalJobRoles}
                subtitle="10+ Skill Sectors"
                icon={Layers}
                color="purple"
              />
            </div>

            {/* Analytics Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Popular Sectors Distribution */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <span>Most Recommended Sectors</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {stats.popularSectors.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{sec.sector}</span>
                        <span className="text-slate-500">{sec.count} recommendations</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (sec.count / Math.max(1, stats.totalRecommendations)) * 100 * 3)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Distribution */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-600" />
                  <span>Beneficiary Education Distribution</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {stats.educationDistribution.map((edu, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{edu.education_level}</span>
                        <span className="text-slate-500">{edu.count} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (edu.count / Math.max(1, stats.totalBeneficiaries)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job vs Self-Employment Preference */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Employment Preference Distribution</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  {stats.employmentPreferences.map((pref, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <p className="text-2xl font-black text-slate-900">{pref.count}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-1">{pref.preference}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recommended Roles */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Top Recommended Job Roles</span>
                </h3>
                <div className="divide-y divide-slate-100">
                  {stats.topRecommendedRoles.map((role, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{role.role_name}</p>
                        <p className="text-slate-500 text-[11px]">{role.sector}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
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

        {/* TAB 2: NSQF JOB ROLE MANAGEMENT */}
        {activeTab === 'jobRoles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">National Skills Qualification Framework (NSQF) Catalog</h2>
                <p className="text-xs text-slate-500">Add, edit, or delete official qualification packs and skilling curricula.</p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Job Role</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Role Name</th>
                      <th className="px-5 py-3.5">Sector</th>
                      <th className="px-5 py-3.5">NSQF Level</th>
                      <th className="px-5 py-3.5">Min Education</th>
                      <th className="px-5 py-3.5">Training Duration</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {role.role_name}
                        </td>
                        <td className="px-5 py-3.5">{role.sector}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                            Level {role.nsqf_level}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{role.required_education}</td>
                        <td className="px-5 py-3.5 text-slate-500">{role.training_duration}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(role)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-purple-600 transition"
                              title="Edit Role"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id, role.role_name)}
                              className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
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

        {/* TAB 3: BENEFICIARY REGISTRY */}
        {activeTab === 'beneficiaries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Beneficiaries Enrollment Registry</h2>
              <p className="text-xs text-slate-500">Live registry of candidates registered under PM-AJAY GIA.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Candidate Name</th>
                      <th className="px-5 py-3.5">Contact</th>
                      <th className="px-5 py-3.5">Education</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Profile Completion</th>
                      <th className="px-5 py-3.5">Recommendations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900">{u.name}</span>
                          <span className="block text-[11px] text-slate-400 capitalize">{u.preferred_language === 'hi' ? 'Hindi Voice' : 'English Voice'}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-slate-800">{u.mobile}</span>
                          <span className="block text-[11px] text-slate-400">{u.email}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{u.education || 'Not Specified'}</td>
                        <td className="px-5 py-3.5">{u.preferred_location || 'Not Specified'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">{u.profile_completion || 0}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${u.profile_completion || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
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

        {/* MODAL: ADD / EDIT NSQF JOB ROLE */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingRole ? 'Edit NSQF Job Role' : 'Add New NSQF Job Role'}
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-4 text-xs font-medium text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={roleForm.role_name}
                      onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                      placeholder="e.g. Assistant Electrician"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider mb-1">Sector</label>
                    <input
                      type="text"
                      required
                      value={roleForm.sector}
                      onChange={(e) => setRoleForm({ ...roleForm, sector: e.target.value })}
                      placeholder="e.g. Electrical & Power"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider mb-1">NSQF Level</label>
                    <select
                      value={roleForm.nsqf_level}
                      onChange={(e) => setRoleForm({ ...roleForm, nsqf_level: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none bg-white"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
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
                    className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none bg-slate-50"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow"
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

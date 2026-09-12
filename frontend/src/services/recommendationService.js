import api from './api';

export const recommendationService = {
  async generateRecommendations() {
    const res = await api.post('/recommendations/generate');
    return res.data;
  },

  async getRecommendations() {
    const res = await api.get('/recommendations');
    return res.data;
  },

  async getRecommendationById(id) {
    const res = await api.get(`/recommendations/${id}`);
    return res.data;
  },

  async getJobRoles(params = {}) {
    const res = await api.get('/job-roles', { params });
    return res.data;
  },

  async getJobRoleById(id) {
    const res = await api.get(`/job-roles/${id}`);
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/profile', profileData);
    return res.data;
  },

  async getProfileSkills() {
    const res = await api.get('/profile/skills');
    return res.data;
  },

  // Admin APIs
  async getAdminDashboard() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getAdminUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },

  async getAdminJobRoles() {
    const res = await api.get('/admin/job-roles');
    return res.data;
  },

  async createAdminJobRole(roleData) {
    const res = await api.post('/admin/job-roles', roleData);
    return res.data;
  },

  async updateAdminJobRole(id, roleData) {
    const res = await api.put(`/admin/job-roles/${id}`, roleData);
    return res.data;
  },

  async deleteAdminJobRole(id) {
    const res = await api.delete(`/admin/job-roles/${id}`);
    return res.data;
  },

  async getAdminSkills() {
    const res = await api.get('/admin/skills');
    return res.data;
  },

  async getAdminJobs() {
    const res = await api.get('/admin/jobs');
    return res.data;
  },

  async getAdminCourses() {
    const res = await api.get('/admin/courses');
    return res.data;
  },

  async getAdminKnowledge() {
    const res = await api.get('/admin/knowledge');
    return res.data;
  },

  async getAdminHumanReviews() {
    const res = await api.get('/admin/human-reviews');
    return res.data;
  },

  async updateAdminHumanReview(id, reviewData) {
    const res = await api.put(`/admin/human-reviews/${id}`, reviewData);
    return res.data;
  },
};

export default recommendationService;


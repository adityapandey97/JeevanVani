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
  }
};

export default recommendationService;

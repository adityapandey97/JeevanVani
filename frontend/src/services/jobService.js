import api from './api';

export const jobService = {
  async getJobs(params = {}) {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  async getRecommendedJobs(limit = 6) {
    const res = await api.get('/jobs/recommended', { params: { limit } });
    return res.data;
  },

  async getJobById(id) {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  async applyToJob(id, notes = '') {
    const res = await api.post(`/jobs/${id}/apply`, { notes });
    return res.data;
  }
};

export default jobService;

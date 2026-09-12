import api from './api';

export const feedbackService = {
  async submitFeedback(data) {
    const res = await api.post('/feedback', data);
    return res.data;
  },

  async getExplanation(recommendationId) {
    const res = await api.get(`/feedback/explain/${recommendationId}`);
    return res.data;
  },

  async getHumanReviewQueue() {
    const res = await api.get('/feedback/human-review');
    return res.data;
  },

  async updateHumanReview(id, status, reviewerNotes = '') {
    const res = await api.put(`/feedback/human-review/${id}`, { status, reviewerNotes });
    return res.data;
  }
};

export default feedbackService;

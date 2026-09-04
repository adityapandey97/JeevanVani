import api from './api';

export const assessmentService = {
  async startAssessment(restart = false, language = 'hi') {
    const res = await api.post('/assessment/start', { restart, language });
    return res.data;
  },

  async submitAnswer(questionIndex, answerText, audioBlob = null, language = 'hi') {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('questionIndex', questionIndex);
      formData.append('answerText', answerText || '');
      formData.append('language', language);
      formData.append('audio', audioBlob, 'response.webm');

      const res = await api.post('/assessment/answer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }

    const res = await api.post('/assessment/answer', {
      questionIndex,
      answerText,
      language
    });
    return res.data;
  },

  async getStatus() {
    const res = await api.get('/assessment/status');
    return res.data;
  },

  async completeAssessment() {
    const res = await api.post('/assessment/complete');
    return res.data;
  }
};

export default assessmentService;

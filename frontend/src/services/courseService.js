import api from './api';

export const courseService = {
  async getCourses(params = {}) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  async getRecommendedCourses(limit = 6) {
    const res = await api.get('/courses/recommended', { params: { limit } });
    return res.data;
  },

  async getCourseById(id) {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  async enrollCourse(id, enrollmentType = 'Fresh Training') {
    const res = await api.post(`/courses/${id}/enroll`, { enrollmentType });
    return res.data;
  }
};

export default courseService;

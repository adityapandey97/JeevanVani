import api from './api';

export const roadmapService = {
  async getRoadmap() {
    const res = await api.get('/roadmap');
    return res.data;
  },

  async getCareerRoadmap() {
    const res = await api.get('/roadmap');
    return res.data;
  },

  async getSkillGaps(roleId = null) {
    const res = await api.get('/roadmap/gaps', { params: roleId ? { roleId } : {} });
    return res.data;
  }
};

export default roadmapService;

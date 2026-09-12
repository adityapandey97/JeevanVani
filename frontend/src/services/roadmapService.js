import api from './api';

export const roadmapService = {
  async getRoadmap() {
    const res = await api.get('/training/roadmap');
    return res.data;
  },

  async getSkillGaps(roleId = null) {
    const res = await api.get('/skills/gaps', { params: roleId ? { roleId } : {} });
    return res.data;
  }
};

export default roadmapService;

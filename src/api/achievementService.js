import { api } from './api';

export default {
  getUserAchievements(userId) {
    return api.get(`achievement/${userId}`);
  },

  setUserAchievementToSeen(achievementId) {
    return api.put(`achievement/${achievementId}/seen`);
  }
};

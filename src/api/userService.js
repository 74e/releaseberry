import { api } from './api';

export default {
  handleTakenValidation(handle) {
    return api.post('user/validate-handle', { handle });
  },

  emailTakenValidation(email) {
    return api.post('user/validate-email', { email });
  },

  createAccount(userData) {
    return api.post('user/create-account', userData);
  },

  login(userHandleOrEmail, password) {
    return api.post('user/login', {
      userHandleOrEmail,
      password
    });
  },

  persistentLogin() {
    return api.get('user/automatic-authentication');
  },

  updateUserInformation(newData, isDeleting) {
    return api.put(`user/update?isDeleting=${isDeleting}`, { newData });
  },

  updateUserPreferences(newData) {
    return api.put('user/preference', { newData });
  },

  deleteAccount(handle) {
    return api.delete(`user/delete?handle=${handle}`);
  },

  userSearch(searchQuery) {
    return api.get('user/search', {
      params: {
        query: searchQuery
      }
    });
  },

  getUserCredentials() {
    return api.get(`user/credentials`);
  },

  getUserProfile(handle) {
    return api.get(`user/${handle}`);
  },

  followUser(userId) {
    return api.post(`/user/${userId}/follow`);
  },

  unfollowUser(userId) {
    return api.post(`/user/${userId}/unfollow`);
  }
};

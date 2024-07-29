import { api } from './api'

export default {
  handleTakenValidation(handle) {
    return api.post('user/validate-handle', { handle })
  },

  emailTakenValidation(email) {
    return api.post('user/validate-email', { email })
  },

  createAccount(handle, username, email, password, steam_id) {
    return api.post('user/create-account', {
      handle,
      username,
      email,
      password,
      steam_id
    })
  },

  login(userHandleOrEmail, password) {
    return api.post('user/login', {
      userHandleOrEmail,
      password
    })
  },

  persistentLogin() {
    return api.get('user/automatic-authentication')
  },

  userSearch(searchQuery) {
    return api.get('user/search', {
      params: {
        query: searchQuery
      }
    })
  },

  getUserProfile(username) {
    return api.get(`user/${username}`)
  },

  followUser(userId) {
    return api.post(`/user/${userId}/follow`)
  },

  unfollowUser(userId) {
    return api.post(`/user/${userId}/unfollow`)
  }
}

import { api } from './api'

export default {
  usernameTakenValidation(username) {
    return api.post('user/validate-username', { username })
  },

  emailTakenValidation(email) {
    return api.post('user/validate-email', { email })
  },

  createAccount(username, email, password, steam_id) {
    return api.post('user/create-account', {
      username,
      email,
      password,
      steam_id
    })
  },

  login(email, password) {
    return api.post('user/login', {
      email,
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

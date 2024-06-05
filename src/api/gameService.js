import { api } from './api'

export default {
  getFollowedGamesFromUser(userId) {
    return api.get('game/following', {
      params: {
        userId
      }
    })
  },

  getGlobalGames() {
    return api.get('game')
  }
}

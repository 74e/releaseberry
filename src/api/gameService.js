import { api } from './api'

export default {
  getFollowedGamesFromUser(userId) {
    return api.get(`game/library/${userId}`)
  },

  getGlobalGames() {
    return api.get('game')
  },

  getAvailableGames(query) {
    return api.get(`game/search/${query}`)
  },

  getGameCovers(appid, page = 0) {
    return api.get(`game/steamdb-images/${appid}`, {
      params: {
        page
      }
    })
  },

  addIndividualSteamGame(gameData, cardData) {
    return api.post(`game/add`, {
      gameData,
      cardData
    })
  }
}

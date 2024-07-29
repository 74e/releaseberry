import { defineStore } from 'pinia'
import gameService from '@/api/gameService'

const gameStore = defineStore('Game', {
  state: () => ({
    ownGames: null,
    globalGames: null,
    searchedGames: null,
    gameCoverImages: [],
    totalCovers: 0
  }),

  getters: {
    library: (state) => state.ownGames,
    globalLibrary: (state) => state.globalLibrary,
    searchResults: (state) => state.searchedGames,
    gameCovers: (state) => state.gameCoverImages,
    total: (state) => state.totalCovers
  },

  actions: {
    async getLibrary(userId) {
      try {
        const { data } = await gameService.getFollowedGamesFromUser(userId)
        this.ownGames = data
      } catch (error) {
        console.error(error)
      }
    },

    async getGlobalGames() {
      try {
        const { data } = await gameService.getGlobalGames()
        this.globalGames = data
      } catch (error) {
        console.error(error)
      }
    },

    async getAvailableGames(searchTerm) {
      try {
        const { data } = await gameService.getAvailableGames(searchTerm)

        this.searchedGames = data
      } catch (error) {
        console.error(error)
      }
    },

    clearSearchResults() {
      this.searchedGames = null
    },

    async getGameCovers({ appid, page = 0 }) {
      try {
        const { data } = await gameService.getGameCovers(appid, page)

        this.gameCoverImages = [...this.gameCoverImages, ...data.covers]
        this.totalCovers = data.total
      } catch (error) {
        console.error(error)
      }
    },

    clearGameCovers() {
      this.gameCoverImages = []
      this.totalCovers = 0
    },

    async addIndividualSteamGame({ gameData, cardData }) {
      try {
        const { data } = await gameService.addIndividualSteamGame(gameData, cardData)

        this.ownGames.push(data)
      } catch (error) {
        console.error(error)
      }
    }
  }
})

export default gameStore

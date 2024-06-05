import { defineStore } from 'pinia'
import gameService from '@/api/gameService'

const gameStore = defineStore('Game', {
  state: () => ({
    ownGames: null,
    globalGames: null
  }),

  getters: {
    library: (state) => state.ownGames,
    globalLibrary: (state) => state.globalLibrary
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
    }
  }
})

export default gameStore

import { defineStore } from 'pinia'
import gameService from '@/api/userService'

const userStore = defineStore('User', {
  state: () => ({
    ownGames: null,
    globalGames: null
  }),

  getters: {
    ownLibrary: (state) => state.ownLibrary,
    globalLibrary: (state) => state.globalLibrary,
    currentProfileLibrary: (state) => state.profileGames
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

    async getUserProfile() {
      try {
        const { data } = await gameService.getGlobalGames()
        this.globalGames = data
      } catch (error) {
        console.error(error)
      }
    }
  }
})

export default userStore

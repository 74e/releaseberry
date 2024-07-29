import { defineStore } from 'pinia'
import userService from '@/api/userService'

const userStore = defineStore('User', {
  state: () => ({
    user: null,
    userProfile: null
  }),

  getters: {
    loggedInUser: (state) => state.user,
    username: (state) => state.user?.username,
    userHandle: (state) => state.user?.handle,
    currentUserProfile: (state) => state.userProfile
  },

  actions: {
    async handleTakenValidation(handle) {
      try {
        await userService.handleTakenValidation(handle)
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async emailTakenValidation(email) {
      try {
        return await userService.emailTakenValidation(email)
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async createAccount({ handle, username, email, password }) {
      try {
        const { data } = await userService.createAccount(
          handle,
          username,
          email,
          password
        )
        const { newUser, token } = data

        this.user = newUser
        localStorage.setItem('RBsession', JSON.stringify({ token }))
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async login({ userHandleOrEmail, password }) {
      try {
        const { data } = await userService.login(userHandleOrEmail, password)
        const { user, token } = data

        this.user = user
        localStorage.setItem('RBsession', JSON.stringify({ token }))
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('RBsession')
    },

    async persistentLogin() {
      try {
        const { data } = await userService.persistentLogin()
        const { user, token } = data

        this.user = user
        localStorage.setItem('RBsession', JSON.stringify({ token }))
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async userSearch(username) {
      try {
        const { data } = await userService.userSearch(username)
        return data
      } catch (error) {
        console.error(error)
        // This error does not need to be bubbled up
        // At least for now,
        // TODO: Implement a way to show the user that the search failed
        // with a toast or a modal
      }
    },

    async getUserProfile(username) {
      try {
        const { data } = await userService.getUserProfile(username)
        this.userProfile = data
      } catch (error) {
        console.error(error)
        // throw error Adding error display later
      }
    },

    async followUser(userId) {
      try {
        await userService.followUser(userId)
      } catch (error) {
        console.error(error)
      }
    },

    async unfollowUser(userId) {
      try {
        await userService.unfollowUser(userId)
      } catch (error) {
        console.error(error)
      }
    }
  }
})

export default userStore

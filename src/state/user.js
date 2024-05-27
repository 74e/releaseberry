import { defineStore } from 'pinia'

const useUserStore = defineStore('User', {
  state: () => ({
    user: { name: 'strawberrySundae' }
  }),

  getters: {
    userName: (state) => state.user.name
  },

  actions: {}
})

export default useUserStore

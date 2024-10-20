import { defineStore } from 'pinia'

export const toastStore = defineStore('toaster', {
  state: () => ({ id: 0, toasts: [], timer: null }),

  actions: {
    add(options) {
      const defaults = { id: ++this.id }
      const toast = { ...defaults, ...options }

      this.toasts.unshift(toast)

      this.addToRemoveQueue(toast.duration)
    },

    addToRemoveQueue(duration = 3000) {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.remove()
        this.resume()
      }, duration)
    },

    remove() {
      this.toasts.shift()
    },

    pause() {
      clearTimeout(this.timer)
    },

    resume() {
      if (this.toasts.length > 0) {
        this.addToRemoveQueue()
      }
    },

    clear() {
      this.toasts = []
    },

    handleErrorMessage(
      error,
      defaultError = 'Something went wrong',
      icon = 'NoticeIcon'
    ) {
      let message

      if (error.response) {
        message = error.response.data.error
      } else {
        message = defaultError
      }

      this.add({ icon, message })
    }
  }
})

<template>
  <span>{{ released ? 'RELEASED' : formattedTime }}</span>
</template>

<script>
export default {
  props: {
    releaseDate: {
      type: Number || null,
      default: 0,
      required: true
    }
  },

  data() {
    return {
      countdown: null,
      diff: null,
      released: false
    }
  },

  computed: {
    formattedTime() {
      const days = Math.floor(this.diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((this.diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((this.diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((this.diff % (1000 * 60)) / 1000)
      return `${days} : ${hours} : ${minutes} : ${seconds}`
    }
  },

  mounted() {
    if (!this.releaseDate) return
    const now = new Date()
    const diff = this.releaseDate - now
    if (diff <= 0) {
      this.released = true
      return
    }

    this.startCountdown()
  },

  methods: {
    startCountdown() {
      const now = new Date()
      this.diff = this.releaseDate - now

      this.countdown = setInterval(() => {
        const now = new Date()
        this.diff = this.releaseDate - now

        if (this.diff <= 0) {
          clearInterval(this.countdown)
        }
      }, 1000)
    }
  },

  beforeUnmount() {
    clearInterval(this.countdown)
  }
}
</script>

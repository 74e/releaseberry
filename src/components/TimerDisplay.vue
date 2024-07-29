<template>
  <span>{{ released ? 'RELEASED' : this.getTimeFromFormat }}</span>
</template>

<script>
export default {
  props: {
    releaseDate: {
      type: Number || null,
      default: 0,
      required: true
    },

    counterFormat: {
      default: 'DDD:HH:MM:SS',
      required: true
    }
  },

  data() {
    return {
      countdown: null,
      diff: null,
      released: false,
      // releaseDate: 1720993060000,
      // counterFormat: 'YY Years DDD Days',
      availableTimerFormats: [
        'YY:DDD:HH:MM:SS',
        'DDD:HH:MM:SS',
        'DDD:HH:MM',
        'DDD Days',
        'YY Years DDD Days',
        'DATE',
        'FULL DATE'
      ]
    }
  },

  watch: {
    counterFormat() {
      this.startCountdown()
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

  computed: {
    minInMs() {
      return 1000 * 60
    },

    hourInMs() {
      return this.minInMs * 60
    },

    dayInMs() {
      return this.hourInMs * 24
    },

    yearInMs() {
      return this.dayInMs * 365
    },

    notCountdownable() {
      return ['DATE', 'FULL DATE', 'YY Years DDD Days', 'DDD Days'].includes(
        this.counterFormat
      )
    },

    getTimeFromFormat() {
      switch (this.counterFormat) {
        case 'YY:DDD:HH:MM:SS':
          return this.YYDDDHHMMSS()
        case 'DDD:HH:MM:SS':
          return this.DDDHHMMSS()
        case 'DDD:HH:MM':
          return this.DDDHHMM()
        case 'DDD Days':
          return this.days()
        case 'YY Years DDD Days':
          return this.yearsDays()
        case 'DATE':
          return this.date()
        case 'FULL DATE':
          return this.fullDate()
        default:
          return 'Invalid format'
      }
    },

    intervaDelay() {
      return this.counterFormat === 'DDD:HH:MM' ? this.minInMs : 1000
    }
  },

  methods: {
    YYDDDHHMMSS() {
      const years = Math.floor(this.diff / this.yearInMs)
      const days365 = this.pad(Math.floor((this.diff % this.yearInMs) / this.dayInMs))
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs))
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs))
      const seconds = this.pad(Math.floor((this.diff % this.minInMs) / 1000))

      return `${years}:${days365}:${hours}:${minutes}:${seconds}`
    },

    DDDHHMMSS() {
      const days = this.pad(Math.floor(this.diff / this.dayInMs))
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs))
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs))
      const seconds = this.pad(Math.floor((this.diff % this.minInMs) / 1000))

      return `${days} : ${hours} : ${minutes} : ${seconds}`
    },

    DDDHHMM() {
      const days = this.pad(Math.floor(this.diff / this.dayInMs))
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs))
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs))

      return `${days}D ${hours}H ${minutes}M`
    },

    yearsDays() {
      const years = Math.floor(this.diff / this.yearInMs)
      const days365 = this.pad(Math.floor((this.diff % this.yearInMs) / this.dayInMs))

      return `${years} Year${years > 1 ? 's' : ''} ${days365} Day${days365 > 1 ? 's' : ''}`
    },

    days() {
      const days = Math.floor(this.diff / this.dayInMs)

      return `${days} Day${days > 1 ? 's' : ''}`
    },

    date() {
      const dateData = this.convertToDate(this.releaseDate)

      return `${dateData.day} ${dateData.month}`
    },

    fullDate() {
      const dateData = this.convertToDate(this.releaseDate)

      return `${dateData.day} ${dateData.month} ${dateData.year}`
    },

    convertToDate(time) {
      let date = new Date(Number(time))
      let day = date.getDate()
      const month = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()
      day = day += this.getNumberSuffix(day)

      return { day, month, year }
    },

    getNumberSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th'
      }

      switch (day % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    },

    pad(number) {
      return String(number).padStart(2, '0')
    },

    startCountdown() {
      clearInterval(this.countdown)
      if (this.notCountdownable) return

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

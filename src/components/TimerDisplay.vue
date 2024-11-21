<template>
  <span>{{
    released ? 'RELEASED' : notDetermined ? notDetermined : getTimeFromFormat
  }}</span>
</template>

<script>
import gameStore from '../state/gameStore';
import { mapActions } from 'pinia';

export default {
  props: {
    releaseDate: {
      default: 'To be announced',
      required: true
    },

    createdAt: { required: true },

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
      availableTimerFormats: [
        'YY:DDD:HH:MM:SS',
        'DDD:HH:MM:SS',
        'DDD:HH:MM',
        'DDD Days',
        'YY Years DDD Days',
        'DATE',
        'FULL DATE'
      ],
      notDetermined: null
    };
  },

  watch: {
    counterFormat() {
      this.startCountdown();
    }
  },

  mounted() {
    if (this.releaseDate.length === 4) {
      this.notDetermined = 'Expected ' + this.releaseDate;
      return;
    } else if (isNaN(Number(this.releaseDate))) {
      this.notDetermined = this.releaseDate;
      return;
    }

    const now = new Date();
    const releaseDate = Number(this.releaseDate);
    const diff = releaseDate - now;

    if (diff <= 0) {
      const createdAt = new Date(this.createdAt);
      if (releaseDate > createdAt) this.setAsCollectableGame(this.$parent);

      this.released = true;
      return;
    }

    this.startCountdown();
  },

  computed: {
    minInMs() {
      return 1000 * 60;
    },

    hourInMs() {
      return this.minInMs * 60;
    },

    dayInMs() {
      return this.hourInMs * 24;
    },

    yearInMs() {
      return this.dayInMs * 365;
    },

    notCountdownable() {
      return ['DATE', 'FULL DATE', 'YY Years DDD Days', 'DDD Days'].includes(
        this.counterFormat
      );
    },

    getTimeFromFormat() {
      switch (this.counterFormat) {
        case 'YY:DDD:HH:MM:SS':
          return this.YYDDDHHMMSS();
        case 'DDD:HH:MM:SS':
          return this.DDDHHMMSS();
        case 'DDD:HH:MM':
          return this.DDDHHMM();
        case 'DDD Days':
          return this.days();
        case 'YY Years DDD Days':
          return this.yearsDays();
        case 'DATE':
          return this.date();
        case 'FULL DATE':
          return this.fullDate();
        default:
          return 'Invalid format';
      }
    },

    intervaDelay() {
      return this.counterFormat === 'DDD:HH:MM' ? this.minInMs : 1000;
    }
  },

  methods: {
    ...mapActions(gameStore, ['convertToDate', 'setAsCollectableGame']),

    YYDDDHHMMSS() {
      const years = Math.floor(this.diff / this.yearInMs);
      const days365 = this.pad(Math.floor((this.diff % this.yearInMs) / this.dayInMs));
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs));
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs));
      const seconds = this.pad(Math.floor((this.diff % this.minInMs) / 1000));

      return `${years} : ${days365} : ${hours} : ${minutes} : ${seconds}`;
    },

    DDDHHMMSS() {
      const days = this.pad(Math.floor(this.diff / this.dayInMs));
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs));
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs));
      const seconds = this.pad(Math.floor((this.diff % this.minInMs) / 1000));

      return `${days} : ${hours} : ${minutes} : ${seconds}`;
    },

    DDDHHMM() {
      const days = this.pad(Math.floor(this.diff / this.dayInMs));
      const hours = this.pad(Math.floor((this.diff % this.dayInMs) / this.hourInMs));
      const minutes = this.pad(Math.floor((this.diff % this.hourInMs) / this.minInMs));

      return `${days}D ${hours}H ${minutes}M`;
    },

    yearsDays() {
      const years = Math.floor(this.diff / this.yearInMs);
      const days365 = this.pad(Math.floor((this.diff % this.yearInMs) / this.dayInMs));

      return `${years} Year${years > 1 ? 's' : ''} ${days365} Day${days365 > 1 ? 's' : ''}`;
    },

    days() {
      const days = Math.floor(this.diff / this.dayInMs);

      return `${days} Day${days > 1 ? 's' : ''}`;
    },

    date() {
      const dateData = this.convertToDate(this.releaseDate);

      return `${dateData.day} ${dateData.month}`;
    },

    fullDate() {
      const dateData = this.convertToDate(this.releaseDate);

      return `${dateData.day} ${dateData.month} ${dateData.year}`;
    },

    pad(number) {
      return String(number).padStart(2, '0');
    },

    startCountdown() {
      clearInterval(this.countdown);

      const now = new Date();
      this.diff = this.releaseDate - now;

      if (this.notCountdownable) return;

      this.countdown = setInterval(() => {
        const now = new Date();
        this.diff = this.releaseDate - now;

        if (this.diff <= 0) {
          clearInterval(this.countdown);
        }
      }, 1000);
    }
  },

  beforeUnmount() {
    clearInterval(this.countdown);
  }
};
</script>

<template>
  <div class="card-default-minimal">
    <div class="image-container">
      <img :src="gameCover" :alt="cardTitle" />
    </div>

    <div class="info-container">
      <div class="timer-container">
        <timerDisplay
          class="timer"
          :counterFormat="this.counterFormat"
          :createdAt="createdAt"
          :releaseDate="releaseDate"
        />

        <span class="full-date">
          {{ fullDate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import timerDisplay from '@/components/TimerDisplay.vue';

export default {
  name: 'FallbackCard',

  components: {
    timerDisplay
  },

  props: {
    gameData: {
      type: [Object, null],
      default: null
    },

    cardData: {
      type: [Object, null],
      default: null
    }
  },

  computed: {
    cardTitle() {
      return this.gameData.name;
    },

    gameCover() {
      return this.gameData.cover_url;
    },

    releaseDate() {
      return this.gameData.release_date;
    },

    counterFormat() {
      return this.cardData?.countdown_format;
    },

    createdAt() {
      return this.cardData?.created_at;
    },

    fullDate() {
      if (isNaN(this.releaseDate)) return this.releaseDate;

      const dateData = this.convertToDate(this.releaseDate);

      return `${dateData.day} ${dateData.month} ${dateData.year}`;
    }
  },

  methods: {
    convertToDate(time) {
      let date = new Date(Number(time));
      let day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      day = day += this.getNumberSuffix(day);

      return { day, month, year };
    },

    getNumberSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }

      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  }
};
</script>

<style scoped>
.card-default-minimal {
  width: 200px;
  position: relative;
  padding: 12px 14px;
  user-select: none;

  &:hover {
    .info-container {
      .timer-container {
        .full-date {
          display: inline;
        }

        .timer {
          display: none;
        }
      }
    }
  }

  .image-container {
    border: 1px solid rgba(255, 255, 255, 0.212);

    border-radius: var(--radius-s);
    overflow: hidden;
    position: relative;

    img {
      border-radius: var(--radius-s) var(--radius-s) 0 0;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;

      box-shadow: inset 0px -1px 11px 5px rgba(0, 0, 0, 0.5);
    }
  }

  .info-container {
    background: rgba(0, 0, 0, 0.212);
    border: 1px solid rgba(255, 255, 255, 0.212);
    padding: 4px 0 6px 0;
    box-shadow: 0px 3px 0px rgba(255, 255, 255, 0.055);
    border-radius: var(--radius-s);
    backdrop-filter: blur(7.95px);

    transform: translate(-50%, -50%);
    left: 50%;
    position: absolute;
    width: 150px;

    .card-title {
      display: block;
      text-align: center;
      padding: 0 8px 2px 8px;
      color: var(--default-font-color);
      font-size: 13px;
    }

    .full-date {
      font-size: 15px;
      font-family: 'Oswald';
      color: var(--default-font-color);
      letter-spacing: 0.04em;
      line-height: 86.85%;
      text-align: center;

      transform: translateY(-1px);
      display: none;
    }

    .timer-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;

      .timer {
        font-size: 15px;
        font-family: 'Oswald';
        color: var(--default-font-color);
        letter-spacing: 0.04em;
        line-height: 86.85%;
        text-align: center;

        transform: translateY(-1px);
      }
    }
  }
}
</style>

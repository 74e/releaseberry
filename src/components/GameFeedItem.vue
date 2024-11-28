<template>
  <div class="game">
    <img :src="game.gameData.cover_url" alt="game cover" />
    <div class="game-info">
      <span class="type">Game</span>
      <span class="title">{{ game.gameData.name }}</span>

      <div class="release-info">
        <span class="release-label">Release date</span>
        <span class="release-date">{{ gameDate(game.gameData.release_date) }}</span>
      </div>

      <div v-if="showDate" class="follow-date">
        Followed: {{ game.cardData.created_at.split('T')[0] }}
      </div>
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';

export default {
  name: 'GameFeedItem',

  props: ['game', 'showDate'],

  computed: {
    convertToDate() {
      return gameStore().convertToDate;
    }
  },

  methods: {
    gameDate(time) {
      const { day, month, year, isInvalid } = this.convertToDate(time);
      if (isInvalid) return time;
      return `${day} ${month} ${year}`;
    }
  }
};
</script>

<style scoped>
.game {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid rgba(var(--accentColor), 0.2);
  border-radius: 6px;
  background: linear-gradient(
    -20deg,
    rgba(var(--accentColor), 0.24) 0%,
    rgb(34, 34, 34) 50%,
    rgba(var(--accentColor), 0.24) 100%
  );
  transition: all 0.3s ease-out;
  cursor: pointer;
  position: relative;

  &:hover {
    filter: brightness(1.4);
  }

  img {
    width: 70px;
    border-radius: var(--radius-s);
  }

  .game-info {
    display: flex;
    flex-direction: column;
    padding: 4px 0;
    margin-left: 8px;
    width: 100%;

    .type {
      font-size: 12px;
      color: rgba(var(--accentColor));
      margin-bottom: 2px;

      &::before {
        content: '';
        height: 15px;
        width: 3px;
        border-radius: 2px;
        display: inline-block;
        margin-right: 4px;
        background-color: rgba(var(--accentColor));
        transform: translateY(3px);
      }
    }

    .title {
      font-size: 18px;
      color: var(--default-font-color);
    }

    .bottom-menu {
      display: flex;
      gap: 16px;
    }

    .release-info {
      min-width: 45px;
      .release-label {
        font-size: 18px;
        color: rgba(var(--accentColor));
        display: block;
      }

      .release-date {
        font-size: 16px;
        color: var(--default-font-color);
      }
    }

    .follow-date {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.25);
    }
  }
}
</style>

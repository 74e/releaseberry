<template>
  <div class="feed">
    <div class="game" v-for="item in gameItems" :key="item.id">
      <img :src="item.game.cover_url" alt="game cover" />
      <div class="game-info">
        <span class="type">Game</span>
        <span class="title">{{ item.game.name }}</span>

        <span class="release-label">Release date</span>
        <span class="release-date">
          {{ date(item.game.release_date) }}
        </span>

        <div class="options-container">
          <button>Details</button>
          <button><PlusIcon /> Add</button>
        </div>
      </div>
    </div>

    <div v-if="gameItems?.length == 0" class="no-activity">
      Looks like there is no activity here yet
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import { mapActions } from 'pinia';

export default {
  name: 'UserLibrary',

  computed: {
    gameItems() {
      return userStore()?.userProfile.followedGames;
    }
  },

  methods: {
    ...mapActions(gameStore, ['convertToDate']),

    date(time) {
      const { day, month, year } = this.convertToDate(time);
      return `${day} ${month} ${year}`;
    }
  }
};
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.game {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px 0 32px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 94%;
    right: 50%;
    transform: translate(50%, 13px);
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(0, 240, 255, 0) 0%,
      rgba(var(--accentColor)) 52%,
      rgba(0, 144, 153, 0) 100%
    );
    bottom: 0;
  }

  img {
    width: 90px;
    border-radius: var(--radius-m);
    border: 1px solid rgba(var(--accentColor), 0.5);
  }

  .game-info {
    display: flex;
    flex-direction: column;
    padding: 4px 0;
    margin-left: 12px;
    width: 100%;

    .type {
      font-size: 12px;
      color: rgba(var(--accentColor));
      margin-bottom: 4px;

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
      font-size: 20px;
      color: var(--default-font-color);
    }

    .release-label {
      font-size: 18px;
      color: rgba(var(--accentColor));
      margin-top: 4px;
    }

    .release-date {
      font-size: 16px;
      color: var(--default-font-color);
    }

    .options-container {
      display: flex;
      gap: 8px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 6px 16px;
        margin-top: 8px;
        border-radius: var(--radius-m);
        background-color: transparent;
        border: 2px solid rgba(var(--accentColor));
        color: rgba(var(--accentColor));
        font-size: 15px;
        outline: none;
        cursor: pointer;
        transition: all 0.3s ease-out;

        .plus-icon {
          margin-right: 6px;
        }

        &:hover {
          background-color: var(--dark-fg-hover);
        }
      }
    }
  }
}

.no-activity {
  margin-top: 100px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.301);
}
</style>

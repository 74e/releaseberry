<template>
  <div v-if="displayData" class="main-details">
    <div class="details-header">
      <span class="type">{{ gameData.type }}</span>
      <h1>{{ gameData.name }}</h1>

      <div class="update-container">
        <div class="update-notice-section">
          <Transition name="fade">
            <div v-if="upToDateNotice" class="up-to-date-notice">Up-to-Date</div>
          </Transition>

          <WindowPopup width="275" v-if="newUpdateNotice.length > 0">
            <div class="update-notice-btn">
              <UpdateNoticeIcon />
              New Info Added
            </div>

            <template #window>
              <ul class="notice-items-container">
                <li v-for="update in newUpdateNotice" :key="update">
                  + New <span class="accent">{{ update }}</span> added!
                </li>
              </ul>
            </template>
          </WindowPopup>
        </div>

        <button @click="checkForUpdate" :class="['update-btn', { loadingUpdate }]">
          <UpdateIcon />
          Update info
        </button>
      </div>
    </div>

    <MediaGallery v-if="media" :media="media" />

    <div class="release-date">
      <span class="title">Release Date</span>
      <p>{{ releaseDate }}</p>
    </div>

    <div class="dev-publish">
      <div class="developer">
        <span>Developer</span>
        <p v-for="dev in gameData?.developer" :key="dev">{{ dev }}</p>
      </div>

      <div v-if="gameData?.publisher && gameData?.developer" class="divider" />

      <div class="publisher">
        <span>Publisher</span>
        <p v-for="pub in gameData?.publisher" :key="pub">{{ pub }}</p>
      </div>
    </div>

    <div class="genre">
      <span class="title">Genre</span>
      <div class="item-container">
        <div class="genre-item" v-for="genre in genres" :key="genre">{{ genre }}</div>
      </div>
    </div>

    <div v-if="gameData?.short_description" class="description">
      <span>About the game</span>
      <div class="short-description" v-html="gameData.short_description" />
      <br />
      <div v-html="gameData.detailed_description" />
    </div>
  </div>
</template>

<script>
import WindowPopup from './uiComponents/WindowPopup.vue';
import MediaGallery from './uiComponents/MediaGallery.vue';
import gameStore from '../state/gameStore';
import userStore from '../state/userStore';
import { toastStore } from '../state/toastStore';
import { mapActions } from 'pinia';

export default {
  name: 'GameDetailsDisplay',

  components: {
    MediaGallery,
    WindowPopup
  },

  props: {
    displayData: {
      type: [Object, null],
      default: null
    }
  },

  mounted() {
    this.media = [
      ...this.gameData.screenshots,
      ...this.gameData.movies.map((item) => {
        item.type = true;
        return item;
      })
    ];

    this.newUpdateNotice = [];
  },

  data() {
    return {
      media: null,
      upToDateNotice: false,
      cooldownTime: null,
      newUpdateNotice: [],
      loadingUpdate: false,
      fourDayInMs: 345600000
    };
  },

  computed: {
    gameData() {
      return this.displayData.gameData;
    },

    gameId() {
      return this.displayData.gameData.id;
    },

    genres() {
      return this.gameData.genres.map((genre) => genre.description);
    },

    releaseDate() {
      if (this.gameData.release_date.length === 4) {
        return 'Expected ' + this.gameData.release_date;
      } else if (isNaN(Number(this.gameData.release_date))) {
        return this.gameData.release_date;
      }

      const time = this.convertToDate(this.gameData.release_date);
      return `${time.day} ${time.month} ${time.year}`;
    }
  },

  methods: {
    ...mapActions(gameStore, ['convertToDate', 'updateGameInfo']),

    async checkForUpdate() {
      if (this.loadingUpdate) return;

      // check if theres an update cooldown
      if (userStore()?.loggedInUser?.role !== 'ADMIN' && this.hasUpdateCooldown()) {
        toastStore().add({
          icon: 'CooldownIcon',
          message: `<span>Title currently on update cooldown</span> <br /> <b>Available in ${this.cooldownTime} Hours</b>`,
          duration: 4500
        });

        return;
      }

      this.loadingUpdate = true;
      try {
        const updateLog = await this.updateGameInfo(this.gameId);

        for (const key in updateLog) {
          if (updateLog[key]) this.newUpdateNotice.push(key.replace('_', ' '));
        }

        if (this.newUpdateNotice.length === 0) {
          this.upToDateNotice = true;

          setTimeout(() => {
            this.upToDateNotice = false;
          }, 5000);
        }
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Could not check for updates, try again later.`
        );
      } finally {
        this.loadingUpdate = false;
      }
    },

    hasUpdateCooldown() {
      const lastTimeUpdated = new Date(this.gameData.updated_at).getTime();
      const elapsedTimeSinceLastUpdate = Date.now() - lastTimeUpdated;

      this.cooldownTime = (
        (this.fourDayInMs - elapsedTimeSinceLastUpdate) /
        (1000 * 60 * 60)
      ).toFixed(0);

      return elapsedTimeSinceLastUpdate < this.fourDayInMs;
    }
  }
};
</script>

<style scoped>
.main-details {
  display: flex;
  flex-direction: column;
  gap: 12px;

  overflow-y: scroll;
  padding: 8px 32px;

  @media (max-width: 800px) {
    padding: 8px;
  }

  .details-header {
    background-color: var(--dark-fg);
    border-radius: var(--radius-sm);
    padding: 12px 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;

    .update-container {
      font-size: 13px;
      position: absolute;
      right: 0;
      top: 0;
      margin: 8px 14px;
      display: flex;
      gap: 8px;

      .update-notice-section {
        position: absolute;
        right: calc(100% + 8px);
      }

      .cooldown-notice {
        background-color: var(--dark-fg);
        border-right: 1px solid rgba(var(--accentColor));
        border-radius: 4px;
        text-align: center;
        font-size: 15px;
        width: 270px;
        font-weight: 500;
        padding: 4px;
        color: rgba(var(--accentColor));

        span {
          color: rgba(var(--accentColor), 0.84);
          font-weight: 300;
        }
      }

      .notice-items-container {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        li {
          list-style-type: none;
          text-transform: capitalize;
          font-size: 15px;

          .accent {
            color: rgba(var(--accentColor));
          }
        }
      }

      .update-notice-btn {
        background-color: rgba(255, 255, 255, 0.055);
        border: 1px solid #ffffff28;
        padding: 4px 8px;
        border-radius: 50px;
        display: flex;
        cursor: pointer;
        width: 140px;
        transition:
          background-color 0.3s ease-out,
          color 0.3s ease-out,
          border-color 0.3s ease-out;

        svg {
          height: 15px;
          width: 12px;
          fill: rgba(255, 255, 255, 0.5);
          margin: 0 4px;
        }

        &:hover {
          color: rgba(var(--accentColor));
          background-color: rgba(255, 255, 255, 0.021);
          border-color: rgba(var(--accentColor));
          svg {
            fill: rgba(var(--accentColor));
          }
        }
      }

      .up-to-date-notice {
        font-size: 14px;
        color: rgba(var(--accentColor));
        width: 76px;
      }

      .update-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: transparent;
        border: none;

        color: rgba(255, 255, 255, 0.4);

        transition: color 0.3s ease-out;
        cursor: pointer;

        &.loadingUpdate {
          svg {
            animation-name: spin;
            animation-duration: 1000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
        }

        svg {
          height: 13px;
          fill: rgba(255, 255, 255, 0.4);
        }

        &:hover {
          color: rgba(var(--accentColor));

          svg {
            fill: rgba(var(--accentColor));
          }
        }
      }
    }

    .type {
      color: rgba(var(--accentColor));
      position: relative;
      font-size: 16px;
      text-transform: capitalize;
      display: inline-blocke;
      margin-left: 8px;

      &::after {
        content: '';
        display: block;
        width: 3px;
        border-radius: 2px;
        height: 18px;
        background: rgba(var(--accentColor));

        position: absolute;
        top: 50%;
        left: -8px;
        transform: translateY(-50%);
      }
    }

    h1 {
      font-size: 28px;
    }
  }

  .release-date,
  .genre {
    text-align: center;

    .title {
      font-size: 14px;
      font-weight: 600;
      padding: 4px;
      color: rgba(var(--accentColor));
    }

    p {
      font-size: 20px;
    }

    .item-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px 0;

      .genre-item {
        padding: 0 6px;
        border-right: 1px solid rgba(var(--accentColor));

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
          border: none;
        }
      }
    }
  }

  .genre {
    p {
      font-size: 16px;
    }
  }

  .dev-publish {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 20px;
    padding: 0 24px;

    .divider {
      width: 2px;
      border-radius: 2px;
      height: 100%;
      background-color: rgba(var(--accentColor), 0.77);
    }

    .developer,
    .publisher {
      text-align: center;
      width: 50%;

      span {
        font-size: 14px;
        font-weight: 600;
        color: rgba(var(--accentColor));
      }
    }
  }

  .description {
    margin: 0 8px;
    padding: 18px 24px;
    background-color: var(--dark-95);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(var(--accentColor), 0.33);
    box-shadow: inset 0px 0px 16px -6px rgba(255, 255, 255, 0.089);

    span {
      display: block;
      font-size: 22px;
      font-weight: 600;
      padding-bottom: 12px;
      color: rgba(var(--accentColor));
    }

    &:deep(img) {
      margin: auto;
    }

    &:deep(h2) {
      margin-top: 16px;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

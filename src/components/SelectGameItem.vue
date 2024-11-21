<template>
  <div class="search-game-container">
    <input
      @input="handleSearch"
      v-model="searchQuery"
      type="text"
      placeholder="Search for a game"
    />

    <div class="search-results">
      <template v-if="!noGamesFound && searchQuery">
        <AccordionItem v-for="result in searchResults" :key="result.source" tabType="tab">
          <div class="custom-tab">
            <span class="tab-title">{{ result.source }}</span>
            <span class="results"> ({{ result.games.length }})</span>
          </div>

          <template #content>
            <div v-if="result.games.length !== 0" class="search-items">
              <div
                :class="[
                  'item',
                  {
                    selected: selectedGameItem?.appid === game.appid,
                    following: game.isFollowedByUser
                  }
                ]"
                v-for="game in result.games"
                :key="game.id"
                @click="selectGame(game)"
              >
                <span>{{ game.name }}</span>
                <div
                  v-if="game.isFollowedByUser"
                  :class="[
                    'following',
                    { notice: isAlreadyInLibraryAppid === game.appid }
                  ]"
                >
                  <FollowedCheckmarkIcon />
                </div>
              </div>
            </div>
          </template>
        </AccordionItem>
      </template>

      <div v-if="noGamesFound && searchQuery" class="no-results">No games found</div>

      <div v-if="!searchQuery" class="start-typing">
        <SearchIcon />
        Start typing to <br />
        search for a game
      </div>

      <LoadingOverlay :isLoading="isLoading" />
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import { toastStore } from '@/state/toastStore';
import AccordionItem from './uiComponents/AccordionItem.vue';
import LoadingOverlay from './uiComponents/LoadingOverlay.vue';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'SelectGameItem',

  components: {
    AccordionItem,
    LoadingOverlay
  },

  props: {
    selectedGameItem: {
      type: [Object, null],
      default: null
    }
  },

  data() {
    return {
      openTab: 1,
      searchQuery: '',
      isLoading: false,
      isAlreadyInLibraryAppid: null,
      isAlreadyInLibraryTimeout: null
    };
  },

  mounted() {
    this.$emit('update:selectedGameItem', null);
  },

  computed: {
    ...mapState(gameStore, ['searchResults']),
    ...mapState(userStore, ['loggedInUser']),

    noGamesFound() {
      return (
        this.searchResults?.every((result) => result.games.length === 0) &&
        this.searchQuery !== ''
      );
    }
  },

  methods: {
    ...mapActions(gameStore, ['getAvailableGames', 'clearSearchResults']),

    async handleSearch() {
      this.$emit('update:selectedGameItem', null);

      clearTimeout(this.searchTimeout);
      if (!this.searchQuery) {
        this.clearSearchResults();
        return;
      }

      this.searchTimeout = setTimeout(async () => {
        this.isLoading = true;

        try {
          await this.getAvailableGames(this.searchQuery, this.loggedInUser?.id);
        } catch (error) {
          toastStore().handleErrorMessage(
            error,
            `Something went wrong, Could not retrieve games`
          );
        } finally {
          this.isLoading = false;
        }
      }, 300);
    },

    selectGame(game) {
      if (game?.isFollowedByUser) {
        clearTimeout(this.isAlreadyInLibraryTimeout);

        this.isAlreadyInLibraryAppid = game.appid;

        this.isAlreadyInLibraryTimeout = setTimeout(() => {
          this.isAlreadyInLibraryAppid = null;
        }, 1500);

        return;
      }

      this.$emit('update:selectedGameItem', game);
    }
  }
};
</script>

<style scoped>
.search-game-container {
  padding: 6px 0;
  margin: auto;

  input {
    display: block;
    margin: 0 auto 12px auto;
    width: 100%;
    max-width: 650px;
    padding: 8px 12px 4px 12px;
    border: none;
    border-bottom: 2px solid rgba(var(--accentColor));
    border-radius: 4px;
    background-color: transparent;
    color: var(--default-font-color);
    outline: none;
  }
}

button {
  text-align: center;
  min-width: 100px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.534);
  border-radius: var(--radius-s);
  border: 1px solid #ffffff28;
  transition: padding 0.3s ease-out;
  cursor: pointer;
  transition: all 0.25s ease-out;
  font-weight: bold;
  float: right;
  margin: 8px 8px 0 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(var(--accentColor));
    color: rgba(var(--accentColor));
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.055);
    border-color: #ffffff28;
    color: #ffffff28;
    cursor: default;
  }
}

.search-results {
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.336);
  border-radius: var(--radius-m);
  border: 1px solid #ffffff1c;
  overflow-y: scroll;
  position: relative;

  height: 585px;

  @media (max-height: 948px) {
    height: 550px;
  }

  @media (max-height: 918px) {
    height: 520px;
  }

  @media (max-height: 875px) {
    height: 490px;
  }

  @media (max-height: 845px) {
    height: 460px;
  }

  @media (max-height: 815px) {
    height: 430px;
  }

  @media (max-height: 785px) {
    height: 60vh;
  }

  .custom-tab {
    padding: 8px 8px 4px 8px;
    border-bottom: 3px solid #ffffff69;

    .tab-title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .no-results,
  .start-typing {
    font-size: 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    filter: brightness(50%);

    .search-icon {
      height: 150px;
      width: 150px;
      cursor: default;
      fill: rgb(141, 141, 141);
      margin-bottom: 16px;
    }
  }

  .search-items {
    padding: 16px 8px 4px 8px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .item {
      text-align: center;
      min-width: 100px;
      padding: 16px;
      background-color: rgba(255, 255, 255, 0.055);
      border-radius: var(--radius-s);
      border: 1px solid #ffffff28;
      transition: padding 0.3s ease-out;
      cursor: pointer;
      transition: background-color 0.25s ease-out;
      position: relative;

      &:hover {
        background-color: rgba(255, 255, 255, 0.12);
      }

      &.selected {
        border: 1px solid rgba(var(--accentColor));
      }

      .following {
        position: absolute;
        right: 0;
        top: -12px;

        svg {
          height: 34px;
          width: 35px;
        }

        &::after {
          content: 'Already in Library';
          position: absolute;
          right: calc(100% - 8px);
          top: 50%;
          transform: translateY(-50%);

          font-size: 14px;
          font-weight: bold;
          background-color: rgba(var(--accentColor));

          padding: 4px 0;
          border-radius: 4px 0 0 4px;
          text-wrap: nowrap;

          overflow: hidden;
          height: 25px;
          width: 0;
          transition: all 0.3s ease-out;
        }

        &:hover,
        &.notice {
          &::after {
            width: 136px;
          }
        }
      }
    }
  }

  .loading {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.336);
    display: flex;
    justify-content: center;
    align-items: center;

    .loading-icon {
      width: 150px;
      height: 150px;
    }
  }
}
</style>

<template>
  <div class="root">
    <div class="filter-menu">
      <WindowPopup ref="typebtn" position="bottom-right" class="type-btn">
        <div class="side-menu-icon">
          <ControllerIcon v-if="searchType == 'game'" />
          <ThemeIcon v-else />
        </div>

        <template #window>
          <div class="select-type-menu">
            <span class="order-by-heading">Select search target</span>
            <ul class="status-selection">
              <li
                v-for="type in ['game', 'card']"
                :class="type === searchType && 'active'"
                @click="switchSearchType(type)"
                :key="type"
              >
                {{ { game: 'Games', card: 'Cards by game' }[type] }}
              </li>
            </ul>
          </div>
        </template>
      </WindowPopup>

      <div class="search-field-container">
        <SearchField
          ref="search"
          :disabled="Boolean(selectedGameId)"
          :timeoutDelay="300"
          @search="handleSearch"
        />

        <div v-if="gameTitleTag" class="tagged-game-tag">
          <span>{{ gameTitleTag }}</span>
          <div class="close-btn" @click="clearGameId"><CloseIcon /></div>
        </div>

        <Transition name="fade">
          <ul v-if="globalFilterSearchTerm && searchType == 'card'" class="dropdown">
            <li
              v-for="result in searchSuggestion"
              :key="result.id"
              @click="selectGameId(result)"
            >
              {{ result.name }}
            </li>

            <li v-if="searchSuggestion == 0" class="no-suggestions-found">
              No results found
            </li>
          </ul>
        </Transition>
      </div>

      <WindowPopup class="filter-btn">
        <div class="side-menu-icon">
          <FilterIcon />
          <span>Filter</span>
        </div>
        <template #window>
          <GlobalLibraryFilterMenu
            v-if="searchType == 'game'"
            @getGlobalGames="getDisplayData"
          />
          <CardFilterMenu
            v-if="searchType == 'card'"
            @getCardConfigsByGame="getDisplayData"
          />
        </template>
      </WindowPopup>

      <div class="side-menu-icon add-btn" @click="toggleAddGameModal">
        <PlusIcon />
        <span>Add</span>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="!isLoading" class="card-display-container">
        <component
          v-for="card in filteredGlobalLibrary"
          :is="card.cardData?.card_component || 'FallbackCard'"
          :gameData="card.gameData"
          :cardData="card.cardData"
          :key="card.id"
          @click="triggerGameModal(card)"
        />
      </div>
    </Transition>

    <NoResultsNotice
      v-if="globalLibrary.length == 0 && !isLoading && globalFilterSearchTerm"
      heading="No games found"
      message="Looks like the game you're looking for hasn't been added to Release Berry yet. <br /> Be the first to add it!"
      buttonMessage="Add game"
      :callback="toggleAddGameModal"
    />

    <TransitionGroup name="fade">
      <GameDetailsModal
        v-if="showGameModal"
        v-model:showModal="showGameModal"
        :displayData="displayData"
        :clickOutside="true"
      />

      <AddGameModal v-if="showAddGameModal" v-model:showModal="showAddGameModal" />
    </TransitionGroup>
  </div>
</template>

<script>
import SearchField from '@/components/SearchField.vue';
import AddGameModal from './AddGameModal.vue';
import GameDetailsModal from '@/components/GameDetailsModal.vue';
import NoResultsNotice from './NoResultsNotice.vue';
import TitleLogo from '@/components/TitleLogo.vue';
import gameStore from '@/state/gameStore';
import { mapState, mapActions } from 'pinia';
import WindowPopup from './uiComponents/WindowPopup.vue';
import GlobalLibraryFilterMenu from './GlobalLibraryFilterMenu.vue';
import CardFilterMenu from './CardFilterMenu.vue';
import { toastStore } from '@/state/toastStore';
import cardStore from '@/state/cardStore';

export default {
  name: 'GlobalLibraryArea',

  components: {
    SearchField,
    TitleLogo,
    GameDetailsModal,
    WindowPopup,
    GlobalLibraryFilterMenu,
    AddGameModal,
    CardFilterMenu,
    NoResultsNotice
  },

  data() {
    return {
      showGameModal: false,
      showAddGameModal: false,
      displayData: null,
      searchType: 'game',
      isLoading: false,
      searchSuggestion: [],
      gameTitleTag: null
    };
  },

  mounted() {
    this.initialize();
  },

  computed: {
    ...mapState(gameStore, [
      'globalLibrary',
      'globalFilterLibraryOptions',
      'globalFilterSearchTerm'
    ]),
    ...mapState(cardStore, ['gamesByCardType']),

    selectedGameId() {
      return cardStore().cardFilterOptions.selectedGameId;
    },

    filteredGlobalLibrary() {
      return this.globalLibrary.filter((game) => {
        let status = this.globalFilterLibraryOptions.status;

        if (status == 'all') return true;

        const currentTIme = new Date().getTime();
        const gameReleaseTime = parseInt(game.gameData.release_date);

        if (
          status == 'unreleased' &&
          (gameReleaseTime > currentTIme || isNaN(gameReleaseTime))
        ) {
          return true;
        }

        if (status == 'released' && gameReleaseTime < currentTIme) {
          return true;
        }

        return false;
      });
    }
  },

  watch: {
    searchType() {
      this.getDisplayData();
    }
  },

  methods: {
    ...mapActions(gameStore, ['getGlobalLibrary']),
    ...mapActions(cardStore, ['getCardConfigsByGame']),

    async initialize() {
      await this.getGlobalLibrary();
    },

    triggerGameModal(data) {
      this.displayData = data;
      this.showGameModal = true;
    },

    toggleAddGameModal() {
      this.showAddGameModal = !this.showAddGameModal;
    },

    resetSearchState() {
      this.gameTitleTag = null;
      this.searchSuggestion = [];
      this.$refs.search.changeQuery('');
      gameStore().$patch({ globalFilterSearchTerm: '' });
      cardStore().clearSelectedGameId();
    },

    switchSearchType(type) {
      if (type === this.searchType) return;
      this.resetSearchState();
      this.searchType = type;
      this.$refs.typebtn.hide();
    },

    selectGameId(game) {
      this.searchSuggestion = [];
      this.$refs.search.changeQuery('');
      cardStore().setSelectedGameId(game.id);
      this.gameTitleTag = game.name;
      this.getDisplayData();
    },

    clearGameId() {
      this.gameTitleTag = null;
      cardStore().clearSelectedGameId();
      this.getDisplayData();
    },

    async handleSearch(query) {
      try {
        gameStore().$patch({ globalFilterSearchTerm: query });
        if (this.searchType === 'game') {
          this.getDisplayData();
        } else {
          if (!query) return;
          const data = await gameStore().indexSearchAutoCompletion(query);
          this.searchSuggestion = data.sort((a, b) => a.name.length - b.name.length);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getDisplayData() {
      // no early return, only doing isLoading for smoother animation
      this.isLoading = true;
      try {
        if (this.searchType === 'game') {
          await gameStore().getGlobalLibrary();
        } else {
          await cardStore().getCardConfigsByGame();
        }
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not get games');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.card-display-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 48px;
  margin: 30px auto;

  width: 95%;
}

.filter-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

.select-type-menu {
  padding: 8px;
}

.order-by-heading {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.274);
  margin-bottom: 4px;
  display: block;
}

.status-selection {
  list-style: none;
  display: flex;
  width: max-content;
  border: 1px solid rgba(255, 255, 255, 0.041);
  background-color: rgba(184, 184, 184, 0.048);
  border-radius: 8px;
  overflow: hidden;
  user-select: none;

  li {
    padding: 6px 12px;
    color: rgba(255, 255, 255, 0.425);
    transition: all 0.2s ease-in;
    font-size: 15px;
    cursor: pointer;
    text-transform: capitalize;

    &.active,
    &:hover {
      background-color: rgba(184, 184, 184, 0.089);
      color: rgba(255, 255, 255, 0.644);
    }
  }
}

.side-menu-icon {
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(10px);
  color: rgba(var(--accentColor), 1);
  padding: 16px;
  cursor: pointer;
  display: flex;
  max-height: 50px;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: brightness(1.3);
  }

  .plus-icon {
    height: 20px;
    width: 20px;
  }
}

.filter-btn,
.add-btn,
.type-btn {
  span {
    display: none;
  }
}

.search-field-container {
  position: relative;

  .tagged-game-tag {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    text-wrap: wrap;
    max-width: 230px;
    background-color: rgba(255, 255, 255, 0.062);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-out;
    color: rgba(255, 255, 255, 0.521);
  }

  .dropdown {
    position: absolute;
    z-index: 1;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background-color: var(--dark-50);
    box-shadow: var(--shadow-default);
    border-radius: var(--radius-l);
    backdrop-filter: blur(10px);
    color: rgba(var(--accentColor), 1);
    padding: 16px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.062);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease-out;
      color: rgba(255, 255, 255, 0.521);
      user-select: none;

      &:hover {
        background-color: rgba(255, 255, 255, 0.199);
        border: 1px solid rgba(255, 255, 255, 0.158);
      }
    }
  }
}

@media (max-width: 570px) {
  .filter-menu {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(3, 0.33fr);
  }

  .search-field-container {
    grid-row-start: 2;
    grid-column-start: 1;
    grid-column-end: 4;
  }

  .filter-btn,
  .add-btn,
  .type-btn {
    width: 100%;

    span {
      display: inline-block;
      margin-left: 8px;
    }
  }
}
</style>

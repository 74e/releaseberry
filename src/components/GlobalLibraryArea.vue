<template>
  <div class="root">
    <div class="filter-menu">
      <WindowPopup ref="typebtn">
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

      <div class="search-field">
        <SearchField ref="search" :timeoutDelay="250" @search="handleSearch" />
        <ul class="dropdown" v-if="isValidSearch">
          <li
            v-for="result in searchSuggestion"
            :key="result.id"
            @click="selectGameId(result)"
          >
            {{ result.name }}
          </li>
        </ul>
      </div>

      <WindowPopup>
        <div class="side-menu-icon">
          <FilterIcon />
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
    </div>

    <Transition name="fade">
      <div v-if="!isLoading" class="card-display-container">
        <component
          v-for="card in globalLibrary"
          :is="card.cardData?.card_component || 'FallbackCard'"
          :gameData="card.gameData"
          :cardData="card.cardData"
          :key="card.id"
          @click="triggerGameModal(card)"
        />
      </div>
    </Transition>

    <Transition name="fade">
      <GameDetailsModal
        v-if="showGameModal"
        v-model:showModal="showGameModal"
        :displayData="displayData"
        :clickOutside="true"
      />
    </Transition>
  </div>
</template>

<script>
import SearchField from '@/components/SearchField.vue';
import GameDetailsModal from '@/components/GameDetailsModal.vue';
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
    CardFilterMenu
  },

  data() {
    return {
      showGameModal: false,
      displayData: null,
      searchType: 'game',
      isLoading: false,
      searchSuggestion: [],
      isValidSearch: false
    };
  },

  mounted() {
    this.initialize();
  },

  computed: {
    ...mapState(gameStore, ['globalLibrary']),
    ...mapState(cardStore, ['gamesByCardType'])
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

    switchSearchType(type) {
      if (type === this.searchType) return;
      this.searchType = type;
      this.$refs.typebtn.hide();
    },

    selectGameId(game) {
      // TODO: after its been selected there is no way to remove it. make it so you can remove the game id fromt the search
      cardStore().setSelectedGameId(game.id);
      this.getDisplayData();
      this.$refs.search.changeQuery(game.name);
      this.isValidSearch = false;
    },

    async handleSearch(query) {
      this.isValidSearch = Boolean(query);

      if (this.searchType === 'game') {
        gameStore().$patch({ globalFilterSearchTerm: query });
        this.getDisplayData();
      } else {
        const data = await gameStore().indexSearchAutoCompletion(query);
        this.searchSuggestion = data.sort((a, b) => a.name.length - b.name.length);
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

  &:hover {
    filter: brightness(1.3);
  }
}
</style>

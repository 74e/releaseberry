<template>
  <div class="collectable-container">
    <div class="collect-text">Collect your experience</div>
    <TransitionGroup tag="div" name="motion" class="collectable-area">
      <component
        v-for="card in collectable"
        :is="card.cardData.card_component"
        :gameData="card.gameData"
        :cardData="card.cardData"
        :key="card.gameData.id"
        class="cc"
        @click="initCollection(card)"
      />
    </TransitionGroup>

    <Transition name="fade">
      <ExperienceCollectionWindow
        v-if="showExpModal"
        v-model:showModal="showExpModal"
        v-model:gameTitle="gameTitle"
        v-model:accumulatedExp="accumulatedExp"
      />
    </Transition>
  </div>
</template>

<script>
import ExperienceCollectionWindow from './ExperienceCollectionWindow.vue';
import gameStore from '@/state/gameStore';
// import { toastStore } from '@/state/toastStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'LibraryContainer',

  inject: ['accentColor'],

  components: { ExperienceCollectionWindow },

  data() {
    return {
      showExpModal: false,
      gameTitle: null,
      accumulatedExp: null,
      customGameId: null
    };
  },

  unmounted() {
    gameStore().$patch({ collectableGames: [] });
  },

  computed: {
    ...mapState(gameStore, ['library', 'collectableGames']),

    collectable() {
      return this.library.filter(({ cardData }) =>
        this.collectableGames.includes(cardData.custom_game_config_id)
      );
    }
  },

  methods: {
    ...mapActions(gameStore, ['calculateAccumulatedExp']),

    initCollection({ gameData, cardData }) {
      this.customGameId = cardData.custom_game_config_id;
      this.gameTitle = gameData.name;
      this.accumulatedExp = this.calculateAccumulatedExp();
      this.showExpModal = true;
    },

    clearCollectedGame() {
      this.showExpModal = false;
      this.customGameId = null;
      this.gameTitle = null;
      this.accumulatedExp = null;

      // clear game from collectableGames array
    }
  }
};
</script>

<style scoped>
.cc.cc.cc.cc {
  filter: brightness(1.2);
}

.collectable-container {
  padding: 16px;

  .collect-text {
    text-align: center;
    font-size: 22px;
    margin-bottom: 8px;
    position: relative;
    color: v-bind(accentColor);
  }
}

.collectable-area {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 48px;
  position: relative;
  padding: 16px 0;

  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.001) 0%,
    rgba(255, 255, 255, 0.001) 3%,
    v-bind(accentColor + '2c') 40%,
    v-bind(accentColor + '2c') 60%,
    rgba(255, 255, 255, 0.001) 97%,
    rgba(255, 255, 255, 0.001) 100%
  );

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.001) 0%,
      v-bind(accentColor) 40%,
      v-bind(accentColor) 60%,
      rgba(255, 255, 255, 0.001) 100%
    );
  }

  &::after {
    top: 0;
  }

  &::before {
    bottom: 0;
  }
}

.motion-move {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1) !important;
}

.motion-leave-active {
  position: absolute !important;
}

.motion-enter-from,
.motion-leave-to {
  opacity: 0 !important;
}
</style>

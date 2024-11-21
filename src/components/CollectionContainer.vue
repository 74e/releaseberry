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
        @collectAnimFinished="finalizeCollection"
      />
    </Transition>
  </div>
</template>

<script>
import ExperienceCollectionWindow from './ExperienceCollectionWindow.vue';
import gameStore from '@/state/gameStore';
import { toastStore } from '@/state/toastStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'LibraryContainer',

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
    ...mapState(gameStore, ['library', 'ownGames', 'collectableGames']),

    collectable() {
      return this.ownGames.filter(({ cardData }) =>
        this.collectableGames.includes(cardData.custom_game_config_id)
      );
    }
  },

  methods: {
    ...mapActions(gameStore, ['calculateAccumulatedExp', 'collectExperience']),

    initCollection({ gameData, cardData }) {
      const { custom_game_config_id, created_at } = cardData;
      const { name, release_date } = gameData;
      this.customGameId = custom_game_config_id;
      this.gameTitle = name;
      this.accumulatedExp = this.calculateAccumulatedExp(release_date, created_at);
      this.showExpModal = true;
    },

    async finalizeCollection(expAfterCollection) {
      try {
        this.showExpModal = false;
        await this.collectExperience(this.customGameId, expAfterCollection);

        toastStore().add({
          icon: 'ReleaseBerryIcon',
          message: `Collected Released Title</br><b>${this.gameTitle}</b>`,
          duration: 5000
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not collect released game`
        );
      }
    },

    clearCollectedGame() {
      this.showExpModal = false;
      this.customGameId = null;
      this.gameTitle = null;
      this.accumulatedExp = null;
    }
  }
};
</script>

<style scoped>
.cc.cc.cc.cc {
  animation: waveAnim forwards 2.5s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes waveAnim {
  0%,
  100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.4);
  }
}

.collectable-container {
  padding: 16px;

  .collect-text {
    text-align: center;
    font-size: 22px;
    margin-bottom: 8px;
    position: relative;
    color: rgba(var(--accentColor));
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
    rgba(var(--accentColor), 0.17) 40%,
    rgba(var(--accentColor), 0.17) 60%,
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
      rgba(var(--accentColor)) 40%,
      rgba(var(--accentColor)) 60%,
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

<template>
  <div class="root">
    <SearchField />
    <div class="card-display-container">
      <component
        v-for="card in globalLibrary"
        :is="card.cardData?.card_component || 'FallbackCard'"
        :gameData="card.gameData"
        :cardData="card.cardData"
        :key="card.id"
        @click="triggerGameModal(card)"
      />
    </div>

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

export default {
  name: 'GlobalLibraryArea',

  components: {
    SearchField,
    TitleLogo,
    GameDetailsModal
  },

  data() {
    return {
      showGameModal: false,
      displayData: null
    };
  },

  mounted() {
    this.initialize();
  },

  computed: {
    ...mapState(gameStore, ['globalLibrary'])
  },

  methods: {
    ...mapActions(gameStore, ['getGlobalLibrary']),

    async initialize() {
      await this.getGlobalLibrary();
    },

    triggerGameModal(data) {
      this.displayData = data;
      this.showGameModal = true;
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
</style>

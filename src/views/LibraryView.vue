<template>
  <main>
    <TitleLogo />
    <template v-if="isUserLoggedIn">
      <CardToolbar />
      <Transition name="fade">
        <CollectionContainer v-if="collectableGames.length > 0" />
      </Transition>
      <LibraryContainer @triggerGameModal="triggerGameModal" />
    </template>

    <TransitionGroup name="fade">
      <GameDetailsModal
        v-if="showGameModal"
        v-model:showModal="showGameModal"
        :displayData="displayData"
        :clickOutside="true"
      />

      <EditGameListModal
        v-if="showGameListModal"
        v-model:showModal="showGameListModal"
        :clickOutside="true"
      />
    </TransitionGroup>
  </main>
</template>

<script>
import CardToolbar from '@/components/CardToolbar.vue';
import TitleLogo from '@/components/TitleLogo.vue';
import GameDetailsModal from '@/components/GameDetailsModal.vue';
import EditGameListModal from '@/components/EditGameListModal.vue';
import CollectionContainer from '@/components/CollectionContainer.vue';
import LibraryContainer from '@/components/LibraryContainer.vue';
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import { mapState } from 'pinia';
import DisplayAllIcons from '@/components/DisplayAllIcons.vue';

export default {
  name: 'MainView',

  components: {
    CardToolbar,
    TitleLogo,
    GameDetailsModal,
    DisplayAllIcons,
    EditGameListModal,
    LibraryContainer,
    CollectionContainer
  },

  data() {
    return {
      showGameModal: false,
      showGameListModal: false,
      displayData: null
    };
  },

  watch: {
    editingGameListId() {
      this.showGameListModal = Boolean(this.editingGameListId);
    }
  },

  computed: {
    ...mapState(gameStore, [
      'editingGameListId',
      'selectedGameListId',
      'collectableGames'
    ]),

    isUserLoggedIn() {
      return userStore().loggedInUser;
    }
  },

  methods: {
    triggerGameModal(data) {
      this.displayData = data;
      this.showGameModal = true;
    }
  }
};
</script>

<style scoped>
main {
  min-height: 100vh;
  padding: 40px 16px;
  margin: auto;

  @media (max-width: 500px) {
    padding: 16px;
  }
}
</style>

<template>
  <div class="feed">
    <GameFeedItem
      v-for="game in games"
      :game="game"
      :key="game.cardData.id"
      :showDate="true"
      @click="initDisplayGameDetails(game)"
    />

    <div v-if="games?.length == 0" class="no-activity">
      Looks like there is no activity here yet
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import GameFeedItem from './GameFeedItem.vue';

export default {
  name: 'UserLibraryFeed',

  components: { GameFeedItem },

  inject: ['initDisplayGameDetails'],

  computed: {
    games() {
      return gameStore()?.userProfileGames;
    }
  },

  mounted() {
    this.initUserLibrary();
  },

  methods: {
    initUserLibrary() {
      const userId = userStore().userProfile.id;
      gameStore().getLibrary(userId);
    }
  }
};
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px !important;
}

.no-activity {
  margin-top: 100px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.301);
}
</style>

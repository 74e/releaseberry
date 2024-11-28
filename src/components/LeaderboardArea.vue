<template>
  <div class="leaderboard-container">
    <div class="leaderboard-item" v-for="user in leaderboardData" :key="user.handle">
      <img :src="profileImages[user.image_index]" alt="Profile image" />
      {{ user.xp }}
    </div>
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import userStore from '@/state/userStore';

export default {
  name: 'ExperienceLeaderboard',

  inject: ['profileImages'],

  data() {
    return {
      leaderboardData: null
    };
  },

  mounted() {
    this.initLeaderboardData();
  },

  methods: {
    async initLeaderboardData() {
      try {
        const data = await userStore().getLeaderboardData();
        this.leaderboardData = data;
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not load in leaderboard');
      }
    }
  }
};
</script>

<style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  gap: 100px;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.leaderboard-item {
}
</style>

<template>
  <div class="leaderboard-container">
    <div class="focused-stat-filter">
      <div class="focused-stat-input" @click="toggleDropDown">
        <span class="selected-ranking">
          {{ statLabels.find((stat) => stat.stat == rankBy).label.replace('</br>', ' ') }}
        </span>
        <TinyArrowIcon :class="isOpen && 'active'" />
      </div>

      <div :class="['dropdown', isOpen && 'active']">
        <div class="rank-item" @click="selectRankByStat(stat.stat)" v-for="stat in statLabels" :key="stat.stat">
          {{ stat.label.replace('</br>', ' ') }}
        </div>
      </div>
    </div>

    <div class="leaderboard-list">
      <LeaderboardItem
        v-for="user in leaderboardData"
        :user="user"
        :statLabels="statLabels"
        :profileImage="profileImages[user.image_index]"
        :focusedStat="rankBy"
        :key="user.id"
      />
    </div>
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import userStore from '@/state/userStore';
import LeaderboardItem from './LeaderboardItem.vue';

export default {
  name: 'LeaderboardArea',
  components: { LeaderboardItem },
  inject: ['profileImages'],

  data() {
    return {
      leaderboardData: null,
      statLabels: [
        { stat: 'followers', label: 'FOLLOWER</br>COUNT' },
        { stat: 'followedUsers', label: 'FOLLOWING</br>COUNT' },
        { stat: 'followedGames', label: 'GAMES IN</br>LIBRARY' },
        { stat: 'collected', label: 'COLLECTED</br>RELEASES' },
        { stat: 'xp', label: 'ACCUMULATED</br>EXPERIENCE' },
        { stat: 'level', label: 'LEVEL' }
      ],
      isOpen: false,
      rankBy: 'level',
      skip: 0,
      take: 100,
      orderBy: 'desc'
    };
  },

  mounted() {
    this.getLeaderboardData();
  },

  methods: {
    async getLeaderboardData() {
      try {
        const data = await userStore().getLeaderboardData({
          rankBy: this.rankBy,
          verticalOrder: 'desc',
          skip: this.skip,
          take: this.take,
        });
        this.leaderboardData = data;
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not load in leaderboard');
      }
    },

    selectRankByStat(stat){
      this.rankBy = stat
      this.isOpen = false
      this.getLeaderboardData()
    },

    toggleDropDown(){
      this.isOpen = !this.isOpen
    }
  }
};
</script>

<style scoped>
.leaderboard-container {
  padding: 16px 0;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.focused-stat-input{
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(10px);
  width: 300px;
  display: flex;
  color: rgba(var(--accentColor), 1);
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.focused-stat-filter {
  margin: 0 auto 16px auto;
  position: relative;
  width: max-content;

  &:hover {
    .selected-ranking, .tiny-arrow-icon {
      filter: brightness(1.3);
    }
  }

  .tiny-arrow-icon {
    width: 12px;
    height: 12px;
    transform: rotateZ(90deg);

    &.active{
      transform: rotateZ(0deg);
    }
  }

  .selected-ranking {
    display: block;
    font-weight: 700;
    margin: auto;
    transition: all .2s ease-in;
  }
}

.dropdown {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(10px);
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  display: flex;
  flex-direction: column-reverse;
  padding: 0 8px;
  margin-top: 0;
}

.dropdown.active {
  padding: 8px;
  margin-top: 8px;
  max-height: 302px;
  opacity: 1;
}

.rank-item {
  padding: 12px 16px;
  margin: 4px 0;
  color: rgb(var(--accentColor));
  background-color: transparent;
  border-radius: var(--radius-s);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease-in;
}

.rank-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.rank-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.rank-item:last-child {
  margin-bottom: 0;
}



</style>

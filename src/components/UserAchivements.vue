<template>
  <div class="group-container">
    <div v-for="[group, value] in groupedAchievements" :key="group" class="group">
      <div :class="['heading', achievementTypeProgress(value, true) && 'complete']">
        <div class="info">
          <span class="type-name">{{ groupTitles[group] }}</span>
          <span class="completion-progress">
            Completed: {{ achievementTypeProgress(value) }}
          </span>
        </div>
      </div>

      <div class="item-container">
        <div
          v-for="item in value"
          :key="item.id"
          :class="['item', item.unlocked_date && 'complete']"
        >
          <div class="icon">
            <ReleaseBerryIcon v-if="item.unlocked_date" />
            <LockedIcon v-else />
          </div>

          <div class="info">
            <div class="top">
              <span class="name">{{ item.name }}</span>
              <span class="percentage">({{ achievementProgressPercentage(item) }}%)</span>
            </div>

            <div class="progress-bar">
              <div class="progress" :style="achievementProgressPercentage(item, true)" />
            </div>

            <div class="bottom">
              <span class="description">{{ item.description }}</span>
              <div class="reward">
                <span class="label">REWARD</span>
                <div class="amount">{{ item.experience_reward }} Exp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import achievementStore from '@/state/achievementStore';
import userStore from '@/state/userStore';

export default {
  name: 'userAchivements',

  setup() {
    const achievementsApi = achievementStore();
    return { achievementsApi };
  },

  data() {
    return {
      typeOrder: [
        'GAME_ADD',
        'GAME_COLLECT',
        'DESIGN_ADD',
        'USER_FOLLOWING',
        'USER_FOLLOWED',
        'EXPLOIT'
      ],
      groupTitles: {
        GAME_ADD: 'Library Collection',
        GAME_COLLECT: 'Collected Releases',
        DESIGN_ADD: 'Card Designs',
        USER_FOLLOWING: 'Following',
        USER_FOLLOWED: 'Followed',
        EXPLOIT: 'Exploit'
      }
    };
  },

  watch: {
    $route: {
      handler() {
        this.$emit('revert');
      },
      deep: true
    }
  },

  computed: {
    achievements() {
      return this.achievementsApi.currentUserAchievements;
    },

    groupedAchievements() {
      const typeOrderMap = new Map(this.typeOrder.map((item, index) => [item, index]));
      const groupedItems = Object.entries(
        Object.groupBy(this.achievements, (a) => a.type)
      );

      groupedItems.forEach((v) => {
        v[1].sort((a, b) => a.completion_condition - b.completion_condition);
      });

      return groupedItems.sort(([a], [b]) => typeOrderMap.get(a) - typeOrderMap.get(b));
    }
  },

  mounted() {
    this.initAchievements();
  },

  unmounted() {
    this.achievementsApi.clearCurrentUserAchievements();
  },

  methods: {
    async initAchievements() {
      const id = userStore().userProfile.id;
      await this.achievementsApi.getUserAchievements(id);
    },

    progressAndTotal(achievements) {
      const totalAchievements = achievements.length;
      const completeAchievements = achievements.filter((a) =>
        Boolean(a.unlocked_date)
      ).length;

      return [completeAchievements, totalAchievements];
    },

    achievementTypeProgress(achievements, calc = false) {
      const [progress, total] = this.progressAndTotal(achievements);
      return calc ? progress / total === 1 : `${progress} / ${total}`;
    },

    achievementProgressPercentage(achievement, width = false) {
      const { progress, completion_condition, unlocked_date } = achievement;
      if (unlocked_date) return width ? `width: 100%;` : 100;
      const percent = Math.min((progress / completion_condition).toFixed(2) * 100, 100);
      return width ? `width: ${percent}%;` : percent;
    },

    rewardType(value) {
      return value > 0 ? '+' : '';
    }
  }
};
</script>

<style scoped>
.group-container {
  padding-left: 12px;
  padding-right: 12px;
  display: grid;
  gap: 12px;
}

.group {
  .heading {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    color: #ffffffa6;
    border-radius: 8px;
    background: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0) 45%,
      rgba(255, 255, 255, 0) 55%,
      rgba(255, 255, 255, 0.13) 100%
    );

    &.complete {
      background: linear-gradient(
        -20deg,
        rgba(var(--accentColor), 0.44) 0%,
        rgb(34, 34, 34) 50%,
        rgba(var(--accentColor), 0.44) 100%
      );
      border: 1px solid rgba(var(--accentColor), 0.26);
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      width: 100%;

      .type-name {
        font-size: 18px;
      }
      .completion-progress {
        color: rgba(255, 255, 255, 0.425);
        font-size: 12px;
      }
    }
  }
}

.progress-bar {
  height: 4px;
  width: 100%;
  background-color: #2e2e2e;
  border-radius: 4px;
  outline: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2px 0;

  .progress {
    height: 100%;
    background-color: rgba(var(--accentColor));
    border-radius: 4px;
  }
}

.item-container {
  padding: 12px 8px 2px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .item {
    padding: 8px;
    background: linear-gradient(
      340deg,
      rgb(61, 61, 61) 0%,
      rgba(34, 34, 34, 0.3) 20%,
      rgba(34, 34, 34, 0.3) 80%,
      rgb(61, 61, 61) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 4px;

    &.complete {
      background: linear-gradient(
        20deg,
        rgba(var(--accentColor), 0.44) 0%,
        rgb(34, 34, 34) 50%,
        rgba(var(--accentColor), 0.44) 100%
      );
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
    }

    .top {
      display: flex;

      .name {
        font-size: 14px;
      }

      .percentage {
        margin-left: auto;
        font-size: 13px;
      }
    }

    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .description {
      font-size: 11px;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;

      svg {
        width: 28px;
        height: 34px;
      }

      .locked-icon {
        fill: rgba(var(--accentColor), 0.44);
      }
    }

    .reward {
      display: inline-flex;
      gap: 3px;

      .label {
        transform: translateY(1px);
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
      }

      .amount {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>

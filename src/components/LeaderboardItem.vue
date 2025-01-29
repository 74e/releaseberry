<template>
  <div
    v-if="user"
    @click="toggleAllInfo"
    :class="['leaderboard-item', isOpen && 'active']"
  >
    <div class="display">
      <div class="placement">
        {{ user.placement }}
      </div>

      <RouterLink :to="`/user/${user.handle}`">
        <img :src="profileImage" alt="Profile image" />
      </RouterLink>

      <RouterLink :to="`/user/${user.handle}`" class="info">
        <div class="profile-name">
          <div class="username">{{ user.username }}</div>
          <span class="handle">@{{ user.handle }}</span>
        </div>
      </RouterLink>

      <div :class="['focused-stat', { isLevel: focusedStat == 'level' }]">
        <div
          class="label"
          v-html="statLabels.find((item) => item.stat == focusedStat)?.label"
        />

        <div class="value">
          {{ user[focusedStat] }}
        </div>
      </div>
    </div>

    <div class="stats">
      <template v-for="item in statLabels" :key="user[item.stat] + user.id">
        <div v-if="item.stat !== focusedStat" class="stat-item">
          <div class="label" v-html="item.label" />
          <div class="value">{{ user[item.stat] }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardItem',

  props: ['user', 'statLabels', 'profileImage', 'focusedStat'],

  data() {
    return {
      isOpen: false
    };
  },

  methods: {
    toggleAllInfo() {
      this.isOpen = !this.isOpen;
    }
  },

  computed: {
    accentColor() {
      return this.user.accentColor;
    }
  }
};
</script>

<style scoped>
.leaderboard-item {
  border-radius: 6px;
  background: linear-gradient(
    -20deg,
    v-bind(accentColor + '3d') 0%,
    rgba(34, 34, 34, 0.1) 50%,
    v-bind(accentColor + '4f') 100%
  );
  border: 1px solid v-bind(accentColor + '1e');
  transition: all 0.3s ease-out;
  position: relative;
  backdrop-filter: blur(14px);
  width: 100%;
  max-width: 540px;
  z-index: inherit;

  &:hover {
    filter: brightness(1.4);
  }

  img {
    width: 65px;
    border-radius: 6px;
  }
}

.display {
  display: flex;
  align-items: center;
  padding: 8px;
}

.placement {
  min-width: 47px;
  font-size: 40px;
  padding: 0 16px 0 8px;
  color: v-bind(accentColor);
}

.info {
  margin-left: 8px;
}

.profile-name {
  margin: 12px 0;
  padding-left: 12px;
  position: relative;
  line-height: 18px;
  width: max-content;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 4px;
    width: 3px;
    height: 48px;
    background-color: v-bind(accentColor);
    transition: all 0.3s ease-out;
  }

  .username {
    font-size: 20px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .handle {
    font-size: 14px;
    color: #848c8f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.stats {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  overflow: hidden;
  height: 0px;
  transition: all 0.3s ease-out;
}

.stat-item {
  text-align: center;

  .label {
    font-size: 13px;
  }

  .value {
    font-weight: bold;
    font-size: 20px;
    color: v-bind(accentColor);
  }
}

.focused-stat {
  margin: 0 8px 0 auto;
  text-align: center;

  .label {
    font-size: 13px;
  }

  .value {
    font-weight: bold;
    font-size: 20px;
    color: v-bind(accentColor);
  }

  &.isLevel {
    .label {
      font-size: 15px;
    }

    .value {
      font-size: 23px;
    }
  }
}

.leaderboard-item.active {
  .stats {
    height: 80px;
  }
}

@media (max-width: 480px) {
  .leaderboard-item {
    flex-direction: column;
    padding: 8px;
  }

  .placement {
    position: absolute;
    top: 8px;
    left: 8px;
  }

  .display {
    flex-direction: column;
    align-items: flex-start;
    align-items: center;
    text-align: center;
  }

  .info {
    margin-left: 0;
    margin-top: 8px;
  }

  img {
    width: 50px;
    margin: 0 auto;
  }

  .profile-name {
    padding: 0;

    &::before {
      left: 50%;
      top: -9px;
      transform: translateX(-50%);
      width: 100%;
      height: 3px;
    }
  }

  .username {
    font-size: 16px;
  }

  .handle {
    font-size: 10px;
  }

  .focused-stat {
    margin: 0 !important;
  }

  .stat-item,
  .focused-stat {
    margin: 8px;
  }

  .stat-item .label {
    font-size: 12px !important;

    .stat-item .value {
      font-size: 18px !important;
    }
  }
}

@media (max-width: 480px) {
  .leaderboard-item.active .stats {
    height: 60px !important;
  }
  .stat-item .label {
    font-size: 9px !important;

    .stat-item .value {
      font-size: 14px !important;
    }
  }
}
</style>

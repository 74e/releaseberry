<template>
  <div class="profile-level">
    <div class="level-display">
      <span class="level-label">LEVEL</span>
      <span class="level">{{ level }}</span>
    </div>

    <div class="xp-display">
      <span class="total-xp">Total Exp: {{ experience }}</span>

      <div class="xp-bar">
        <div :style="{ width: percentProgress }" class="current-xp-bar" />
      </div>

      <span class="xp-label">
        Exp:<span class="highlighted"> {{ cappedExperience }} / 2440 </span>
      </span>
    </div>
  </div>
</template>

<script>
const XP_PER_LEVEL = 2440;

export default {
  name: 'ExperienceBar',

  props: {
    staticLevel: {
      default: null,
      type: Number
    },

    experience: {
      default: null,
      type: Number
    }
  },

  computed: {
    level() {
      if (this.staticLevel) return this.staticLevel;

      return Math.floor(this.experience / XP_PER_LEVEL) + 1;
    },

    cappedExperience() {
      return this.experience % 2440;
    },

    percentProgress() {
      return `${((this.cappedExperience / 2440) * 100).toFixed(2)}%`;
    }
  }
};
</script>

<style scoped>
.profile-level {
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: 8px;

  @media (max-width: 1150px) {
    margin: 0;
  }

  .level-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .level-label {
      font-size: 11px;
      color: #848c8f;
      margin-bottom: -8px;
    }

    .level {
      font-size: 24px;
      font-weight: 500;
      color: rgba(var(--accentColor));
    }
  }

  .xp-display {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 8px;
    width: 100%;

    .total-xp {
      font-size: 9px;
      color: #678793;
      margin-bottom: 3px;
    }

    .xp-bar {
      height: 5px;
      width: 100%;
      background-color: #2e2e2e;
      border-radius: 4px;
      outline: 1px solid rgba(255, 255, 255, 0.1);

      .current-xp-bar {
        height: 100%;
        background-color: rgba(var(--accentColor));
        border-radius: 4px;
      }
    }

    .xp-label {
      word-spacing: 200;
      font-size: 12px;
      color: #678793;
      display: flex;
      gap: 2px;
      margin-top: 2px;

      .highlighted {
        word-spacing: -2px;
        color: #99afb8;
      }
    }
  }
}
</style>

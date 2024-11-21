<template>
  <div class="exp">
    <span class="label">{{
      label ? 'Accumulated Experience' : 'No Experience Available'
    }}</span>
    <span v-if="label" class="exp-count">{{ label }}</span>
  </div>
</template>

<script>
import gameStore from '../state/gameStore';

export default {
  name: 'AccumulatedXpDisplay',

  props: ['data'],

  computed: {
    accumulatedExperience() {
      const { gameData, cardData } = this.data;
      const createdAt = cardData.created_at;
      const releaseDate = gameData.release_date;
      return gameStore().calculateAccumulatedExp(releaseDate, createdAt);
    },

    label() {
      const exp = this.accumulatedExperience;

      if (this.data.cardData.release_collected) {
        return 'Collected';
      } else if (!exp) {
        return false;
      }

      return `${exp} Exp`;
    }
  }
};
</script>

<style scoped>
.exp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  span {
    display: block;
    text-align: center;
  }

  .label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .exp-count {
    color: rgba(var(--accentColor));
  }
}
</style>

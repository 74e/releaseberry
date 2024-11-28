<template>
  <ul class="btn-container">
    <li
      :class="component === button.component && 'active'"
      v-for="button in buttons"
      :key="button.component"
      @click="setView(button.component)"
    >
      {{ button.label }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ViewMenu',

  props: ['component', 'setView'],

  data() {
    return {
      buttons: [
        { component: 'LeaderboardArea', label: 'Leaderboard' },
        { component: 'GlobalLibraryArea', label: 'Global library' },
        { component: 'CalenderArea', label: 'Games Calender' }
      ]
    };
  }
};
</script>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  position: relative;
  padding: 4px;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 3px;
    top: 0;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.014) 0%,
      rgba(0, 0, 0, 0.014) 5%,
      rgba(100, 102, 237, 0.6) 20%,
      rgba(var(--accentColor), 0.6) 50%,
      rgba(var(--accentColor), 0.6) 80%,
      rgba(0, 0, 0, 0.034) 95%,
      rgba(0, 0, 0, 0.034) 100%
    );
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 90%;
    height: 15px;
    top: -10%;
    z-index: -1;
    filter: blur(10px);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.014) 0%,
      rgba(0, 0, 0, 0.014) 5%,
      rgba(100, 102, 237, 0.6) 20%,
      rgba(var(--accentColor), 0.6) 50%,
      rgba(var(--accentColor), 0.6) 80%,
      rgba(0, 0, 0, 0.034) 95%,
      rgba(0, 0, 0, 0.034) 100%
    );
  }
}

li {
  font-size: 16px;
  background: none;
  list-style: none;
  color: rgba(161, 223, 247, 0.644);
  transition: all 0.3s;
  cursor: pointer;

  &.active {
    color: rgba(255, 255, 255, 0.8);
  }
}

li:hover {
  color: rgba(255, 255, 255, 0.6);
}
</style>

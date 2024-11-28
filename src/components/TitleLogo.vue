<template>
  <div class="releaseberry-logo-container">
    <h1 class="releaseberry-logo fancy-text">RELEASE BERRY</h1>
    <ReleaseBerryIcon />
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['margin']);
const nameAndCountry = computed(() => (props.margin == 's' ? '20px' : '40px'));
</script>

<style scoped>
.releaseberry-logo-container {
  width: fit-content;
  margin: auto;
  margin-bottom: v-bind(nameAndCountry);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: waveAnim forwards 6s infinite;
  animation-timing-function: ease-in-out;
  cursor: default;
  user-select: none;

  .releaseberry-logo {
    font-weight: 400;
    font-size: 54px;
    line-height: 86.85%;
    font-family: var(--font-style-mplus);
    background: linear-gradient(92.72deg, #6568ed 0%, rgba(var(--accentColor)) 100%);
    background-clip: text;
    color: transparent;

    animation: waveAnim forwards 6s infinite;
    animation-timing-function: ease-in-out;
  }

  .releaseberry-icon {
    width: 41.28px;
    height: 48px;
    cursor: default;
    user-select: none;

    transform: rotate(34.14deg) translate(5px, -4px);
  }

  @media (max-width: 500px) {
    margin-bottom: 24px;

    .releaseberry-logo {
      font-size: 36px;
      font-weight: 500;
    }

    .releaseberry-icon {
      display: none;
    }
  }

  @media (max-width: 350px) {
    .releaseberry-logo {
      font-size: 28px;
    }
  }
}

@keyframes waveAnim {
  0%,
  100% {
    filter: brightness(1);
    text-shadow:
      0 0 70px rgba(var(--accentColor), 0.4),
      0 0 70px rgba(var(--accentColor), 0.4);
  }

  50% {
    filter: brightness(1.2);
    text-shadow:
      0 0 80px rgba(var(--accentColor), 0.8),
      0 0 80px rgba(var(--accentColor), 0.8);
  }
}
</style>

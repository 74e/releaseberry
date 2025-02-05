<template>
  <Transition name="fade">
    <div v-if="showLoadingScreen" class="loading-container">
      <div class="logo">
        <ReleaseBerryIcon />
        <h1>Release berry</h1>
      </div>

      <div class="loading-bar-container">
        <div class="loading-bar" />
      </div>
      <span>Server is initalizing. Takes approximately 50 seconds</span>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    showLoadingScreen: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped>
.loading-container {
  padding: 24px;
  position: fixed;
  inset: 0;
  background-color: rgba(59, 59, 59, 0.301);
  backdrop-filter: blur(40px);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg {
    height: 60px;
    width: 60px;
  }

  .logo {
    color: rgb(var(--accentColor));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    h1 {
      font-size: 48px;
      font-weight: 500;
      font-family: var(--font-style-mplus);
      margin-top: -10px;
    }
  }

  .loading-bar-container {
    height: 16px;
    width: 500px;
    max-width: 90vw;
    margin: 8px 0 6px 0;

    border-radius: 50px;
    border: 3px solid rgba(255, 255, 255, 0.5);
    /* border: 3px solid rgba(var(--accentColor), 0.9); */

    padding: 2px;

    .loading-bar {
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      /* background-color: rgba(var(--accentColor), 0.9); */
      border-radius: 50px;
      animation: load 45s linear;
    }
  }
}

@keyframes load {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>

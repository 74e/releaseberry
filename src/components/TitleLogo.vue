<template>
  <div class="releaseberry-logo-container">
    <h1 class="releaseberry-logo fancy-text">RELEASE BERRY</h1>
    <ReleaseBerryIcon />
    <span v-if="global" class="global fancy-text">Global Library</span>
  </div>
</template>

<script>
export default {
  name: 'TitleLogo',

  props: {
    global: {
      default: false
    }
  }
};
</script>

<style scoped>
.releaseberry-logo-container {
  width: fit-content;
  margin: auto;
  margin-bottom: 40px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .releaseberry-logo {
    font-weight: 400;
    font-size: 54px;
    line-height: 86.85%;
  }

  .releaseberry-icon {
    width: 41.28px;
    height: 48px;

    transform: rotate(34.14deg) translate(5px, -4px);
  }

  .global {
    margin: auto;
    display: inline-block;
    position: absolute;
    top: calc(100% + 2px);
    font-size: 19px;
    font-weight: bold;
    opacity: 0.85;
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

    .global {
      top: 95%;
      font-size: 16px;
    }
  }

  @media (max-width: 350px) {
    .releaseberry-logo {
      font-size: 28px;
    }
  }
}

.releaseberry-logo,
.fancy-text {
  cursor: pointer;
  transition: all 0.3 ease-out;
  &:hover {
    filter: var(--hover-filter-effect);
  }
}

.fancy-text {
  font-family: var(--font-style-mplus);
  background: linear-gradient(92.72deg, #6568ed 0%, rgba(var(--accentColor)) 100%);
  background-clip: text;
  color: transparent;
}
</style>

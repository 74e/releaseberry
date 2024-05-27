<template>
  <div class="releaseberry-logo-container">
    <h1 class="releaseberry-logo fancy-text">RELEASE BERRY</h1>
    <ReleaseBerryIcon />
  </div>
</template>

<script>
import useColorStore from '../state/accentColor.js'
import { mapState } from 'pinia'

export default {
  name: 'TitleLogoComponent',

  data() {
    return {}
  },

  computed: {
    ...mapState(useColorStore, [
      'accentColor',
      'backgroundColor',
      'backgroundPosition',
      'duration'
    ])
  },

  methods: {}
}
</script>

<style scoped>
.releaseberry-logo-container {
  width: fit-content;
  margin: auto;
  margin-bottom: 40px;

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

  @media (max-width: 500px) {
    margin-bottom: 16px;

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

.releaseberry-logo,
.fancy-text {
  cursor: pointer;
  transition: all v-bind(duration + 's') ease-out;
  &:hover {
    filter: var(--hover-filter-effect);
  }
}

.fancy-text {
  font-family: var(--font-style-mplus);
  background: linear-gradient(
    92.72deg,
    #6568ed -0.12%,
    var(--accent) 40.81%,
    #6568ed 60.12%,
    v-bind(backgroundColor) 100%
  );
  background-clip: text;
  background-size: 250%;
  background-position: v-bind(backgroundPosition);
  color: transparent;
}
</style>

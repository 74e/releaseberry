<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <NavbarMenu />
  <div class="fakeBG" />
</template>

<script>
import useColorStore from './state/accentColor'
import { mapState } from 'pinia'
import { RouterView } from 'vue-router'
import NavbarMenu from './components/NavbarMenu.vue'

export default {
  components: {
    RouterView,
    NavbarMenu
  },

  computed: {
    ...mapState(useColorStore, ['accentColor', 'duration'])
  }
}
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s ease-out;
}

svg {
  cursor: pointer;
  transition: all v-bind(duration + 's') ease-out;

  &:hover {
    filter: var(--hover-filter-effect);
  }

  &.fill {
    fill: v-bind(accentColor);
  }

  &.stroke {
    stroke: v-bind(accentColor);
  }
}

.fakeBG {
  position: fixed;
  inset: 0;
  background-image: url('/fakeEffect.png');
  background-size: cover;
  mix-blend-mode: lighten;

  z-index: -20;
}
</style>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component v-if="authInitiated" :is="Component" />
    </transition>
  </router-view>
  <NavbarMenu />

  <div class="temporaryBG" />
</template>

<script>
import colorStore from './state/accentColor'
import userStore from './state/userStore'
import { mapState, mapActions } from 'pinia'
import { RouterView } from 'vue-router'
import NavbarMenu from './components/NavbarMenu.vue'

export default {
  components: {
    RouterView,
    NavbarMenu
  },

  created() {
    this.initiateApp()
  },

  provide() {
    return {
      accentColor: this.accentColor,
      backgroundColor: this.backgroundColor,
      backgroundPosition: this.backgroundPosition,
      duration: this.duration
    }
  },

  data() {
    return {
      authInitiated: false
    }
  },

  computed: {
    ...mapState(colorStore, [
      'accentColor',
      'backgroundColor',
      'backgroundPosition',
      'duration'
    ])
  },

  methods: {
    ...mapActions(userStore, ['persistentLogin', 'logout']),

    /**
     * Most of the app is relient on if the userStore has fetched
     * the currents users data. Setting this function to async
     * and letting it dictate when/if the app is initiated makes sure that
     * no matter how slow the connection is the result of any other
     * logic relient on the user will be determenistic. I'll still handle
     * each case as if it could be undefined, but this way I can be sure
     *
     * TODO: Add fancy loading screen animation
     */
    async initiateApp() {
      const session = localStorage.getItem('RBsession')
      if (session) {
        try {
          await this.persistentLogin()
        } catch (error) {
          console.error(error)
          this.logout()
        }
      }

      this.authInitiated = true
    }
  }
}
</script>

<style>
/* :root { // leaving this here as an idea
  --testvar: v-bind(accentColor);
}
Look into scss variables

*/

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

.accent-text {
  color: v-bind(accentColor);
}

.temporaryBG {
  position: fixed;
  inset: 0;
  background-image: url('/fakeEffect.png');
  background-size: cover;
  mix-blend-mode: lighten;

  z-index: -20;
}
</style>

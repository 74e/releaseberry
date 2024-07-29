<template>
  <WindowPopup
    :position="windowPosition"
    :margin="margin"
    borderRadius="s"
    :accentBorders="[borderStyle]"
    :borderWidth="1"
    ref="window"
  >
    <slot />

    <template #window>
      <div class="options-container">
        <div>
          <SettingsIcon />
          <span> Settings </span>
        </div>

        <div @click="openModal" v-if="!loggedInUser">
          <LoginIcon />
          <span> Login </span>
        </div>
        <div @click="logoutActions" v-else>
          <LogoutIcon />
          <span>Logout</span>
        </div>
      </div>
    </template>
  </WindowPopup>
</template>

<script>
import WindowPopup from './uiComponents/WindowPopup.vue'
import userStore from '@/state/userStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'SettingsMenuComponent',

  components: {
    WindowPopup
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowSize)
  },

  unmounted() {
    window.removeEventListener('resize', this.updateWindowSize)
  },

  data() {
    return {
      showSettings: false,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }
  },

  computed: {
    ...mapState(userStore, ['loggedInUser']),

    isMenuShifted() {
      return this.windowWidth > 1050 && this.windowHeight > 750
    },

    windowPosition() {
      return this.isMenuShifted ? 'right-bottom' : 'top-left'
    },

    borderStyle() {
      return this.isMenuShifted ? 'left' : 'bottom'
    },

    margin() {
      return this.isMenuShifted ? 12 : 28
    }
  },

  methods: {
    ...mapActions(userStore, ['logout']),

    openModal() {
      this.$emit('openModal')

      // Close the the window/popup from here (aka parent component)
      this.$refs.window.showWindow = false
    },

    logoutActions() {
      this.logout()
      this.$refs.window.showWindow = false

      this.$router.push('/')
    },

    updateWindowSize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    }
  }
}
</script>

<style scoped>
.options-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  div {
    display: flex;
    padding: 8px 0 8px 12px;
    cursor: pointer;
    width: 120px;
    border-radius: var(--radius-s);
    background-color: var(--light-fg);
    border: 1px solid rgba(255, 255, 255, 0.123);
    transition: all 0.3s ease-out;

    &:hover {
      filter: brightness(1.3);
    }

    .logout-icon {
      filter: invert(1);
    }

    svg {
      margin-right: 16px;
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 14px;
      font-weight: 300;
    }
  }
}
</style>

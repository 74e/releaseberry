<template>
  <WindowPopup
    :position="windowPosition"
    :margin="margin"
    width="130"
    borderRadius="s"
    :accentBorders="[borderStyle]"
    :borderWidth="1"
    ref="window"
  >
    <slot />

    <template #window>
      <div class="options-container">
        <RouterLink
          class="item"
          :to="`/settings`"
          @click="closeWindow"
          v-if="loggedInUser"
        >
          <SettingsIcon />
          <span> Settings </span>
        </RouterLink>

        <div class="item" @click="openModal" v-if="!loggedInUser">
          <LoginIcon />
          <span> Login </span>
        </div>
        <div class="item" @click="logoutActions" v-else>
          <LogoutIcon />
          <span>Logout</span>
        </div>
      </div>
    </template>
  </WindowPopup>
</template>

<script>
import WindowPopup from './uiComponents/WindowPopup.vue';
import userStore from '@/state/userStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'SettingsMenu',

  components: {
    WindowPopup
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowSize);
  },

  unmounted() {
    window.removeEventListener('resize', this.updateWindowSize);
  },

  data() {
    return {
      showSettings: false,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  },

  computed: {
    ...mapState(userStore, ['loggedInUser']),

    isMenuShifted() {
      return this.windowWidth > 750;
    },

    windowPosition() {
      return this.isMenuShifted ? 'right-bottom' : 'top-left';
    },

    borderStyle() {
      return this.isMenuShifted ? 'left' : 'bottom';
    },

    margin() {
      return this.isMenuShifted ? 12 : 28;
    }
  },

  methods: {
    ...mapActions(userStore, ['logout']),

    closeWindow() {
      this.$refs.window.showWindow = false;
    },

    openModal() {
      this.$emit('openModal');
      this.closeWindow();
    },

    logoutActions() {
      this.logout();
      this.closeWindow();
      this.$router.push('/main');
    },

    updateWindowSize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }
};
</script>

<style scoped>
.options-container {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .item {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
    font-size: 14px;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: var(--radius-s);

    span {
      flex: 1;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.171);
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }

  .logout-icon {
    filter: invert(1);
    height: 15px;
  }

  .login-icon {
    height: 15px;
  }
}
</style>

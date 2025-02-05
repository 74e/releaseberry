<template>
  <div class="page-container">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component v-if="authInitiated" :is="Component" />
      </transition>
    </RouterView>
    <NavbarMenu />
  </div>

  <ToasterComponent />
  <ProfileImagePreloader />
  <InitializationLoadingScreen :showLoadingScreen="!authInitiated" />
  <BackgroundDisplay />
</template>

<script>
import InitializationLoadingScreen from './components/InitializationLoadingScreen.vue';
import BackgroundDisplay from './components/BackgroundDisplay.vue';
import colorStore from './state/colorStore';
import userStore from './state/userStore';
import { toastStore } from './state/toastStore';
import { mapState, mapActions } from 'pinia';
import { RouterView } from 'vue-router';
import NavbarMenu from './components/NavbarMenu.vue';
import ToasterComponent from './components/ToasterComponent.vue';
import ProfileImagePreloader from './components/ProfileImagePreloader.vue';
import cc from './helperFunctions/color';

export default {
  components: {
    InitializationLoadingScreen,
    RouterView,
    NavbarMenu,
    ToasterComponent,
    ProfileImagePreloader,
    BackgroundDisplay
  },

  data() {
    return {
      authInitiated: false
    };
  },

  created() {
    this.initiateApp();
  },

  computed: {
    ...mapState(colorStore, ['accentColor'])
  },

  watch: {
    accentColor: {
      handler() {
        document.documentElement.style.setProperty(
          '--accentColor',
          cc.hexToRgb(this.accentColor)
        );
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions(userStore, ['persistentLogin', 'logout']),

    /*
     * TODO: Add fancy loading screen animation
     */

    async initiateApp() {
      const session = localStorage.getItem('RBsession');
      if (session) {
        try {
          await this.persistentLogin();
          const { username } = userStore().loggedInUser;

          toastStore().add({
            icon: 'ProfileIcon',
            message: `Welcome back ${username}`
          });

          this.$router.push('/library');
        } catch (error) {
          toastStore().handleErrorMessage(error, `Something went wrong, couldn't login`);
          this.logout();
          this.$router.push('/');
        }
      }

      this.authInitiated = true;
    }
  }
};
</script>

<style>
.page-container {
  padding: 0 0 0 45px;
  margin: auto;
  /* max-width: 1920px; */

  @media (max-width: 750px) {
    padding: 0 0 45px 0;
  }
}

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
  transition: all 0.4s ease-out;

  &:hover {
    filter: var(--hover-filter-effect);
  }

  &.fill {
    fill: rgba(var(--accentColor));
  }

  &.stroke {
    stroke: rgba(var(--accentColor));
  }
}

.accent-text {
  color: rgba(var(--accentColor));
}
</style>

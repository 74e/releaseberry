<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/">
          <div class="icon-box">
            <ReleaseBerryIcon />
          </div>
        </RouterLink>
      </li>

      <li>
        <RouterLink to="/library">
          <div class="icon-box">
            <LibraryIcon />
          </div>
        </RouterLink>
      </li>

      <li>
        <RouterLink v-if="user" :to="`/user/${this.userHandle || ''}`">
          <div class="icon-box">
            <ProfileIcon />
          </div>
        </RouterLink>

        <NotLoggedInWindow
          v-else
          @openAuthModal="openAuthModal"
          @openAuthSignUpModal="openAuthSignUpModal"
        />
      </li>

      <li @click="openUserSearchModal">
        <div class="icon-box">
          <SearchIcon />
        </div>
      </li>

      <SettingsMenu @openModal="openAuthModal">
        <div class="icon-box dot">
          <DotMenuIcon />
        </div>
      </SettingsMenu>
    </ul>
  </nav>

  <TransitionGroup name="fade">
    <AuthModal ref="authModal" v-if="showAuthModal" v-model:showModal="showAuthModal" />
    <UserSearchModal
      ref="UserSearchModal"
      v-if="showUserSearchModal"
      v-model:showModal="showUserSearchModal"
    />
  </TransitionGroup>
</template>

<script>
import userStore from '@/state/userStore';
import SettingsMenu from './SettingsMenu.vue';
import AuthModal from './AuthModal.vue';
import UserSearchModal from './UserSearchModal.vue';
import NotLoggedInWindow from './NotLoggedInWindow.vue';

export default {
  name: 'NavbarMenu',

  components: {
    SettingsMenu,
    AuthModal,
    UserSearchModal,
    NotLoggedInWindow
  },

  data() {
    return {
      showAuthModal: false,
      showUserSearchModal: false
    };
  },

  computed: {
    user() {
      return userStore().user;
    },

    userHandle() {
      return this.user?.handle;
    }
  },

  methods: {
    openAuthModal() {
      this.showAuthModal = true;
    },

    openAuthSignUpModal() {
      this.showAuthModal = true;
      this.$nextTick(() => {
        this.$refs.authModal.showLogin = false;
      });
    },

    openUserSearchModal() {
      this.showUserSearchModal = true;
    }
  }
};
</script>

<style scoped>
nav {
  width: 45px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 26px;

    @media (max-width: 750px) {
      flex-direction: row;
    }

    li {
      display: flex;
      cursor: pointer;
    }
    .icon-box {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .dot {
      margin-top: -4px;
    }
  }

  @media (max-width: 750px) {
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 50px;
    bottom: 0;
    top: unset;

    .dot {
      margin-top: 0 !important;
    }
  }
}

span {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  color: rgba(var(--accentColor));
  padding: 8px 16px;
  display: none;
}

a {
  transition: all 0.3s ease-out;
}

.router-link-active {
  filter: var(--hover-filter-effect);
}

nav {
  background-color: var(--dark-50);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 11px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-m);
}
</style>

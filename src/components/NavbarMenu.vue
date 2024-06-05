<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/">
          <ReleaseBerryIcon />
          <span>Notes</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink :to="`/user/${this.username || ''}`">
          <ProfileIcon />
          <span>Profile</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink to="/notes">
          <NotesIcon />
          <span>Notes</span>
        </RouterLink>
      </li>

      <li @click="openUserSearchModal">
        <SearchIcon />
      </li>

      <SettingsMenu @openModal="openAuthModal">
        <li>
          <DotMenuIcon />
        </li>
      </SettingsMenu>
    </ul>

    <div class="active-link-indicator" />
  </nav>
  <AuthModal v-model:showModal="showAuthModal" />
  <UserSearchModal ref="UserSearchModal" v-model:showModal="showUserSearchModal" />
</template>

<script>
import colorStore from '@/state/accentColor'
import userStore from '@/state/userStore'
import SettingsMenu from './SettingsMenu.vue'
import { mapState } from 'pinia'
import AuthModal from './AuthModal.vue'
import UserSearchModal from './UserSearchModal.vue'

export default {
  name: 'NavbarMenuComponent',

  components: {
    SettingsMenu,
    AuthModal,
    UserSearchModal
  },

  data() {
    return {
      navItems: [{ pathName: 'main' }, { pathName: 'profile' }, { pathName: 'notes' }],
      renderedNavItems: null,
      currentIndex: 0,
      indicatorOffset: null,
      showAuthModal: false,
      showUserSearchModal: false
    }
  },

  watch: {
    $route: {
      handler(updatedRoute) {
        this.currentIndex = this.navItems.findIndex((item) => {
          return item.pathName === updatedRoute.name
        })

        this.setActiveLinkIndicator(this.currentIndex)
      },
      deep: true
    }
  },

  computed: {
    ...mapState(colorStore, ['accentColor']),
    ...mapState(userStore, ['username']),

    RenderedmavItems() {
      return this.navItems.map((item) => {
        if (item.pathName === 'profile' && this.username) {
          item.path += `/${this.username}`
        }
        return item
      })
    }
  },

  methods: {
    setActiveLinkIndicator(index = 0) {
      this.currentIndex = index
      // --------------------  BAD SOLUTION  -----------------------------------------
      const startingOffset = 35
      const distanceToNextItem = 17.6
      this.indicatorOffset = `${index * distanceToNextItem}% + ${startingOffset}px`
    },

    openAuthModal() {
      this.showAuthModal = true
    },

    openUserSearchModal() {
      this.showUserSearchModal = true
      this.$refs.UserSearchModal.focusSearch()
    }
  }
}
</script>

<style scoped>
nav {
  width: 65px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 50%;
  left: 24px;
  transform: translateY(50%);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    width: 100%;
    height: 100%;

    @media (max-width: 1050px), (max-height: 750px) {
      flex-direction: row;
    }

    li {
      height: 22px;
      width: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease-out;

      &:hover {
        filter: var(--hover-filter-effect);
      }

      &:hover span {
        display: block;
        animation: delayedFadeIn 0.8s;

        @media (max-width: 1050px), (max-height: 750px) {
          display: none;
        }
      }
    }
  }

  @media (max-width: 1220px) {
    width: 54px;
    left: 0;
    border-radius: 0 var(--radius-m) var(--radius-m) 0 !important;
  }

  @media (max-width: 1050px), (max-height: 750px) {
    flex-direction: row;
    width: 340px;
    height: 65px;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    border-radius: var(--radius-m) !important;
  }

  @media (max-width: 336px) {
    bottom: 0;
  }

  .active-link-indicator {
    width: 3px;
    height: 30px;
    background-color: v-bind(accentColor);
    filter: brightness(120%);
    border-radius: 2px;
    position: absolute;
    top: calc(v-bind(indicatorOffset));
    right: 0;
    transition: all 0.3s ease-out;

    @media (max-width: 1050px), (max-height: 750px) {
      top: 0;
      left: calc(v-bind(indicatorOffset));
      height: 3px;
      width: 30px;
    }
  }
}

span {
  position: absolute;
  top: 50%;
  left: 60px;
  transform: translateY(-50%);
  color: v-bind(accentColor);
  padding: 8px 16px;
  display: none;
}

a {
  transition: all 0.3s ease-out;
}

.router-link-active {
  filter: var(--hover-filter-effect);
}

nav,
span {
  background-color: var(--dark-50);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 11px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-m);
}

@keyframes delayedFadeIn {
  0% {
    display: block;
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

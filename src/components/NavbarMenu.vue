<template>
  <nav>
    <ul>
      <li
        v-for="(menuItem, index) in menuItems"
        @click="handleClick(index, menuItem)"
        :class="{ active: menuItems[currentIndex].component === menuItem.component }"
        :key="menuItem.component"
      >
        <component :is="menuItem.component" />
        <span v-if="menuItem.name">{{ menuItem.name }}</span>
      </li>
    </ul>

    <div class="active-link-indicator" />
  </nav>
</template>

<script>
import useColorStore from '@/state/accentColor'
import useUserStore from '@/state/user'
import { mapState } from 'pinia'

export default {
  name: 'NavbarMenuComponent',

  data() {
    return {
      menuItems: [
        { name: 'Home', path: '/', component: 'ReleaseBerryIcon' },
        { name: 'Profile', path: `/user`, component: 'ProfileIcon' },
        { name: 'Notes', path: '/notes', component: 'NotesIcon' },
        { name: 'Calendar', path: '/calendar', component: 'CalendarIcon' },
        { component: 'DotMenuIcon' }
      ],
      currentIndex: 0,
      indicatorOffset: null
    }
  },

  computed: {
    ...mapState(useColorStore, ['accentColor']),
    ...mapState(useUserStore, ['userName'])
  },

  mounted() {
    this.setActiveLinkIndicator()
  },

  methods: {
    handleClick(index, menuItem) {
      this.setActiveLinkIndicator(index)
      this.menuAction(menuItem)
    },

    menuAction(menuItem) {
      if (menuItem.path) {
        let link = menuItem.path
        if (menuItem.path === '/user') link += `/${this.userName}`

        this.$router.push(link)
        return
      }
    },

    setActiveLinkIndicator(index = 0) {
      this.currentIndex = index
      if (index > 3) return
      // --------------------  BAD SOLUTION  -----------------------------------------
      const startingOffset = 35
      const percentOffset = 17.6
      this.indicatorOffset = `${index * percentOffset}% + ${startingOffset}px`
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

.active {
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

<template>
  <div class="toolbar">
    <div class="list-button-container">
      <WindowMenu>
        <ListIcon />

        <template #window> testing text for window </template>
      </WindowMenu>
    </div>

    <div class="menu-buttons">
      <Transition name="fade" mode="out-in">
        <component @click="toggleSearchField" :is="searchIcon" />
      </Transition>
      <!-- <FilterIcon /> TODO ADD FILTER FUNCTION -->
      <WindowMenu>
        <ThemeIcon />
        <template #window> testing text for window </template>
      </WindowMenu>

      <LayoutIcon />

      <button class="add-title-button">
        <PlusIcon />
        Add
      </button>
    </div>
  </div>

  <SearchField
    :showSearchField="showSearchField"
    @search="search"
    @toggle-search-field="toggleSearchField"
  />
</template>

<script>
import useColorStore from '../state/accentColor.js'
import SearchField from './SearchField.vue'
import WindowMenu from './WindowMenu.vue'
import { mapState } from 'pinia'

export default {
  name: 'CardToolbarComponent',

  components: {
    SearchField,
    WindowMenu
  },

  data() {
    return {
      showSearchField: false
    }
  },

  computed: {
    ...mapState(useColorStore, [
      'accentColor',
      'backgroundColor',
      'backgroundPosition',
      'duration'
    ]),

    searchIcon() {
      return this.showSearchField ? 'CloseIcon' : 'SearchIcon'
    }
  },

  methods: {
    toggleSearchField() {
      this.showSearchField = !this.showSearchField
    },

    search(query) {
      console.log(query, 'searching')
    }
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  max-width: 928px;
  height: 50px;
  margin: auto;
  padding: 0 14px;

  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(80px);

  display: flex;
  justify-content: space-between;
  position: relative;

  .list-button-container {
    display: flex;
    align-items: center;
  }

  .menu-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;

    .add-title-button {
      display: flex;
      align-items: center;
      padding: 3px 8px 3px 4px;
      font-size: 16px;

      background-color: transparent;
      color: v-bind(accentColor);
      border: 2px solid v-bind(accentColor);
      border-radius: 4px;

      svg {
        margin-right: 4px;
      }
    }
  }

  .close-icon {
    filter: invert(0.8);

    &:hover {
      filter: invert(0.8) var(--hover-filter-effect);
    }
  }

  @media (max-width: 350px) {
    height: 44px;

    .menu-buttons {
      gap: 12px;

      .add-title-button {
        font-size: 14px;
        padding: 2px 6px 3px 4px;
        border-width: 1px;
      }
    }

    svg {
      height: 19px;
    }

    .close-icon {
      height: 24px !important;
    }
  }
}

.add-title-button {
  cursor: pointer;
  transition: all v-bind(duration + 's') ease-out;
  &:hover {
    filter: var(--hover-filter-effect);
  }
}
</style>

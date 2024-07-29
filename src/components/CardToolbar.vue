<template>
  <div class="toolbar">
    <div class="list-btn-container">
      <WindowPopup position="bottom-right">
        <ListIcon />

        <template #window> testing text for window </template>
      </WindowPopup>
    </div>

    <div class="menu-btns">
      <Transition name="fade" mode="out-in">
        <component @click="toggleSearchField" :is="searchIcon" />
      </Transition>
      <!-- <FilterIcon /> TODO ADD FILTER FUNCTION -->
      <WindowPopup position="left-center">
        <ThemeIcon />
        <template #window> testing text for window </template>
      </WindowPopup>

      <LayoutIcon />

      <button @click="toggleAddGameModal" class="add-title-btn">
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
  <AddGameModal v-model:showModal="showAddGameModal" />
</template>

<script>
import SearchField from './SearchField.vue'
import WindowPopup from './uiComponents/WindowPopup.vue'
import AddGameModal from './AddGameModal.vue'

export default {
  name: 'CardToolbarComponent',

  components: {
    SearchField,
    WindowPopup,
    AddGameModal
  },

  inject: ['accentColor', 'backgroundColor', 'backgroundPosition', 'duration'],

  data() {
    return {
      showSearchField: false,
      showAddGameModal: false
    }
  },

  computed: {
    searchIcon() {
      return this.showSearchField ? 'CloseIcon' : 'SearchIcon'
    }
  },

  methods: {
    toggleSearchField() {
      this.showSearchField = !this.showSearchField
    },

    toggleAddGameModal() {
      this.showAddGameModal = !this.showAddGameModal
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

  .list-btn-container {
    display: flex;
    align-items: center;
  }

  .menu-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;

    .add-title-btn {
      display: flex;
      align-items: center;
      padding: 3px 8px 3px 4px;
      font-size: 16px;

      background-color: transparent;
      color: v-bind(accentColor);
      border: 2px solid v-bind(accentColor + 'c7');
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

    .menu-btns {
      gap: 12px;

      .add-title-btn {
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

.add-title-btn {
  cursor: pointer;
  transition: all v-bind(duration + 's') ease-out;

  &:hover {
    filter: var(--hover-filter-effect);
  }
}
</style>

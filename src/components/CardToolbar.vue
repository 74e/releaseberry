<template>
  <div class="toolbar">
    <div class="list-btn-container">
      <WindowPopup position="bottom-right">
        <ListIcon />

        <template #window>
          <GameListMenu />
        </template>
      </WindowPopup>
    </div>

    <div class="menu-btns">
      <Transition name="fade" mode="out-in">
        <component @click="toggleSearchField" :is="searchIcon" />
      </Transition>

      <WindowPopup position="bottom-left">
        <FilterIcon />
        <template #window>
          <LibraryFilterMenu />
        </template>
      </WindowPopup>

      <!-- <WindowPopup>
        <LayoutIcon />
        <template #window>
          <div style="padding: 16px; width: 150px; text-align: center">
            Layout settings coming soon
          </div>
        </template>
      </WindowPopup> -->

      <button @click="$emit('toggleAddGameModal')" class="add-title-btn">
        <PlusIcon />
        Add
      </button>
    </div>
  </div>

  <ToolBarSearchField
    :showSearchField="showSearchField"
    @toggle-search-field="toggleSearchField"
  />
</template>

<script>
import ToolBarSearchField from './ToolBarSearchField.vue';
import WindowPopup from './uiComponents/WindowPopup.vue';
import LibraryFilterMenu from './LibraryFilterMenu.vue';
import GameListMenu from './GameListMenu.vue';
import AddGameModal from './AddGameModal.vue';

export default {
  name: 'CardToolbar',

  emits: ['toggleAddGameModal'],

  components: {
    ToolBarSearchField,
    WindowPopup,
    AddGameModal,
    GameListMenu,
    LibraryFilterMenu
  },

  data() {
    return {
      showSearchField: false
    };
  },

  computed: {
    searchIcon() {
      return this.showSearchField ? 'CloseIcon' : 'SearchIcon';
    }
  },

  methods: {
    toggleSearchField() {
      this.showSearchField = !this.showSearchField;
    }
  }
};
</script>

<style scoped>
.toolbar {
  width: 100%;
  max-width: 928px;
  height: 50px;
  margin: auto;
  padding: 0 14px;
  z-index: 1;

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
      color: rgba(var(--accentColor));
      border: 2px solid rgba(var(--accentColor), 0.78);
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
  transition: all 0.3s ease-out;

  &:hover {
    filter: var(--hover-filter-effect);
  }
}
</style>

<template>
  <Transition
    @after-enter="initializeSearchField"
    @after-leave="deinitializeSearchField"
    name="fade-grow"
  >
    <div v-show="showSearchField" class="search-field">
      <input
        type="text"
        ref="searchField"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search"
      />
      <SearchIcon />
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ToolBarSearchField',

  props: {
    showSearchField: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
      isActive: false,
      focusTimeout: null
    };
  },

  computed: {
    animDurationInMs() {
      return this.animDuration * 1000;
    }
  },

  mounted() {
    document.addEventListener('keyup', this.handleSearchHotKeys);
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('keyup', this.handleSearchHotKeys);
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    handleSearch() {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        this.$emit('search', this.searchQuery);
      }, 500);
    },

    initializeSearchField() {
      this.isActive = true;
      this.$refs.searchField.focus();
    },

    deinitializeSearchField() {
      this.isActive = false;
      this.searchQuery = '';
    },

    handleSearchHotKeys(e) {
      if (e.key === 'Escape' && this.showSearchField) {
        this.$emit('toggleSearchField');
      }

      if (e.target.nodeName === 'INPUT') return;

      if (e.key === 'f' && !this.showSearchField) {
        this.$emit('toggleSearchField');
      }
    },

    /*
     * this.isActive prevents handleClickOutside from triggering when clincking on the search icon
     * this.showSearchField prevents handleClickOutside from triggering when clicking on the X icon
     *
     * This happens because the icon clicking itself triggers a toggle, without these values it double toggles
     */
    handleClickOutside(e) {
      if (
        !this.$refs.searchField.contains(e.target) &&
        this.$refs.searchField !== e.target &&
        this.showSearchField &&
        this.isActive
      ) {
        this.$emit('toggleSearchField');
      }
    }
  }
};
</script>

<style scoped>
.search-field {
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(80px);
  height: 50px;
  width: 320px;
  margin: 26px auto 0 auto;

  padding: 0 12px 0 16px;
  display: flex;
  align-items: center;

  @media (max-width: 350px) {
    margin: 12px auto 0 auto;
    height: 44px;
  }

  .search-icon {
    width: 34px;
  }

  input {
    width: 100%;
    height: 100%;
    font-size: 16px;
    background-color: transparent;
    border: none;
    outline: none;
    border-radius: var(--radius-l);
    color: var(--text-color);
  }

  @media (max-width: 350px) {
    width: 100%;
  }
}

.fade-grow-enter-active,
.fade-grow-leave-active {
  transition: all 0.25s ease;
  height: 50px;
  margin: 26px auto 0 auto;

  @media (max-width: 350px) {
    margin: 12px auto 0 auto;
    height: 44px;
  }
}

.fade-grow-enter-from,
.fade-grow-leave-to {
  opacity: 0;
  height: 0px;
  margin: 0 auto;
}
</style>

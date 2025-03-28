<template>
  <div class="search-field">
    <input
      type="text"
      ref="searchField"
      v-model="searchQuery"
      @input="handleSearch"
      :placeholder="disabled ? '' : 'Search'"
      :disabled="disabled"
    />
    <SearchIcon />
  </div>
</template>

<script>
export default {
  name: 'SearchField',

  props: {
    timeoutDelay: {
      default: 500
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchQuery: '',
      searchTimeout: null
    };
  },

  mounted() {
    this.$refs.searchField.focus();
  },

  methods: {
    changeQuery(query = '') {
      this.searchQuery = query;
    },

    handleSearch() {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        this.$emit('search', this.searchQuery);
      }, this.timeoutDelay);
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
  width: 100%;

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
</style>

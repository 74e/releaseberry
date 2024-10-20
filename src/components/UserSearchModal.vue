<template>
  <ModalPopup
    :closeButton="false"
    :clickOutside="true"
    :blur="true"
    :accentBorders="['right', 'left']"
    ref="modal"
  >
    <div class="search-container">
      <div class="search-field">
        <input
          type="text"
          ref="userSearchInput"
          v-model="searchValue"
          @input="handleUserSearch"
          placeholder="Search for a user"
        />
        <CloseIcon @click="close" />
      </div>

      <div class="results-container">
        <div class="results" v-if="results.length > 0 && searchValue">
          <TransitionGroup name="fade" tag="div">
            <UserSearchItem
              v-for="result in sortedResults"
              :key="result.id"
              :item="result"
            />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import userStore from '@/state/userStore';
import { mapActions } from 'pinia';
import UserSearchItem from './UserSearchItem.vue';

export default {
  name: 'UserSearchModal',

  components: {
    ModalPopup,
    UserSearchItem
  },

  inject: ['accentColor'],

  data() {
    return {
      searchValue: '',
      results: [],
      searchTimer: null
    };
  },

  computed: {
    sortedResults() {
      return this.results.toSorted((a, b) => a.username.length - b.username.length);
    }
  },

  mounted() {
    this.focusSearch();
  },

  methods: {
    ...mapActions(userStore, ['userSearch']),

    close() {
      this.$refs.modal.hide();
    },

    focusSearch() {
      this.$refs.userSearchInput.focus();
    },

    handleUserSearch() {
      clearTimeout(this.searchTimer);
      if (!this.searchValue) return;

      this.searchTimer = setTimeout(async () => {
        const searchResults = await this.userSearch(this.searchValue);
        this.results = searchResults;
      }, 500);
    }
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px;

  width: 400px;
  height: 600px;

  @media (max-width: 428px) {
    width: 98vw;
    height: 99vh;
  }

  .search-field {
    position: relative;
    width: 100%;

    input {
      width: 100%;
      padding: 8px 12px;
      border-radius: var(--radius-m);
      background-color: var(--dark-fg);
      border: 1px solid #ffffff1c;
      border-bottom: 1px solid v-bind(accentColor);
      color: var(--default-font-color);
      font-size: 15px;
      outline: none;

      &:focus {
        outline: 1px solid v-bind(accentColor + '90');
      }
    }

    .close-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }

  .results-container {
    width: 100%;
    height: 100%;
    padding: 8px;

    overflow: hidden;
    overflow-y: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .no-results {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 18px;
      color: rgb(116, 131, 145);
      text-align: center;
    }
  }
}
</style>

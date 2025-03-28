<template>
  <div class="menu-container">
    <span class="order-by-heading">Filter by Release status</span>
    <ul class="status-selection">
      <li
        v-for="status in availableReleaseStatus"
        :class="status === filterOptions.status && 'active'"
        @click="setReleaseStatus(status)"
        :key="status"
      >
        {{ status }}
      </li>
    </ul>

    <span class="order-by-heading">Order by:</span>

    <div class="filter-section">
      <div
        v-for="option in availableOptions"
        :key="option"
        @click="setFilterOption(option)"
        :class="['order-by-item', { active: filterOptions.option == option }]"
      >
        <span>{{ option }}</span>

        <div v-if="filterOptions.option == option" class="order">
          <span
            v-for="order in ['asc', 'desc']"
            :key="order"
            @click="(e) => setOrder(order, e)"
            :class="order === filterOptions.order && 'active'"
          >
            {{ order }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameStore from '../state/gameStore';

export default {
  name: 'GlobalLibraryFilterMenu',

  inject: ['hide'],

  data() {
    return {
      availableReleaseStatus: ['all', 'unreleased', 'released'],
      availableOptions: ['Latest Added', 'Release Date', 'Most Popular']
    };
  },

  computed: {
    filterOptions() {
      return gameStore().globalFilterLibraryOptions;
    }
  },

  methods: {
    setReleaseStatus(status) {
      this.filterOptions.status = status;
      this.getFilteredGames();
    },

    setFilterOption(option) {
      this.filterOptions.option = option;
      this.filterOptions.order = 'desc';
      this.getFilteredGames();
    },

    setOrder(order, e) {
      e.stopPropagation();
      this.filterOptions.order = order;
      this.getFilteredGames();
    },

    getFilteredGames() {
      this.$emit('getGlobalGames');
      this.hide();
    }
  }
};
</script>

<style scoped>
.menu-container {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 12px 12px 12px;
}

.status-selection {
  list-style: none;
  display: flex;
  width: max-content;
  border: 1px solid rgba(255, 255, 255, 0.041);
  background-color: rgba(184, 184, 184, 0.048);
  border-radius: 8px;
  overflow: hidden;
  margin: auto;
  user-select: none;

  li {
    padding: 6px 12px;
    color: rgba(255, 255, 255, 0.425);
    transition: all 0.2s ease-in;
    font-size: 15px;
    cursor: pointer;
    text-transform: capitalize;

    &.active,
    &:hover {
      background-color: rgba(184, 184, 184, 0.089);
      color: rgba(255, 255, 255, 0.644);
    }
  }
}

.order-by-heading {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.274);
  margin-top: 2px;
}

.filter-section {
  display: grid;
  gap: 6px;

  .order-by-item {
    border: 1px solid rgba(255, 255, 255, 0.041);
    background-color: rgba(184, 184, 184, 0.048);
    border-radius: 8px;
    padding: 6px 12px;
    width: 100%;
    overflow: hidden;
    margin: auto;
    user-select: none;
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.411);
    transition: all 0.2s ease-in;
    cursor: pointer;
    font-size: 15px;

    &:hover {
      background-color: rgba(184, 184, 184, 0.123);
      color: rgba(255, 255, 255, 0.5);
    }

    &.active {
      color: rgba(255, 255, 255, 0.63);
      background-color: rgba(184, 184, 184, 0.123);
      position: relative;

      &::after {
        content: '';
        background-color: rgba(var(--accentColor));
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        border-radius: 2px;
      }

      .order {
        span.active {
          color: rgba(255, 255, 255, 0.753);
        }
      }
    }

    .order {
      display: flex;
      gap: 8px;
      color: rgba(255, 255, 255, 0.274);

      span {
        &:hover {
          color: rgba(255, 255, 255, 0.753);
        }
      }
    }
  }
}
</style>

<template>
  <div class="menu-container">
    <span class="order-by-heading">Filter by Card Type</span>
    <ul class="status-selection">
      <li :class="selectedCard === null && 'active'" @click="selectCard(null)">
        All cards <span class="muted">(default)</span>
      </li>
      <li
        :class="card.card_component === selectedCard && 'active'"
        @click="selectCard(card.card_component)"
        v-for="card in cardTypes"
        :key="card.card_component"
      >
        {{ card.card_name }}
      </li>
    </ul>

    <span class="order-by-heading">Order by:</span>
    <div class="filter-section">
      <div
        v-for="option in availableOptions"
        :key="option"
        @click="setFilterOption(option.order)"
        :class="['order-by-item', { active: cardFilterOptions.order == option.order }]"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import cardStore from '@/state/cardStore';
import { mapState } from 'pinia';

export default {
  name: 'CardFilterMenu',

  inject: ['hide'],

  data() {
    return {
      availableOptions: [
        { label: 'Newest Added', order: 'desc' },
        { label: 'Oldest Added', order: 'asc' }
      ]
    };
  },

  computed: {
    ...mapState(cardStore, ['cardConfigs', 'cardFilterOptions']),

    cardTypes() {
      if (!this.cardConfigs) return [];

      return this.cardConfigs.map((c) => ({
        card_component: c.card_component,
        card_name: c.card_name
      }));
    },

    selectedCard() {
      return this.cardFilterOptions.selectedCard;
    }
  },

  mounted() {
    console.log(this.cardConfigs);
  },

  methods: {
    selectCard(card) {
      cardStore().cardFilterOptions.selectedCard = card;
      this.$emit('getCardConfigsByGame');
      this.hide();
    },

    setFilterOption(order) {
      cardStore().cardFilterOptions.order = order;
      this.$emit('getCardConfigsByGame');
      this.hide();
    }
  }
};
</script>

<style scoped>
.menu-container {
  width: 230px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 12px 12px 12px;
}

.status-selection {
  list-style: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.041);
  background-color: rgba(184, 184, 184, 0.048);
  border-radius: 8px;
  overflow: hidden;
  user-select: none;

  li {
    padding: 6px 12px;
    color: rgba(255, 255, 255, 0.425);
    transition: all 0.2s ease-in;
    font-size: 15px;
    cursor: pointer;
    text-transform: capitalize;
    position: relative;

    span {
      color: rgba(255, 255, 255, 0.225);
    }

    &.active,
    &:hover {
      background-color: rgba(184, 184, 184, 0.089);
      color: rgba(255, 255, 255, 0.644);
    }

    &.active {
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

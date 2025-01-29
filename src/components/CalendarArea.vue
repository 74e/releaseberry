<template>
  <div class="game-calendar-container">
    <TransitionGroup tag="div" name="motion" class="game-calendar-list">
      <template v-for="(game, index) in calendarData" :key="game.id">
        <div class="date-divider">
          <span>{{ formatDate(game.release_date) }}</span>
          <div class="line" />
        </div>
        <CalendarItem :game="game" :index="index" @expandImage="expandImage" />
      </template>
    </TransitionGroup>

    <Transition name="fade">
      <ImageViewModal
        v-if="showImageModal"
        v-model:showModal="showImageModal"
        :screenshots="payload.screenshots"
        :index="payload.index"
      />
    </Transition>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import { toastStore } from '@/state/toastStore';
import CalendarItem from './CalendarItem.vue';
import ImageViewModal from './ImageViewModal.vue';

export default {
  name: 'GameCalendar',

  components: { CalendarItem, ImageViewModal },

  data() {
    return {
      calendarData: null,
      showImageModal: false,
      payload: null
    };
  },

  mounted() {
    this.initGameCalendar();
  },

  unmounted() {},

  methods: {
    async initGameCalendar() {
      try {
        const data = await gameStore().getGameCalendar();
        this.calendarData = data;
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not load calendar games');
      }
    },

    expandImage(payload) {
      this.payload = payload;
      this.showImageModal = true;
    },

    formatDate(time) {
      const postDate = new Date(time);
      const now = new Date();

      const { day, month, year } = gameStore().convertToDate(postDate);
      if (year !== now.getFullYear()) return `${day} ${month} ${year}`;
      return `${day} ${month}`;
    }
  }
};
</script>

<style scoped>
.game-calendar-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

.date-divider {
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 680px;
  text-transform: uppercase;
  color: rgba(var(--accentColor), 0.9);

  span {
    text-wrap: nowrap;
  }

  .line {
    height: 2px;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(var(--accentColor), 0.2) 0%,
      rgba(var(--accentColor), 0.5) 100%
    );
  }
}

.motion-move,
.motion-enter-active {
  transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1) !important;
}

.motion-enter-from {
  opacity: 0 !important;
  transform: translateY(50px);
}
</style>

<template>
  <TransitionGroup tag="div" name="motion" class="card-display-container">
    <component
      v-for="card in filteredLibrary"
      :is="card.cardData.card_component"
      :gameData="card.gameData"
      :cardData="card.cardData"
      :key="card.gameData.id"
      :class="dragStartCardId == getCustomGameId(card) && 'moving'"
      @click="$emit('triggerGameModal', card)"
      @dragstart="(e) => startdrag(getCustomGameId(card), e)"
      @dragenter="enterdrag(getCustomGameId(card))"
      @dragend="enddrag(getCustomGameId(card))"
      :draggable="true"
    />
  </TransitionGroup>
</template>

<script>
import gameStore from '@/state/gameStore';
import { toastStore } from '@/state/toastStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'LibraryContainer',

  emits: ['triggerGameModal'],

  data() {
    return {
      dragStartCardId: null,
      movingCards: [],
      dragGhostImg: null,
      hasMoved: false
    };
  },

  mounted() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  },

  computed: {
    ...mapState(gameStore, [
      'library',
      'selectedGameListId',
      'filterLibraryOptions',
      'filterSearchTerm'
    ]),

    customGameIds() {
      return this.library.map((c) => c.cardData.custom_game_config_id);
    },

    areCardsMovable() {
      return Boolean(this.selectedGameListId);
    },

    filterStatus() {
      return this.filterLibraryOptions.status;
    },

    filteredLibrary() {
      if (!this.library) return [];

      let filtered = this.library;

      if (this.filterSearchTerm) {
        filtered = filtered.filter((item) => {
          return item.gameData.name
            .toLowerCase()
            .includes(this.filterSearchTerm.toLowerCase());
        });
      }

      filtered = filtered.filter((item) => {
        let releaseDate = new Date(Number(item.gameData.release_date));
        const now = new Date();

        if (
          releaseDate.getFullYear() <= 1970 ||
          releaseDate.toString() == 'Invalid Date'
        ) {
          releaseDate = false;
        }

        switch (this.filterStatus) {
          case 'all':
            return true;
          case 'unreleased':
            return releaseDate ? releaseDate > now : false;
          case 'released':
            return releaseDate ? releaseDate < now : false;
          case 'TBD':
            return releaseDate ? false : true;
          case 'collected':
            return item.cardData.release_collected;
          default:
            return true;
        }
      });

      if (this.filterLibraryOptions.option) {
        filtered = filtered.toSorted((a, b) => {
          const aDate = Number(a.gameData.release_date);
          const bDate = Number(b.gameData.release_date);

          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;

          if (this.filterLibraryOptions.order == 'asc') {
            return aDate - bDate;
          } else {
            return bDate - aDate;
          }
        });
      }

      return filtered;
    }
  },

  methods: {
    ...mapActions(gameStore, ['moveCardIndex', 'finalizeMoveCardIndex']),

    getCustomGameId(card) {
      return card.cardData.custom_game_config_id;
    },

    startdrag(draggedCard, e) {
      e.dataTransfer.setDragImage(this.dragImg, 0, 0);

      if (this.areCardsMovable || this.filterLibraryOptions.option !== null) {
        e.preventDefault();

        return toastStore().add({
          icon: 'NoticeIcon',
          message: this.areCardsMovable
            ? 'Cannot change order of gamelist items.'
            : 'Cannot change order of games while filter is applied.'
        });
      }

      this.dragStartCardId = draggedCard;
    },

    enterdrag(targetCard) {
      if (targetCard == this.dragStartCardId || this.movingCards.includes(targetCard)) {
        return;
      }

      this.hasMoved = true;
      const targetCardIndex = this.customGameIds.indexOf(targetCard);
      const draggedCardIndex = this.customGameIds.indexOf(this.dragStartCardId);

      // this is to prevent the moving items from triggering a dragenter event
      this.movingCards = this.customGameIds.slice(
        Math.min(targetCardIndex, draggedCardIndex),
        Math.max(targetCardIndex, draggedCardIndex) + 1
      );

      this.moveCardIndex(draggedCardIndex, targetCardIndex);

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.movingCards = [];
      }, 300);
    },

    async enddrag() {
      try {
        if (this.hasMoved) {
          const targetIndex = this.customGameIds.indexOf(this.dragStartCardId);
          await this.finalizeMoveCardIndex(targetIndex);
        }

        this.dragStartCardId = null;
        this.hadMoved = false;
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not change game position`
        );
      }
    }
  }
};
</script>

<style scoped>
.moving.moving.moving.moving {
  position: relative;

  transition: all 0.3 ease-in;
  &::after {
    content: '';
    position: absolute;
    inset: -18px;
    overflow: hidden;
    box-shadow: inset 0px 0px 24px 4px rgba(var(--accentColor));
    border-radius: 12px;
    border: 2px solid rgba(var(--accentColor));
  }
}

.card-display-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 48px;
  margin: 30px auto;

  /*
  Might make this value dynamic.
  letting users decide how wide the display area is
   */
  width: 95%;
}

.motion-move {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1) !important;
}

.motion-leave-active {
  position: absolute !important;
}

.motion-enter-from,
.motion-leave-to {
  opacity: 0 !important;
}
</style>

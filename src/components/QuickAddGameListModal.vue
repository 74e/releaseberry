<template>
  <div @click.self="cancel" class="backdrop">
    <div class="popup-box">
      <CloseIcon @click="cancel" />
      <div class="modal-heading">Add to game list(s)</div>

      <ul class="game-lists-container">
        <li
          v-for="list in userGameLists"
          @click="handleGameItemClick(list.id)"
          class="list-item"
          :key="list.id"
        >
          <div :class="['status', { active: isGameInGameList(list.id) }]" />
          <span>{{ list.list_name }}</span>
        </li>

        <span class="no-lists" v-if="userGameLists.length < 1">
          You have no game lists
        </span>
      </ul>
    </div>
  </div>
</template>

<script>
import gameStore from '../state/gameStore';
import { toastStore } from '@/state/toastStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'QuickAddGameListModal',

  props: ['followGameId'],

  data() {
    return {};
  },

  computed: {
    ...mapState(gameStore, ['userGameLists'])
  },

  methods: {
    ...mapActions(gameStore, ['addGameToGameList', 'deleteGameFromGameList']),

    cancel() {
      this.$emit('closePopup');
    },

    handleGameItemClick(gameListId) {
      if (this.isGameInGameList(gameListId)) {
        this.removeGameFromGameList(gameListId);
      } else {
        this.addToGameList(gameListId);
      }
    },

    async addToGameList(gameListId) {
      try {
        await this.addGameToGameList(this.followGameId, gameListId);
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not add game to game list`
        );
      }
    },

    async removeGameFromGameList(gameListId) {
      try {
        await this.deleteGameFromGameList(this.followGameId, gameListId);
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not remove game from game list`
        );
      }
    },

    isGameInGameList(gameListId) {
      const targetGameList = this.userGameLists.find((list) => list.id === gameListId);
      return targetGameList?.game_list_items.some((game) => {
        return game.followGameId === this.followGameId;
      });
    }
  }
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  inset: -4000px;

  .popup-box {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 330px;
    height: 400px;
    background-color: var(--dark-85);
    box-shadow: var(--shadow-default);
    border: 1px solid rgba(255, 255, 255, 0.19);
    border-radius: 8px;
    padding: 8px 8px 0 8px;
    backdrop-filter: blur(10px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.close-icon {
  position: absolute;
  top: 4px;
  right: 6px;
}

.modal-heading {
  color: rgba(var(--accentColor));
  padding-left: 4px;
  font-weight: 500;
  font-size: 18px;
}

.game-lists-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 4px;
  list-style: none;
  max-height: 100%;
  overflow-y: scroll;

  .list-item {
    display: grid;
    grid-template-columns: 20px 1fr;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease-out;
    cursor: pointer;

    span {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.062);
      padding: 4px 8px;
      border-radius: 4px;
      transition: inherit;
      font-size: 14px;
      user-select: none;
    }

    .status {
      border: 1px solid rgba(255, 255, 255, 0.25);
      background-color: rgba(0, 0, 0, 0.884);
      height: 20px;
      border-radius: 4px;
      transition: inherit;
      width: 20px;
      position: relative;

      &.active {
        border-color: rgba(var(--accentColor), 0.73);

        &::after {
          content: '\25CF';
          position: absolute;
          color: rgba(var(--accentColor));
          top: -2.1px;
          left: 50%;
          transform: translate(-50%);
        }
      }
    }

    &:hover {
      span {
        background-color: rgba(255, 255, 255, 0.137);
        border-color: rgba(var(--accentColor));
      }

      .status {
        background-color: var(--dark-fg);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }

  .no-lists {
    padding: 20px;
    margin: auto;
    color: rgba(255, 255, 255, 0.384);
  }
}
</style>

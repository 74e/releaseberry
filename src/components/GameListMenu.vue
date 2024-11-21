<template>
  <div class="menu-container">
    <div :class="['add-new-section', { isAdding: !showAddSection }]">
      <Transition @after-enter="focusInput" name="fade" mode="out-in">
        <div v-if="!showAddSection" class="heading">
          <div class="list-heading">Game Lists</div>
          <div @click="toggleAddButton" class="add-new-button">
            <NewListIcon />
          </div>
        </div>

        <form v-else @submit.prevent="createNewList" class="add-area">
          <input
            ref="input"
            type="text"
            required
            maxlength="22"
            v-model="newGameListName"
          />
          <button class="add" type="submit"><NewListIcon /></button>
        </form>
      </Transition>
    </div>

    <TransitionGroup
      tag="div"
      name="list"
      :class="['lists-container', { isAdding: !showAddSection }]"
    >
      <div
        :class="['list-item', { active: selectedGameListId === null }]"
        @click="selectList(null)"
        key="library"
      >
        <span>Library <span class="muted">(Default)</span> </span>
        <span class="count">{{ ownGames.length }}</span>
      </div>

      <div
        :class="['list-item', { active: selectedGameListId === gameList.id }]"
        v-for="gameList in userGameLists"
        :key="gameList.id"
        @click="selectList(gameList)"
      >
        <span class="game-list-name">{{ gameList.list_name }} </span>

        <div class="right-side" @click.stop="initializeEditGameList(gameList.id)">
          <span class="count">{{ gameList.game_list_items.length }}</span>
          <EditIcon />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import gameStore from '../state/gameStore';
import { toastStore } from '@/state/toastStore';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'GameListMenu',

  inject: ['hide'],

  data() {
    return {
      showAddSection: false,
      newGameListName: 'New Game List'
    };
  },

  computed: {
    ...mapState(gameStore, [
      'userGameLists',
      'ownGames',
      'selectedGameListId',
      'editingGameListId'
    ])
  },

  methods: {
    ...mapActions(gameStore, ['createNewGameList']),

    toggleAddButton(event) {
      if (event) event.stopPropagation();
      this.showAddSection = !this.showAddSection;
    },

    focusInput() {
      if (this.$refs.input) this.$refs.input.focus();
    },

    async createNewList() {
      if (!this.newGameListName) return;

      try {
        await this.createNewGameList(this.newGameListName);

        toastStore().add({
          icon: 'SaveIcon',
          message: 'Created new list'
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not create new list');
      } finally {
        this.toggleAddButton();
      }
    },

    async selectList(gameList) {
      try {
        gameStore().$patch({ activeGameListId: gameList?.id || null });
        // this.hide();
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not select game list');
      }
    },

    initializeEditGameList(id) {
      gameStore().$patch({ editingGameListId: id });
      this.hide();
    }
  }
};
</script>

<style scoped>
.menu-container {
  padding: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-heading {
  color: rgba(var(--accentColor));
  font-weight: 500;
  font-size: 17px;
}

input {
  border-radius: var(--radius-s);
  border: 1px solid rgba(255, 255, 255, 0.055);
  background-color: rgba(255, 255, 255, 0.096);
  color: rgb(180, 180, 180);
  font-size: 14px;
  padding: 4px;
  height: 28px;
}

.add-new-button {
  cursor: pointer;
}

.add-new-section {
  height: 27px;
  transition: margin 0.3s ease-out;

  &.isAdding {
    margin-bottom: -6px;
  }
}

.add-area {
  display: flex;
  align-items: center;
  gap: 4px;

  .add {
    background-color: transparent;
    border: none;
    padding: 4px;
    height: 28px;
  }

  input {
    flex-grow: 1;
    padding: 4px 12px;
    outline: none;
  }

  svg {
    min-height: 18px;
    min-width: 18px;
  }
}

.lists-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 336px;
  overflow-y: scroll;

  .list-item {
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.062);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.521);
    user-select: none;
    position: relative;

    .muted {
      opacity: 0.4;
    }

    &.active::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background-color: rgba(var(--accentColor));
      border-radius: 4px;
    }

    .game-list-name {
      max-width: 228px;
    }

    .right-side {
      position: absolute;
      inset: 0 0 0 auto;
      width: 35px;
      align-content: center;
      text-align: center;

      &:hover {
        svg {
          &.fill {
            fill: rgba(var(--accentColor));
          }
        }
      }

      svg {
        margin: auto;
        width: 17px;
        height: 17px;
        display: none;

        &.fill {
          fill: rgba(255, 255, 255, 0.4);
        }
      }
    }

    &:hover {
      .right-side {
        svg {
          display: block;
        }

        .count {
          display: none;
        }
      }
      background-color: rgba(255, 255, 255, 0.199);
      border: 1px solid rgba(255, 255, 255, 0.158);
    }
  }
}

.list-enter-from,
.list-leave-to,
.list-leave-active {
  opacity: 0;
  height: 0;
  padding: 0px 12px !important;
}

.list-enter-to {
  opacity: 1;
  height: 35px;
  padding: 8px 12px;
}
</style>

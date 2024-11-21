<template>
  <ModalPopup ref="modal" :blur="true" :accentBorders="['faint']">
    <div class="content">
      <WindowPopup
        width="190"
        ref="dotmenu"
        class="dotmenu"
        position="bottom-left"
        :margin="6"
      >
        <div class="menu-btn">
          <DotMenuIcon />
        </div>

        <template #window>
          <div class="dropdown-container">
            <div class="item" @click="initEditName">
              <EditIcon />
              <span>Rename game list</span>
            </div>

            <div class="item" @click="toggleDeleteModal">
              <TrashIcon />
              <span>Delete game list</span>
            </div>
          </div>
        </template>
      </WindowPopup>

      <form class="top-menu" @submit.prevent="updateGameListName">
        <input
          type="text"
          maxlength="30"
          ref="name"
          :class="['title-heading', { editing: isEditingName }]"
          :disabled="!isEditingName"
          required
          v-model="newName"
        />

        <button v-if="isEditingName" class="save-btn" type="submit"><SaveIcon /></button>
      </form>

      <span class="small-text">Select the games you want to include to this list</span>

      <input
        type="text"
        placeholder="Search game"
        class="search"
        v-model="gameSearchTerm"
      />

      <div class="game-selection">
        <div
          v-for="entry in filteredGames"
          :class="['game', { active: isGameInGameList(entry.cardData.game_followed_id) }]"
          @click="handleGameItemClick(entry.cardData.game_followed_id)"
          :key="entry.gameData.id"
        >
          {{ entry.gameData.name }}
        </div>

        <div v-if="filteredGames.length == 0" class="no-results">
          {{ library.length > 0 ? 'No results' : 'You have no games in your library' }}
        </div>
      </div>
    </div>

    <ConfirmationModal
      v-if="showDeleteModal"
      :mainText="`Are you sure you want to delete <br /> the game list <b>${currentGameList.list_name}</b>?`"
      subText="This action will not affect games however deleting the game list is irreversible"
      @closePopup="toggleDeleteModal"
      @confirm="removeGameList"
    />
  </ModalPopup>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import ModalPopup from './uiComponents/ModalPopup.vue';
import WindowPopup from './uiComponents/WindowPopup.vue';
import gameStore from '@/state/gameStore';
import { mapActions, mapState } from 'pinia';
import ConfirmationModal from './ConfirmationModal.vue';

export default {
  name: 'EditGameListModal',

  components: { ModalPopup, WindowPopup, ConfirmationModal },

  data() {
    return {
      renameTimeout: null,
      gameSearchTerm: '',
      initialName: null,
      newName: '',
      isEditingName: false,
      showDeleteModal: false
    };
  },

  mounted() {
    this.newName = this.currentGameList.list_name;
    this.initialName = this.currentGameList.list_name;
  },

  unmounted() {
    gameStore().$patch({ editingGameListId: null });
  },

  computed: {
    ...mapState(gameStore, ['ownGames', 'userGameLists', 'editingGameListId']),

    filteredGames() {
      if (!this.gameSearchTerm) return this.ownGames;

      return this.ownGames.filter((entry) => {
        return entry.gameData.name
          .toLowerCase()
          .includes(this.gameSearchTerm.toLowerCase());
      });
    },

    currentGameList() {
      return this.userGameLists.find((list) => list.id === this.editingGameListId);
    }
  },

  methods: {
    ...mapActions(gameStore, [
      'renameGameList',
      'deleteGameList',
      'addGameToGameList',
      'deleteGameFromGameList'
    ]),

    initEditName() {
      this.isEditingName = true;
      this.$refs.dotmenu.hide();
      this.$nextTick(() => this.$refs.name.focus());
    },

    async updateGameListName() {
      try {
        await this.renameGameList(this.newName);
        toastStore().add({
          icon: 'SaveIcon',
          message: `Saved changes`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not rename game list`
        );
      } finally {
        this.isEditingName = false;
      }
    },

    toggleDeleteModal() {
      this.$refs.dotmenu.hide();
      this.showDeleteModal = !this.showDeleteModal;
    },

    async removeGameList() {
      const deletedGameList = this.currentGameList.list_name;

      try {
        await this.deleteGameList();

        toastStore().add({
          icon: 'TrashIcon',
          message: `Game list <b>${deletedGameList}</b> has been deleted`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not delete game list`
        );
      } finally {
        this.$refs.modal.hide();
      }
    },

    handleGameItemClick(followGameId) {
      if (this.isGameInGameList(followGameId)) {
        this.removeGameFromGameList(followGameId);
      } else {
        this.addToGameList(followGameId);
      }
    },

    async addToGameList(followGameId) {
      try {
        await this.addGameToGameList(followGameId);
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not add game to game list`
        );
      }
    },

    async removeGameFromGameList(followGameId) {
      try {
        await this.deleteGameFromGameList(followGameId);
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not remove game from game list`
        );
      }
    },

    isGameInGameList(followGameId) {
      const targetGameList = this.userGameLists.find(
        (list) => list.id === this.editingGameListId
      );
      return targetGameList?.game_list_items.some((game) => {
        return game.followGameId === followGameId;
      });
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 600px;
  min-height: 600px;
  max-height: 79vh;
  display: flex;
  padding: 16px;
  position: relative;

  @media (max-width: 800px) {
    width: 97vw;
    height: 98vh;
    max-height: unset;
  }

  .top-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -6px 0 0 -4px;
    position: relative;
    width: max-content;

    .save-btn {
      position: absolute;
      left: calc(100% + 8px);
      height: 32px;
      width: 32px;
      border: none;
      background-color: transparent;

      svg {
        height: 24px;
        width: 24px;
      }
    }
  }

  .title-heading {
    width: 440px;
    background-color: transparent;
    padding-left: 4px;
    border: none;
    outline: none;
    font-size: 22px;
    color: rgba(var(--accentColor));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 620px) {
      font-size: 20px;
      width: 400px;
    }

    @media (max-width: 540px) {
      font-size: 18px;
      width: 300px;
    }

    @media (max-width: 420px) {
      font-size: 18px;
      width: 260px;
    }

    &.editing {
      border-bottom: 1px solid rgba(var(--accentColor));
      margin-bottom: -1px;
    }
  }
}

.small-text {
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.438);
}

.search {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 16px auto;
  padding: 8px 12px 4px 12px;
  border: none;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-bottom: 2px solid rgba(var(--accentColor));
  border-radius: 4px;
  background-color: var(--dark-100);
  color: var(--default-font-color);
  outline: none;
}

.game-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  overflow-y: scroll;

  .game {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    min-height: 60px;
    transition: all 0.2s ease-out;
    text-align: center;
    position: relative;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.062);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.137);
      border-color: rgba(var(--accentColor));
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(var(--accentColor));

      &::after {
        content: 'Added';
        display: block;
        position: absolute;
        bottom: 4px;
        right: 8px;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.247);
      }
    }
  }

  .no-results {
    text-align: center;
    font-size: 20px;
    padding: 20px;
    color: rgba(255, 255, 255, 0.336);
  }
}

.dotmenu {
  position: absolute;
  right: 38px;
  top: 12px;

  .dot-menu-icon {
    width: 18px;
    height: 18px;
  }

  .dropdown-container {
    padding: 8px;
    display: grid;
    gap: 8px;
    width: max-content;

    .item {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      font-size: 14px;
      cursor: pointer;
      padding: 6px 14px;
      border-radius: var(--radius-s);

      span {
        flex: 1;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.171);
      }

      svg {
        width: 18px;
        height: 18px;
      }

      .trash-icon {
        filter: invert(1);
      }
    }
  }
}
</style>

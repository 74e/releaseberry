<template>
  <ModalPopup
    ref="modal"
    @modalClosing="changeView('GameDetailsDisplay')"
    :blur="true"
    :accentBorders="['right', 'left']"
  >
    <div v-if="displayData" class="content">
      <div class="top-controls">
        <ButtonComponent
          @click="
            changeView(
              this.mode === 'GameDetailsDisplay'
                ? 'CardStyleDisplay'
                : 'GameDetailsDisplay'
            )
          "
          :disabled="!cardData"
          size="s"
          minWidth="unset"
        >
          {{
            mode === 'GameDetailsDisplay' ? 'Switch to Card tab' : 'Switch to Game tab'
          }}
        </ButtonComponent>

        <WindowPopup
          ref="dotmenu"
          v-if="isUserAdmin || isInLibrary"
          position="bottom-left"
          :margin="6"
        >
          <div class="menu-btn">
            <DotMenuIcon />
          </div>

          <template #window>
            <div class="dropdown-container">
              <div v-if="isInLibrary" @click="toggleQuickAddGameListModal" class="item">
                <NewListIcon />
                <span>Save to game list</span>
              </div>

              <div v-if="isInLibrary" @click="toggleConfirmationPopup" class="item">
                <TrashIcon />
                <span>Remove</span>
              </div>

              <div v-if="isUserAdmin" @click="toggleAdminConfirmationPopup" class="item">
                <NoticeIcon />
                <span>Completely delete game</span>
              </div>
            </div>
          </template>
        </WindowPopup>
      </div>

      <Transition name="fade" mode="out-in">
        <component
          :is="mode"
          :displayData="displayData"
          @resetView="changeView('GameDetailsDisplay')"
        />
      </Transition>

      <div v-if="mode !== 'AddCustomDisplay'" class="bottom-controls">
        <div class="follow-count" @click="toggleFollowsModal">
          <span class="count">{{ follows.length }}</span>
          <span class="label">Following this {{ type }}</span>
          <ProfileIcon class="icon-label" />
        </div>

        <AccumulatedXpDisplay :show="showExp" :data="displayData" />

        <WindowPopup
          position="top-left"
          width="250"
          :accentBorders="['bottom']"
          v-if="!isInLibrary"
        >
          <ButtonComponent size="s" minWidth="unset">
            <span class="default-text"> Add to Library </span>
          </ButtonComponent>

          <template #window>
            <div class="options-container">
              <template v-if="isUserLoggedIn">
                <ButtonComponent
                  @click="changeView('AddCustomDisplay')"
                  size="s"
                  class="btn"
                >
                  <PlusIcon />
                  <span>Add with custom style</span>
                </ButtonComponent>

                <ButtonComponent @click="addWithCurrentPreset" size="s" class="btn">
                  <SaveIcon />
                  <span>Add with current style</span>
                </ButtonComponent>
              </template>
              <span v-else class="login-to-add">Login to add games</span>
            </div>
          </template>
        </WindowPopup>

        <span v-else class="in-library">In Library</span>
      </div>
    </div>

    <ConfirmationModal
      v-if="showAdminConfirmationModal"
      :mainText="`Are you sure you want to <br /> completely delete <b>${gameData?.name}?</b> `"
      subText="This action will affect all users <br /> who saved this game"
      @closePopup="toggleAdminConfirmationPopup"
      @confirm="finalizeCompleteDeletion"
    />
    <ConfirmationModal
      v-if="showConfirmationModal"
      :mainText="`Are you sure you want to remove <br /> <b>${gameData?.name}?</b> `"
      subText="Accumulated experience will not be collectable upon release"
      @closePopup="toggleConfirmationPopup"
      @confirm="finalizeUnfollow"
    />
    <Transition name="fade">
      <UserListModal
        v-if="showFollowsModal"
        heading="Users following this game"
        @closePopup="toggleFollowsModal"
        :userList="follows"
      />
    </Transition>
    <QuickAddGameListModal
      v-if="showQuickAddModal"
      @closePopup="toggleQuickAddGameListModal"
      :followGameId="cardData.game_followed_id"
    />
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import ButtonComponent from './ButtonComponent.vue';
import CardStyleDisplay from './CardStyleDisplay.vue';
import AddCustomDisplay from './AddCustomDisplay.vue';
import WindowPopup from './uiComponents/WindowPopup.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import GameDetailsDisplay from './GameDetailsDisplay.vue';
import UserListModal from './UserListModal.vue';
import QuickAddGameListModal from './QuickAddGameListModal.vue';
import AccumulatedXpDisplay from './AccumulatedXpDisplay.vue';
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import { toastStore } from '@/state/toastStore';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'GameDetailsModal',

  props: ['displayData'],

  components: {
    ModalPopup,
    WindowPopup,
    GameDetailsDisplay,
    ButtonComponent,
    ConfirmationModal,
    CardStyleDisplay,
    AddCustomDisplay,
    UserListModal,
    QuickAddGameListModal,
    AccumulatedXpDisplay
  },

  data() {
    return {
      showConfirmationModal: false,
      showFollowsModal: false,
      showQuickAddModal: false,
      showAdminConfirmationModal: false,
      mode: 'GameDetailsDisplay'
    };
  },

  computed: {
    ...mapState(gameStore, ['library']),

    cardData() {
      return this.displayData.cardData;
    },

    gameData() {
      return this.displayData?.gameData;
    },

    gameId() {
      return this.gameData?.id;
    },

    customGameConfigId() {
      return this.displayData?.cardData?.custom_game_config_id;
    },

    type() {
      return this.gameData?.type;
    },

    follows() {
      return this.gameData?.followers.map((u) => u.user);
    },

    isInLibrary() {
      return this.library?.some((item) => item.gameData.id === this.gameId);
    },

    isUserLoggedIn() {
      return userStore().loggedInUser;
    },

    isUserAdmin() {
      if (!this.isUserLoggedIn) return false;
      return this.isUserLoggedIn.role === 'ADMIN';
    },

    showExp() {
      return this.$route.name === 'library';
    }
  },

  methods: {
    ...mapActions(gameStore, [
      'unfollowGame',
      'addGameAndCopyPreset',
      'calculateAccumulatedExp',
      'adminDeleteSteamGame'
    ]),

    async finalizeCompleteDeletion() {
      try {
        const gameName = this.gameData.name;

        await this.adminDeleteSteamGame(this.gameId);

        toastStore().add({
          icon: 'TrashIcon',
          message: `<b>${gameName}</b> deleted from Release Berry`
        });

        this.$refs.modal.hide();
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not add game to library`
        );
      }
    },

    async finalizeUnfollow() {
      try {
        const gameName = this.gameData.name;

        await this.unfollowGame(this.gameId);

        toastStore().add({
          icon: 'TrashIcon',
          message: `<b>${gameName}</b> removed from Library`
        });

        if (this.$router.currentRoute._value.name === 'library') {
          this.$refs.modal.hide();
        }
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not add game to library`
        );
      }
    },

    async addWithCurrentPreset() {
      try {
        await this.addGameAndCopyPreset({
          gameId: this.gameId,
          customGameConfigId: this.customGameConfigId
        });

        const gameName = this.gameData.name;
        toastStore().add({
          icon: 'LibraryIcon',
          message: `<b>${gameName}</b> added to Library`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, could not add game`
        );
      }
    },

    toggleAdminConfirmationPopup() {
      this.$refs.dotmenu.hide();
      this.showAdminConfirmationModal = !this.showAdminConfirmationModal;
    },

    toggleConfirmationPopup() {
      this.$refs.dotmenu.hide();
      this.showConfirmationModal = !this.showConfirmationModal;
    },

    toggleFollowsModal() {
      this.showFollowsModal = !this.showFollowsModal;
    },

    toggleQuickAddGameListModal() {
      this.$refs.dotmenu.hide();
      this.showQuickAddModal = !this.showQuickAddModal;
    },

    changeView(view) {
      this.mode = view;
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 79vh;
  display: flex;

  @media (max-width: 800px) {
    width: 97vw;
    height: 98vh;
  }
}

.top-controls {
  padding: 8px 40px 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.bottom-controls {
  padding: 8px 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .follow-count {
    padding: 4px 8px;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.05);
    outline: 1px solid rgba(255, 255, 255, 0.116);
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s ease-out;
    user-select: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .count {
      font-size: 13px;
      font-weight: 500;
      background-color: rgba(255, 255, 255, 0.185);
      padding: 1px 6px;
      border-radius: 7px;
    }

    .icon-label {
      display: none;
      height: 15px;
      margin-left: 3px;

      &.fill {
        fill: rgba(255, 255, 255, 0.625);
      }
    }

    @media (max-width: 620px) {
      padding: 2px 8px;

      .count {
        font-size: 15px;
        font-weight: 300;
        background-color: transparent;
        padding: 0;
      }

      .label {
        display: none;
      }

      .icon-label {
        display: block;
      }
    }
  }

  .label {
    font-size: 14px;
    font-weight: 300;
    padding-left: 3px;
    color: rgba(255, 255, 255, 0.548);
  }

  .in-library {
    font-size: 18px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.336);
  }
}

.confirmation {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  inset: -4000px;

  .popup-box {
    width: 340px;
    background-color: var(--dark-85);
    box-shadow: var(--shadow-default);
    border: solid rgba(var(--accentColor));
    border-width: 0 1px 0 1px;
    border-radius: 8px;
    padding: 18px 8px;
    backdrop-filter: blur(4px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .text {
      font-weight: 400;
      text-align: center;

      .bold {
        font-weight: bold;
      }

      .exp-text {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.479);
      }
    }

    .btn-container {
      display: flex;
      justify-content: center;
      padding-top: 16px;
      gap: 28px;
    }
  }
}

.options-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .btn {
    display: flex;
    padding: 8px;
    width: 100%;

    svg {
      margin-right: 16px;
      width: 18px;
      height: 18px;
    }
  }

  .login-to-add {
    display: block;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.548);
  }
}

.menu-btn {
  height: 22px;
  width: 22px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .dot-menu-ico {
    width: 18px;
    height: 18px;
    fill: rgba(255, 255, 255, 0.486);

    &:hover {
      fill: rgba(var(--accentColor));
    }
  }
}

.dropdown-container {
  width: max-content;
  padding: 8px;
  display: grid;
  gap: 8px;

  .item {
    display: flex;
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

    .trash-icon,
    .notice-icon {
      filter: invert(1);
    }
  }
}
</style>

<template>
  <div class="style-view-content">
    <div class="display-area">
      <component
        :is="cardData?.card_component || 'FallbackCard'"
        :gameData="editableGameData || displayData.gameData"
        :cardData="editableCardData || cardData"
      />

      <Transition v-if="isLoggedInUsersConfig" name="fade" mode="out-in">
        <div
          v-if="
            !this.uneditable && isUserPerformingAnAction && loggedInUserView === 'edit'
          "
          class="btn-ctrl"
        >
          <ButtonComponent class="btn-delete" size="s" @click="deleteConfig">
            <TrashIcon />
          </ButtonComponent>

          <ButtonComponent class="btn-edit" size="s" @click="showEditArea">
            Edit preset
          </ButtonComponent>

          <ButtonComponent class="btn-edit" size="s" @click="showEditImageArea">
            Edit image
          </ButtonComponent>
        </div>

        <div
          v-else-if="loggedInUserView !== 'details' && isUserPerformingAnAction"
          class="official"
        >
          <span>Official preset</span>
          <ButtonComponent
            v-if="isLoggedInUsersConfig && !editableGameData"
            class="btn-edit"
            size="s"
            @click="showEditImageArea"
          >
            Edit image
          </ButtonComponent>
        </div>
      </Transition>
    </div>

    <Transition name="fade" mode="out-in">
      <UserCardEditArea
        ref="edit"
        v-if="isLoggedInUsersConfig && loggedInUserView === 'edit'"
        @updateEditableCardData="(value) => (editableCardData = value)"
        @updateEditableGameData="(value) => (editableGameData = value)"
        @toggleTab="toggleTab"
        :displayData="displayData"
      />

      <UserCardDetailsArea v-else @toggleTab="toggleTab" :displayData="displayData" />
    </Transition>
  </div>
</template>

<script>
import gameStore from '../state/gameStore';
import { mapState } from 'pinia';
import ButtonComponent from './ButtonComponent.vue';
import UserCardEditArea from './UserCardEditArea.vue';
import UserCardDetailsArea from './UserCardDetailsArea.vue';

export default {
  name: 'CardStyleDisplay',

  components: {
    ButtonComponent,
    UserCardEditArea,
    UserCardDetailsArea
  },

  props: ['displayData'],

  data() {
    return {
      selectedCard: null,
      editableCardData: null,
      editableGameData: null,
      loggedInUserView: 'edit'
    };
  },

  computed: {
    ...mapState(gameStore, ['library']),

    cardData() {
      return this.displayData.cardData;
    },

    uneditable() {
      return (
        ['FallbackCard'].includes(this.cardData.card_component) || this.cardData.official
      );
    },

    isLoggedInUsersConfig() {
      return this.library.some((game) => {
        return this.cardData.custom_game_config_id == game.cardData.custom_game_config_id;
      });
    },

    isUserPerformingAnAction() {
      return !this.editableCardData && !this.editableGameData;
    }
  },

  methods: {
    showEditArea() {
      this.$refs.edit.initEdit();
    },

    showEditImageArea() {
      this.$refs.edit.initEditImage();
    },

    deleteConfig() {
      this.$refs.edit.toggleDeleteModal();
    },

    toggleTab() {
      this.loggedInUserView = this.loggedInUserView === 'edit' ? 'details' : 'edit';
    }
  }
};
</script>

<style scoped>
.style-view-content {
  display: flex;
  align-items: center;
  padding: 0 18px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  @media (max-width: 620px) {
    flex-direction: column;
    overflow-y: scroll;
  }
}

.display-area {
  background-color: rgba(0, 0, 0, 0.336);
  border-radius: var(--radius-m);
  border: 1px solid #ffffff1c;
  min-height: 440px;
  min-width: 290px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  margin: 8px 22px;

  .btn-ctrl,
  .official {
    position: absolute;
    bottom: 12px;
    transform: translateX(-50%);
    left: 50%;
    width: calc(100% - 24px);
  }

  .official {
    span {
      font-size: 12px;
      opacity: 0.4;
    }

    button {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .btn-ctrl {
    display: flex;
    gap: 12px;

    .btn-edit {
      flex: 1;
    }

    .btn-delete {
      min-width: unset;
      padding: 0 6px;

      &:hover {
        filter: invert(1);

        svg {
          &.fill {
            fill: rgba(var(--accentColor));
          }
        }
      }

      svg {
        width: 14px;
        height: 14px;
        transform: translateY(-1px);

        &.fill {
          fill: rgba(255, 255, 255, 0.514);
        }
      }
    }
  }
}
</style>

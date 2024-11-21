<template>
  <div class="root">
    <Transition name="fade" mode="out-in">
      <div v-if="!editableCardData && !editableGameData" class="menu-area">
        <ButtonComponent @click="$emit('toggleTab')" class="btn-switch-view" size="s">
          Preset details
        </ButtonComponent>

        <DropDown
          label="Release Counter Format"
          @onSelect="switchTimeFormat"
          :dropdownCount="4"
          v-model:selectedValue="counterFormat"
          :optionValues="availableTimerFormats"
        />

        <DropDown
          label="Card Style"
          targetDisplay="name"
          @onSelect="switchCard"
          v-model:selectedValue="selectedCard"
          :optionValues="availableCards"
        />

        <DropDown
          label="Design Preset"
          targetDisplay="name"
          targetIdentifier="id"
          @onSelect="switchConfig"
          v-model:selectedValue="selectedCardConfig"
          :optionValues="availableCardConfigs"
        />

        <ButtonComponent minWidth="230px" size="s" @click="initCreateNewConfig">
          Create new preset
        </ButtonComponent>
      </div>

      <div v-else-if="editableCardData" ref="editontainer" class="edit-area">
        <div :class="['name-config', { error: noNameError }]">
          <label class="error-label" v-if="noNameError">Preset name required</label>
          <input
            type="text"
            v-model="currentPresetName"
            @focusin="this.noNameError = false"
            placeholder="Name your preset"
            maxlength="22"
          />
        </div>

        <PresetTemplateRender :preset="editableCardData" />
        <div class="btn-menu">
          <ButtonComponent size="s" @click="cancelEdit">Cancel</ButtonComponent>

          <ButtonComponent
            v-if="isCreatingNewPreset"
            size="s"
            @click="confirmAsNewConfig"
          >
            Save
          </ButtonComponent>

          <WindowPopup
            v-else
            ref="optionWindow"
            position="top-left"
            width="250"
            :accentBorders="['bottom']"
          >
            <ButtonComponent size="s">Save</ButtonComponent>

            <template #window>
              <div class="options-container">
                <ButtonComponent @click="toggleConfirmationModal" size="s" class="btn">
                  <span>Save as new preset</span>
                </ButtonComponent>

                <ButtonComponent @click="confirmUpdate" size="s" class="btn">
                  <span>Save changes</span>
                </ButtonComponent>
              </div>
            </template>
          </WindowPopup>
        </div>
      </div>

      <div v-else-if="editableGameData" class="image-area">
        <SelectGameCover
          :selectedGameItem="gameData.appid"
          v-model:selectedGameCover="selectedGameCover"
        />
        <div class="btn-menu-two">
          <ButtonComponent size="s" :disabled="isLoading" @click="cancelEditImage">
            Cancel
          </ButtonComponent>

          <ButtonComponent size="s" :disabled="isLoading" @click="updateGameCover">
            {{ isLoading ? 'Loading' : 'Save' }}
          </ButtonComponent>
        </div>
      </div>
    </Transition>

    <NewPresetNameConfirmation
      v-if="showConfirmationModal"
      @closePopup="toggleConfirmationModal"
      @confirm="confirmAsNewConfig"
    />

    <ConfirmationModal
      v-if="showDeleteModal"
      :mainText="`Are you sure you want to delete <br /> the preset <b>${cardData.config.name}</b>?`"
      subText="This action will affect all cards using this preset."
      @closePopup="toggleDeleteModal"
      @confirm="deleteConfigAction"
    />
  </div>
</template>

<script>
import cardStore from '../state/cardStore';
import userStore from '../state/userStore';
import gameStore from '../state/gameStore';
import { toastStore } from '../state/toastStore';
import { mapActions, mapState } from 'pinia';
import DropDown from './uiComponents/DropDown.vue';
import PresetTemplateRender from './PresetTemplateRender.vue';
import ButtonComponent from './ButtonComponent.vue';
import WindowPopup from './uiComponents/WindowPopup.vue';
import NewPresetNameConfirmation from './NewPresetNameConfirmation.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import SelectGameCover from './SelectGameCover.vue';
import _ from 'lodash';

export default {
  name: 'UserCardEditArea',

  components: {
    DropDown,
    PresetTemplateRender,
    ButtonComponent,
    WindowPopup,
    NewPresetNameConfirmation,
    ConfirmationModal,
    SelectGameCover
  },

  emits: [
    'updateEditableCardData',
    'updateEditableGameData',
    'sumbitAsUpdate',
    'submitNewConfig',
    'toggleTab'
  ],

  props: ['displayData'],

  data() {
    return {
      selectedCard: null,
      availableCards: null,
      selectedCardConfig: null,
      currentPresetName: '',
      editableCardData: null,
      editableGameData: null,
      selectedGameCover: null,
      noNameError: false,
      showConfirmationModal: false,
      showDeleteModal: false,
      counterFormat: null,
      isCreatingNewPreset: false,
      isLoading: false,
      availableTimerFormats: [
        'DDD:HH:MM:SS',
        'YY:DDD:HH:MM:SS',
        'DDD:HH:MM',
        'DDD Days',
        'YY Years DDD Days',
        'DATE',
        'FULL DATE'
      ]
    };
  },

  watch: {
    currentPresetName() {
      this.editableCardData.config.name = this.currentPresetName;
    },

    selectedGameCover() {
      this.editableGameData.cover_url = this.selectedGameCover.thumb;
    }
  },

  mounted() {
    this.initialize();
  },

  computed: {
    ...mapState(userStore, ['loggedInUser']),
    ...mapState(cardStore, ['userCardConfigs']),

    cardData() {
      return this.displayData.cardData;
    },

    gameData() {
      return this.displayData.gameData;
    },

    customGameConfigId() {
      return this.cardData.custom_game_config_id;
    },

    availableCardConfigs() {
      if (!this.selectedCard) return [];

      return this.userCardConfigs
        .find((c) => c.card_name === this.selectedCard.name)
        .card_config.map((c) => ({
          name: c.config.name,
          id: c.id
        }));
    }
  },

  methods: {
    ...mapActions(cardStore, [
      'changeCardConfig',
      'editCardConfig',
      'changeCountdownFormat',
      'updateCustomGameConfigWithNewCardConfig',
      'deleteConfig'
    ]),

    async initialize() {
      this.counterFormat = this.cardData.countdown_format;
      this.selectedCard = {
        name: this.cardData.card_name,
        component: this.cardData.card_component
      };
      this.availableCards = this.userCardConfigs.map((card) => ({
        name: card.card_name,
        component: card.card_component
      }));
      this.selectedCardConfig = {
        name: this.cardData.config.name,
        id: this.cardData.id
      };
    },

    switchTimeFormat() {
      try {
        this.changeCountdownFormat({
          countdown_format: this.counterFormat,
          customGameConfigId: this.customGameConfigId
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not change countdown format`
        );
      }
    },

    initCreateNewConfig() {
      this.isCreatingNewPreset = true;
      this.initEdit();
    },

    async switchConfig(triggerFetch = true) {
      const customGameConfigId = this.cardData.custom_game_config_id;
      const cardConfigId = this.selectedCardConfig.id;
      const { name, component } = this.selectedCard;
      const { config, official } = this.userCardConfigs
        .find((c) => c.card_name === this.selectedCard.name)
        .card_config.find((c) => c.id === this.selectedCardConfig.id);

      try {
        await this.changeCardConfig({
          cardConfigId,
          customGameConfigId,
          triggerFetch,
          cardData: { config, name, component, official }
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not change card design`
        );
      }
    },

    switchCard() {
      const targetConfig = this.userCardConfigs.find(
        (c) => c.card_name === this.selectedCard.name
      ).card_config[0];
      this.selectedCardConfig = { name: targetConfig.config.name, id: targetConfig.id };

      this.switchConfig();
    },

    initEdit() {
      this.editableCardData = _.cloneDeep(this.cardData);
      this.currentPresetName = this.editableCardData.config.name;
      this.$emit('updateEditableCardData', this.editableCardData);
    },

    initEditImage() {
      this.editableGameData = _.cloneDeep(this.gameData);
      this.$emit('updateEditableGameData', this.editableGameData);
    },

    cancelEdit() {
      this.editableCardData = null;
      this.$emit('updateEditableCardData', null);
    },

    cancelEditImage() {
      this.editableGameData = null;
      this.$emit('updateEditableGameData', null);
    },

    toggleConfirmationModal() {
      this.$refs.optionWindow.hide();
      this.showConfirmationModal = !this.showConfirmationModal;
    },

    async confirmAsNewConfig(newPresetName) {
      if (this.isLoading) return;

      const { config, card_component, card_name, countdown_format } =
        this.editableCardData;

      if (this.isCreatingNewPreset && !config.name) {
        this.$refs.editontainer.scrollTo({ top: 0, behavior: 'smooth' });
        this.noNameError = true;

        return;
      }

      this.isLoading = true;
      let hasFailed = { state: false };
      const presetName = this.isCreatingNewPreset ? config.name : newPresetName;

      try {
        const selectedData = await this.updateCustomGameConfigWithNewCardConfig({
          customGameConfigId: this.customGameConfigId,
          cardData: {
            countdown_format,
            card_component,
            card_name,
            card_config: {
              ...config,
              name: presetName
            }
          }
        });

        this.selectedCardConfig = selectedData;
        this.isCreatingNewPreset = false;

        toastStore().add({
          icon: 'SaveIcon',
          message: `Saved new preset <b>${presetName}</b>`
        });
      } catch (error) {
        hasFailed.state = true;
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not save preset`
        );
      } finally {
        this.isLoading = false;
        if (!hasFailed.state) this.cancelEdit();
      }
    },

    async confirmUpdate() {
      this.$refs.optionWindow.hide();
      if (this.isLoading) return;

      const { id: cardConfigId, config } = this.editableCardData;

      if (!config.name) {
        this.$refs.editontainer.scrollTo({ top: 0, behavior: 'smooth' });
        this.noNameError = true;

        return;
      }

      this.isLoading = true;
      let hasFailed = { state: false };

      try {
        await this.editCardConfig({ cardConfigId, config });
        this.selectedCardConfig.name = config.name;

        toastStore().add({
          icon: 'SaveIcon',
          message: 'Saved preset changes'
        });
      } catch (error) {
        hasFailed.state = true;
        toastStore().handleErrorMessage(error, 'Could not save changes, sorry :(');
      } finally {
        this.isLoading = false;
        if (!hasFailed.state) this.cancelEdit();
      }
    },

    toggleDeleteModal() {
      this.showDeleteModal = !this.showDeleteModal;
    },

    async deleteConfigAction() {
      try {
        const {
          custom_game_config_id,
          card_component,
          id: card_config_id
        } = this.cardData;
        const name = this.selectedCardConfig.name;

        // This logic is flawed because if the deletion fails, it will still remove the config
        // Set to a config non-deleted config
        const defaultConfig = this.userCardConfigs
          .find((c) => c.card_name === this.selectedCard.name)
          .card_config.find((c) => c.official === true);

        this.selectedCardConfig = {
          name: defaultConfig.config.name,
          id: defaultConfig.id
        };
        this.switchConfig(false);

        await this.deleteConfig({
          custom_game_config_id,
          card_component,
          card_config_id,
          defaultConfig
        });

        toastStore().add({
          icon: 'TrashIcon',
          message: `Preset「${name}」has been deleted`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          'Something went wrong, could not delete preset'
        );
      }
    },

    async updateGameCover() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        await gameStore().updateCustomGameConfigCover({
          customGameConfigId: this.customGameConfigId,
          coverData: {
            cover_url: this.selectedGameCover.url,
            cover_thumb: this.selectedGameCover.thumb
          }
        });

        this.cancelEditImage();

        toastStore().add({
          icon: 'TrashIcon',
          message: `Game cover has been update`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          'Something went wrong, could not update game cover'
        );
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  overflow: scroll;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 620px) {
    border-top: 1px solid #ffffff1c;
    overflow: visible;
  }
}

.menu-area {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 18px;
  position: relative;
}

.edit-area {
  height: 100%;
  padding: 12px 0;

  .anchor {
    width: 100px;
  }
}

.image-area {
  padding-top: 8px;
}

.btn-menu,
.btn-menu-two {
  display: flex;
  justify-content: space-between;
}
.btn-menu {
  padding: 0 0 12px 0;
}

.btn-menu-two {
  padding: 6px 0;
}

.name-config {
  padding-bottom: 12px;
  position: relative;

  &.error {
    .error-label {
      opacity: 1;
    }

    input {
      border: 1px solid red !important;
    }
  }

  .error-label {
    display: block;
    color: rgba(255, 0, 0, 0.692);
    position: absolute;
    font-size: 13px;
    bottom: 100%;
    margin: 0 0 4px 4px;
    opacity: 0;
    transition: color 0.3s ease-out;
  }

  input {
    background-color: var(--dark-fg);
    color: inherit;
    border: none;
    font-size: 16px;
    width: 100%;
    padding: 8px 16px;
    border-bottom: 2px solid rgba(var(--accentColor));
    border-radius: 6px;
    box-shadow: var(--shadow-default);
    outline: none;
    transition: border-color 0.3s ease-out;
  }
}

.options-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  button {
    width: 100%;
  }
}

.btn-switch-view {
  position: absolute;
  right: 0;
  top: 16px;
}
</style>

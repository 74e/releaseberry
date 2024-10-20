<template>
  <div class="transition-root" v-if="isInitialized">
    <div class="style-container">
      <div class="card-container">
        <div class="card-background">
          <div v-if="showEditArea" @click="handleEditVisibility(false)" class="back-btn">
            <span>Back to card select</span>
            {{ '-->' }}
          </div>

          <component
            :is="card.card_component"
            :gameData="gameData"
            :cardData="cardData"
            :key="card.card_component"
          />
        </div>

        <DropDown
          label="Release Counter Format"
          labelPosition="center"
          :dropdownCount="2"
          v-model:selectedValue="counterFormat"
          :optionValues="availableTimerFormats"
        />
      </div>

      <Transition name="fade" mode="out-in">
        <div class="select-card-container" v-if="!showEditArea">
          <div class="card-dropdown-container">
            <DropDown
              label="Card Style"
              v-model:selectedValue="selectedCardName"
              :optionValues="availableCardOptions"
            />

            <DropDown
              label="Design Preset"
              targetDisplay="name"
              targetIdentifier="id"
              v-model:selectedValue="selectedConfig"
              :optionValues="availablePresets"
            />
          </div>
          <ButtonComponent
            :disabled="noneEditableCard"
            class="show-edit-btn"
            @click="handleEditVisibility(true)"
          >
            Create custom preset
          </ButtonComponent>
        </div>

        <div v-else class="settings-container" ref="styleContainer">
          <div :class="['name-config', { error: noNameError }]">
            <label class="error-label" v-if="noNameError">Preset name required</label>
            <input
              type="text"
              v-model="newPresetName"
              @focusin="this.noNameError = false"
              placeholder="Name your preset"
              maxlength="22"
            />
          </div>

          <div class="color-config">
            <PresetTemplateRender :preset="selectedPresetSettings" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import PresetTemplateRender from './PresetTemplateRender.vue';
import DropDown from './uiComponents/DropDown.vue';
import ButtonComponent from './ButtonComponent.vue';
import cardStore from '@/state/cardStore';
import userStore from '@/state/userStore';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'SelectGameStyle',

  components: {
    DropDown,
    PresetTemplateRender,
    ButtonComponent
  },

  props: {
    selectedGameItem: {
      type: [Object, null],
      default: null
    },

    selectedGameCover: {
      type: [Object, null],
      default: null
    }
  },

  inject: ['accentColor'],

  mounted() {
    this.initialize();
    console.log(this.selectedGameCover);
  },

  data() {
    return {
      // Waits until initialized to render content or fetch
      isInitialized: false,
      isLoading: false,

      availablePresets: [],

      //Timer Format
      counterFormat: null,
      availableTimerFormats: [
        'DDD:HH:MM:SS',
        'YY:DDD:HH:MM:SS',
        'DDD:HH:MM',
        'DDD Days',
        'YY Years DDD Days',
        'DATE',
        'FULL DATE'
      ],

      // Strings to determine which card and preset is selected
      selectedCardName: null,
      selectedConfig: null, // has name and id

      // Objects containing data
      selectedPresetSettings: null,

      // Edit area
      showEditArea: false,
      newPresetName: '',

      // error handling for preset
      noNameError: false,
      noNameTimeout: null,

      cardConfigCopy: null
    };
  },

  watch: {
    selectedCardName() {
      // Selects the first preset
      const { config, id } = this.card.card_config[0];
      this.selectedConfig = { name: config.name, id };

      this.resetDefaultCardConfig();
    },

    selectedConfig() {
      this.resetDefaultCardConfig();
    }
  },

  computed: {
    ...mapState(userStore, ['loggedInUser']),
    ...mapState(cardStore, ['userCardConfigs']),

    card() {
      return this.cardConfigCopy?.find(
        (card) => card.card_name === this.selectedCardName
      );
    },

    availableCardOptions() {
      return this.cardConfigCopy.map((card) => card.card_name);
    },

    noneEditableCard() {
      return ['Release Berry Plain'].includes(this.selectedCardName);
    },

    isEditing() {
      return JSON.stringify(this.userCardConfigs) !== JSON.stringify(this.cardConfigCopy);
    },

    gameData() {
      const time = Date.now();
      const arbitraryFutureDate = 39689946000;

      return {
        name: this.selectedGameItem.name,
        cover_url: this.selectedGameCover.url,
        release_date: time + arbitraryFutureDate
      };
    },

    cardData() {
      return {
        countdown_format: this.counterFormat,
        config: this.selectedPresetSettings.config
      };
    }
  },

  methods: {
    ...mapActions(cardStore, ['getConfigCopy']),

    async initialize() {
      this.cardConfigCopy = this.getConfigCopy();

      this.counterFormat = this.availableTimerFormats[0];

      const { card_name, card_config } = this.cardConfigCopy[0];
      this.selectedCardName = card_name;
      this.selectedConfig = { name: card_config[0].config.name, id: card_config[0].id };

      this.isInitialized = true;
    },

    resetDefaultCardConfig() {
      // This is to reset any data that might have been edited
      // (As in someone edits a config and then switches)
      this.cardConfigCopy = this.getConfigCopy();

      // Setting the editable config to selectedPresetSettings and then
      // sending it to rendering
      this.selectedPresetSettings = this.card.card_config.find((preset) => {
        return preset.id === this.selectedConfig.id;
      });

      // Get the new cards styles configs
      this.availablePresets = this.card.card_config.map((cardConfig) => ({
        name: cardConfig.config.name,
        id: cardConfig.id
      }));

      this.showEditArea = false;
      this.newPresetName = '';
    },

    async handleConfirm() {
      const gameData = {
        appid: this.selectedGameItem.appid,
        gameCover: this.selectedGameCover
      };

      let cardData;

      if (this.isEditing) {
        if (!this.newPresetName) {
          this.$refs.styleContainer.scrollTo({ top: 0, behavior: 'smooth' });
          this.noNameError = true;

          return;
        }

        cardData = {
          card_config: {
            ...this.selectedPresetSettings.config,
            name: this.newPresetName
          },
          id: null,
          countdown_format: this.counterFormat,
          card_component: this.card.card_component,
          card_name: this.card.card_name
        };
      } else {
        cardData = {
          id: this.selectedConfig.id,
          card_component: this.card.component,
          countdown_format: this.counterFormat
        };
      }

      return { payload: { cardData, gameData }, gameName: this.selectedGameItem.name };
    },

    handleEditVisibility(value) {
      this.showEditArea = value;
    }
  }
};
</script>

<style scoped>
.style-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;
  height: 620px;

  @media (max-height: 948px) {
    height: 580px;
  }

  @media (max-height: 918px) {
    height: 550px;
  }

  @media (max-height: 875px) {
    height: 520px;
  }

  @media (max-height: 845px) {
    height: 490px;
  }

  @media (max-height: 815px) {
    height: 460px;
  }

  @media (max-height: 785px), (max-width: 1240px) {
    height: auto;
    flex-direction: column;
    gap: 0px;
  }
}

.select-card-container {
  width: 600px;
  padding: 16px;
  align-content: center;

  @media (max-width: 1240px) {
    flex-direction: column;
    width: 100%;
  }

  .show-edit-btn {
    margin: 28px auto;
    display: block;
  }
}

.settings-container {
  overflow-y: scroll;
  width: 600px;
  padding: 16px;
  margin: auto;

  @media (max-width: 785px) {
    overflow-y: auto;
    width: 100%;
  }
}

.card-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  padding-top: 18px;

  .card-background {
    background-color: rgba(0, 0, 0, 0.336);
    border-radius: var(--radius-m);
    border: 1px solid #ffffff1c;
    height: 440px;
    min-height: 400px;
    width: 300px;
    min-width: 260px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
}

.card-dropdown-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.back-btn {
  font-size: 20px;
  display: inline-block;
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 8px;
  color: rgba(255, 255, 255, 0.226);
  transition: color 0.2s ease-out;
  display: flex;
  align-items: center;

  span {
    opacity: 0;
    transition: opacity 0.2s ease-out;
    font-size: 14px;
    display: inline-block;
    margin-right: 6px;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.842);

    span {
      opacity: 1;
    }
  }
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
    border-bottom: 2px solid v-bind(accentColor);
    border-radius: 6px;
    box-shadow: var(--shadow-default);
    outline: none;
    transition: border-color 0.3s ease-out;
  }
}
</style>

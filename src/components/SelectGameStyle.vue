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
            :is="card.component"
            :gameData="gameData"
            :cardData="cardData"
            :key="card.component"
          />
        </div>

        <DropDown
          label="Relase Counter Format"
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
              targetValue="name"
              v-model:selectedValue="selectedPreset"
              :optionValues="availablePresets"
            />
          </div>
          <ButtonFancyComponent class="show-edit-btn" @click="handleEditVisibility(true)">
            Create custom preset
          </ButtonFancyComponent>
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

    <div class="btn-container">
      <ButtonComponent @click="handleProgression('previous')">Back</ButtonComponent>
      <ButtonComponent @click="handleConfirm">Confirm</ButtonComponent>
    </div>
  </div>
</template>

<!--
TODO:
      WHAT NEEDS FIXING?
        work on the backend


      The cardstyle logic in the backend needs to have 2 tables
      One has the card, every entry represents a card type, it contains the
      card structure config (ie, what component to use and restrictions)
      the id from the card type will be used as a reference for the presets.
      So its going to be a many to one relation where all presets link to the card type the preset is for
      For validation of the card data:
        The card type config will be used to check if the structure is the same
        and that the values are valid in both type and restriction.
      How to deal with duplicates/determine that a preset is being used:
        when sending an existing preset then send along preset id, from there
        compare the presets with JSON.stringify to check validity.
        If no id is sent along proceed to add preset to database
      In short, the frontend needs to send:
        card type id so I know which card the preset is for
        preset id to determine that a preset is used
        if no id: save preset data as a new entry

      FIX PRESET RENAME BUG WITH DROPDOWN

      Remove save button because the backend will save the preset no matter what anyways

      Future stretch goal:
        Palettes: Use config structure to determine where generated color should be added
-->

<script>
import cardConfigPresets from '../assets/styleSettings/defaultPresetsAndSettings.js'
import PresetTemplateRender from './PresetTemplateRender.vue'
import DropDown from './uiComponents/DropDown.vue'
import injectTemplateConfig from '../helperFunctions/templateConfig'
import ButtonComponent from './primitiveComponents/ButtonComponent.vue'
import ButtonFancyComponent from './primitiveComponents/ButtonFancyComponent.vue'

export default {
  name: 'SelectGameStyleComponent',

  components: {
    DropDown,
    PresetTemplateRender,
    ButtonComponent,
    ButtonFancyComponent
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

  inject: ['handleProgression', 'accentColor'],

  mounted() {
    this.initialize()
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

      // Deep copy for cardConfigPresets
      editableCardConfigPresets: null,

      // Strings to determine which card and preset is selected
      selectedCardName: null,
      selectedPreset: null, // has name and id

      // Objects containing data
      selectedPresetSettings: null,

      // Edit area
      showEditArea: false,
      newPresetName: '',

      // error handling for preset
      noNameError: false,
      noNameTimeout: null
    }
  },

  watch: {
    selectedCardName() {
      // Selects the first preset
      const { name, id } = this.card.presets[0]
      this.selectedPreset = { name, id }

      this.resetDefaultCardConfig()
    },

    selectedPreset() {
      this.resetDefaultCardConfig()
    }
  },

  computed: {
    card() {
      for (const name in cardConfigPresets) {
        if (cardConfigPresets[name].name === this.selectedCardName) {
          return this.editableCardConfigPresets[name]
        }
      }

      return null
    },

    availableCardOptions() {
      let cardNames = []

      for (const name in cardConfigPresets) {
        cardNames.push(cardConfigPresets[name].name)
      }

      return cardNames
    },

    isEditing() {
      return (
        JSON.stringify(this.editableCardConfigPresets) !==
        JSON.stringify(cardConfigPresets)
      )
    },

    gameData() {
      const time = Date.now()
      const arbitraryFutureDate = 39689946000

      return {
        name: this.selectedGameItem.name,
        cover_url: this.selectedGameCover.url,
        release_date: time + arbitraryFutureDate
      }
    },

    cardData() {
      return {
        countdown_format: this.counterFormat,
        config: this.selectedPresetSettings
      }
    }
  },

  methods: {
    initialize() {
      injectTemplateConfig(cardConfigPresets)
      this.editableCardConfigPresets = structuredClone(cardConfigPresets)

      this.counterFormat = this.availableTimerFormats[0]

      const { name, presets } = this.editableCardConfigPresets.releaseBerryStandard
      this.selectedCardName = name
      this.selectedPreset = { name: presets[0].name, id: presets[0].id }

      this.isInitialized = true
    },

    resetDefaultCardConfig() {
      this.editableCardConfigPresets = structuredClone(cardConfigPresets)

      this.selectedPresetSettings = this.card.presets.find((preset) => {
        return preset.id === this.selectedPreset.id
      })

      this.availablePresets = this.card.presets.map((preset) => ({
        name: preset.name,
        id: preset.id
      }))

      this.showEditArea = false
      this.newPresetName = ''
    },

    async handleConfirm() {
      const gameData = {
        appid: this.selectedGameItem.appid,
        gameCover: this.selectedGameCover
      }

      let cardData

      if (this.isEditing) {
        if (!this.newPresetName) {
          this.$refs.styleContainer.scrollTo({ top: 0, behavior: 'smooth' })
          this.noNameError = true

          return
        }

        cardData = {
          ...this.selectedPresetSettings,
          id: null,
          countdownFormat: this.counterFormat,
          cardComponent: this.card.component,
          name: this.newPresetName
        }
      } else {
        cardData = { id: this.selectedPreset.id, cardComponent: this.card.component }
      }

      this.$emit('handleConfirmation', { cardData, gameData })
    },

    handleEditVisibility(value) {
      this.showEditArea = value
    }
  }
}
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

  @media (max-height: 785px), (max-width: 785px) {
    height: auto;
    flex-direction: column;
  }
}

.select-card-container {
  width: 600px;
  padding: 16px;
  align-content: center;

  @media (max-width: 785px) {
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
  transition: color 0.2s ease-in;
  display: flex;
  align-items: center;

  span {
    opacity: 0;
    transition: opacity 0.2s ease-in;
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
    transition: color 0.3s ease-in;
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
    transition: border-color 0.3s ease-in;
  }
}

.btn-container {
  display: flex;
  justify-content: end;
}
</style>

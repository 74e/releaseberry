<template>
  <ModalPopup ref="modal" :blur="true" :accentBorders="['right', 'left']">
    <div class="heading">
      <h3>Add a steam game</h3>
      <div class="line" />
    </div>

    <div class="container">
      <div v-if="!isLoading" class="content">
        <AccordionItem
          title="1. Search for a game"
          description="Check if the game is already in our global library, if not then be the first to add it!"
          :class="openTab > 1 || 'clickable'"
          @handleTabClick="handleTabClick(1)"
          :completed="openTab > 1"
          :isActive="openTab === 1"
        >
          <template #content>
            <SelectGameItem v-model:selectedGameItem="selectedGameItem" />
          </template>
        </AccordionItem>

        <AccordionItem
          title="2. Choose the cover image"
          description="Look through and choose your game cover from the community powered library of game covers by SteamGridDB."
          :class="openTab > 2 || 'clickable'"
          @handleTabClick="handleTabClick(2)"
          :completed="openTab > 2"
          :isActive="openTab === 2"
        >
          <template #content>
            <SelectGameCover
              :selectedGameItem="selectedGameItem.appid"
              v-model:selectedGameCover="selectedGameCover"
            />
          </template>
        </AccordionItem>

        <AccordionItem
          title="3. Select and customize your card"
          description="Select one of your design presets or start customizing from one!"
          :completed="openTab > 3"
          :isActive="openTab === 3"
        >
          <template #content>
            <SelectGameStyle
              @handleConfirmation="handleSubmit"
              :selectedGameItem="selectedGameItem"
              :selectedGameCover="selectedGameCover"
            />
          </template>
        </AccordionItem>
      </div>

      <LoadingOverlay :isLoading="isLoading" v-else />
    </div>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue'
import AccordionItem from './uiComponents/AccordionItem.vue'
import SelectGameItem from './SelectGameItem.vue'
import SelectGameCover from './SelectGameCover.vue'
import SelectGameStyle from './SelectGameStyle.vue'
import LoadingOverlay from './uiComponents/LoadingOverlay.vue'
import gameStore from '../state/gameStore'
import { mapActions } from 'pinia'

export default {
  name: 'AddGameModalComponent',

  components: {
    ModalPopup,
    AccordionItem,
    SelectGameItem,
    SelectGameCover,
    SelectGameStyle,
    LoadingOverlay
  },

  inject: ['accentColor'],

  provide() {
    return {
      handleProgression: this.handleProgression
    }
  },

  data() {
    return {
      openTab: 1,
      selectedGameItem: null,
      selectedGameCover: null,
      isLoading: false
    }
  },

  methods: {
    ...mapActions(gameStore, ['addIndividualSteamGame']),

    handleTabClick(index) {
      if (this.openTab <= index) return

      this.openTab = index
    },

    handleProgression(action) {
      if (action === 'next') {
        this.openTab++

        return
      }

      if (action === 'previous') {
        this.openTab--
        return
      }
    },

    async handleSubmit(payload) {
      try {
        this.isLoading = true
        await this.addIndividualSteamGame(payload)

        this.$refs.modal.hide()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 96vw;
  height: 91vh;
  padding: 12px 18px;
  overflow-y: scroll;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 1200px;
  margin: auto;
}

.heading {
  margin: 16px 16px 0 16px;

  h3 {
    font-size: 24px;
    padding-left: 8px;
    margin: 4px;
    color: v-bind(accentColor);
  }

  span {
    color: var(--default-font-color);
  }

  .line {
    width: 100%;
    height: 1px;
    margin-top: 8px;
    width: 94%;
    background: linear-gradient(
      90deg,
      rgba(0, 240, 255, 0) 0%,
      v-bind(accentColor) 13%,
      v-bind(accentColor) 87%,
      rgba(0, 144, 153, 0) 100%
    );
  }
}
</style>

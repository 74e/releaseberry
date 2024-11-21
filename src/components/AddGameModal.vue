<template>
  <ModalPopup ref="modal" :blur="true" :accentBorders="['right', 'left']">
    <div class="heading">
      <h3>Add a steam game</h3>
      <div class="line" />
    </div>

    <div class="container">
      <div class="content">
        <AccordionItem
          title="1. Search for a game"
          description="Check if the game is already in our global library, if not then be the first to add it!"
          :class="openTab > 1 || 'clickable'"
          @handleTabClick="handleTabClick(1)"
          :completed="openTab > 1"
          :isActive="openTab === 1"
        >
          <template #content>
            <div>
              <SelectGameItem v-model:selectedGameItem="selectedGameItem" />

              <ButtonComponent
                :disabled="!selectedGameItem"
                @click="handleProgression('next')"
                style="margin-left: auto; display: block"
              >
                Confirm
              </ButtonComponent>
            </div>
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
            <div>
              <SelectGameCover
                :selectedGameItem="selectedGameItem.appid"
                v-model:selectedGameCover="selectedGameCover"
              />

              <div class="btn-container">
                <ButtonComponent @click="handleProgression('previous')">
                  Back
                </ButtonComponent>

                <ButtonComponent
                  :disabled="!selectedGameCover"
                  @click="handleProgression('next')"
                >
                  Confirm
                </ButtonComponent>
              </div>
            </div>
          </template>
        </AccordionItem>

        <AccordionItem
          title="3. Select and customize your card"
          description="Select one of your design presets or start customizing from one!"
          :completed="openTab > 3"
          :isActive="openTab === 3"
        >
          <template #content>
            <div>
              <SelectGameStyle
                ref="styleSelect"
                :selectedGameItem="selectedGameItem"
                :selectedGameCover="selectedGameCover"
              />

              <div class="btn-container">
                <ButtonComponent @click="handleProgression('previous')">
                  Back
                </ButtonComponent>

                <ButtonComponent @click="handleSubmit"> Confirm </ButtonComponent>
              </div>
            </div>
          </template>
        </AccordionItem>
      </div>
    </div>
    <LoadingOverlay :isLoading="isLoading" />
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import ButtonComponent from './ButtonComponent.vue';
import AccordionItem from './uiComponents/AccordionItem.vue';
import SelectGameItem from './SelectGameItem.vue';
import SelectGameCover from './SelectGameCover.vue';
import SelectGameStyle from './SelectGameStyle.vue';
import LoadingOverlay from './uiComponents/LoadingOverlay.vue';
import gameStore from '../state/gameStore';
import { toastStore } from '../state/toastStore';
import { mapActions } from 'pinia';

export default {
  name: 'AddGameModal',

  components: {
    ModalPopup,
    AccordionItem,
    SelectGameItem,
    SelectGameCover,
    SelectGameStyle,
    LoadingOverlay,
    ButtonComponent
  },

  provide() {
    return {
      handleProgression: this.handleProgression
    };
  },

  data() {
    return {
      openTab: 1,
      selectedGameItem: null,
      selectedGameCover: null,
      isLoading: false
    };
  },

  methods: {
    ...mapActions(gameStore, ['addSteamGame']),

    handleTabClick(index) {
      if (this.openTab <= index) return;

      this.openTab = index;
    },

    handleProgression(action) {
      if (action === 'next') {
        this.openTab++;

        return;
      }

      if (action === 'previous') {
        this.openTab--;
        return;
      }
    },

    async handleSubmit() {
      const { payload, gameName } = await this.$refs.styleSelect.handleConfirm();

      if (!payload) return;

      try {
        this.isLoading = true;
        await this.addSteamGame(payload);

        this.$refs.modal.hide();

        toastStore().add({
          icon: 'LibraryIcon',
          message: `<b>${gameName}</b> added to Library`
        });

        //reset to default
        this.openTab = 1;
        this.selectedGameItem = null;
        this.selectedGameCover = null;
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not add game to library`
        );
      } finally {
        this.isLoading = false;
      }
    },

    resetAddGameModal() {
      this.openTab = 1;
      this.selectedGameItem = null;
      this.selectedGameCover = null;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 96vw;
  max-height: 92vh;
  width: 750px;
  padding: 12px 18px;
  overflow-y: scroll;

  @media (max-width: 750px) {
    width: 96vw;
    height: 92vh;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: auto;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.heading {
  margin: 16px 16px 0 16px;

  h3 {
    font-size: 24px;
    padding-left: 8px;
    margin: 4px;
    color: rgba(var(--accentColor));
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
      rgba(var(--accentColor)) 13%,
      rgba(var(--accentColor)) 87%,
      rgba(0, 144, 153, 0) 100%
    );
  }
}
</style>

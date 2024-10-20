<template>
  <div class="content">
    <Transition name="fade" mode="out-in">
      <SelectGameCover
        v-if="currentTab === 1"
        heading="Select desired cover"
        :selectedGameItem="selectedGameItem.appid"
        v-model:selectedGameCover="selectedGameCover"
      />

      <SelectGameStyle
        ref="selectStyle"
        v-else-if="currentTab === 2"
        :selectedGameItem="selectedGameItem"
        :selectedGameCover="selectedGameCover"
      />
    </Transition>

    <div class="btn-container">
      <ButtonComponent v-if="currentTab === 2" @click="previous">Back</ButtonComponent>
      <ButtonComponent @click="currentTab === 1 ? next() : handleSubmit()">
        {{ currentTab === 1 ? 'Next' : 'Confirm' }}
      </ButtonComponent>
    </div>

    <LoadingOverlay :isLoading="isLoading" />
  </div>
</template>

<script>
import SelectGameCover from './SelectGameCover.vue';
import SelectGameStyle from './SelectGameStyle.vue';
import ButtonComponent from './ButtonComponent.vue';
import LoadingOverlay from './uiComponents/LoadingOverlay.vue';
import gameStore from '../state/gameStore';
import cardStore from '../state/cardStore';
import { toastStore } from '../state/toastStore';
import { mapActions } from 'pinia';

export default {
  name: 'AddCustomDisplay',

  components: {
    SelectGameCover,
    SelectGameStyle,
    LoadingOverlay,
    ButtonComponent
  },

  inject: ['accentColor'],

  props: {
    displayData: {
      type: Object
    }
  },

  data() {
    return {
      currentTab: 1,
      selectedGameCover: null,
      isLoading: false
    };
  },

  computed: {
    selectedGameItem() {
      const name = this.displayData?.gameData.name;
      const appid = this.displayData?.gameData.appid;

      return { name, appid };
    }
  },

  methods: {
    ...mapActions(gameStore, ['addSteamGame']),
    ...mapActions(cardStore, ['getUserCardConfigurations']),

    handleTabClick(index) {
      if (this.openTab <= index) return;

      this.openTab = index;
    },

    next() {
      this.currentTab++;
    },

    previous() {
      this.currentTab--;
    },

    async handleSubmit() {
      const { payload, gameName } = await this.$refs.selectStyle.handleConfirm();

      if (!payload) return;

      try {
        this.isLoading = true;
        await this.addSteamGame(payload);
        await this.getUserCardConfigurations();

        toastStore().add({
          icon: 'LibraryIcon',
          message: `<b>${gameName}</b> added to Library`
        });

        // reset to default
        this.currentTab = 1;
        this.selectedGameCover = null;
        this.$emit('resetView');
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not add game to library`
        );
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.content {
  padding: 0 16px 16px 16px;
  overflow-y: scroll;

  .btn-container {
    width: 100%;
    margin-top: 12px;
    display: flex;
    justify-content: end;
    gap: 16px;
  }
}
</style>

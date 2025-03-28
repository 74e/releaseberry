<template>
  <div v-if="colorPref" class="accent-color-container">
    <div class="select-color">
      <ColorPicker
        v-model="colorValue"
        :visibleFormat="['hex']"
        :alphaChannel="false"
        class="color-picker"
      />
      <div class="example">
        Release Berry
        <ReleaseBerryIcon />
        <LibraryIcon />
        <ControllerIcon />
        <UpdateIcon />
      </div>
      <button class="save-btn" :disabled="isEditing" @click="saveNewColor">Save</button>
      <button class="save-btn" :disabled="isDefaultColor" @click="saveNewColor(_, true)">
        Reset
      </button>
    </div>
    <p>
      Choose an accent color to personalize your profile and UI. Visitors to your profile
      will see this color too. (Preferably select a color that isn't too dark or too
      bright for good visibility).
    </p>
  </div>
</template>

<script>
import userStore from '@/state/userStore';
import colorStore from '@/state/colorStore';
import ColorPicker from '../uiComponents/ColorPicker.vue';
import cc from '@/helperFunctions/color';
import { toastStore } from '@/state/toastStore';

export default {
  name: 'AccentColorSetting',

  components: { ColorPicker },

  data() {
    return {
      colorValue: [0, 0, 0, 1]
    };
  },

  computed: {
    colorPref() {
      return userStore().user.userPreferences.accentColor;
    },

    hexColor() {
      return cc.rgbToHex(...this.colorValue.map((v) => Math.round(v)));
    },

    isEditing() {
      return this.colorPref == this.hexColor;
    },

    defaultColor() {
      return colorStore().defaultColor;
    },

    isDefaultColor() {
      return this.colorPref == this.defaultColor;
    }
  },

  mounted() {
    this.colorValue = cc.hexToRgba(this.colorPref);
  },

  methods: {
    // ignoring first argument because vue makes it an event object by default
    async saveNewColor(_, isReset) {
      const color = isReset ? this.defaultColor : this.hexColor;
      if (isReset) this.colorValue = cc.hexToRgba(this.defaultColor);

      try {
        await userStore().updateUserPreferences({ accentColor: color });
        toastStore().add({ icon: 'SaveIcon', message: 'Saved new accent color' });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not update accent color');
      }
    }
  }
};
</script>

<style scoped>
p {
  font-size: 13px;
  color: rgb(155, 155, 155);
  max-width: 560px;
}

.color-picker {
  border: none;
  background: none;
}

.color-display {
  width: max-content;
}

.select-color {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  border: 1px solid rgba(255, 255, 255, 0.096);
  border-radius: 8px;
  padding-right: 16px;
  width: max-content;

  .save-btn {
    margin-left: 8px;
    border: none;
    background: none;
    color: v-bind(hexColor);
    font-weight: bold;
    cursor: pointer;

    &:disabled {
      cursor: auto;
      opacity: 0.5;
    }
  }

  .example {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 18px;
    border: solid v-bind(hexColor);
    color: v-bind(hexColor);
    padding: 8px;
    border-width: 1px 0;
    border-radius: 6px;
    background-color: rgb(12, 12, 12);
    box-shadow: 0px 8px 11.1px rgba(0, 0, 0, 0.8);
    svg {
      height: 24px;
      cursor: auto;
      &.fill {
        fill: v-bind(hexColor) !important;
      }

      &.stroke {
        stroke: v-bind(hexColor) !important;
      }
    }
  }
}
</style>

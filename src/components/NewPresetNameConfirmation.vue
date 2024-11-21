<template>
  <div @click.self="cancel" class="confirmation">
    <div class="popup-box">
      <div :class="['name-config', { error: noNameError }]">
        <label class="error-label" v-if="noNameError">Preset name required</label>
        <input
          ref="nameInput"
          type="text"
          v-model="presetName"
          @focusin="noNameError = false"
          placeholder="Name your preset"
          maxlength="22"
        />
      </div>

      <div class="btn-container">
        <ButtonComponent @click="cancel" size="s">Cancel</ButtonComponent>
        <ButtonComponent @click="confirm" size="s">Confirm</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from './ButtonComponent.vue';

export default {
  name: 'NewPresetNameConfirmation',

  components: {
    ButtonComponent
  },

  mounted() {
    this.$nextTick(() => this.$refs.nameInput.focus());
  },

  data() {
    return {
      presetName: '',
      noNameError: false
    };
  },

  methods: {
    cancel() {
      this.$emit('closePopup');
    },

    confirm() {
      if (!this.presetName) {
        this.noNameError = true;
        return;
      }

      this.$emit('confirm', this.presetName);
      this.$emit('closePopup');
    }
  }
};
</script>

<style scoped>
.confirmation {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  inset: -4000px;
  z-index: 9999;

  .popup-box {
    width: 340px;
    background-color: var(--dark-85);
    box-shadow: var(--shadow-default);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 22px;
    backdrop-filter: blur(4px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    border-bottom: 2px solid rgba(var(--accentColor));
    border-radius: 6px;
    box-shadow: var(--shadow-default);
    outline: none;
    transition: border-color 0.3s ease-out;
  }
}

.btn-container {
  display: flex;
  justify-content: space-evenly;
  padding-top: 12px;
}
</style>

<template>
  <div @click.self="cancel" class="confirmation">
    <div class="popup-box">
      <div class="main-text" v-html="mainText" />

      <span class="sub-text" v-html="subText" />

      <div v-if="safetyWord" class="safety-word">
        <input type="text" v-model="safetyWordValue" />
      </div>

      <div class="btn-container">
        <ButtonComponent @click="cancel" size="s">Cancel</ButtonComponent>
        <ButtonComponent
          @click="confirm"
          size="s"
          :disabled="this.safetyWord && this.safetyWord !== this.safetyWordValue"
        >
          {{ safetyWord ? 'Delete' : 'Yes' }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from './ButtonComponent.vue';

export default {
  name: 'ConfirmationModal',

  components: {
    ButtonComponent
  },

  props: ['mainText', 'subText', 'safetyWord', 'action'],

  data() {
    return {
      safetyWordValue: ''
    };
  },

  methods: {
    cancel() {
      this.$emit('closePopup');
    },

    confirm() {
      if (this.safetyWord && this.safetyWord !== this.safetyWordValue) return;
      this.$emit('confirm');
      this.$emit('closePopup');
    }
  }
};
</script>

<style scoped>
.confirmation {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  z-index: 50;
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
    text-align: center;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .main-text {
      font-weight: 400;

      .bold {
        font-weight: bold;
      }
    }

    .sub-text {
      display: block;
      margin: auto;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.479);
      width: 255px;
      margin-top: 4px;
    }

    .btn-container {
      display: flex;
      justify-content: center;
      padding-top: 16px;
      gap: 28px;
    }

    .safety-word {
      margin-top: 4px;
      input {
        padding: 4px;
        background-color: var(--dark-30);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.726);
        outline: none;
      }
    }
  }
}
</style>

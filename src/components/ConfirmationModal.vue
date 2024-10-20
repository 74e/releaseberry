<template>
  <div @click.self="cancel" class="confirmation">
    <div class="popup-box">
      <div class="main-text" v-html="mainText" />

      <span class="sub-text" v-html="subText" />

      <div class="btn-container">
        <ButtonComponent @click="cancel" size="s">Cancel</ButtonComponent>
        <ButtonComponent @click="confirm" size="s">Yes</ButtonComponent>
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

  props: ['mainText', 'subText', 'action'],

  inject: ['accentColor'],

  methods: {
    cancel() {
      this.$emit('closePopup');
    },

    confirm() {
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
    border: solid v-bind(accentColor);
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
  }
}
</style>

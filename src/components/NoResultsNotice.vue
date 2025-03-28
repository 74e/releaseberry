<template>
  <div class="no-results-notice">
    <h1>{{ heading }}</h1>

    <span v-html="message" />

    <ButtonComponent size="m" @click="callback">
      {{ buttonMessage }}
    </ButtonComponent>
  </div>
</template>

<script>
import ButtonComponent from './ButtonComponent.vue';

export default {
  name: 'NoResultsNotice',
  components: { ButtonComponent },
  props: {
    heading: {
      type: String
    },

    message: {
      type: String
    },

    buttonMessage: {
      type: String
    },

    callback: {
      type: Function
    }
  }
};
</script>

<style scoped>
.no-results-notice {
  width: 100%;
  max-width: 430px;
  padding: 32px;
  margin: auto;
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  backdrop-filter: blur(80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  h1 {
    color: var(--accent);
    font-size: 26px;
  }

  span {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.555);
    line-height: 25px;
    text-align: center;
  }

  button {
    margin-top: 8px;
  }
}
</style>

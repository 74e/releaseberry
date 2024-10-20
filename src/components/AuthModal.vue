<template>
  <ModalPopup :blur="true" :accentBorders="['right', 'left']">
    <Transition name="fade" mode="out-in">
      <LoginForm @redirect="switchWindowContent" v-if="showLogin" />
      <CreateAccountForm @redirect="switchWindowContent" v-else />
    </Transition>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import LoginForm from './LoginForm.vue';
import CreateAccountForm from './CreateAccountForm.vue';

export default {
  name: 'AuthModal',

  components: {
    ModalPopup,
    LoginForm,
    CreateAccountForm
  },

  data() {
    return {
      showLogin: true
    };
  },

  methods: {
    switchWindowContent() {
      this.showLogin = !this.showLogin;
    }
  }
};
</script>

<style scoped></style>

<template>
  <WindowPopup
    ref="window"
    :position="windowWidth <= 750 ? 'top-center' : 'right-center'"
    :accentBorders="[windowWidth <= 750 ? 'bottom' : 'left']"
  >
    <div class="icon-box">
      <ProfileIcon />
    </div>
    <template #window>
      <div class="login-or-signup">
        <ButtonComponent size="s" @click="openAuth"> Login </ButtonComponent>
        <div class="or-devider">
          <div class="left-line" />
          <div class="or">or</div>
          <div class="right-line" />
        </div>
        <ButtonComponent size="s" @click="openAuthSignUp"> Sign up </ButtonComponent>
      </div>
    </template>
  </WindowPopup>
</template>

<script>
import WindowPopup from './uiComponents/WindowPopup.vue';
import ButtonComponent from './ButtonComponent.vue';

export default {
  name: 'NotloggedInWindow',

  components: {
    WindowPopup,
    ButtonComponent
  },

  data() {
    return {
      windowWidth: window.innerWidth
    };
  },

  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },

  unmounted() {
    window.onresize = null;
  },

  methods: {
    openAuth() {
      this.$emit('openAuthModal');
      this.$refs.window.showWindow = false;
    },

    openAuthSignUp() {
      this.$emit('openAuthSignUpModal');
      this.$refs.window.showWindow = false;
    }
  }
};
</script>

<style scoped>
.login-or-signup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  cursor: auto;

  .or-devider {
    display: flex;
    align-items: center;
    color: rgba(var(--accentColor));
    gap: 4px;

    .or {
      transform: translateY(-2px);
    }

    .left-line,
    .right-line {
      width: 50px;
      height: 2px;
    }

    .left-line {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.001) 0%,
        rgba(255, 255, 255, 0.001) 3%,
        rgba(var(--accentColor)) 100%
      );
    }

    .right-line {
      background: linear-gradient(
        -90deg,
        rgba(255, 255, 255, 0.001) 0%,
        rgba(255, 255, 255, 0.001) 3%,
        rgba(var(--accentColor)) 100%
      );
    }
  }
}
</style>

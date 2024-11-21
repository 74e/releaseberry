<template>
  <div class="login-container">
    <Transition name="fade" mode="out-in">
      <div v-if="!success">
        <ReleaseBerryIcon />

        <h2>
          Login to
          <span class="logo-text">Release Berry</span>
        </h2>

        <span v-if="error" class="went-wrong">{{ error }} </span>

        <form @submit.prevent="handleSubmit">
          <div class="input-container">
            <label for="userHandleOrEmail">User handle or Email</label>
            <input
              type="userHandleOrEmail"
              id="userHandleOrEmail"
              v-model="userHandleOrEmail"
              required
            />
          </div>

          <div class="input-container">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>

          <button :disabled="isLoading" type="submit">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <span class="no-account">
          New to Release berry?
          <span class="redirect" @click="redirect">Create an account</span>
        </span>
      </div>

      <div v-else class="success">
        <h1>Welcome</h1>
        <p>{{ username }}</p>
      </div>
    </Transition>
  </div>
</template>

<script>
import userStore from '../state/userStore.js';
import { toastStore } from '../state/toastStore';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'LoginForm',

  inject: ['hide'],

  data() {
    return {
      userHandleOrEmail: '',
      password: '',
      error: '',
      isLoading: false,
      success: false
    };
  },

  computed: {
    ...mapState(userStore, ['username'])
  },

  methods: {
    ...mapActions(userStore, ['login']),

    redirect() {
      this.$emit('redirect');
    },

    async handleSubmit() {
      this.isLoading = true;

      try {
        await this.login({
          userHandleOrEmail: this.userHandleOrEmail,
          password: this.password
        });

        this.handleSuccesfulLogin();
      } catch (error) {
        // Adds custom error message from backend
        if (error?.response?.data.error) {
          this.error = error.response.data.error;

          setTimeout(() => {
            this.error = '';
          }, 3000);
        } else {
          toastStore().handleErrorMessage(error, `Something went wrong, Could not login`);
        }
      } finally {
        this.isLoading = false;
      }
    },

    handleSuccesfulLogin() {
      this.success = true;

      setTimeout(() => {
        this.hide();
        this.$router.push('/');
      }, 2000);
    }
  }
};
</script>

<style scoped>
.login-container {
  margin: 24px 25px 60px 25px;
  width: 352px;

  min-width: 352px;
  min-height: 342px;

  @media (max-width: 430px) {
    min-width: unset;
    min-height: unset;
    width: 97vw;
    height: 99vh;
    margin: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .releaseberry-icon {
    width: 48px;
    height: 48px;
    margin: auto;
    margin-bottom: 16px;

    @media (max-width: 430px) {
      margin: 0 auto 16px auto;
    }
  }

  h2 {
    font-size: 22px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 8px;

    .logo-text {
      font-family: var(--font-style-mplus);
      background: rgba(var(--accentColor));
      background-clip: text;
      background-position: v-bind(backgroundPosition);
      color: transparent;
      font-weight: 500;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 16px 8px 16px;

    @media (max-width: 430px) {
      padding: 16px 32px 8px 32px;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      font-size: 14px;

      label {
        margin: 0 8px 6px 12px;
      }

      input {
        padding: 8px 12px;
        border-radius: var(--radius-m);
        background-color: var(--dark-fg);
        border: 1px solid #ffffff1c;
        color: var(--default-font-color);
        font-size: 15px;
        outline: none;

        &:focus {
          outline: 1px solid rgba(var(--accentColor), 0.55);
        }
      }
    }

    button {
      padding: 8px;
      margin-top: 8px;

      border-radius: var(--radius-s);
      background-color: rgba(var(--accentColor));
      border: none;
      color: #d0dadf;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease-out;

      &:disabled {
        opacity: 0.5;
      }

      &:hover {
        filter: var(--hover-filter-effect);
      }
    }
  }

  .no-account {
    display: block;
    margin: 8px auto;
    text-align: center;
    color: #7f888d;
    font-size: 14px;

    .redirect {
      color: rgba(var(--accentColor));
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .went-wrong {
    display: block;
    color: #ff4d4d;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
  }
}

.success {
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: translateY(20px);

  p {
    font-size: 32px;
    font-weight: 500;
    color: rgba(var(--accentColor));
  }
}
</style>

/** test test@test.com testtest1 */

<template>
  <div class="create-account-container">
    <div class="logo">
      <span class="logo-text">Release Berry</span>
      <ReleaseBerryIcon />
    </div>

    <h2>Create an account <UserNotice iconSize="19" xShift="-90" width="300" /></h2>

    <span v-if="error" class="went-wrong">{{ error }}</span>

    <form @submit.prevent="handleSubmit">
      <VerficationInput
        v-for="field in formFields"
        :key="field.label"
        :label="field.label"
        :inputType="field.inputType"
        :error="field.error"
        :verificationName="field.name"
        :pattern="field.pattern"
        :isRequired="field.required"
        :noticeMessage="field.noticeMessage"
        v-model:isLoading="field.isLoading"
        v-model:isValid="field.valid"
        v-model:inputValue="field.value"
      />

      <button type="submit">Create account</button>
    </form>

    <span class="already-have-account">
      Already have an account?
      <span class="redirect" @click="redirect">Login</span>
    </span>
  </div>
</template>

<script>
import userStore from '../state/userStore.js';
import { toastStore } from '../state/toastStore';
import UserNotice from './UserNotice.vue';
import VerficationInput from './VerificationInput.vue';
import { mapActions } from 'pinia';

export default {
  name: 'CreateAccountForm',

  components: {
    UserNotice,
    VerficationInput
  },

  inject: ['hide'],

  data() {
    return {
      formFields: [
        {
          label: 'User Handle',
          name: 'handle',
          noticeMessage: 'User handles are unique and can be used to login.',
          value: '',
          inputType: 'text',
          isLoading: false,
          valid: false,
          pattern: /\b([A-Za-z0-9_]{1,22})\b/,
          required: true,
          error: 'Handle too long (max 21 characters)'
        },
        {
          label: 'Username',
          name: 'username',
          noticeMessage: '',
          value: '',
          inputType: 'text',
          isLoading: false,
          valid: false,
          pattern: /^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]{1,21}$/,
          required: true,
          error: 'Username too long (max 21 characters)'
        },
        {
          label: 'Email (Optional)',
          name: 'email',
          noticeMessage: 'Email is not required but recommended (Password reset),',
          value: '',
          inputType: 'email',
          isLoading: false,
          valid: false,
          pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          required: false,
          error: 'Invalid email format'
        },
        {
          label: 'Password',
          name: 'password',
          noticeMessage: '',
          value: '',
          inputType: 'password',
          valid: false,
          pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          required: true,
          error: `Password must be at least 8 characters long and consist of letters, numbers and special characters.`
        },
        {
          label: 'Confirm Password',
          name: 'confirmPassword',
          noticeMessage: '',
          value: '',
          inputType: 'password',
          valid: false,
          pattern: '',
          required: true,
          error: 'Passwords do not match'
        }
      ],
      isLoading: false,
      error: ''
    };
  },

  watch: {
    formFields: {
      handler() {
        const passwordField = this.formFields.filter(
          (field) => field.name === 'password'
        );
        this.formFields.forEach((field) => {
          if (field.name === 'confirmPassword') {
            field.pattern = passwordField[0].value;
          }
        });
      },
      deep: true
    }
  },

  methods: {
    ...mapActions(userStore, ['createAccount']),

    redirect() {
      this.$emit('redirect');
    },

    async handleSubmit() {
      if (
        this.formFields.every((field) => {
          if (field.name === 'email' && field.value === '') return true;
          return field.valid;
        })
      ) {
        const formDetails = this.formFields.reduce((acc, field) => {
          acc[field.name] = field.value || null;
          return acc;
        }, {});

        this.isLoading = true;

        try {
          await this.createAccount(formDetails);

          this.$router.push('/library');
          this.hide();
          this.$emit('redirect');
        } catch (error) {
          if (error?.response?.data.error) {
            this.error = error.response.data.error;

            setTimeout(() => {
              this.error = '';
            }, 3000);
          } else {
            toastStore().handleErrorMessage(
              error,
              'NoticeIcon',
              `Something went wrong, Could not create an account.`
            );
          }
        } finally {
          this.isLoading = false;
        }
      }

      console.log('2nd ping');
    }
  }
};
</script>

<style scoped>
.create-account-container {
  margin: 24px 25px 60px 25px;
  width: 352px;

  @media (max-width: 430px) {
    width: 97vw;
    height: 99vh;
    margin: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .logo {
    font-size: 34px;
    font-weight: 600;

    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;

    .releaseberry-icon {
      width: 42px;
      height: 42px;
      transform: translate(3px, 1px) rotate(34.14deg);
    }

    .logo-text {
      font-family: var(--font-style-mplus);
      color: rgba(var(--accentColor));
    }
  }

  h2 {
    font-size: 20px;
    font-weight: 300;
    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 16px 8px 16px;

    @media (max-width: 430px) {
      padding: 16px 32px 8px 32px;
    }

    button {
      padding: 8px;
      margin-top: 8px;

      border-radius: var(--radius-s);
      background-color: var(--accent);
      border: none;
      color: #d0dadf;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease-out;

      &:hover {
        filter: var(--hover-filter-effect);
      }
    }
  }

  .already-have-account {
    display: block;
    margin: 8px auto;
    text-align: center;
    color: #7f888d;
    font-size: 14px;

    .redirect {
      color: var(--accent);
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
</style>

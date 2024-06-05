<template>
  <div class="create-account-container">
    <div class="logo">
      <span class="logo-text">Release Berry</span>
      <ReleaseBerryIcon />
    </div>

    <h2>Create an account <UserNotice /></h2>

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
        v-model:isLoading="field.isLoading"
        v-model:isValid="field.valid"
        v-model:inputValue="field.value"
        :outlineColor="accentColor"
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
import userStore from '../state/userStore.js'
import UserNotice from './UserNotice.vue'
import colorStore from '../state/accentColor.js'
import VerficationInput from './VerificationInput.vue'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'AuthModalComponent',

  components: {
    UserNotice,
    VerficationInput
  },

  inject: ['hide'],

  data() {
    return {
      formFields: [
        {
          label: 'Username',
          name: 'username',
          value: '',
          inputType: 'text',
          isLoading: false,
          valid: false,
          pattern: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]{1,21}$/,
          error: 'Username too long (max 21 characters)'
        },
        {
          label: 'Email',
          name: 'email',
          value: '',
          inputType: 'email',
          isLoading: false,
          valid: false,
          pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          error: 'Invalid email format'
        },
        {
          label: 'Password',
          name: 'password',
          value: '',
          inputType: 'password',
          valid: false,
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          error: `Password must be at least 8 characters long and consist of letters, numbers and special characters.`
        },
        {
          label: 'Confirm Password',
          name: 'confirmPassword',
          value: '',
          inputType: 'password',
          valid: false,
          pattern: '',
          error: 'Passwords do not match'
        }
      ],
      isLoading: false,
      error: ''
    }
  },

  computed: {
    ...mapState(colorStore, ['accentColor'])
  },

  watch: {
    formFields: {
      handler() {
        const passwordField = this.formFields.filter((field) => field.name === 'password')
        this.formFields.filter((field) => {
          if (field.name === 'confirmPassword') {
            field.pattern = passwordField[0].value
          }

          return field
        })
      },
      deep: true
    }
  },

  methods: {
    ...mapActions(userStore, ['createAccount']),

    redirect() {
      this.$emit('redirect')
    },

    async handleSubmit() {
      if (this.formFields.every((field) => field.valid)) {
        const formDetails = this.formFields.reduce((acc, field) => {
          acc[field.name] = field.value
          return acc
        }, {})

        this.isLoading = true

        try {
          await this.createAccount(formDetails)

          this.$router.push('/')
          this.hide()
        } catch (error) {
          this.error = error.response.data.error

          setTimeout(() => {
            this.error = ''
          }, 3000)
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
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
      color: v-bind(accentColor);
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

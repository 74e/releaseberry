<template>
  <div class="input-container">
    <div class="label-and-verfication">
      <label :for="verificationName">
        {{ label }}
        <UserNotice
          v-if="noticeMessage"
          iconSize="15"
          :noticeMessage="noticeMessage"
          width="275"
        />
      </label>
      <LoadingAnimIcon v-if="isLoading" />
      <div v-if="isValid && !inputValue.length < 1" class="success-message">
        {{ successMessage }}
      </div>
    </div>
    <input
      :type="inputType"
      :id="verificationName"
      :value="inputValue"
      @keyup="updateInputValue"
      :required="isRequired"
    />

    <Transition name="fade">
      <div v-if="errorInput" class="error-message">{{ errorInput }}</div>
    </Transition>
  </div>
</template>

<script>
import UserNotice from './UserNotice.vue';
import userStore from '../state/userStore.js';
import { mapActions } from 'pinia';

export default {
  name: 'VerificationFormItem',

  components: {
    UserNotice
  },

  props: {
    label: {
      type: String,
      default: ''
    },

    inputValue: {
      type: String,
      default: ''
    },

    isLoading: {
      type: Boolean,
      default: false
    },

    isValid: {
      type: Boolean,
      default: false
    },

    error: {
      type: String,
      default: ''
    },

    verificationName: {
      type: String,
      default: ''
    },

    inputType: {
      type: String,
      default: 'text',
      validator(value) {
        return ['text', 'email', 'password'].includes(value);
      }
    },

    noticeMessage: {
      type: String,
      default: ''
    },

    isRequired: {
      type: Boolean,
      default: true
    },

    pattern: {
      type: [RegExp, String],
      default: null
    }
  },

  data() {
    return {
      inputTimeout: null,
      errorInput: ''
    };
  },

  watch: {
    inputValue() {
      this.validateInput();
    }
  },

  computed: {
    successMessage() {
      switch (this.verificationName) {
        case 'password':
          return 'Valid password';
        case 'confirmPassword':
          return 'Passwords match';
        default:
          return `${this.label} available`;
      }
    }
  },

  methods: {
    ...mapActions(userStore, ['handleTakenValidation', 'emailTakenValidation']),

    updateInputValue(e) {
      this.$emit('update:inputValue', e.target.value);
    },

    validateInput() {
      if (this.verificationName === 'handle') {
        this.verify(this.handleTakenValidation);
      } else if (this.verificationName === 'email') {
        this.verify(this.emailTakenValidation);
      } else if (this.verificationName === 'username') {
        this.matchRegexPattern();
      } else if (this.verificationName === 'password') {
        this.matchRegexPattern();
      } else if (this.verificationName === 'confirmPassword') {
        this.matchStringPattern();
      }
    },

    async verify(validationFunction) {
      this.errorInput = '';
      if (!this.inputValue) return;

      clearTimeout(this.inputTimeout);
      this.$emit('update:isLoading', true);
      this.$emit('update:isValid', false);

      this.inputTimeout = setTimeout(async () => {
        try {
          await validationFunction(this.inputValue);
          this.$emit('update:isValid', true);
        } catch (error) {
          this.errorInput = error.response.data.error;
          this.$emit('update:isValid', false);
        } finally {
          this.$emit('update:isLoading', false);
        }
      }, 500);
    },

    matchRegexPattern() {
      clearTimeout(this.inputTimeout);
      this.errorInput = '';

      this.inputTimeout = setTimeout(() => {
        if (this.pattern.test(this.inputValue)) {
          this.$emit('update:isValid', true);
          return;
        }

        this.errorInput = this.error;
        this.$emit('update:isValid', false);
      }, 900);
    },

    matchStringPattern() {
      clearTimeout(this.inputTimeout);
      this.errorInput = '';

      this.inputTimeout = setTimeout(() => {
        if (this.pattern === this.inputValue) {
          this.$emit('update:isValid', true);
          return;
        }

        this.errorInput = this.error;
        this.$emit('update:isValid', false);
      }, 500);
    }
  }
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .label-and-verfication {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .loading-icon {
      width: 23px;
    }
  }

  label {
    margin: 0 8px 6px 12px;
    display: flex;
    align-items: center;
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

  .error-message {
    margin: 4px 0 0 12px;
    color: rgb(187, 32, 32);
  }

  .success-message {
    margin: 0 4px 5px 0;
    color: rgb(32, 187, 78);
  }
}
</style>

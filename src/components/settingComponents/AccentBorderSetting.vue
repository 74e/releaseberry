<template>
  <div class="accent-border-setting-container">
    <div
      :class="[
        'option',
        option,
        { active: option == 'accent' ? bordersOption : !bordersOption }
      ]"
      @click="updateBorderPref(option)"
      v-for="option in ['accent', 'faint']"
      :key="option"
    >
      <div class="dot" />
      <div class="border-example">
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import userStore from '@/state/userStore';

export default {
  name: 'AccentBorderSetting',

  computed: {
    bordersOption() {
      return userStore().user.userPreferences.accentBorders;
    }
  },

  methods: {
    async updateBorderPref(value) {
      const borderSetting = value === 'accent';
      if (this.bordersOption && borderSetting) return;

      try {
        await userStore().updateUserPreferences({ accentBorders: borderSetting });

        toastStore().add({
          icon: 'SaveIcon',
          message: 'Saved border preference'
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not update border preference');
      }
    }
  }
};
</script>

<style scoped>
.accent-border-setting-container {
  display: flex;
  gap: 24px;
}

.option {
  width: 240px;
  height: 240px;
  border: 1px solid rgba(255, 255, 255, 0.096);
  border-radius: 8px;

  &.active {
    border-top: 1px solid rgba(var(--accentColor), 0.3);
    box-shadow:
      rgba(var(--accentColor), 0.12) 0px 2px 4px 0px,
      rgba(var(--accentColor), 0.32) 0px 2px 16px 0px;

    .dot {
      border: 2px solid rgba(var(--accentColor), 1);
      position: relative;

      &::after {
        content: '';
        display: block;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        background: rgba(var(--accentColor), 1);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .dot {
    --diameter: 18px;
    width: var(--diameter);
    height: var(--diameter);
    border-radius: var(--diameter);
    border: 2px solid rgba(var(--accentColor), 0.5);
    margin: 24px auto;
  }

  .border-example {
    width: 75%;
    height: 150px;
    background-color: var(--dark-50);
    margin: auto;
    border-radius: 8px;
    text-transform: capitalize;
    text-align: center;
    align-content: center;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.63);
  }

  &.accent .border-example {
    border: solid rgba(var(--accentColor));
    border-width: 0 2px 0 2px;
  }

  &.faint .border-example {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}
</style>

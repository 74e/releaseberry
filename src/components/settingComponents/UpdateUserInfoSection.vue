<template>
  <div v-if="user" class="user-info-container">
    <div class="profile-example">
      <img :src="profileImages[user.image_index]" alt="profile image" />

      <div class="profile-handle">
        <h2 class="username">{{ user.username }}</h2>
        <span class="handle">@{{ user.handle }}</span>
        <WindowPopup>
          <div class="img-edit"><EditIcon />Change profile image</div>
          <template #window>
            <ProfileImageSelectWindow />
          </template>
        </WindowPopup>
      </div>
    </div>

    <div class="user-info">
      <div class="info-item" v-for="(value, key, i) in formData" :key="key">
        <label>
          {{ key }}

          <input
            :type="key === 'email' && !isEditing[key] ? 'password' : 'text'"
            ref="input"
            @keydown.enter.prevent="saveChange(key)"
            @keydown.esc="cancelEdit(key)"
            v-model="formData[key]"
            :disabled="!isEditing[key]"
          />
          <span v-if="!formData[key] && !isEditing[key]" class="no-info">
            --- No info ---
          </span>
        </label>

        <div class="options">
          <TrashIcon
            v-if="!isEditing[key] && formData[key] && key == 'email'"
            @click="deleteEmail"
          />
          <span v-if="!isEditing[key]" class="edit-btn" @click="initEditing(key, i)">
            {{ formData[key] ? 'Edit' : 'Add' }}
          </span>
          <span v-else class="save-btn" @click="saveChange(key)">Save</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import userStore from '@/state/userStore';
import ProfileImageSelectWindow from './ProfileImageSelectWindow.vue';
import WindowPopup from '../uiComponents/WindowPopup.vue';

export default {
  name: 'UpdateUserInfoSection',

  components: { ProfileImageSelectWindow, WindowPopup },

  inject: ['profileImages'],

  mounted() {
    this.initUserSettings();
  },

  unmounted() {
    userStore().clearUserCredentials();
  },

  data() {
    return {
      formData: {
        handle: null,
        username: null,
        email: null
      },
      isEditing: {
        username: false,
        handle: false,
        email: false
      },
      valueBeforeEdit: null
    };
  },

  computed: {
    user() {
      return userStore().userCredentials;
    }
  },

  methods: {
    async initUserSettings() {
      await userStore().getUserCredentials();

      this.formData = {
        handle: this.user.handle,
        username: this.user.username,
        email: this.user.email
      };
    },

    initEditing(target, i) {
      for (const i in this.isEditing) {
        this.isEditing[i] = false;
      }
      this.valueBeforeEdit = this.formData[target];
      this.isEditing[target] = true;

      this.$nextTick(() => {
        this.$refs.input[i].focus();
      });
    },

    cancelEdit(target) {
      this.isEditing[target] = false;
      this.formData[target] = this.valueBeforeEdit;
    },

    async saveChange(target) {
      if (target !== 'image_index') this.isEditing[target] = false;
      if (this.formData[target] == this.valueBeforeEdit) return;

      try {
        await userStore().updateUserInformation(
          { [target]: this.formData[target] },
          false
        );

        toastStore().add({
          icon: 'SaveIcon',
          message: `${target.charAt(0).toUpperCase() + target.slice(1)} has been updated.`
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, `Could not save ${target}`);
        this.cancelEdit(target);
      }
    },

    async deleteEmail() {
      try {
        await userStore().updateUserInformation({ email: null }, true);
        this.formData.email = null;

        toastStore().add({
          icon: 'SaveIcon',
          message: `Email has been removed.`
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, `Could not remove email`);
      }
    }
  }
};
</script>

<style scoped>
.profile-example {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  img {
    width: 80px;
    border-radius: 6px;
  }
}

.profile-handle {
  margin: 12px 0;
  padding-left: 12px;
  position: relative;
  line-height: 24px;

  width: max-content;

  @media (max-width: 1150px) {
    margin: 0;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 2px;
    border-radius: 4px;
    width: 3px;
    height: 48px;
    background-color: rgba(var(--accentColor));
    transition: all 0.3s ease-out;
    opacity: 100%;
  }

  h2 {
    font-size: 22px;
    font-weight: 500;

    overflow: hidden;
    text-overflow: '-';
    white-space: nowrap;
  }

  .handle {
    font-size: 16px;
    color: #848c8f;
    display: block;
    overflow: hidden;
    text-overflow: '-';
    white-space: nowrap;
  }

  .img-edit {
    display: flex;
    align-items: center;
    margin: 3px 0 0 -14px;
    cursor: pointer;
    transition: all 0.3s ease-in;
    svg {
      height: 18px;
    }

    &:hover {
      filter: brightness(1.2);
    }
  }

  @media (max-width: 410px) {
    h2 {
      font-size: 14px;
    }

    span {
      font-size: 11px;
    }
  }
}

.user-info {
  max-width: 400px;

  .info-item {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    label {
      display: flex;
      flex-direction: column;
      color: #ffffff73;
      font-size: 15px;
      position: relative;
      text-transform: capitalize;
    }

    .no-info {
      position: absolute;
      bottom: 0;
      color: #ffffff46;
    }

    input {
      background: none;
      color: #ffffffc0;
      font-size: 17px;
      border: none;
      outline: none;
      box-shadow: 0 2px 0 rgba(var(--accentColor));

      &:disabled {
        border: none;
        box-shadow: unset;
      }
    }

    .options {
      display: flex;
      gap: 12px;
    }

    .edit-btn,
    .save-btn {
      user-select: none;
      cursor: pointer;
      &:hover {
        filter: brightness(1.2);
      }
    }
  }
}
</style>

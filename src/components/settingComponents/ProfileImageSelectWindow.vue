<template>
  <div class="image-container">
    <img
      :class="['profile-image', { active: userProfileImage == i }]"
      v-for="(_, i) in profileImages"
      @click="saveChangedProfilePicture(i)"
      :src="profileImages[i]"
      alt="img"
      :key="i"
    />
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import userStore from '@/state/userStore';
export default {
  name: 'ProfileImageSelectWindow',

  inject: ['profileImages'],

  data() {
    return {};
  },

  computed: {
    userProfileImage() {
      return userStore().loggedInUser.image_index;
    }
  },

  methods: {
    async saveChangedProfilePicture(index) {
      try {
        await userStore().updateUserInformation({ image_index: index }, false);
        toastStore().add({
          icon: 'SaveIcon',
          message: 'Updated profile image'
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not change profile image');
      }
    }
  }
};
</script>

<style scoped>
.image-container {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.profile-image {
  min-height: 110px;
  min-width: 110px;
  border-radius: 4px;
  user-select: none;

  &.active {
    outline: 3px solid rgba(var(--accentColor));
  }
}
</style>

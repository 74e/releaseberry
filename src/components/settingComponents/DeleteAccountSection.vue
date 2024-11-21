<template>
  <div class="delete-account-container">
    <button class="delete-btn" @click="toggleAdminConfirmationPopup">
      Delete account
    </button>

    <ConfirmationModal
      v-if="showConfirmDeleteAccountModal"
      mainText="Deleting your account is an irreversible action, are you sure?"
      subText="Write your handle to confirm"
      :safetyWord="userHandle"
      @closePopup="toggleAdminConfirmationPopup"
      @confirm="finalizeAccountDeletion"
    />
  </div>
</template>

<script>
import { toastStore } from '@/state/toastStore';
import ConfirmationModal from '../ConfirmationModal.vue';
import userStore from '@/state/userStore';

export default {
  name: 'DeleteAccountSection',
  components: { ConfirmationModal },

  data() {
    return {
      showConfirmDeleteAccountModal: false
    };
  },

  computed: {
    userHandle() {
      return userStore().user.handle;
    }
  },

  methods: {
    toggleAdminConfirmationPopup() {
      this.showConfirmDeleteAccountModal = !this.showConfirmDeleteAccountModal;
    },

    async finalizeAccountDeletion() {
      try {
        await userStore().deleteAccount();
        this.$router.push('/global');
        toastStore().delete({
          icon: 'TrashIcon',
          message: 'Account has been <b>deleted</b> successfully'
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Could not delete account.');
      }
    }
  }
};
</script>

<style scoped>
.delete-btn {
  filter: invert(1);
  background: none;
  border: 2px solid rgba(var(--accentColor));
  border-radius: 6px;
  color: rgba(var(--accentColor));
  padding: 6px 12px;
  cursor: pointer;
}
</style>

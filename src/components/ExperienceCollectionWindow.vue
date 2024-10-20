<template>
  <ModalPopup ref="modal" :blur="true" :closeButton="false" :accentBorders="['faint']">
    <div class="content" v-if="user">
      <img :src="profileImages[user.image_index]" alt="" />
      {{ `${user.username} @${user.handle} ${user.xp}` }}
    </div>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';
import userStore from '../state/userStore';

export default {
  name: 'ExperienceCollectionWindow',

  inject: ['accentColor', 'profileImages'],

  props: {
    gameTitle: { type: String, default: null },
    accumulatedExp: { type: Number, default: null }
  },

  components: { ModalPopup },

  mounted() {
    const { handle, username, image_index, xp } = userStore().user;
    this.user = { handle, username, xp, image_index };

    console.log(this.gameTitle, this.accumulatedExp);
  },

  data() {
    return {
      user: null
    };
  }
};
</script>

<style scoped>
.content {
  width: 300px;
  height: 200px;
}
</style>

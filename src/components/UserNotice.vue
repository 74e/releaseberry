<template>
  <WindowPopup
    position="bottom-left"
    :trigger="trigger"
    :accentBorders="['right', 'bottom', 'left', 'top']"
    :borderWidth="1"
    width="259px"
  >
    <div class="click-range">
      <NoticeIcon />
    </div>

    <template #window>
      <div class="notice-text">
        Release Berry currently doesn't support <b>password resets</b>. Please make sure
        to stash your password in a safe place.
      </div>
    </template>
  </WindowPopup>
</template>

<script>
import WindowPopup from './WindowPopup.vue'

// TEMPORARY COMPONENT FOR NOTIFYING USERS ABOUT THE LACK OF PASSWORD RESET FUNCTIONALITY

export default {
  name: 'UserNoticeComponent',

  components: {
    WindowPopup
  },

  data() {
    return {
      windowWidth: window.innerWidth
    }
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowSize)
  },

  unmounted() {
    window.removeEventListener('resize', this.updateWindowSize)
  },

  computed: {
    isMobile() {
      return this.windowWidth > 430
    },

    trigger() {
      return this.isMobile ? 'hover' : 'click'
    }
  },

  methods: {
    updateWindowSize() {
      this.windowWidth = window.innerWidth
    }
  }
}
</script>

<style scoped>
.notice-icon {
  height: 20px;
  margin-left: 9px;
  fill: rgb(126, 145, 167);
}
.notice-text {
  font-size: 15px;
  text-align: center;
  padding: 1rem;
}
</style>

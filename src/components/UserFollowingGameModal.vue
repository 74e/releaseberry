<template>
  <div @click.self="cancel" class="backdrop">
    <div class="popup-box">
      <CloseIcon @click="cancel" />
      <div class="modal-heading">Users following this game ({{ followers.length }})</div>

      <div class="line" />

      <div class="follows-container">
        <RouterLink
          class="follower-item"
          v-for="follow in followers"
          :to="`/user/${follow.user.handle}`"
          :key="follow.user.id"
        >
          <div class="profile-image">
            <img :src="profileImages[follow.user.image_index]" alt="Profile Image" />
          </div>

          <div class="profile-details">
            <h2>{{ follow.user.username }}</h2>
            <span>@{{ follow.user.handle }}</span>
          </div>

          <div class="level-display">
            <span class="level-label">LEVEL</span>
            <span class="level">{{ follow.user.level }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFollowingGameModal',

  props: ['followers'],

  inject: ['accentColor', 'profileImages'],

  methods: {
    cancel() {
      this.$emit('closePopup');
    }
  }
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  inset: -4000px;

  .popup-box {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 555px;
    height: 600px;
    background-color: var(--dark-85);
    box-shadow: var(--shadow-default);
    border: 1px solid rgba(255, 255, 255, 0.19);
    border-radius: 8px;
    padding: 8px 8px 0 8px;
    backdrop-filter: blur(10px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (max-width: 585px) {
      width: 90vw;
    }
  }
}

.close-icon {
  position: absolute;
  top: 4px;
  right: 6px;
}

.level-display {
  display: none;
  flex-direction: column;
  align-items: center;

  @media (max-width: 585px) {
    display: flex;
  }

  .level-label {
    font-size: 12px;
    color: #848c8f;
  }

  .level {
    font-size: 26px;
    font-weight: 500;
    color: v-bind(accentColor);
  }
}

.modal-heading {
  color: v-bind(accentColor);
  padding: 0 20px;
  font-weight: 500;
  font-size: 18px;
}

.line {
  margin-top: 4px;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(0, 240, 255, 0) 0%,
    v-bind(accentColor) 8%,
    v-bind(accentColor) 17%,
    rgba(0, 144, 153, 0) 100%
  );
}

.follows-container {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 12px;
  max-height: 100%;
  overflow: scroll;
  gap: 12px;
}

.follower-item {
  display: flex;
  align-items: center;
  padding: 8px;
  width: 250px;
  height: 60px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.062);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.137);
    border-color: v-bind(accentColor);
  }

  @media (max-width: 585px) {
    width: 100%;
  }

  .profile-image {
    width: 50px;
    overflow: hidden;
    border-radius: 50px;
  }

  .profile-details {
    padding-left: 12px;
    position: relative;
    overflow: hidden;

    width: 100%;

    h2 {
      font-size: 18px;
      font-weight: 500;

      overflow: hidden;
      text-overflow: '-';
      white-space: nowrap;
    }

    span {
      font-size: 14px;
      color: #848c8f;
      display: block;
      overflow: hidden;
      text-overflow: '-';
      white-space: nowrap;
    }
  }
}
</style>

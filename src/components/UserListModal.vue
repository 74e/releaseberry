<template>
  <div @click.self="cancel" class="backdrop">
    <div class="popup-box">
      <CloseIcon @click="cancel" />
      <div class="modal-heading">{{ heading }} ({{ userList.length }})</div>

      <div class="line" />

      <div class="list-container">
        <template v-for="user in userList" :key="user?.id">
          <RouterLink v-if="user" class="list-item" :to="`/user/${user.handle}`">
            <div class="profile-image">
              <img :src="profileImages[user.image_index]" alt="Profile Image" />
            </div>

            <div class="profile-details">
              <h2>{{ user.username }}</h2>
              <span>@{{ user.handle }}</span>
            </div>

            <div class="level-display">
              <span class="level-label">LEVEL</span>
              <span class="level">{{ user.level }}</span>
            </div>
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserListModal',

  props: ['userList', 'heading'],

  inject: ['profileImages'],

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
  z-index: 1000;

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
    color: rgba(var(--accentColor));
  }
}

.modal-heading {
  color: rgba(var(--accentColor));
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
    rgba(var(--accentColor)) 8%,
    rgba(var(--accentColor)) 17%,
    rgba(0, 144, 153, 0) 100%
  );
}

.list-container {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 12px;
  max-height: 100%;
  overflow: scroll;
  gap: 12px;
}

.list-item {
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
    border-color: rgba(var(--accentColor));
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

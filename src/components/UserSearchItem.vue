<template>
  <RouterLink @click="hide" :to="`/user/${item.username}`">
    <div class="search-item">
      <div class="profile-image">
        <img :src="profileImage" alt="Profile Image" />
      </div>

      <div class="profile-details">
        <h2>{{ item.username }}</h2>
        <span>@{{ item.handle }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script>
export default {
  name: 'UserSearchItem',

  inject: ['hide', 'profileImages'],

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    profileImage() {
      return this.profileImages[this.item.image_index];
    }
  }
};
</script>

<style scoped>
.search-item {
  display: flex;
  align-items: center;
  padding: 12px 4px;

  .profile-image {
    width: 50px;

    img {
      border-radius: 6px;
    }
  }

  .profile-details {
    margin: 8px 0;
    padding-left: 12px;
    position: relative;
    overflow: hidden;

    width: 100%;

    @media (max-width: 1150px) {
      margin: 0;
    }

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

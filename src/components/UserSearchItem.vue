<template>
  <RouterLink @click="hide" :to="`/user/${item.username}`">
    <div class="search-item">
      <div class="profile-image">
        <img :src="profileImage" alt="Profile Image" />
      </div>

      <div class="profile-details">
        <h2>{{ item.username }}</h2>
        <span>@{{ item.username }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script>
import temporaryAvatars from '@/assets/temporaryAvatars'

export default {
  name: 'UserSearchItemComponent',

  inject: ['hide'],

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    profileImage() {
      const randomPick = Math.floor(Math.random() * 12) + 1
      return temporaryAvatars[randomPick]
    }
  }
}
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

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 2px;
      border-radius: 4px;
      width: 3px;
      height: 35px;
      background-color: v-bind(accentColor);
      transition: all 0.3s ease-out;
      opacity: 100%;
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

<template>
  <div class="user-group">
    <RouterLink :to="`/user/${userEntry.user.handle}`" class="user">
      <img :src="profileImages[userEntry.user.image_index]" alt="profile image" />
      <div class="profile-handle">
        <span class="username">{{ userEntry.user.username }}</span>
        <span class="handle">@{{ userEntry.user.handle }}</span>
      </div>
    </RouterLink>

    <div class="game-group">
      <GameFeedItem
        v-for="game in userEntry.games"
        :game="game"
        :key="game.cardData.id"
        @click="initDisplayGameDetails(game)"
      />
    </div>
  </div>
</template>

<script>
import GameFeedItem from './GameFeedItem.vue';

export default {
  name: 'UserGroupFeeditem',
  components: { GameFeedItem },
  inject: ['profileImages', 'initDisplayGameDetails'],
  props: ['userEntry']
};
</script>

<style scoped>
.user-group {
  padding: 8px;
}

.game-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  width: max-content;

  img {
    width: 40px;
    border-radius: 6px;
  }

  .profile-handle {
    padding-left: 10px;
    position: relative;
    width: max-content;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 38px;
      background-color: rgba(var(--accentColor));
      border-radius: 4px;
    }

    span {
      font-size: 18px;
      font-weight: 500;
      line-height: 19px;
      overflow-x: hidden;
      text-overflow: '-';
      white-space: nowrap;
    }

    .handle {
      line-height: 16px;
      font-size: 14px;
      color: #848c8f;
      display: block;
      text-overflow: '-';
      white-space: nowrap;
    }

    @media (max-width: 410px) {
      span {
        font-size: 14px;
      }

      span {
        font-size: 11px;
      }
    }
  }
}
</style>

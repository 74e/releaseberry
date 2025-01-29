<template>
  <div class="feed">
    <div class="date-group" v-for="dateGroup in userFeed" :key="dateGroup.date">
      <div class="date-group-divider">
        <span>{{ date(dateGroup.date) }}</span>
        <div class="line" />
      </div>

      <UserGroupFeeditem
        v-for="(userEntry, index) in dateGroup.users"
        :userEntry="userEntry"
        :key="index + dateGroup.date"
      />
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import userStore from '@/state/userStore';
import { mapActions } from 'pinia';
import UserGroupFeeditem from './UserGroupFeeditem.vue';

export default {
  name: 'UserLibrary',
  components: { UserGroupFeeditem },
  inject: ['profileImages'],
  props: ['gameItems'],

  computed: {
    userFeed() {
      return userStore().userFeed;
    },

    oneDayInMs() {
      return 86400000;
    },

    twoDayInMs() {
      return this.oneDayInMs * 2;
    }
  },

  mounted() {
    this.initUserFeed();
  },

  methods: {
    ...mapActions(gameStore, ['convertToDate']),

    async initUserFeed() {
      await userStore().getUserFeed();
    },

    date(time) {
      const postDate = new Date(time);
      const now = new Date();
      const pastedTime = now - postDate;

      if (pastedTime < this.oneDayInMs) return `today`;
      if (pastedTime < this.twoDayInMs) return `yesterday`;
      const { day, month, year } = this.convertToDate(postDate);
      if (year !== now.getFullYear()) return `${day} ${month} ${year}`;
      return `${day} ${month}`;
    }
  }
};
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
}

.date-group {
  .date-group-divider {
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    color: rgba(130, 130, 130, 0.8);

    span {
      text-wrap: nowrap;
    }

    .line {
      height: 2px;
      width: 100%;
      background: linear-gradient(
        90deg,
        rgba(130, 130, 130, 0.2) 0%,
        rgba(130, 130, 130, 0.5) 100%
      );
    }
  }
}
</style>

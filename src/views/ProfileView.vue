<template>
  <main>
    <UserProfileCard v-if="userProfile?.id && !userNotFound" :userData="userProfile" />

    <div class="feed-container" :style="accentBorders">
      <div class="feed-btn">
        <div @click="setActiveTab(1)" :class="['tab-btn', { active: activeTab === 1 }]">
          {{ tabName }}
        </div>
        <div class="devider" />
        <div @click="setActiveTab(2)" :class="['tab-btn', { active: activeTab === 2 }]">
          Achievements
        </div>
      </div>

      <Transition tag="div" name="fade" mode="out-in" v-if="gameItems" class="area">
        <component :is="displayComponent" :gameItems="gameItems" @revert="revertView" />
      </Transition>

      <div v-if="userNotFound" class="not-found">Sorry, user not found</div>
    </div>
  </main>
</template>

<script>
import userStore from '@/state/userStore';
import { mapState, mapActions } from 'pinia';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserAchivements from '@/components/UserAchivements.vue';
import UserLibrary from '@/components/UserLibrary.vue';
import UserFeed from '@/components/UserFeed.vue';

export default {
  name: 'ProfileView',

  components: {
    UserProfileCard,
    UserAchivements,
    UserLibrary,
    UserFeed
  },

  /**
   * This is for when the user is already on the profile page during a user search
   */
  watch: {
    $route: {
      handler() {
        this.initiateGetUserData();
      },
      deep: true
    }
  },

  data() {
    return {
      activeTab: 1,
      isUsersOwnPage: false,
      userNotFound: false
    };
  },

  computed: {
    ...mapState(userStore, ['loggedInUser', 'userProfile']),

    tabName() {
      return this.isUsersOwnPage ? 'My Feed' : 'Library';
    },

    displayComponent() {
      const userView = this.isUsersOwnPage ? 'UserFeed' : 'UserLibrary';
      return this.activeTab === 1 ? userView : 'UserAchivements';
    },

    gameItems() {
      return this.userProfile?.followedGames;
    },

    accentBorders() {
      if (!userStore().user?.userPreferences?.accentBorders) {
        return 'border: 1px solid rgba(255, 255, 255, 0.1);';
      }

      return `border: solid rgba(var(--accentColor)); border-width: 2px 0;`;
    }
  },

  created() {
    this.initiateGetUserData();
  },

  methods: {
    ...mapActions(userStore, ['getUserProfile']),

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    async initiateGetUserData() {
      this.isUsersOwnPage = false;
      this.userNotFound = false;

      const { handle } = this.$route.params;

      if (handle === '') {
        this.$router.push('/');
        return;
      }

      // Check if the logged in user is on their own profile page
      if (this.loggedInUser?.handle === handle) this.isUsersOwnPage = true;

      try {
        // get pinia to fetch the user profile into state
        await this.getUserProfile(handle);
      } catch (error) {
        this.userNotFound = true;
        return;
      }
    },

    revertView() {
      this.activeTab = 1;
    }
  }
};
</script>

<style scoped>
.area {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 8px;
}

.feed-container {
  overflow: hidden;
  background-color: var(--dark-50);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 11px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-m);
  /* border: solid rgba(var(--accentColor));
  border-width: 2px 0; */
  height: 100%;
  padding-bottom: 32px;

  @media (max-width: 1150px) {
    border-radius: 0 0 var(--radius-m) var(--radius-m);
  }

  .feed-btn {
    display: flex;
    height: 32px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 100%;

      width: 100%;
      height: 20px;
      background: linear-gradient(180deg, var(--dark-85) 0%, rgba(16, 19, 21, 0) 90%);
      transition: all 0.3s ease-out;
      z-index: 1;
    }

    .tab-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 18px;
      font-family: var(--font-style-mplus);
      color: #717d8d;
      cursor: pointer;
      transition: all 0.3s ease-out;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #101315 -8.7%, rgba(16, 19, 21, 0) 90%);
        transition: all 0.3s ease-out;
        opacity: 100%;
      }
    }

    .active {
      color: rgba(var(--accentColor));
      background: transparent;
      cursor: default;

      &::after {
        opacity: 0%;
      }
    }

    .devider {
      width: 4px;
      background: linear-gradient(
        180deg,
        rgba(var(--accentColor)) 0%,
        rgba(40, 53, 61, 0) 90%
      );
    }
  }
}

.not-found {
  margin-top: 100px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
}

main {
  height: 100vh;
  max-height: 100vh;
  max-width: 600px;
  margin: auto;
  padding: 24px 0 12px 0;
  position: relative;

  display: flex;
  flex-direction: column;

  @media (max-width: 1220px) {
    max-width: 540px;
  }

  @media (max-width: 500px) {
    padding: 0;
  }
}
</style>

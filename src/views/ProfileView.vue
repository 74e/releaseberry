<template>
  <main>
    <template v-if="!isNonLoggedInUserPage">
      <UserProfileCard v-if="userProfile" :userData="userProfile" />

      <div class="feed-container">
        <div class="feed-btn">
          <div @click="setActiveTab(1)" :class="['tab-btn', { active: activeTab === 1 }]">
            {{ tabName }}
          </div>
          <div class="devider" />
          <div
            @click="setActiveTab(2)"
            :class="['tab-btn', { active: activeTab === 2 }]"
            class="tab-btn"
          >
            Achivements
          </div>
        </div>

        <div v-if="userLibrary" class="display-area">
          <div class="game" v-for="item in userLibrary" :key="item.id">
            <img :src="item.game.cover_url" alt="game cover" />
            <div class="game-info">
              <span class="type">Game</span>
              <span class="title">{{ item.game.name }}</span>

              <span class="release-label">Release date</span>
              <span class="release-date">{{
                convertToDate(item.game.release_date)
              }}</span>

              <div class="options-container">
                <button>Details</button>
                <button><PlusIcon /> Add</button>
              </div>
            </div>
          </div>

          <!-- Implement this later when the backend has user feed logic
          <component :is="displayComponent" />
          -->
        </div>
      </div>
    </template>

    <userNoticeProfile v-else />
  </main>
</template>

<script>
import colorStore from '@/state/accentColor'
import userStore from '@/state/userStore'
import { mapState, mapActions } from 'pinia'
import UserProfileCard from '@/components/UserProfileCard.vue'
import userNoticeProfile from '@/components/UserNoticeProfile.vue'

export default {
  name: 'ProfileView',

  components: {
    UserProfileCard,
    userNoticeProfile
  },

  /**
   * This is for when the user is already on the profile page during a user search
   */
  watch: {
    $route: {
      handler() {
        this.initiateGetUserData()
      },
      deep: true
    }
  },

  data() {
    return {
      activeTab: 1,
      isNonLoggedInUserPage: false,
      isUsersOwnPage: false
    }
  },

  mounted() {},

  computed: {
    ...mapState(colorStore, ['accentColor']),
    ...mapState(userStore, ['loggedInUser', 'userProfile']),

    tabName() {
      return this.isUsersOwnPage ? 'My Feed' : 'Library'
    },

    displayComponent() {
      return this.activeTab === 1 ? 'userLibrary' : 'userAchivements'

      // if (this.isUsersOwnPage) { // Implement this later
      //   return this.activeTab === 1 ? 'userFeed' : 'userAchivements'
      // } else {
      //   return this.activeTab === 1 ? 'userLibrary' : 'userAchivements'
      // }
    },

    userLibrary() {
      return this.userProfile?.followedGames
    }
  },

  created() {
    this.initiateGetUserData()
  },

  methods: {
    ...mapActions(userStore, ['getUserProfile']),

    setActiveTab(tab) {
      this.activeTab = tab
    },

    async initiateGetUserData() {
      this.isNonLoggedInUserPage = false
      this.isUsersOwnPage = false

      const { username } = this.$route.params

      // Check if a non-logged in user is on the profile page
      if (!this.loggedInUser?.username && !username) {
        this.isNonLoggedInUserPage = true
        return
      }

      // Check if the logged in user is on their own profile page
      if (this.loggedInUser?.username === username) this.isUsersOwnPage = true

      // get pinia to fetch the user profile into state
      await this.getUserProfile(username)
    },

    convertToDate(time) {
      let date = new Date(Number(time))
      let day = date.getDate()
      const month = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()
      day = day += this.getNumberSuffix(day)

      return `${day} ${month} ${year}`
    },

    getNumberSuffix(day) {
      //Ordinal suffixes algo from https://www.freecodecamp.org/news/format-dates-with-ordinal-number-suffixes-javascript/
      if (day >= 11 && day <= 13) {
        return 'th'
      }

      switch (day % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    }
  }
}
</script>

<style scoped>
.display-area {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 16px 8px;

  display: flex;
  flex-direction: column;
  gap: 26px;

  .game {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px 0 32px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 94%;
      right: 50%;
      transform: translate(50%, 13px);
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(0, 240, 255, 0) 0%,
        v-bind(accentColor) 52%,
        rgba(0, 144, 153, 0) 100%
      );
      bottom: 0;
    }

    img {
      width: 90px;
      border-radius: var(--radius-m);
      border: 1px solid v-bind(accentColor + '80');
    }

    .game-info {
      display: flex;
      flex-direction: column;
      padding: 4px 0;
      margin-left: 12px;
      width: 100%;

      .type {
        font-size: 12px;
        color: v-bind(accentColor);
        margin-bottom: 4px;

        &::before {
          content: '';
          height: 15px;
          width: 3px;
          border-radius: 2px;
          display: inline-block;
          margin-right: 4px;
          background-color: v-bind(accentColor);
          transform: translateY(3px);
        }
      }

      .title {
        font-size: 20px;
        color: var(--default-font-color);
      }

      .release-label {
        font-size: 18px;
        color: v-bind(accentColor);
        margin-top: 4px;
      }

      .release-date {
        font-size: 16px;
        color: var(--default-font-color);
      }

      .options-container {
        display: flex;
        gap: 8px;

        button {
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 6px 16px;
          margin-top: 8px;
          border-radius: var(--radius-m);
          background-color: transparent;
          border: 2px solid v-bind(accentColor);
          color: v-bind(accentColor);
          font-size: 15px;
          outline: none;
          cursor: pointer;
          transition: all 0.3s ease-out;

          .plus-icon {
            margin-right: 6px;
          }

          &:hover {
            background-color: var(--dark-fg-hover);
          }
        }
      }
    }
  }
}

.feed-container {
  overflow: hidden;

  background-color: var(--dark-50);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 11px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-m);
  border: solid v-bind(accentColor);
  border-width: 2px 0;
  height: 100%;

  @media (max-width: 1150px) {
    border-radius: 0 0 var(--radius-m) var(--radius-m);
  }

  .feed-btn {
    display: flex;
    height: 42px;
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
      font-size: 22px;
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

    @media (max-width: 1050px) {
      height: 32px;

      .tab-btn {
        font-size: 18px;
      }
    }

    .active {
      color: v-bind(accentColor);
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
        v-bind(accentColor) 0%,
        rgba(40, 53, 61, 0) 90%
      );
    }
  }
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

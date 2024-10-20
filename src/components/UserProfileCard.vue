<template>
  <div v-if="loggedInUser" class="profile-card-container">
    <div class="profile-avatar">
      <img :src="avatar" alt="profile avatar" />
    </div>

    <div class="profile-details">
      <div class="profile-handle">
        <h2 class="handle">{{ username }}</h2>
        <span class="id-handle">@{{ username }}</span>
      </div>

      <div class="profile-level">
        <div class="level-display">
          <span class="level-label">LEVEL</span>
          <span class="level">{{ level }}</span>
        </div>

        <div class="xp-display">
          <div class="xp-bar"><div class="current-xp-bar" /></div>
          <span class="xp-label">
            <span class="xp-number">
              Exp: <span class="highlighted">{{ experience }} / 1000</span>
            </span>
          </span>
        </div>
      </div>

      <div class="follow-container">
        <button
          v-if="isFollowable"
          @click="isUserFollowed ? unfollow() : follow()"
          class="follow-btn"
        >
          {{ followLable }}
        </button>

        <div class="profile-follow-info">
          <div class="follow-border">
            <span class="label">Following</span>
            <span class="number">{{ following }}</span>
          </div>

          <div class="follow-border">
            <span class="label">Followers</span>
            <span class="number">{{ followers }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userStore from '@/state/userStore';
import { mapState } from 'pinia';

export default {
  name: 'ProfileView',

  inject: ['accentColor', 'profileImages'],

  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      activeTab: 'feed'
    };
  },

  mounted() {},

  computed: {
    ...mapState(userStore, [
      'loggedInUser',
      'followUser',
      'unfollowUser',
      'getUserProfile'
    ]),

    isFollowable() {
      return this.loggedInUser && this.loggedInUser.username !== this.userData.username;
    },

    username() {
      return this.userData?.username;
    },

    level() {
      return this.userData?.level;
    },

    experience() {
      return this.userData?.xp;
    },

    following() {
      return this.userData?.followedUsers.length;
    },

    followers() {
      return this.userData?.followers.length;
    },

    imageIndex() {
      return this.userData?.image_index;
    },

    avatar() {
      return this.profileImages[this.imageIndex];
    },

    isUserFollowed() {
      return this.userData?.followers.find(
        (follow) => follow.user_id === this.loggedInUser.id
      );
    },

    followLable() {
      return this.isUserFollowed ? 'Following' : 'Follow';
    }
  },

  methods: {
    async follow() {
      await this.followUser(this.userData.id);

      // I am refetching the user profile to update
      // This is not a good method, but it works for now
      // I will implement the updating of the state manually later
      await this.getUserProfile(this.userData.username);
    },

    async unfollow() {
      await this.unfollowUser(this.userData.id);
      await this.getUserProfile(this.userData.username);
    }
  }
};
</script>

<style scoped>
.profile-card-container {
  position: absolute;
  width: 230px;
  background-color: var(--dark-50);

  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 8px 11px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-m);
  border: 1px solid v-bind(accentColor + '50');
  padding: 16px;

  right: calc(100% + 16px);
  top: 48px;

  @media (max-width: 1150px) {
    position: static;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--radius-m) var(--radius-m) 0 0;
  }

  .profile-details {
    width: 100%;
    @media (max-width: 1150px) {
      margin-left: 12px;
    }
  }

  .profile-avatar {
    width: 100%;

    @media (max-width: 1150px) {
      height: fit-content;
      width: 192px;
    }

    @media (max-width: 500px) {
      width: 120px;
    }

    img {
      width: 100%;
      overflow: hidden;
      border-radius: var(--radius-m);
      background-color: #2e2e2e;
    }
  }

  .profile-handle {
    margin: 8px 0;
    padding-left: 12px;
    position: relative;
    overflow: hidden;
    line-height: 19px;

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

    @media (max-width: 410px) {
      h2 {
        font-size: 14px;
      }

      span {
        font-size: 11px;
      }
    }
  }

  .profile-level {
    display: flex;
    align-items: center;
    height: 50px;
    margin-bottom: 8px;

    @media (max-width: 1150px) {
      margin: 0;
    }

    .level-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 8px;
      gap: 4px;

      .level-label {
        font-size: 13px;
        color: #848c8f;
        margin-bottom: -8px;
      }

      .level {
        font-size: 32px;
        font-weight: 500;
        color: v-bind(accentColor);
      }

      @media (max-width: 1150px) {
        .level-label {
          font-size: 9px;
        }

        .level {
          font-size: 24px;
        }
      }
    }

    .xp-display {
      padding: 0 8px;
      width: 100%;

      .xp-bar {
        height: 5px;
        width: 100%;
        background-color: #2e2e2e;
        border-radius: 4px;
        .current-xp-bar {
          height: 100%;
          width: 34%;
          background-color: v-bind(accentColor);
          border-radius: 4px;
        }
      }

      .xp-label {
        word-spacing: 1px;
        font-size: 12px;
        color: #678793;

        .highlighted {
          word-spacing: -2px;
          color: #99afb8;
        }
      }
    }
  }

  .follow-container {
    @media (max-width: 1150px) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (max-width: 430px) {
      flex-direction: column;
      gap: 4px;
    }
  }

  .follow-btn {
    width: 100%;
    background-color: transparent;
    border: 1px solid #4b4b4b;
    color: inherit;
    margin-bottom: 16px;
    border-radius: 50px;
    padding: 6px 0;
    cursor: pointer;
    transition: all 0.3s ease-out;

    @media (max-width: 1150px) {
      margin-bottom: 0px;
      padding: 4px 0;
      font-size: 15px;
    }

    &:hover {
      border: 1px solid v-bind(accentColor);
      color: v-bind(accentColor);
      filter: brightness(1.4);
    }
  }

  .profile-follow-info {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    .follow-border {
      color: rgb(156, 156, 156);
      border: 1px solid #2e2e2e;
      border-radius: var(--radius-m);
      height: 55px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      span {
        text-align: center;
        display: block;
        font-size: 15px;
      }

      .number {
        font-weight: 600;
      }
    }

    @media (max-width: 1150px) {
      justify-content: flex-start;
      gap: 0;
      width: 100%;

      .follow-border {
        padding: 8px;
        width: fit-content;
        height: auto;
        flex-direction: row;
        width: 100%;

        &:first-child {
          border-right: none;
          border-radius: 50px 0 0 50px;
        }

        &:last-child {
          border-radius: 0 50px 50px 0;
        }

        span {
          font-size: 12px;
        }

        .number {
          margin-left: 8px;
        }
      }
    }

    @media (max-width: 430px) {
      width: 100%;

      .follow-border {
        width: 100%;

        &:first-child {
          border-radius: 50px 0 0 50px;
        }

        &:last-child {
          border-radius: 0 50px 50px 0;
        }
      }
    }
  }
}
</style>

<template>
  <div class="profile-card-container">
    <div class="profile-avatar">
      <img :src="avatar" alt="profile avatar" />
    </div>

    <div class="profile-details">
      <div class="profile-handle">
        <h2 class="handle">{{ username }}</h2>
        <span class="id-handle">@{{ handle }}</span>
      </div>

      <ExperienceBar :staticLevel="level" :experience="experience" />

      <div class="follow-container">
        <button
          v-if="isFollowable"
          @click="isUserFollowed ? unfollow() : follow()"
          class="follow-btn"
        >
          {{ followLable }}
        </button>

        <div class="profile-follow-info">
          <div class="follow-border" @click="initShowFollowsModal('following')">
            <span class="label">Following</span>
            <span class="number">{{ following }}</span>
          </div>

          <div class="follow-border" @click="initShowFollowsModal('followers')">
            <span class="label">Followers</span>
            <span class="number">{{ followers }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <UserListModal
      v-if="showFollowsModal"
      heading="Users following this game"
      @closePopup="closeFollowsModal"
      :userList="userList"
    />
  </Transition>
</template>

<script>
import userStore from '@/state/userStore';
import { mapState } from 'pinia';
import ExperienceBar from './ExperienceBar.vue';
import { toastStore } from '@/state/toastStore';
import UserListModal from './UserListModal.vue';

export default {
  name: 'UserProfileCard',

  components: { ExperienceBar, UserListModal },

  inject: ['profileImages'],

  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      showFollowsModal: false,
      displayFollowingOrFollows: null
    };
  },

  computed: {
    ...mapState(userStore, ['loggedInUser', 'followUser', 'unfollowUser']),

    userList() {
      if (this.displayFollowingOrFollows == 'following') {
        return this.userData.followedUsers.map((u) => u.following);
      }

      if (this.displayFollowingOrFollows == 'followers') {
        return this.userData.followers.map((u) => u.follower);
      }

      return [];
    },

    isFollowable() {
      return this.loggedInUser && this.loggedInUser.username !== this.userData.username;
    },

    username() {
      return this.userData?.username;
    },

    handle() {
      return this.userData?.handle;
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
    initShowFollowsModal(displayType) {
      this.displayFollowingOrFollows = displayType;
      this.showFollowsModal = true;
    },

    closeFollowsModal() {
      this.showFollowsModal = false;
      this.displayFollowingOrFollows = null;
    },

    async follow() {
      try {
        await this.followUser(this.userData.id);

        toastStore().add({
          icon: 'ProfileIcon',
          message: `Followed ${this.username}`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, couldn't follow user`
        );
      }
    },

    async unfollow() {
      try {
        await this.unfollowUser(this.userData.id);

        toastStore().add({
          icon: 'ProfileIcon',
          message: `Unfollowed ${this.username}`
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, couldn't unfollow user`
        );
      }
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
  border: 1px solid rgba(var(--accentColor), 0.3);
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
      background-color: rgba(var(--accentColor));
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
      border: 1px solid rgba(var(--accentColor));
      color: rgba(var(--accentColor));
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

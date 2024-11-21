import { defineStore } from 'pinia';
import cardStore from './cardStore';
import gameStore from './gameStore';
import achievementStore from './achievementStore';
import userService from '@/api/userService';
import colorStore from './colorStore';

const userStore = defineStore('User', {
  state: () => ({
    user: null,
    userProfile: null,
    userCredentials: null
  }),

  getters: {
    loggedInUser: (state) => state.user,
    username: (state) => state.user?.username,
    userHandle: (state) => state.user?.handle,
    currentUserProfile: (state) => state.userProfile
  },

  actions: {
    async initUserData(user, token) {
      localStorage.setItem('RBsession', JSON.stringify({ token }));
      this.user = user;
      colorStore().setUserColorPref();
      await cardStore().getUserCardConfigurations();
      await gameStore().getLibrary();
      await gameStore().getUsersGameLists();
      await achievementStore().getUserAchievements();
    },

    async handleTakenValidation(handle) {
      try {
        await userService.handleTakenValidation(handle);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async emailTakenValidation(email) {
      try {
        return await userService.emailTakenValidation(email);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async createAccount(userData) {
      try {
        const { data } = await userService.createAccount(userData);
        const { newUser, token } = data;

        await this.initUserData(newUser, token);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateUserInformation(newData, isDeleting) {
      try {
        const { data } = await userService.updateUserInformation(newData, isDeleting);
        const { token } = data;

        if (token) localStorage.setItem('RBsession', JSON.stringify({ token }));
        this.userCredentials = { ...this.userCredentials, ...newData };
        this.user = { ...this.user, ...newData };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateUserPreferences(data) {
      const newData = { ...this.user.userPreferences, ...data };
      try {
        await userService.updateUserPreferences(newData);

        this.user.userPreferences = newData;
        colorStore().setUserColorPref();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteAccount() {
      try {
        await userService.deleteAccount(this.user.handle);
        this.logout();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async login({ userHandleOrEmail, password }) {
      try {
        const { data } = await userService.login(userHandleOrEmail, password);
        const { user, token } = data;

        await this.initUserData(user, token);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      achievementStore().userAchievements = [];
      gameStore().ownGames = [];
      cardStore().cardConfigs = null;
      this.user = null;
      localStorage.removeItem('RBsession');
    },

    async persistentLogin() {
      try {
        const { data } = await userService.persistentLogin();
        const { user, token } = data;

        await this.initUserData(user, token);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async userSearch(username) {
      try {
        const { data } = await userService.userSearch(username);
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    async getUserCredentials() {
      try {
        const { data } = await userService.getUserCredentials();
        this.userCredentials = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async clearUserCredentials() {
      this.userCredentials = null;
    },

    async getUserProfile(handle) {
      try {
        const { data } = await userService.getUserProfile(handle);
        this.userProfile = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async followUser(userId) {
      try {
        const { data: newFollow } = await userService.followUser(userId);

        this.user.followedUsers.push(newFollow);
        this.userProfile.followers.push(newFollow);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async unfollowUser(userId) {
      try {
        await userService.unfollowUser(userId);

        this.userProfile.followers = this.userProfile.followers.filter(
          (f) => f.user_id !== this.user.id
        );
        this.user.followedUsers = this.user.followedUsers.filter(
          (f) => f.user_id !== userId
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
});

export default userStore;

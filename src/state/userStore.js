import { defineStore } from 'pinia';
import cardStore from './cardStore';
import gameStore from './gameStore';
import userService from '@/api/userService';

const userStore = defineStore('User', {
  state: () => ({
    user: null,
    userProfile: null
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
      await cardStore().getUserCardConfigurations();
      await gameStore().getLibrary();
      await gameStore().getUsersGameLists();
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

    async createAccount({ handle, username, email, password }) {
      try {
        const { data } = await userService.createAccount(
          handle,
          username,
          email,
          password
        );
        const { newUser, token } = data;

        this.user = newUser;
        localStorage.setItem('RBsession', JSON.stringify({ token }));
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
      cardStore().cardConfigs = null;
      gameStore().ownGames = null;
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

    async getUserProfile(username) {
      try {
        const { data } = await userService.getUserProfile(username);
        this.userProfile = data;
      } catch (error) {
        console.error(error);
        // throw error Adding error display later
      }
    },

    async followUser(userId) {
      try {
        await userService.followUser(userId);
      } catch (error) {
        console.error(error);
      }
    },

    async unfollowUser(userId) {
      try {
        await userService.unfollowUser(userId);
      } catch (error) {
        console.error(error);
      }
    }
  }
});

export default userStore;

import { defineStore } from 'pinia';
import userStore from './userStore';

const initialColor = '#26b3bd';

const colorStore = defineStore('accentColor', {
  state: () => ({
    color: initialColor,
    hoverTransitonColor: null
  }),

  getters: {
    accentColor: (state) => state.hoverTransitonColor || state.color
  },

  actions: {
    setUserColorPref() {
      const colorPref = userStore().user.userPreferences.accentColor;
      this.color = colorPref;
    }
  }
});

export default colorStore;

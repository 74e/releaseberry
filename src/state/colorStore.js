import { defineStore } from 'pinia';
import userStore from './userStore';

const initialColor = '#26b3bd';

const colorStore = defineStore('accentColor', {
  state: () => ({
    color: initialColor,
    visitedProfileColor: null,
    defaultColor: initialColor
  }),

  getters: {
    accentColor: (state) => state.visitedProfileColor || state.color
  },

  actions: {
    setUserColorPref() {
      const colorPref = userStore().user.userPreferences.accentColor;
      this.color = colorPref;
    },

    setVisitedProfileColor(color = null) {
      this.visitedProfileColor = color;
    }
  }
});

export default colorStore;

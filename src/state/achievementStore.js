import { defineStore } from 'pinia';
import userStore from './userStore';
import gameStore from './gameStore';
import cardStore from './cardStore';
import { toastStore } from './toastStore';
import achievementService from '@/api/achievementService.js';
import { watch, ref } from 'vue';

const achievementStore = defineStore('achievement', () => {
  // States
  const userAchievements = ref([]);
  const currentUserAchievements = ref([]);
  const isInitialized = ref(false);

  // I am checking all but its really just for followers
  watch(() => isInitialized.value, checkAllAchievementProgress);

  // Watchers
  watch(
    () => userStore().user?.followedUsers,
    () => checkAchievements('follow'),
    { deep: true }
  );
  watch(
    () => gameStore().ownGames.length,
    () => checkAchievements('game')
  );
  watch(
    () => cardStore().cardConfigs,
    () => checkAchievements('card'),
    { deep: true }
  );

  // Actions
  function getProgressData(type) {
    const user = userStore().user;
    const library = gameStore().ownGames;
    const cardConfigs = cardStore().cardConfigs;

    switch (type) {
      case 'game':
        return {
          GAME_ADD: library.length,
          GAME_COLLECT: library.filter(({ cardData }) => cardData.release_collected)
            .length
        };
      case 'card':
        return {
          DESIGN_ADD: cardConfigs?.reduce((acc, item) => acc + item.card_config.length, 0)
        };
      case 'follow':
        return {
          // User is following/User is being followed
          USER_FOLLOWING: user.followedUsers.length,
          USER_FOLLOWED: user.followers.length
        };
    }
  }

  function checkAchievements(type) {
    if (!userStore().user) return;
    const progressMap = getProgressData(type);

    userAchievements.value
      .filter((achievement) => Object.keys(progressMap).includes(achievement.type))
      .forEach(async (achievement) => {
        await validateIfUnlockable(achievement, progressMap[achievement.type]);
      });
  }

  async function validateIfUnlockable(achievement, currentValue) {
    if (currentValue >= achievement.completion_condition && !achievement.is_seen) {
      await setUserAchievementToSeen(achievement);
    }
  }

  async function getUserAchievements(userId = null) {
    try {
      const id = userId || userStore().user.id;
      const { data } = await achievementService.getUserAchievements(id);

      if (userId) {
        currentUserAchievements.value = data;
      } else {
        userAchievements.value = data;
        isInitialized.value = true;
      }
    } catch (error) {
      toastStore().handleErrorMessage(error, 'Failed to load achievements.');
    }
  }

  function checkAllAchievementProgress() {
    if (!userStore().user) return;
    userAchievements.value.forEach(async (achievement) => {
      if (achievement.unlocked_date && !achievement.is_seen) {
        await setUserAchievementToSeen(achievement);
      }
    });
  }

  async function setUserAchievementToSeen(achievement) {
    try {
      await achievementService.setUserAchievementToSeen(achievement.id);
      achievement.is_seen = true;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toastStore().add({
        icon: 'ReleaseBerryIcon',
        reward: achievement.experience_reward,
        message: `<b>Unlocked Achievement</b></br>${achievement.name}`,
        duration: 5500
      });
    } catch (error) {
      toastStore().handleErrorMessage(
        error,
        `Something went wrong with your achievements.`
      );
    }
  }

  function clearUserAchievements() {
    userAchievements.value = [];
  }

  function clearCurrentUserAchievements() {
    currentUserAchievements.value = [];
  }

  return {
    userAchievements,
    currentUserAchievements,
    clearCurrentUserAchievements,
    getUserAchievements,
    clearUserAchievements
  };
});

export default achievementStore;

import cardStore from './cardStore';
import { defineStore } from 'pinia';
import gameService from '@/api/gameService';
import userStore from './userStore';

const gameStore = defineStore('Game', {
  state: () => ({
    gameLists: [],
    ownGames: [],
    globalGames: [],
    collectableGames: [],
    searchedGames: [],
    gameCoverImages: [],
    totalCovers: 0,
    activeGameListId: null,
    editingGameListId: null,
    filterLibraryOptions: { releaseStatus: 'all', option: null, order: 'asc' }
  }),

  getters: {
    library: (state) => {
      if (state.activeGameListId) {
        const activeGameLists =
          state.userGameLists.find(({ id }) => id === state.activeGameListId)
            ?.game_list_items || [];

        return state.ownGames.filter(({ cardData: { game_followed_id } }) => {
          if (activeGameLists.some((i) => i.followGameId === game_followed_id)) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return state.ownGames;
      }
    },
    globalLibrary: (state) => state.globalGames,
    userGameLists: (state) => state.gameLists,
    searchResults: (state) => state.searchedGames,
    gameCovers: (state) => state.gameCoverImages,
    total: (state) => state.totalCovers,
    selectedGameListId: (state) => state.activeGameListId
  },

  actions: {
    async getLibrary() {
      try {
        const userId = userStore().loggedInUser.id;
        const { data } = await gameService.getFollowedGamesFromUser(userId);
        this.ownGames = data;
      } catch (error) {
        console.error(error);
      }
    },

    async getGlobalLibrary() {
      try {
        const { data } = await gameService.getGlobalLibrary();
        this.globalGames = data;
      } catch (error) {
        console.error(error);
      }
    },

    async getAvailableGames(searchTerm) {
      try {
        const { data } = await gameService.getAvailableGames(searchTerm);

        this.searchedGames = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    setAsCollectableGame({ cardData }) {
      if (cardData.release_collected === false) {
        this.collectableGames.push(cardData.custom_game_config_id);
      }
    },

    async collectExperience(custom_game_config_id, experience) {
      // Do something when collecting XP
      const user = userStore().user;

      console.log(user, custom_game_config_id, experience);

      // const { data } = await gameService.collectExperience(custom_game_config_id);
    },

    clearSearchResults() {
      this.searchedGames = null;
    },

    async getGameCovers({ appid, page = 0 }) {
      try {
        const { data } = await gameService.getGameCovers(appid, page);

        this.gameCoverImages = [...this.gameCoverImages, ...data.covers];
        this.totalCovers = data.total;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    clearGameCovers() {
      this.gameCoverImages = [];
      this.totalCovers = 0;
    },

    async addSteamGame({ gameData, cardData }) {
      try {
        const index = this.createNewIndex(this.ownGames[0].cardData);
        const { data } = await gameService.addSteamGame({
          gameData,
          cardData,
          index
        });

        if (!cardData.id) {
          cardStore().getUserCardConfigurations();
        }

        this.ownGames.unshift(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getUsersGameLists() {
      try {
        const { data } = await gameService.getUsersGameLists();
        this.gameLists = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async createNewGameList(gameListName) {
      this.gameLists.push({ id: 'temp', list_name: gameListName, game_list_items: [] });
      try {
        const { data } = await gameService.createNewGameList(gameListName);
        const index = this.gameLists.findIndex((list) => list.id === 'temp');
        this.gameLists[index] = { ...this.gameLists[index], ...data };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async renameGameList(newName) {
      const index = this.gameLists.map((l) => l.id).indexOf(this.editingGameListId);
      this.gameLists[index].list_name = newName;

      try {
        await gameService.renameGameList({ newName, gameListId: this.editingGameListId });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async addGameToGameList(followGameId, gameListId = null) {
      if (!gameListId) gameListId = this.editingGameListId;
      const index = this.createNewIndex(this.selectedGameListItems(gameListId)[0]);
      this.selectedGameListItems(gameListId).unshift({ followGameId, index });
      try {
        await gameService.addGameToGameList({ followGameId, gameListId, index });
      } catch (error) {
        this.selectedGameListItems(gameListId).shift();
        console.error(error);
        throw error;
      }
    },

    async deleteGameFromGameList(followGameId, gameListId = null) {
      if (!gameListId) gameListId = this.editingGameListId;
      const gameListItems = this.selectedGameListItems(gameListId);
      const indexOf = gameListItems.map((g) => g.followGameId).indexOf(followGameId);
      const deletedGame = gameListItems.splice(indexOf, 1);
      try {
        await gameService.deleteGameFromGameList({ followGameId, gameListId });
      } catch (error) {
        // breaks order of items whem spammed
        gameListItems.splice(indexOf, 0, deletedGame[0]);
        console.error(error);
        throw error;
      }
    },

    async deleteGameList() {
      try {
        await gameService.deleteGameList(this.editingGameListId);
        const index = this.gameLists.map((l) => l.id).indexOf(this.editingGameListId);
        this.gameLists.splice(index, 1);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async addGameAndCopyPreset({ gameId, customGameConfigId }) {
      try {
        const index = this.createNewIndex(this.ownGames[0].cardData);
        const { data } = await gameService.addGameAndCopyPreset({
          gameId,
          customGameConfigId,
          index
        });
        await cardStore().getUserCardConfigurations();

        this.ownGames.unshift(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async unfollowGame(gameId) {
      try {
        await gameService.unfollowGame(gameId);

        this.ownGames = this.ownGames.filter((game) => game.gameData.id !== gameId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateGameInfo(gameId) {
      try {
        const { data } = await gameService.updateGameInfo(gameId);
        const { gameData, updateStatus } = data;

        [this.ownGames, this.globalGames].forEach((state) => {
          this.addNewGameData(state, gameData, gameId);
        });

        return updateStatus;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    addNewGameData(state, gameData, id) {
      const index = state.map((g) => g.gameData.id).indexOf(id);

      if (index == -1) return;

      state[index].gameData = { ...state[index].gameData, ...gameData };
    },

    async updateCustomGameConfigCover({ customGameConfigId, coverData }) {
      try {
        await gameService.updateCustomGameConfigCover({ customGameConfigId, coverData });

        [this.ownGames, this.globalGames].forEach((state) => {
          state.forEach((game) => {
            if (game.cardData.custom_game_config_id === customGameConfigId) {
              game.gameData.cover_url = coverData.cover_url;
              game.gameData.cover_thumb = coverData.cover_thumb;
            }
          });
        });

        return;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    createNewIndex(state) {
      return state ? Math.round(state.index * 1.2) : 1000;
    },

    selectedGameListItems(gameListId) {
      return this.gameLists.find((l) => {
        return l.id === gameListId;
      })?.game_list_items;
    },

    moveCardIndex(draggedCardIndex, targetCardIndex) {
      const movedCard = this.ownGames[draggedCardIndex];
      this.ownGames.splice(draggedCardIndex, 1);
      this.ownGames.splice(targetCardIndex, 0, movedCard);
    },

    async finalizeMoveCardIndex(targetCardIndex) {
      const rightCardIndex = this.ownGames[targetCardIndex - 1]?.cardData.index;
      const leftCardindex = this.ownGames[targetCardIndex + 1]?.cardData.index;
      let newIndex;

      if (rightCardIndex === undefined && leftCardindex === undefined) {
        newIndex = 1000;
      } else if (rightCardIndex === undefined) {
        newIndex = leftCardindex + 1000;
      } else if (leftCardindex === undefined) {
        newIndex = rightCardIndex * 0.8;
      } else {
        newIndex = (rightCardIndex + leftCardindex) / 2;
      }

      const updateCardTarget = this.ownGames[targetCardIndex].cardData;
      updateCardTarget.index = newIndex;

      try {
        await gameService.updateCustomGameIndex(
          updateCardTarget.custom_game_config_id,
          newIndex
        );
      } catch (error) {
        await this.getLibrary();
        console.error(error);
        throw error;
      }
    },

    shuffle() {
      for (let i = this.ownGames.length - 1; i > 0; i--) {
        const randomNum = Math.floor(Math.random() * (i + 1));
        const temprorary = this.ownGames[i].cardData.index;
        this.ownGames[i].cardData.index = this.ownGames[randomNum].cardData.index;
        this.ownGames[randomNum].cardData.index = temprorary;
      }
    },

    calculateAccumulatedExp(releaseDate, followedDate) {
      console.log(releaseDate, followedDate, 'releaseDate, followedDate');

      return 234;
    },

    convertToDate(time) {
      let date = new Date(Number(time));
      let day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      day = day += this.getNumberSuffix(day);

      return { day, month, year };
    },

    getNumberSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }

      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  }
});

export default gameStore;

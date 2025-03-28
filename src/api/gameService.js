import { api } from './api';

export default {
  serverPing() {
    return api.get('game/ping');
  },

  syncSteamGameIndex() {
    return api.post('game/sync-index');
  },

  getIndexLogs() {
    return api.get('game/get-index');
  },

  getGlobalLibrary(filter) {
    return api.get('game/library/global', {
      params: filter
    });
  },

  getFollowedGamesFromUser(userId) {
    return api.get(`game/library/${userId}`);
  },

  indexSearchAutoCompletion(query) {
    return api.get(`game/search-suggestion-index/`, {
      params: { query }
    });
  },

  getAvailableGames(query) {
    return api.get(`game/search/${query}`);
  },

  getGameCovers(appid, page = 0) {
    return api.get(`game/steamdb-images/${appid}`, {
      params: {
        page
      }
    });
  },

  collectExperience(customGameConfigId) {
    return api.post(`game/collect-experience`, { customGameConfigId });
  },

  addSteamGame({ gameData, cardData, index }) {
    return api.post(`game/add`, {
      gameData,
      cardData,
      index
    });
  },

  adminDeleteSteamGame(appId) {
    return api.delete(`game/index/${appId}`);
  },

  addGameAndCopyPreset({ gameId, customGameConfigId, index }) {
    return api.post(`game/copy`, {
      gameId,
      customGameConfigId,
      index
    });
  },

  updateCustomGameIndex(id, index) {
    return api.put(`game/${id}/index`, { index });
  },

  getUsersGameLists() {
    return api.get(`game/list`);
  },

  createNewGameList(gameListName) {
    return api.post(`game/create-list`, { gameListName });
  },

  addGameToGameList({ gameListId, followGameId, index }) {
    return api.post(`game/list/${gameListId}/add-game?test=lol`, {
      followGameId,
      index
    });
  },

  deleteGameFromGameList({ gameListId, followGameId }) {
    return api.delete(`game/list/${gameListId}/remove-game`, {
      params: { followGameId }
    });
  },

  renameGameList({ gameListId, newName }) {
    return api.put(`game/list/${gameListId}/rename`, { newName });
  },

  deleteGameList(gameListId) {
    return api.delete(`game/list/${gameListId}/delete`);
  },

  unfollowGame(gameId) {
    return api.post(`game/${gameId}/unfollow`);
  },

  updateGameInfo(gameId) {
    return api.put(`game/${gameId}/update`);
  },

  updateCustomGameConfigCover({ customGameConfigId, coverData }) {
    return api.put(`game/${customGameConfigId}/update-cover`, {
      coverData
    });
  },

  getGameCalendar() {
    return api.get(`calendar/`);
  }
};

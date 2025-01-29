import { api } from './api';

export default {
  getCardConfigsByGame(filter) {
    return api.get(`card/configs-by-game`, {
      params: filter
    });
  },

  addCardConfig(cardConfigId) {
    return api.post(`card/${cardConfigId}/add`);
  },

  getUserCardConfigurations(userId) {
    return api.get(`card/${userId}/configs`);
  },

  changeCardConfig({ customGameConfigId, cardConfigId }) {
    return api.put(`card/${customGameConfigId}/change`, { cardConfigId });
  },

  editCardConfig({ cardConfigId, config }) {
    return api.put(`card/${cardConfigId}/edit`, { config });
  },

  updateCustomGameConfigWithNewCardConfig({ customGameConfigId, cardData }) {
    return api.put(`card/${customGameConfigId}/update-with-new-config`, { cardData });
  },

  changeCountdownFormat({ customGameConfigId, countdown_format }) {
    return api.put(`card/${customGameConfigId}/update-countdown`, { countdown_format });
  },

  getGameEntryCardDetails(customGameConfigId) {
    return api.get(`card/${customGameConfigId}/details`);
  },

  deleteConfig(customGameConfigId) {
    return api.delete(`card/${customGameConfigId}/delete`);
  }
};

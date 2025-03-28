import { defineStore } from 'pinia';
import userStore from './userStore';
import gameStore from './gameStore';
import cardService from '@/api/cardService';
import _ from 'lodash';

const cardStore = defineStore('Card', {
  state: () => ({
    cardConfigs: null,
    cardFilterOptions: {
      selectedGameId: null,
      selectedCard: null,
      order: 'desc'
    }
  }),

  getters: {
    userCardConfigs: (state) => state.cardConfigs
  },

  actions: {
    async getCardConfigsByGame() {
      try {
        const { data } = await cardService.getCardConfigsByGame(this.cardFilterOptions);

        gameStore().globalGames = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    setSelectedGameId(game) {
      this.cardFilterOptions.selectedGameId = game;
    },

    clearSelectedGameId() {
      this.cardFilterOptions.selectedGameId = null;
    },

    getConfigCopy() {
      return _.cloneDeep(this.cardConfigs);
    },

    updateGameStore(callback) {
      ['ownGames', 'globalGames'].forEach((state) => {
        gameStore()[state].forEach(callback);
      });
    },

    async addCardConfig({ cardConfigId, cardComponent }) {
      try {
        const { data } = await cardService.addCardConfig(cardConfigId);

        this.cardConfigs.some((cardType) => {
          if (cardType.card_component === cardComponent) {
            cardType.card_config.push(data);
            return true;
          }
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getUserCardConfigurations(userId = null) {
      try {
        if (!userId) userId = userStore().loggedInUser.id;
        const { data } = await cardService.getUserCardConfigurations(userId);
        this.cardConfigs = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateCustomGameConfigWithNewCardConfig({ customGameConfigId, cardData }) {
      try {
        const { data } = await cardService.updateCustomGameConfigWithNewCardConfig({
          customGameConfigId,
          cardData
        });

        await this.getUserCardConfigurations();

        const { id: cardConfigId } = data.card_config;
        const { card_config } = cardData;

        this.updateGameStore((game) => {
          if (game.cardData.custom_game_config_id === customGameConfigId) {
            game.cardData.id = cardConfigId;
            game.cardData.config = card_config;
          }
        });

        return {
          name: card_config.name,
          id: cardConfigId
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async editCardConfig({ cardConfigId, config }) {
      try {
        const { data } = await cardService.editCardConfig({ cardConfigId, config });
        const { author_id, author } = data;

        this.updateGameStore((game) => {
          if (game?.cardData.id === cardConfigId) {
            game.cardData.config = config;
            game.cardData.author_id = author_id;
            game.cardData.author = author;
          }
        });

        this.cardConfigs.forEach((card) => {
          card.card_config.forEach((card_config) => {
            if (card_config.id === cardConfigId) {
              card_config.config = config;
              card_config.author_id = author_id;
              card_config.author = author;
            }
          });
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async changeCardConfig({ customGameConfigId, cardConfigId, cardData, triggerFetch }) {
      try {
        if (triggerFetch) {
          await cardService.changeCardConfig({ customGameConfigId, cardConfigId });
        }

        this.updateGameStore((game) => {
          if (game.cardData.custom_game_config_id === customGameConfigId) {
            game.cardData.id = cardConfigId;
            game.cardData.config = cardData.config;
            game.cardData.card_name = cardData.name;
            game.cardData.card_component = cardData.component;
            game.cardData.official = cardData.official;
          }
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    changeCountdownFormat(payload) {
      try {
        // no await so there is no delay/shitty ui feedback
        cardService.changeCountdownFormat(payload);

        const { countdown_format, customGameConfigId } = payload;

        this.updateGameStore((game) => {
          if (game.cardData.custom_game_config_id === customGameConfigId) {
            game.cardData.countdown_format = countdown_format;
          }
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getGameEntryCardDetails(customGameConfigId) {
      try {
        const { data } = await cardService.getGameEntryCardDetails(customGameConfigId);

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteConfig({
      custom_game_config_id,
      card_component,
      card_config_id,
      defaultConfig
    }) {
      try {
        // Returns all the updated gameConfig IDs
        const { data } = await cardService.deleteConfig(custom_game_config_id);

        this.updateGameStore((game) => {
          if (data.includes(game.cardData.custom_game_config_id)) {
            game.cardData.id = defaultConfig.id;
            game.cardData.config = defaultConfig.config;
          }
        });

        this.cardConfigs.forEach((card) => {
          if (card.card_component === card_component) {
            card.card_config = card.card_config.filter((config) => {
              return config.id !== card_config_id;
            });
          }
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
});

export default cardStore;

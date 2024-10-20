<template>
  <div v-if="initiated" class="details-view">
    <ButtonComponent
      v-if="isUsersConfig"
      @click="$emit('toggleTab')"
      class="btn-switch-view"
      size="s"
    >
      Edit preset
    </ButtonComponent>

    <div class="info-section">
      <div class="card-name data-row">
        <LibraryIcon />
        <span class="title">Card style</span>
        <span class="content">{{ cardName }}</span>
      </div>

      <div class="preset-name data-row">
        <ThemeIcon />
        <span class="title">Card preset</span>
        <span class="content">{{ presetName }}</span>
      </div>

      <div class="author data-row">
        <ProfileIcon />
        <span class="title">Preset Author</span>
        <span class="content">
          <RouterLink v-if="cardData.author" :to="`/user/${cardData.author.handle}`">
            @{{ cardData.author.handle }}
          </RouterLink>
          <template v-else>Release Berry Official</template>
        </span>
      </div>

      <div v-if="currentEntryBy" class="user-following-game data-row">
        <ControllerIcon />
        <span class="title">Game entry by</span>
        <RouterLink class="content" :to="`/user/${currentEntryBy.handle}`">
          @{{ currentEntryBy.handle }}
        </RouterLink>
      </div>

      <div v-if="timesPresetUsed" class="amount-in-use data-row">
        <NodeIcon />
        <span class="text">
          Preset used by {{ timesPresetUsed }} card{{ timesPresetUsed > 1 ? 's' : null }}
        </span>
      </div>
    </div>
    <div style="position: relative" v-if="!isFallbackCard">
      <ButtonComponent
        :disabled="!userCardConfigs || userHasAlreadyIdenticalConfig || isLoading"
        @click="addConfig"
        class="btn"
        size="s"
      >
        Add preset
      </ButtonComponent>

      <span v-if="userHasAlreadyIdenticalConfig" class="small-print">
        You already have this preset
      </span>

      <span v-else-if="!userCardConfigs" class="small-print">
        You need to be logged in for this action
      </span>
    </div>
  </div>
</template>

<script>
import cardStore from '../state/cardStore';
import userStore from '../state/userStore';
import { mapActions, mapState } from 'pinia';
import ButtonComponent from './ButtonComponent.vue';
import { toastStore } from '@/state/toastStore';

export default {
  name: 'UserCardDetailsArea',

  components: {
    ButtonComponent
  },

  emits: ['toggleTab'],

  props: ['displayData'],

  inject: ['accentColor'],

  data() {
    return {
      timesPresetUsed: null,
      currentEntryBy: null,
      initiated: false,
      isLoading: false
    };
  },

  computed: {
    ...mapState(cardStore, ['userCardConfigs']),

    cardData() {
      return this.displayData.cardData;
    },

    presetName() {
      return this.cardData.config.name;
    },

    cardName() {
      return this.cardData.card_name;
    },

    isFallbackCard() {
      return this.cardName === 'FallbackCard';
    },

    userHasAlreadyIdenticalConfig() {
      if (this.isFallbackCard) return false;

      return this.userCardConfigs
        ?.find((card) => card.card_name == this.cardName)
        ?.card_config.some((c) => {
          if (c.config.name === this.presetName) {
            return JSON.stringify(c.config) === JSON.stringify(this.cardData.config);
          }
        });
    },

    isUsersConfig() {
      return userStore()?.loggedInUser?.id === this.currentEntryBy?.id;
    }
  },

  mounted() {
    this.getGameEntryCardDetailsInit();
  },

  methods: {
    ...mapActions(cardStore, ['getGameEntryCardDetails', 'addCardConfig']),

    async getGameEntryCardDetailsInit() {
      try {
        const { entryBy, useCount } = await this.getGameEntryCardDetails(
          this.cardData.custom_game_config_id
        );

        this.timesPresetUsed = useCount;
        this.currentEntryBy = entryBy;

        this.initiated = true;
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not retrieve data`
        );
      }
    },

    async addConfig() {
      if (this.isLoading) return;

      this.isLoading = true;

      try {
        await this.addCardConfig({
          cardConfigId: this.cardData.id,
          cardComponent: this.cardData.card_component
        });

        toastStore().add({
          icon: 'SaveIcon',
          message: 'Config has been saved'
        });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Something went wrong, Could not save config`
        );
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.details-view {
  position: relative;
  height: 100%;
  min-height: 440px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;

  @media (max-width: 620px) {
    border-top: 1px solid #ffffff1c;
  }
}

.data-row {
  background-color: rgba(255, 255, 255, 0.089);
  padding: 14px;
  border-radius: 8px;
  display: flex;
  font-size: 14px;
  position: relative;
  min-width: 230px;
  gap: 12px;

  .title {
    position: absolute;
    border-radius: 4px;
    top: 7px;
    left: 40px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.425);
  }

  a {
    transition: color 0.3s ease-out;

    &:hover {
      color: white;
    }
  }

  .content {
    transform: translateY(7px);
  }

  svg {
    max-width: 20px;
    max-height: 20px;
    cursor: auto;

    &.fill {
      fill: rgba(255, 255, 255, 0.315);
    }
  }
}

.btn {
  width: 230px;
  margin: 16px 0 4px 0;
}

.small-print {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.37);
  position: absolute;
  width: 100%;
  top: 100%;
  text-align: center;
}

.amount-in-use {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  align-items: center;
  color: rgba(255, 255, 255, 0.514);
  gap: 8px;

  .text {
    display: block;
    width: 100%;
    text-align: center;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-switch-view {
  position: absolute;
  right: 0;
  top: 16px;
}
</style>

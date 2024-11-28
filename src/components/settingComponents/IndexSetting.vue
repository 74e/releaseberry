<template>
  <div class="index">
    <p class="explanation">
      Game index prefers to the indexed entries from the steam database
    </p>

    <ul class="log-list">
      <li v-for="(log, index) in formattedLogs" :key="index" class="log-item">
        Game entries: {{ log.gameEntries }} | {{ log.date }} | {{ log.time }}
        <span v-if="formattedLogs.length - (index + 1) === 0"
          >{{ '<-' }} Last update</span
        >
      </li>
    </ul>

    <ButtonComponent
      size="s"
      @click="syncSteamGameIndex"
      :disabled="isLoading"
      class="update-button"
    >
      <span v-if="!isLoading">Update Index</span>
      <span v-else>Updating...</span>
    </ButtonComponent>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import { toastStore } from '@/state/toastStore';
import ButtonComponent from '../ButtonComponent.vue';

export default {
  name: 'IndexSetting',

  components: { ButtonComponent },

  data() {
    return {
      indexLogs: null,
      isLoading: false
    };
  },

  computed: {
    formattedLogs() {
      if (!this.indexLogs) return [];

      return this.indexLogs.map((log) => {
        const [date, time] = log.date.split('T');
        return { gameEntries: log.game_entries, date, time: time.split('.')[0] };
      });
    }
  },

  mounted() {
    this.initIndexLogs();
  },

  methods: {
    async syncSteamGameIndex() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const newIndex = await gameStore().syncSteamGameIndex();
        this.indexLogs = newIndex;
        this.$nextTick(() => {
          this.scrollToBottom();
        });

        toastStore().add({
          icon: 'UpdateIcon',
          message: 'Index has been updated'
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Failed to update the index');
      } finally {
        this.isLoading = false;
      }
    },

    async initIndexLogs() {
      try {
        const newIndex = await gameStore().getIndexLogs();
        this.indexLogs = newIndex;

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        toastStore().handleErrorMessage(error, 'Failed to get index logs');
      }
    },

    scrollToBottom() {
      const logContainer = this.$refs.logContainer;
      if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
    }
  }
};
</script>

<style scoped>
.explanation {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.521);
}

.update-button {
  margin-left: auto;
}

.update-button:disabled {
  background: rgba(var(--accentColor), 0.5);
  cursor: not-allowed;
}

.log-list {
  list-style-type: none;
  margin: 12px 0;
  padding: 8px 0;
  background: rgba(var(--accentColor), 0.1);
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(var(--accentColor), 0.2);
}

.log-item {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  border-bottom: 1px solid rgba(var(--accentColor), 0.2);
}

.log-item:last-child {
  border-bottom: none;
}
</style>

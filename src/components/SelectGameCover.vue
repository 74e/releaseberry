<template>
  <div>
    <div class="cover-results">
      <div
        v-for="cover in gameCovers"
        :class="['cover', { selected: cover.id === selectedGameCover?.id }]"
        :key="cover?.id"
      >
        <img
          @click="selectCover(cover)"
          :src="cover?.thumb"
          alt="game cover"
          draggable="false"
        />
      </div>

      <ButtonComponent
        class="load-more-btn"
        v-if="gameCovers.length < total"
        @click="handleLoadMore"
      >
        {{ isLoading ? 'Loading...' : 'Load more' }}
      </ButtonComponent>

      <div v-if="gameCovers.length === 0" class="no-results">
        Looks like there is no covers for this game yet. <br />
        Please try again later or go to
        <a href="https://www.steamgriddb.com/" target="_blank" rel="noopener noreferrer">
          SteamGridDB
        </a>
        and add your own cover!
      </div>

      <LoadingOverlay :isLoading="isLoading" />
    </div>

    <div class="btn-container">
      <ButtonComponent @click="handleProgression('previous')">Back</ButtonComponent>
      <ButtonComponent :disabled="!selectedGameCover" @click="handleProgression('next')">
        Confirm
      </ButtonComponent>
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore'
import LoadingOverlay from './uiComponents/LoadingOverlay.vue'
import { mapState, mapActions } from 'pinia'
import ButtonComponent from './primitiveComponents/ButtonComponent.vue'

export default {
  name: 'SelectGameCoverComponent',

  components: {
    LoadingOverlay,
    ButtonComponent
  },

  inject: ['handleProgression', 'accentColor'],

  props: {
    selectedGameItem: {
      type: [Number, null],
      default: null
    },

    selectedGameCover: {
      type: [Object, null],
      default: null
    }
  },

  data() {
    return {
      isLoading: false,
      page: 0
    }
  },

  mounted() {
    this.fetchGameCovers()
  },

  unmounted() {
    this.clearGameCovers()
  },

  computed: {
    ...mapState(gameStore, ['gameCovers', 'total'])
  },

  methods: {
    ...mapActions(gameStore, ['getGameCovers', 'clearGameCovers']),

    async fetchGameCovers() {
      if (this.isLoading) return

      this.isLoading = true

      try {
        await this.getGameCovers({ appid: this.selectedGameItem, page: this.page })
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    selectCover(cover) {
      this.$emit('update:selectedGameCover', cover)
    },

    handleLoadMore() {
      this.page++
      this.fetchGameCovers()
    }
  }
}
</script>

<style scoped>
.cover-results {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.336);
  border-radius: var(--radius-m);
  border: 1px solid #ffffff1c;
  overflow-y: scroll;
  position: relative;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  height: 620px;

  @media (max-height: 948px) {
    height: 580px;
  }

  @media (max-height: 918px) {
    height: 550px;
  }

  @media (max-height: 875px) {
    height: 520px;
  }

  @media (max-height: 845px) {
    height: 490px;
  }

  @media (max-height: 815px) {
    height: 460px;
  }

  @media (max-height: 785px) {
    height: 60vh;
  }

  .cover {
    height: 220px;
    margin: 8px;
    border-radius: 4px;
    overflow: hidden;
    user-select: none;

    img {
      height: 100%;
    }

    &.selected {
      outline: 2px solid white;
    }
  }

  .loading {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.336);
    display: flex;
    justify-content: center;
    align-items: center;

    .loading-icon {
      width: 150px;
      height: 150px;
    }
  }
}

.btn-container {
  display: flex;
  justify-content: end;
}

.load-more-btn {
  flex-basis: 100%;
  margin-bottom: 20px;
}
</style>

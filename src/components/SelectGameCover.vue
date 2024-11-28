<template>
  <div>
    <h3 v-if="heading" class="heading">{{ heading }}</h3>
    <div class="select-cover-area">
      <div
        class="back-btn"
        v-if="gameCovers.length > 0 && isAddingCustomImage"
        @click="toggleCustomImageView"
      >
        {{ '<--' }}
        <span>Back to SteamDBGrid selection</span>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="!isAddingCustomImage" class="cover-results">
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
            class="btn-load-more"
            v-if="gameCovers.length < total"
            @click="handleLoadMore"
          >
            {{ isLoading ? 'Loading...' : 'Load more' }}
          </ButtonComponent>
          <ButtonComponent
            v-if="gameCovers.length > 0"
            @click="toggleCustomImageView"
            class="btn-custom-image"
          >
            Add custom image
          </ButtonComponent>

          <div v-if="gameCovers.length === 0 && !isLoading" class="no-results">
            <span>
              Looks like there are no covers for this game yet. <br />
              However you can add your own custom image url
            </span>

            <p class="small-print">
              Or you can head over to
              <a
                href="https://www.steamgriddb.com/"
                target="_blank"
                class="steamdb-link"
                rel="noopener noreferrer"
                >SteamGridDB</a
              >
              and help the community by adding your game cover there!
            </p>

            <ButtonComponent size="s" @click="toggleCustomImageView">
              Add custom image
            </ButtonComponent>
          </div>
        </div>

        <div v-else class="custom-image">
          <div class="url-input">
            <span
              v-if="statusMessage?.message"
              :class="[
                'status-message',
                { success: statusMessage?.isValid, error: !statusMessage?.isValid }
              ]"
            >
              {{ statusMessage.message }}
            </span>

            <input
              type="text"
              ref="input"
              placeholder="Add your URL here"
              @input="(e) => urlValidation(e)"
            />
            <button class="btn-clear" @click="clearUrlInput"><CloseIcon /></button>
          </div>

          <span class="explanation">
            When choosing an image make sure that the aspect ratio is close to 2:3
            (portrait format) and that the image doesn't exceed heights and widths of
            around 1000px
          </span>

          <div class="example-image-display" v-if="customImageExample">
            <LoadingAnimIcon v-if="isVerifying" />
            <img v-else :src="urlToCheck" alt="Image will be displayed here" />
          </div>
        </div>
      </Transition>

      <LoadingOverlay :isLoading="isLoading" />
    </div>
  </div>
</template>

<script>
import gameStore from '@/state/gameStore';
import LoadingOverlay from './uiComponents/LoadingOverlay.vue';
import { mapState, mapActions } from 'pinia';
import ButtonComponent from './ButtonComponent.vue';
import { toastStore } from '../state/toastStore';
import { validateImageUrl } from '../helperFunctions/common';

export default {
  name: 'SelectGameCover',

  components: {
    LoadingOverlay,
    ButtonComponent
  },

  props: {
    selectedGameItem: {
      type: [Number, null],
      default: null
    },

    selectedGameCover: {
      type: [Object, null],
      default: null
    },

    heading: {
      type: String,
      default: ''
    },

    customImageExample: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isAddingCustomImage: false,
      urlToCheck: '',
      validationTimer: null,
      statusMessage: null,
      isLoading: false,
      isVerifying: false,
      page: 0
    };
  },

  mounted() {
    this.fetchGameCovers();
  },

  unmounted() {
    this.clearGameCovers();
  },

  computed: {
    ...mapState(gameStore, ['gameCovers', 'total'])
  },

  methods: {
    ...mapActions(gameStore, ['getGameCovers', 'clearGameCovers']),

    async fetchGameCovers() {
      if (this.isLoading) return;

      this.isLoading = true;

      try {
        await this.getGameCovers({ appid: this.selectedGameItem, page: this.page });
      } catch (error) {
        toastStore().handleErrorMessage(
          error,
          `Could not retrieve game covers, try again later`
        );
      } finally {
        this.isLoading = false;
      }
    },

    selectCover(cover) {
      this.$emit('update:selectedGameCover', cover);
    },

    handleLoadMore() {
      this.page++;
      this.fetchGameCovers();
    },

    toggleCustomImageView() {
      this.isAddingCustomImage = !this.isAddingCustomImage;
    },

    clearUrlInput() {
      this.$refs.input.value = '';
      this.urlToCheck = '';
      this.statusMessage = null;
    },

    urlValidation(e) {
      clearTimeout(this.validationTimer);
      this.statusMessage = null;
      this.urlToCheck = '';
      this.$emit('update:selectedGameCover', null);
      if (!e.target.value) return;

      this.isVerifying = true;

      this.validationTimer = setTimeout(async () => {
        const [message, isValid] = await validateImageUrl(e.target.value);
        this.urlToCheck = e.target.value;

        const data = isValid ? { url: this.urlToCheck, thumb: this.urlToCheck } : null;

        this.$emit('update:selectedGameCover', data);

        this.statusMessage = { message, isValid };
        this.isVerifying = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.select-cover-area {
  border-radius: var(--radius-m);
  background-color: rgba(0, 0, 0, 0.336);
  border: 1px solid rgba(255, 255, 255, 0.11);
  height: 620px;
  overflow-y: scroll;
  position: relative;
}

.custom-image {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding: 16px;

  .url-input,
  .example-image-display {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    width: 100%;
  }

  .url-input {
    max-width: 400px;
    background-color: rgba(36, 36, 36, 0.945);
    border: 1px solid rgba(255, 255, 255, 0.219);
    position: relative;

    .status-message {
      position: absolute;
      bottom: calc(100% + 6px);
      font-size: 16px;
      color: rgba(var(--accentColor));

      &.error {
        filter: invert(1);
      }
    }

    input {
      border: none;
      outline: none;
      width: 100%;
      background-color: transparent;
      padding: 4px 8px;
      color: rgba(255, 255, 255, 0.623);
    }

    .btn-clear {
      background-color: transparent;
      border: none;
      padding: 0 10px;
      border-left: 1px solid rgba(255, 255, 255, 0.219);
      cursor: pointer;

      svg {
        fill: rgba(255, 255, 255, 0.39);
      }

      &:hover {
        svg {
          fill: rgba(255, 255, 255, 0.822);
        }
      }
    }
  }

  .explanation {
    margin-top: 4px;
    max-width: 400px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.356);
    text-align: center;
  }

  .example-image-display {
    background-color: rgba(48, 48, 48, 0.377);
    margin-top: 20px;
    height: 400px;
    width: 277px;
    color: rgba(255, 255, 255, 0.527);
    padding: 16px;

    .loading-icon {
      height: 50px;
      width: 50px;
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}

.cover-results {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;

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

  .no-results,
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &.loading {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.336);

      .loading-icon {
        width: 150px;
        height: 150px;
      }
    }
  }

  .no-results {
    span,
    .small-print {
      max-width: 480px;
      text-align: center;
    }

    span {
      line-height: 1.2;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.58);
    }

    .small-print {
      padding: 4px 12px;
      margin-bottom: 22px;
      opacity: 0.65;
      font-size: 14px;
      text-align: center;

      .steamdb-link {
        text-decoration: underline;
        color: rgba(var(--accentColor), 0.7);
      }
    }
  }

  .btn-load-more,
  .btn-custom-image {
    flex-basis: 100%;
    margin-bottom: 8px;
  }

  .heading {
    font-weight: 400;
    text-align: center;
    color: rgba(var(--accentColor));
  }
}

.back-btn {
  font-size: 25px;
  display: inline-block;
  cursor: pointer;
  position: absolute;
  top: 8px;
  left: 12px;
  color: rgba(255, 255, 255, 0.226);
  transition: color 0.2s ease-out;
  display: flex;
  align-items: center;

  span {
    opacity: 0;
    transition: opacity 0.2s ease-out;
    font-size: 14px;
    display: inline-block;
    margin-left: 6px;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.842);

    span {
      opacity: 1;
    }
  }
}
</style>

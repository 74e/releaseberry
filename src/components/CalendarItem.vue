<template>
  <div v-show="isLoaded" class="game-calendar-item">
    <div class="platform-icons">
      <component
        class="icon"
        v-for="(icon, index) in game.platforms"
        :is="iconComponent(icon)"
        :key="index"
      />
      <a v-if="game.link" class="more-info" target="_blank" :href="game.link"> Source </a>
    </div>

    <img :src="game.cover_url" class="cover-img" alt="Game cover" />

    <div class="info">
      <div class="title">{{ game.title || 'Untitled Game' }}</div>

      <div class="genre">
        <span v-for="(genre, index) in game.genres" class="genre-item" :key="index">
          {{ genre }}<span v-if="index < game.genres.length - 1"> | </span>
        </span>
      </div>

      <div class="btn-fix">
        <button
          v-if="isScrollable"
          :disabled="!isAtStart"
          class="nav-btn prev"
          @click="scrollRight"
        >
          <TinyArrowIcon />
        </button>
        <div class="screenshots-container">
          <div ref="screenshots" class="screenshots" @scroll="updateScrollState">
            <img
              v-for="(screenshot, index) in game.screenshots"
              :key="index"
              :src="screenshot"
              :alt="`Screenshot ${index + 1}`"
              @error="hideImage($event)"
              @click="initExpandImage(game.screenshots, index)"
            />
          </div>
        </div>
        <button
          v-if="isScrollable"
          :disabled="!isAtEnd"
          class="nav-btn next"
          @click="scrollLeft"
        >
          <TinyArrowIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { LoadImagePromise } from '@/helperFunctions/common';

export default {
  name: 'GameCalendarItem',

  props: ['game', 'index'],

  mounted() {
    this.initCalendarItem();
    // window.addEventListener('resize', this.updateScrollState);
  },

  // unmounted() {
  //   window.removeEventListener('resize', this.updateScrollState);
  // },

  data() {
    return {
      isLoaded: false,
      isAtStart: true,
      isAtEnd: false,
      isScrollable: false
    };
  },

  methods: {
    initCalendarItem() {
      setTimeout(
        async () => {
          this.isLoaded = await LoadImagePromise(this.game.cover_url);
          await Promise.all(
            this.game.screenshots.map(async (screenshot) => LoadImagePromise(screenshot))
          );
          this.updateScrollState();
        },
        50 * this.index + 1
      );
    },

    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },

    iconComponent(platform) {
      const icon = platform.replace(' ', '');
      if (/[^A-Za-z0-9]+/g.test(icon)) return null;
      if (icon.includes('VR')) return 'VRIcon';
      return icon + 'Icon';
    },

    hideImage(event) {
      event.target.style.display = 'none';
    },

    initExpandImage(screenshots, index) {
      this.$emit('expandImage', { screenshots, index });
    },

    scrollLeft() {
      const container = this.$refs.screenshots;
      container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
    },

    scrollRight() {
      const container = this.$refs.screenshots;
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    },

    updateScrollState() {
      this.$nextTick(() => {
        try {
          const screenshots = this.$refs.screenshots;
          this.isAtStart = screenshots.scrollLeft === 0;
          this.isAtEnd =
            screenshots.scrollLeft + screenshots.clientWidth >= screenshots.scrollWidth;
          this.isScrollable = screenshots.scrollWidth > screenshots.clientWidth;
        } catch (error) {
          /* empty */
        }
      });
    }
  }
};
</script>

<style scoped>
.game-calendar-item {
  border-radius: 6px;
  background: linear-gradient(
    -20deg,
    rgba(var(--accentColor), 0.3) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(var(--accentColor), 0.4) 100%
  );
  border: 1px solid rgba(50, 50, 50, 0.2);
  transition: all 0.3s ease-out;
  position: relative;
  padding: 16px;
  max-width: 602px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  backdrop-filter: blur(15px);
}

.game-calendar-item:hover {
  filter: brightness(1.3);
}

.cover-img {
  max-width: 150px;
  max-height: 150px;
  border-radius: 4px;
  margin-right: 16px;
  object-fit: contain;
}

.more-info {
  font-size: 14px;
  color: #ffffff75;

  &:hover {
    color: #ffffffc4;
  }
}

.platform-icons {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  right: 0;
  top: 0;
  margin: 5px;
}

.icon {
  max-height: 15px;

  &.fill {
    max-width: 15px;
    fill: #ffffff63;
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.info {
  width: 100%;
}

.metadata {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.genre-item {
  color: #ffffff63;
  font-size: 14px;
  font-weight: bold;
}

.btn-fix {
  position: relative;
}

.screenshots-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  margin-top: 8px;
  padding: 6px;
  border: 1px solid rgba(var(--accentColor), 0.5);
  background-color: rgba(var(--accentColor), 0.25);
  border-radius: 4px;
}

.screenshots {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.screenshots img {
  flex-shrink: 0;
  width: 100px;
  height: auto;
  border-radius: 4px;
  scroll-snap-align: start;
  display: block;
  width: 100px;
}

.nav-btn {
  border: none;
  background: rgba(var(--accentColor), 0);
  width: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  transition: all 0.3 ease-in;

  &:hover {
    background: rgba(var(--accentColor), 0.2);
  }

  &:disabled {
    cursor: auto;
    filter: brightness(0.5);
  }
}

.nav-btn.prev {
  left: calc(100% + 2px);

  svg {
    transform: rotate(-90deg) scale(6, 1);
  }
}

.nav-btn.next {
  right: calc(100% + 2px);

  svg {
    transform: rotate(90deg) scale(6, 1);
  }
}

@media (max-width: 670px) {
  .cover-img {
    max-width: 140px;
    max-height: 140px;
  }

  .icon {
    max-height: 15px;

    &.fill {
      max-width: 15px;
    }
  }

  .title {
    font-size: 18px;
    font-weight: 600;
  }

  .genre-item {
    font-size: 12px;
  }
}
</style>

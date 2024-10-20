<template>
  <div
    :class="[
      'card-default-minimal',
      { enter: isLoaded.trigger, 'y-slide': ySlide },
      showBackdrop ? 'card-backdrop' : 'no-backdrop-space'
    ]"
  >
    <div class="image-container">
      <img :src="gameCover" :alt="cardTitle" />
    </div>

    <div class="info-container">
      <span v-if="showTitle" class="card-title"> {{ cardTitle }} </span>
      <div class="timer-container">
        <timerDisplay
          class="timer"
          :counterFormat="this.counterFormat"
          :createdAt="createdAt"
          :releaseDate="releaseDate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import colorStore from '@/state/colorStore';
import { mapActions } from 'pinia';
import timerDisplay from '@/components/TimerDisplay.vue';
import { LoadImageInitTrigger } from '../../helperFunctions/common';

export default {
  name: 'ReleaseBerryMinimalCard',

  components: {
    timerDisplay
  },

  props: {
    gameData: {
      type: [Object, null],
      default: null
    },

    cardData: {
      type: [Object, null],
      default: null
    },

    ySlide: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    LoadImageInitTrigger(this.gameCover, this.isLoaded);
  },

  computed: {
    cardTitle() {
      return this.gameData.name;
    },

    gameCover() {
      return this.gameData.cover_url;
    },

    counterFormat() {
      return this.cardData.countdown_format;
    },

    createdAt() {
      return this.cardData?.created_at;
    },

    styleSettings() {
      return this.cardData.config;
    },

    releaseDate() {
      return this.gameData.release_date;
    },

    showTitle() {
      return this.styleSettings.displaySettings.showTitle.value;
    },

    showBackdrop() {
      return this.styleSettings.displaySettings.showBackdrop.value;
    },

    backgroundTintOne() {
      const { value } = this.styleSettings.cardBackground.gradientColorOne;
      return this.stringifyRGBA(value);
    },

    backgroundTintTwo() {
      const { value } = this.styleSettings.cardBackground.gradientColorTwo;
      return this.stringifyRGBA(value);
    },

    backgroundGradientDirection() {
      const { value } = this.styleSettings.cardBackground.gradientDirection;
      return `${value}deg`;
    },

    backdropTintOne() {
      const { value } = this.styleSettings.backdrop.gradientColorOne;
      return this.stringifyRGBA(value);
    },

    backdropTintTwo() {
      const { value } = this.styleSettings.backdrop.gradientColorTwo;
      return this.stringifyRGBA(value);
    },

    backdropGradientDirection() {
      const { value } = this.styleSettings.backdrop.gradientDirection;
      return `${value}deg`;
    },

    titleFontColor() {
      const { value } = this.styleSettings.cardProperties.titleColor;
      return this.stringifyRGBA(value);
    },

    timerFontColor() {
      const { value } = this.styleSettings.cardProperties.counterColor;
      return this.stringifyRGBA(value);
    },

    borderAccent() {
      const { value } = this.styleSettings.backdrop.innerBorderColor;
      return this.stringifyRGBA(value);
    },

    fakeDepthColor() {
      const { value } = this.styleSettings.cardProperties.thicknessColor;
      return this.stringifyRGBA(value);
    },

    borderColor() {
      const { value } = this.styleSettings.cardProperties.borderColor;
      return this.stringifyRGBA(value);
    },

    fakeDepthWidth() {
      const { value } = this.styleSettings.cardProperties.thickness;
      return `${value}px`;
    }
  },

  data() {
    return {
      isLoaded: { trigger: false }
    };
  },

  methods: {
    ...mapActions(colorStore, ['setDefaultColor', 'setNewColor']),

    stringifyRGBA(colorValues) {
      const [R, G, B, A] = colorValues;
      return `rgba(${R},${G},${B},${A})`;
    }
  }
};
</script>

<style scoped>
.card-default-minimal {
  width: 200px;
  position: relative;
  padding: 12px 14px;
  user-select: none;

  opacity: 0;
  transition:
    opacity 750ms ease-out,
    transform 750ms ease-out;

  &.y-slide {
    transform: translateY(6px);
  }

  &.enter {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  &.card-backdrop {
    background: linear-gradient(
      v-bind(backdropGradientDirection),
      v-bind(backdropTintOne) 6.65%,
      v-bind(backdropTintTwo) 65.45%
    );
    box-shadow: inset 0px 0px 11px 2px rgba(0, 0, 0, 0.33);
    backdrop-filter: blur(7.95px);
    border-radius: var(--radius-s);

    &::before {
      content: '';
      position: absolute;
      inset: 3px;

      border: 1px solid v-bind(borderAccent);
      border-radius: 3px;
    }
  }

  .image-container {
    border: 1px solid v-bind(borderColor);
    border-radius: var(--radius-s) var(--radius-s) 0 0;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;

      box-shadow: inset 0px -1px 11px 5px rgba(0, 0, 0, 0.5);
    }
  }

  .card-title {
    display: block;
    text-align: center;
    padding: 0 8px 2px 8px;
    color: v-bind(titleFontColor);
    font-size: 13px;
  }

  .info-container {
    background: linear-gradient(
      v-bind(backgroundGradientDirection),
      v-bind(backgroundTintOne) 6.65%,
      v-bind(backgroundTintTwo) 65.45%
    );
    border: 1px solid v-bind(borderColor);
    border-top: 0px;
    padding: 4px 0 6px 0;
    box-shadow: 0px v-bind(fakeDepthWidth) 0px v-bind(fakeDepthColor);
    border-radius: 0 0 var(--radius-s) var(--radius-s);
    backdrop-filter: blur(7.95px);

    .timer-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;

      .timer {
        font-size: 18px;
        font-family: 'Oswald';
        color: v-bind(timerFontColor);
        letter-spacing: 0.04em;
        line-height: 86.85%;
        text-align: center;

        transform: translateY(-1px);
      }
    }
  }
}

.no-backdrop-space {
  margin: 0 -14px !important;
}
</style>

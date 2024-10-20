<template>
  <div
    v-if="gameData"
    :class="['card-default', { enter: isLoaded.trigger, 'y-slide': ySlide }]"
  >
    <div class="image-container">
      <img :src="gameCover" :alt="cardTitle" loading="lazy" />
    </div>

    <span v-if="showTitle" class="card-title">{{ cardTitle }}</span>

    <div :class="['timer-container', { 'no-titie-space': !showTitle }]">
      <timerDisplay
        class="timer"
        :releaseDate="releaseDate"
        :createdAt="createdAt"
        :counterFormat="counterFormat"
      />
    </div>
  </div>
</template>

<script>
import colorStore from '@/state/colorStore';
import { mapActions } from 'pinia';
import timerDisplay from '@/components/TimerDisplay.vue';
import { LoadImageInitTrigger } from '../../helperFunctions/common';

export default {
  name: 'ReleaseBerryDefaultCard',

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
      return this.cardData?.config;
    },

    releaseDate() {
      return this.gameData.release_date;
    },

    showTitle() {
      return this.styleSettings.displaySettings.showTitle.value;
    },

    backgroundTintOne() {
      const { value } = this.styleSettings.cardBackground.gradientColorOne;
      return this.stringifyRGBA(value);
    },

    backgroundTintTwo() {
      const { value } = this.styleSettings.cardBackground.gradientColorTwo;
      return this.stringifyRGBA(value);
    },

    gradientDirection() {
      const { value } = this.styleSettings.cardBackground.gradientDirection;
      return `${value}deg`;
    },

    edgeGradientColor() {
      const { value } = this.styleSettings.cardBackground.edgeGradientColor;
      return this.stringifyRGBA(value);
    },

    edgeGradientBlur() {
      const { value } = this.styleSettings.cardBackground.edgeGradientSoftness;
      return `${value}px`;
    },

    edgeGradientSpread() {
      const { value } = this.styleSettings.cardBackground.edgeGradientSize;
      return `${value}px`;
    },

    titleFontColor() {
      const { value } = this.styleSettings.cardProperties.titleColor;
      return this.stringifyRGBA(value);
    },

    timerFontColor() {
      const { value } = this.styleSettings.counterProperties.counterTextColor;
      return this.stringifyRGBA(value);
    },

    cardBorderColor() {
      const { value } = this.styleSettings.cardProperties.innerBorderColor;
      return this.stringifyRGBA(value);
    },

    coverBorderColor() {
      const { value } = this.styleSettings.coverProperties.borderColor;
      return this.stringifyRGBA(value);
    },

    counterBorderColor() {
      const { value } = this.styleSettings.counterProperties.borderColor;
      return this.stringifyRGBA(value);
    },

    cardBorderWidth() {
      const { value } = this.styleSettings.cardProperties.innerBorderSize;
      return `${value}px`;
    },

    coverBorderWidth() {
      const { value } = this.styleSettings.coverProperties.borderSize;
      return `${value}px`;
    },

    counterBorderWidth() {
      const { value } = this.styleSettings.counterProperties.borderSize;
      return `${value}px`;
    },

    cardThickness() {
      const { value } = this.styleSettings.cardProperties.thickness;
      return `${value}px`;
    },

    coverThickness() {
      const { value } = this.styleSettings.coverProperties.thickness;
      return `${value}px`;
    },

    counterThickness() {
      const { value } = this.styleSettings.counterProperties.thickness;
      return `${value}px`;
    },

    cardDepthColor() {
      const { value } = this.styleSettings.cardProperties.thicknessColor;
      return this.stringifyRGBA(value);
    },

    coverDepthColor() {
      const { value } = this.styleSettings.coverProperties.thicknessColor;
      return this.stringifyRGBA(value);
    },

    counterDepthColor() {
      const { value } = this.styleSettings.counterProperties.thicknessColor;
      return this.stringifyRGBA(value);
    },

    cardBorderRadius() {
      const { value } = this.styleSettings.cardProperties.cornerRadius;
      return `${value}px`;
    },

    coverBorderRadius() {
      const { value } = this.styleSettings.coverProperties.cornerRadius;
      return `${value}px`;
    },

    counterBorderRadius() {
      const { value } = this.styleSettings.counterProperties.cornerRadius;
      return `${value}px`;
    },

    counterBackgroundTintOne() {
      const { value } = this.styleSettings.counterBackground.gradientColorOne;
      return this.stringifyRGBA(value);
    },

    counterBackgroundTintTwo() {
      const { value } = this.styleSettings.counterBackground.gradientColorTwo;
      return this.stringifyRGBA(value);
    },

    counterGradientDirection() {
      const { value } = this.styleSettings.counterBackground.gradientDirection;
      return `${value}deg`;
    }
  },

  mounted() {
    LoadImageInitTrigger(this.gameCover, this.isLoaded);
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
    },

    onloadShow() {
      this.isLoaded = true;
    }
  }
};
</script>

<style scoped>
.card-default {
  width: 200px;
  position: relative;
  padding: 12px 14px;
  user-select: none;

  background: linear-gradient(
    v-bind(gradientDirection),
    v-bind(backgroundTintOne) 7%,
    v-bind(backgroundTintTwo) 65%
  );
  box-shadow:
    0px v-bind(cardThickness) 0px v-bind(cardDepthColor),
    inset 0px 0px v-bind(edgeGradientBlur) v-bind(edgeGradientSpread)
      v-bind(edgeGradientColor);
  backdrop-filter: blur(7.95px);
  border-radius: v-bind(cardBorderRadius);

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

  &::before {
    content: '';
    position: absolute;
    inset: 4px;

    border: v-bind(cardBorderWidth) solid v-bind(cardBorderColor);
    border-radius: calc(v-bind(cardBorderRadius) - 2px);
  }

  .image-container {
    border: v-bind(coverBorderWidth) solid v-bind(coverBorderColor);
    box-shadow: 0px v-bind(coverThickness) 0px v-bind(coverDepthColor);
    border-radius: v-bind(coverBorderRadius);
    overflow: hidden;
    position: relative;
    margin-bottom: calc(v-bind(coverThickness) + 1px);

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
    margin-bottom: 2px;
    color: v-bind(titleFontColor);
    font-size: 14px;
  }

  .timer-container {
    height: 30px;
    background: linear-gradient(
      v-bind(counterGradientDirection),
      v-bind(counterBackgroundTintOne) 6.65%,
      v-bind(counterBackgroundTintTwo) 65.45%
    );
    border: v-bind(counterBorderWidth) solid v-bind(counterBorderColor);
    box-shadow: 0px v-bind(counterThickness) 0px v-bind(counterDepthColor);
    border-radius: v-bind(counterBorderRadius);

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: calc(v-bind(counterThickness) * 0.6);

    .timer {
      font-size: 19px;
      font-family: 'Oswald';
      color: v-bind(timerFontColor);
      letter-spacing: 0.04em;
      line-height: 86.85%;
      text-align: center;

      transform: translateY(-2px);
    }
  }

  .no-titie-space {
    margin-top: 8px;
  }
}
</style>

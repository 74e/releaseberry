<template>
  <div v-if="gameData" class="card-default">
    <div class="image-container">
      <img :src="gameCover" :alt="cardTitle" />
    </div>

    <span v-if="showTitle" class="card-title">{{ cardTitle }}</span>

    <div :class="['timer-container', { 'no-titie-space': !showTitle }]">
      <timerDisplay class="timer" :releaseDate="releaseDate" />
    </div>
  </div>
</template>

<script>
import { releaseBerryStandard } from '../../assets/styleSettings/defaultPresetsAndSettings.js'
import colorStore from '@/state/accentColor'
import { mapActions } from 'pinia'
import timerDisplay from '@/components/TimerDisplay.vue'

export default {
  name: 'CardToolbarComponent',

  components: {
    timerDisplay
  },

  props: {
    gameData: {
      type: Object || null,
      default: null
    },

    styleSettings: {
      type: Object,
      default: releaseBerryStandard.presets[0]
    },

    displaySettings: {
      type: Object,
      default: releaseBerryStandard.settings
    }
  },

  mounted() {
    console.log(this.showTitle)
  },

  computed: {
    showTitle() {
      return this.displaySettings.showTitle
    },

    timerFormat() {
      return this.displaySettings.timerFormat
    },

    backgroundTintOne() {
      const { colorOne } = this.styleSettings.backgroundTint
      return this.stringifyRGBA(colorOne)
    },

    backgroundTintTwo() {
      const { colorTwo } = this.styleSettings.backgroundTint
      return this.stringifyRGBA(colorTwo)
    },

    edgeGradientColor() {
      const { color } = this.styleSettings.edgeGradient
      return this.stringifyRGBA(color)
    },

    edgeGradientBlur() {
      const { blur } = this.styleSettings.edgeGradient
      return `${blur}px`
    },

    edgeGradientSpread() {
      const { spread } = this.styleSettings.edgeGradient
      return `${spread}px`
    },

    timerFontColor() {
      return this.stringifyRGBA(this.styleSettings.timerFontColor)
    },

    borderAccent() {
      return this.stringifyRGBA(this.styleSettings.borderAccent)
    },

    fakeDepthColor() {
      const color = this.styleSettings.fakeDepth.color
      return this.stringifyRGBA(color)
    },

    fakeDepthWidth() {
      const width = this.styleSettings.fakeDepth.width
      return `${width}px`
    },

    cardTitle() {
      return this.gameData.name
    },

    gameCover() {
      return this.gameData.cover_url
    },

    releaseDate() {
      return Number(this.gameData.release_date)
    }
  },

  data() {
    return {}
  },

  methods: {
    ...mapActions(colorStore, ['setDefaultColor', 'setNewColor']),

    stringifyRGBA(colorValues) {
      const { R, G, B, A } = colorValues
      return `rgba(${R},${G},${B},${A})`
    }
  }
}
</script>

<style scoped>
.card-default {
  width: 200px;
  position: relative;
  padding: 12px 14px;
  z-index: -1; /* This is a hack to make the cards respect z-index */

  background: linear-gradient(
    328.98deg,
    v-bind(backgroundTintOne) 6.65%,
    v-bind(backgroundTintTwo) 65.45%
  );
  box-shadow:
    0px v-bind(fakeDepthWidth) 0px v-bind(fakeDepthColor),
    inset 0px 0px v-bind(edgeGradientBlur) v-bind(edgeGradientSpread)
      v-bind(edgeGradientColor);
  backdrop-filter: blur(7.95px);
  border-radius: var(--radius-s);

  &::before {
    content: '';
    position: absolute;
    inset: 4px;

    border: 1px solid v-bind(borderAccent);
    border-radius: 3px;
  }

  .image-container {
    border: 1px solid v-bind(borderAccent);
    box-shadow: 0px v-bind(fakeDepthWidth) 0px v-bind(fakeDepthColor);
    border-radius: var(--radius-s);
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
    margin: 4px 0 2px 0;

    font-size: 14px;
  }

  .timer-container {
    height: 30px;
    background: linear-gradient(
      328.98deg,
      v-bind(backgroundTintOne) 6.65%,
      v-bind(backgroundTintTwo) 65.45%
    );
    border: 1px solid v-bind(borderAccent);
    box-shadow: 0px v-bind(fakeDepthWidth) 0px v-bind(fakeDepthColor);
    border-radius: var(--radius-s);

    display: flex;
    align-items: center;
    justify-content: center;

    .timer {
      font-size: 22px;
      font-family: 'Oswald';
      color: v-bind(timerFontColor);
      letter-spacing: 0.04em;
      line-height: 86.85%;
      text-align: center;

      transform: translateY(-1px);
    }
  }

  .no-titie-space {
    margin-top: 8px;
  }
}
</style>

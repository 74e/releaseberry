<template>
  <div
    :class="[
      'card-default-minimal',
      showBackdrop ? 'card-backdrop' : 'no-backdrop-space'
    ]"
  >
    <div class="image-container">
      <img :src="gameData.cover_url" :alt="cardTitle" />
    </div>

    <div class="info-container">
      <span v-if="showTitle" class="card-title"> {{ cardTitle }} </span>
      <div class="timer-container">
        <timerDisplay class="timer" :releaseDate="releaseDate" />
      </div>
    </div>
  </div>
</template>

<script>
import { releaseBerryMinimal } from '../../assets/styleSettings/defaultPresetsAndSettings.js'
import colorStore from '@/state/accentColor'
import { mapActions } from 'pinia'
import timerDisplay from '@/components/TimerDisplay.vue'

export default {
  name: 'CardDefaultMinimalComponent',

  components: {
    timerDisplay
  },

  props: {
    gameData: {
      type: Object,
      default: () => ({})
    },

    styleSettings: {
      type: Object,
      default: releaseBerryMinimal.presets[0]
    },

    displaySettings: {
      type: Object,
      default: releaseBerryMinimal.settings
    }
  },

  computed: {
    showTitle() {
      return this.displaySettings.showTitle
    },

    showBackdrop() {
      return this.displaySettings.showBackdrop
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
.card-default-minimal {
  width: 200px;
  position: relative;
  padding: 12px 14px;
  z-index: -1; /* This is a hack to make the cards respect z-index */

  &.card-backdrop {
    background: linear-gradient(
      328.98deg,
      v-bind(backgroundTintOne) 6.65%,
      v-bind(backgroundTintTwo) 65.45%
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
    border: 1px solid v-bind(borderAccent);

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

    font-size: 13px;
  }

  .info-container {
    background: linear-gradient(
      328.98deg,
      v-bind(backgroundTintOne) 6.65%,
      v-bind(backgroundTintTwo) 65.45%
    );
    border: 1px solid v-bind(borderAccent);
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

<template>
  <div class="color-display">
    <span class="color-code">
      <span class="rgb">{{ colorDisplay.rgb }}</span>
      <span class="alpha">{{ colorDisplay.alpha + '%' }}</span>
    </span>

    <WindowPopup width="300">
      <div class="color" :style="{ backgroundColor: colorDisplay.hexWithAlpha }" />
      <template #window>
        <div class="pad">
          <ColourPicker
            default-format="hex"
            :visible-formats="['hex', 'hsl', 'rgb']"
            :color="color"
            @color-change="updateColor"
          />
        </div>
      </template>
    </WindowPopup>
  </div>
</template>

<script>
import cc from '../../helperFunctions/color'
import { ColorPicker as ColourPicker } from 'vue-accessible-color-picker'
import WindowPopup from './WindowPopup.vue'

export default {
  name: 'ColorPicker',

  components: {
    ColourPicker,
    WindowPopup
  },

  data() {
    return {
      displayColor: null
    }
  },

  props: {
    modelValue: {
      type: Array,
      required: true
    }
  },

  methods: {
    updateColor(e) {
      const { r, g, b, a } = e.colors.rgb

      this.$emit('update:modelValue', [r, g, b, a])
    }
  },

  computed: {
    color() {
      const [r, g, b, a] = this.modelValue

      return { r, g, b, a }
    },

    colorDisplay() {
      const [r, g, b, a] = this.modelValue.map((c) => {
        if (c > 1) return Math.round(c)
        return c
      })

      const hexWithAlpha = cc.rgbaToHex(r, g, b, a)
      const rgb = cc.rgbaToHex(r, g, b).slice(0, 7)

      return { hexWithAlpha, rgb, alpha: (a * 100).toFixed(0) }
    }
  }
}
</script>

<style>
.color-display {
  display: flex;
  align-items: center;
  border-radius: 6px;
  width: 160px;
  padding: 6px;
  background-color: var(--dark-fg);
  border: 1px solid rgba(255, 255, 255, 0.123);

  .color-code {
    font-size: 13px;
    flex-grow: 1;
    min-width: 75px;
    display: flex;
    justify-content: space-evenly;

    .alpha {
      min-width: 33px;
      text-align: center;
    }

    span {
      transform: translateY(-1px);
    }
  }

  .color {
    width: 48px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
  }
}

.pad {
  padding: 8px;
}

.vacp-color-picker {
  max-width: 300px;
  padding: 6px;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 1fr min-content;
  font-size: 0.8em;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Arial,
    sans-serif;
  color: inherit;
  background-color: transparent;
  user-select: none;
}

.vacp-color-picker,
.vacp-color-picker *,
.vacp-color-picker *:before,
.vacp-color-picker *:after {
  box-sizing: border-box;
}

.vacp-color-picker button::-moz-focus-inner {
  border: none;
  padding: 0;
}

.vacp-color-picker :focus {
  outline: none;
}

.vacp-color-space {
  grid-column: 1/-1;
  overflow: hidden;
  aspect-ratio: 1/0.6;
}

.vacp-color-space-thumb {
  width: 18px;
  height: 18px;
  margin-left: calc(-1 * 24px / 2);
  margin-bottom: calc(-1 * 24px / 2);
  border: 2px solid #ffffff;
  border-radius: 50%;
  transform: rotate(0);
  mix-blend-mode: difference;
}

.vacp-color-space-thumb:focus {
  outline: none;
}

.vacp-range-input-label {
  display: block;
}

.vacp-range-input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vacp-range-input-group > :not(:first-child) {
  margin-top: 6px;
}

.vacp-range-input,
.vacp-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
}

.vacp-range-input {
  display: block;
  width: 95%;
  height: 6px; /* Unsure what to use here */
  margin-right: 0;
  margin-left: 0;
  margin-top: calc(6px / 2 + 1px);
  margin-bottom: calc(6px / 2 + 1px);
  padding: 0;
  border: none;
  background: none;
  outline: none;
}

.vacp-range-input:focus {
  outline: none;
}

.vacp-range-input::-moz-focus-outer {
  border: none;
  outline: none;
}

.vacp-range-input--alpha {
  background-color: #fff;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee
    ),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
  background-size: calc(6px * 2) calc(6px * 2);
  background-position:
    0 0,
    6px 6px;
  outline: none;
  border-radius: 4px;
}

.vacp-range-input::-moz-range-track {
  box-sizing: border-box;
  width: 100%;
  height: 6px; /* Unsure what to use here */
  border: none;
  border-radius: 4px;
}

.vacp-range-input::-webkit-slider-runnable-track {
  box-sizing: border-box;
  width: 100%;
  height: 6px; /* Unsure what to use here */
  border: none;
}

.vacp-range-input::-ms-track {
  box-sizing: border-box;
  width: 100%;
  height: 6px; /* Unsure what to use here */
  border: none;
}

.vacp-range-input:focus::-moz-range-track {
  outline: 2px solid #19f;
}

.vacp-range-input:focus::-webkit-slider-runnable-track {
  outline: 2px solid #19f;
}

.vacp-range-input:focus::-ms-track {
  outline: 2px solid #19f;
}

.vacp-range-input--alpha::-moz-range-track {
  background-image: linear-gradient(to right, transparent, blue);
}

.vacp-range-input--alpha::-webkit-slider-runnable-track {
  background-image: linear-gradient(to right, transparent, blue);
}

.vacp-range-input--alpha::-ms-track {
  background-image: linear-gradient(to right, transparent, blue);
}

.vacp-range-input--hue::-moz-range-track {
  background-image: linear-gradient(
    to right,
    #f00 0%,
    #ff0 16.6666666667%,
    #0f0 33.3333333333%,
    #0ff 50%,
    #00f 66.6666666667%,
    #f0f 83.3333333333%,
    #f00 100%
  );
}

.vacp-range-input--hue::-webkit-slider-runnable-track {
  background-image: linear-gradient(
    to right,
    #f00 0%,
    #ff0 16.6666666667%,
    #0f0 33.3333333333%,
    #0ff 50%,
    #00f 66.6666666667%,
    #f0f 83.3333333333%,
    #f00 100%
  );
}

.vacp-range-input--hue::-ms-track {
  background-image: linear-gradient(
    to right,
    #f00 0%,
    #ff0 16.6666666667%,
    #0f0 33.3333333333%,
    #0ff 50%,
    #00f 66.6666666667%,
    #f0f 83.3333333333%,
    #f00 100%
  );
}

.vacp-range-input::-moz-range-thumb {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  isolation: isolate;
}

.vacp-range-input::-webkit-slider-thumb {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  margin-top: calc(-1 * 6px / 2);
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  isolation: isolate;
}

.vacp-range-input::-ms-thumb {
  box-sizing: border-box;
  width: 20px;
  height: 0px;
  margin-top: calc(-1 * 6px / 2);
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  isolation: isolate;
}

.vacp-copy-button {
  justify-self: center;
  align-self: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 50%;
  color: currentColor;
  background-color: transparent;
}

.vacp-copy-button:enabled:focus {
  outline: none;
  border: none;
}

.vacp-color-inputs {
  display: flex;
  width: 115%;

  &:first-child {
    input {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }

  &:first-last {
    input {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
}

.vacp-color-input-group {
  flex-grow: 1;
  display: flex;
  column-gap: 0px;
}

.vacp-color-input-label {
  text-align: center;
}

.vacp-color-input {
  width: 100%;
  margin: 0;
  margin-top: calc(6px / 2);
  padding: 6px;
  border: 1px solid #ffffff25;
  font: inherit;
  text-align: center;
  color: inherit;
  background-color: transparent;
}

.vacp-format-switch-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font: inherit;
  color: inherit;
  border: 1px solid #ffffff25;
  background-color: transparent;
  cursor: pointer;
  position: relative;

  svg {
    display: none;
  }

  &::after {
    content: 'Color Space';
    font-size: 12px;
    text-align: center;
    line-height: 13px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.151);
  }
}

.vacp-format-switch-button:enabled:focus {
  border-color: none;
}

.vacp-format-switch-button:enabled:hover {
  background-color: none;
}

.vacp-visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  white-space: nowrap;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

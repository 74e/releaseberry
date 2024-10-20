<template>
  <div class="backdrop" v-if="modelValue">
    <input type="range" :min="orignialObj.min" :max="orignialObj.max" v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'SliderInput',

  inject: ['accentColor'],

  props: {
    modelValue: {
      required: true
    },

    orignialObj: {
      type: Object
    }
  },

  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<style scoped>
.backdrop {
  width: fit-content;
  background-color: var(--dark-fg);
  border: 1px solid rgba(255, 255, 255, 0.123);
  height: 34px;
  border-radius: 6px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  transform: translateY(-1px);
}

input[type='range'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 145px;
  background-color: transparent;

  &:focus {
    outline-color: #f8b195;
  }
}

input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  border-radius: 3px;

  background: v-bind(accentColor);
}

input[type='range']::-moz-range-track {
  -moz-appearance: none;
  appearance: none;
  height: 3px;
  border-radius: 3px;
  background: v-bind(accentColor);
}

input[type='range']::-ms-track {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 3px;
  background: v-bind(accentColor);
  border-radius: 3px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  border: 3px solid v-bind(accentColor);
  border-radius: 50%;
  height: 15px;
  width: 15px;
  position: relative;
  bottom: 8px;
  background: #222;
  background-size: 50%;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

input[type='range']::-moz-range-thumb {
  -moz-appearance: none;
  appearance: none;
  border: 3px solid v-bind(accentColor);
  border-radius: 50%;
  height: 15px;
  width: 15px;
  position: relative;
  bottom: 8px;
  background: #222;
  background-size: 50%;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

input[type='range']::-ms-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 3px solid v-bind(accentColor);
  border-radius: 50%;
  height: 15px;
  width: 15px;
  position: relative;
  bottom: 8px;
  background: #222;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>

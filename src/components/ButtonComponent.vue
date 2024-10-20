<template>
  <button>
    <slot> Button </slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonComponent',

  inject: ['accentColor'],

  props: {
    size: {
      default: 'm',
      type: String,
      validator: (value) => ['s', 'm', 'l'].includes(value)
    },

    minWidth: {
      default: 100,
      type: [Number, String],
      validator: (value) => typeof value === 'number' || value === 'unset'
    }
  },

  computed: {
    padding() {
      return { s: '4px 14px', m: '8px 16px', l: '16px 32px' }[this.size];
    },

    fontWeightCss() {
      return { s: '400', m: '500', l: 'bold' }[this.size];
    },

    fontSizeCss() {
      return { s: '14px', m: '16px', l: '18px' }[this.size];
    }
  }
};
</script>

<style scoped>
button {
  width: max-content;
  min-width: v-bind(minWidth + 'px');
  background-color: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.534);
  border-radius: var(--radius-s);
  border: 1px solid #ffffff28;
  transition: all 0.25s ease-out;
  text-align: center;
  cursor: pointer;
  font-size: v-bind(fontSizeCss);
  font-weight: v-bind(fontWeightCss);
  padding: v-bind(padding);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: v-bind(accentColor);
    color: v-bind(accentColor);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.055);
    border-color: #ffffff28;
    color: #ffffff28;
    cursor: default;
  }
}
</style>

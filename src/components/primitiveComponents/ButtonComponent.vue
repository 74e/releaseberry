<template>
  <button>
    <slot> Button </slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonComponent',

  inject: ['accentColor']
}
</script>

<style scoped>
button {
  text-align: center;
  min-width: 100px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.534);
  border-radius: var(--radius-s);
  border: 1px solid #ffffff28;
  transition: padding 0.3s ease-out;
  cursor: pointer;
  transition: all 0.25s ease-out;
  font-weight: bold;
  margin: 8px 8px 0 8px;

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

<template>
  <div>
    <label class="wraper">
      <div class="switch-wrap">
        <input type="checkbox" v-model="value" />
        <div class="switch" />
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ToggleInput',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },

  inject: ['accentColor'],

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
.switch-wrap {
  cursor: pointer;
  background-color: var(--dark-fg);
  border: 1px solid rgba(255, 255, 255, 0.123);
  padding: 7px;
  width: 60px;
  height: 33.5px;
  border-radius: 16px;
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
}
.switch {
  height: 100%;
  display: grid;
  grid-template-columns: 0fr 1fr 1fr;
  transition: 0.2s;

  &::after {
    content: '';
    aspect-ratio: 1;
    height: 20px;
    transform: translateY(-2px);
    border-radius: 50%;
    background: #ccc;
    grid-column: 2;
    transition: background 0.2s;
  }
}

input:checked {
  + .switch {
    grid-template-columns: 1fr 1fr 0fr;
    &::after {
      background-color: v-bind(accentColor);
    }
  }
}
</style>

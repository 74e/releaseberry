<template>
  <transition class="modal" name="fade">
    <div
      @click.self="handleClickOutside"
      @close="hide"
      v-if="showModal"
      :class="['modal-background', blur ? 'blur' : 'tint-background']"
    >
      <div ref="window" class="window" :style="[borderStyle]">
        <div v-if="closeButton" @click="hide()" class="close-button">
          <CloseIcon />
        </div>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalPopupComponent',

  inject: ['accentColor', 'duration'],

  props: {
    clickOutside: {
      type: Boolean,
      default: false
    },

    closeButton: {
      type: Boolean,
      default: true
    },

    width: {
      type: String,
      default: 'auto'
    },

    showModal: {
      type: Boolean,
      default: false
    },

    borderWidth: {
      type: Number,
      default: 2
    },

    accentBorders: {
      type: [Array],
      default: () => ['top'],
      validator(value) {
        return value.every((border) =>
          ['top', 'bottom', 'right', 'left'].includes(border)
        )
      }
    },

    blur: {
      type: Boolean,
      default: false
    },

    animaSpeed: {
      type: Number,
      default: 0.25
    }
  },

  provide() {
    return {
      hide: this.hide
    }
  },

  data() {
    return {
      hideTimer: null,
      showTimer: null
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleEscape)
  },

  unmounted() {
    document.removeEventListener('keydown', this.handleEscape)
  },

  computed: {
    borderStyle() {
      return this.accentBorders.reduce((border, selectedBorder) => {
        return (border += `border-${selectedBorder}: ${this.borderWidth}px solid ${this.accentColor};`)
      }, '')
    }
  },

  methods: {
    show() {
      this.$emit('update:showModal', true)
    },

    hide() {
      this.$emit('update:showModal', false)
    },

    handleClickOutside() {
      if (this.clickOutside) this.hide()
    },

    handleEscape(e) {
      if (e.key === 'Escape') {
        this.hide()
      }
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1;
}

.modal-background {
  position: fixed;
  inset: 0;
}

.window {
  width: v-bind(width);
  background-color: var(--dark-85);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  cursor: pointer;
  transition: filter 0.3s ease-out;

  &:hover {
    filter: invert(1);
  }
}

.blur {
  backdrop-filter: blur(50px);
}

.tint-background {
  background-color: rgba(0, 0, 0, 0.308);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(animaSpeed + 's') ease-out;
}
</style>

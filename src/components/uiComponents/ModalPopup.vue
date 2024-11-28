<template>
  <div
    @click.self="handleClickOutside"
    @close="hide"
    :class="['modal-background', blur ? 'blur' : 'tint-background']"
  >
    <div ref="window" class="window" :style="[borderStyle]">
      <div v-if="closeButton" @click="hide()" class="close-button">
        <CloseIcon />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import userStore from '@/state/userStore';

export default {
  name: 'ModalPopup',

  props: {
    clickOutside: {
      type: Boolean,
      default: false
    },

    escapeEvent: {
      type: Boolean,
      default: true
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

    borderRadius: {
      type: String,
      default: 'l',
      validator(value) {
        return ['s', 'm', 'l'].includes(value);
      }
    },

    accentBorders: {
      type: [Array],
      default: () => ['top'],
      validator(value) {
        return value.every((border) => {
          return ['top', 'bottom', 'right', 'left', 'none', 'faint'].includes(border);
        });
      }
    },

    blur: {
      type: Boolean,
      default: false
    },

    animaSpeed: {
      type: Number,
      default: 0.25
    },

    topLevelModdal: {
      type: Boolean,
      default: false
    }
  },

  provide() {
    return {
      hide: this.hide
    };
  },

  data() {
    return {
      hideTimer: null,
      showTimer: null
    };
  },

  mounted() {
    document.addEventListener('keydown', this.handleEscape);
    document.body.style.overflow = 'hidden';
  },

  unmounted() {
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = 'visible';
  },

  // This does not work anymore since the modal only loads when it shows up
  // watch: {
  //   showModal() {
  //     if (this.showModal) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = 'visible';
  //     }
  //   }
  // },

  computed: {
    borderStyle() {
      if (this.accentBorders.includes('none')) return '';

      if (
        this.accentBorders.includes('faint') ||
        userStore()?.user?.userPreferences?.accentBorders === false
      ) {
        return 'border: 1px solid rgba(255, 255, 255, 0.1);';
      }

      return this.accentBorders.reduce((border, selectedBorder) => {
        return (border += `border-${selectedBorder}: ${this.borderWidth}px solid rgba(var(--accentColor));`);
      }, '');
    },

    radiusStyle() {
      return { s: '4px', m: '8px', l: '12px' }[this.borderRadius];
    },

    isTopLevelModal() {
      return this.topLevelModdal ? 999 : 1;
    }
  },

  methods: {
    show() {
      this.$emit('update:showModal', true);
    },

    hide() {
      this.$emit('update:showModal', false);
      this.$emit('modalClosing');
    },

    handleClickOutside() {
      if (this.clickOutside) this.hide();
    },

    handleEscape(e) {
      if (!this.escapeEvent) return;

      if (e.key === 'Escape') {
        this.hide();
      }
    }
  }
};
</script>

<style scoped>
.modal-background {
  z-index: v-bind(isTopLevelModal);
  position: fixed;
  inset: 0;
}

.window {
  width: v-bind(width);
  background-color: var(--dark-85);
  box-shadow: var(--shadow-default);
  border-radius: v-bind(radiusStyle);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  cursor: pointer;
  transition: filter 0.3s ease-out;
  z-index: 1;

  &:hover {
    filter: invert(1);
  }
}

.blur {
  backdrop-filter: blur(50px);
}

.tint-background {
  background-color: rgba(0, 0, 0, 0.4);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-out;
}
</style>

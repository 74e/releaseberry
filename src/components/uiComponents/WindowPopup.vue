<template>
  <div class="anchor">
    <span ref="trigger">
      <slot />
    </span>
    <transition name="fade">
      <div
        ref="window"
        class="window"
        :style="[windowPosition, borderStyle]"
        v-if="showWindow"
      >
        <slot name="window" />
      </div>
    </transition>
  </div>
</template>

<script>
import userStore from '@/state/userStore';

export default {
  name: 'WindowPopup',

  provide() {
    return {
      hide: this.hide
    };
  },

  props: {
    width: {
      type: String,
      default: 'auto'
    },

    borderWidth: {
      type: Number,
      default: 2
    },

    borderRadius: {
      type: String,
      default: 'm',
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

    position: {
      type: String,
      default: 'bottom-center',
      validator(value) {
        return [
          'top-center',
          'top-right',
          'top-left',
          'bottom-center',
          'bottom-right',
          'bottom-left',
          'right-center',
          'right-top',
          'right-bottom',
          'left-center',
          'left-top',
          'left-bottom'
        ].includes(value);
      }
    },

    margin: {
      type: Number,
      default: 12
    },

    xShift: {
      type: String,
      default: '0'
    },

    yShift: {
      type: String,
      default: '0'
    },

    trigger: {
      type: String,
      default: 'click',
      validator(value) {
        return ['click', 'hover'].includes(value);
      }
    },

    hideDelay: {
      type: Number,
      default: 0
    },

    showDelay: {
      type: Number,
      default: 0
    },

    animaSpeed: {
      type: Number,
      default: 0.25
    }
  },

  data() {
    return {
      showWindow: false,
      hideTimer: null,
      showTimer: null
    };
  },

  computed: {
    windowPosition() {
      let [primary, secondary] = this.position.split('-');
      let variation = { center: 50, left: 100, right: 0, top: 100, bottom: 0 };
      let reversePosition = {
        top: 'bottom',
        bottom: 'top',
        right: 'left',
        left: 'right'
      };

      let direction = `${reversePosition[primary]}: calc(100% + ${this.margin}px);`;
      let alignment = ['bottom', 'top'].includes(primary)
        ? `left: ${variation[secondary]}%; transform: translateX(calc(-${variation[secondary]}% + ${this.xShift}px));`
        : `top: ${variation[secondary]}%; transform: translateY(calc(-${variation[secondary]}% + ${this.yShift}px));`;

      return `${direction} ${alignment}`;
    },

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

    borderRadiusSize() {
      return `var(--radius-${this.borderRadius})`;
    }
  },

  mounted() {
    this.initiateComponent();
  },

  unmounted() {
    if (this.trigger === 'click') {
      document.removeEventListener('click', this.handleTriggerOutside);
      document.removeEventListener('keyup', this.handleEscape);
    }
  },

  watch: {
    showWindow(newValue) {
      if (newValue && this.trigger === 'click') {
        this.initiateWindow();
      }
    }
  },

  methods: {
    handleTrigger() {
      this.showWindow ? this.hide() : this.show();
    },

    show() {
      clearTimeout(this.showTimer);

      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }

      this.showTimer = setTimeout(
        () => {
          this.showWindow = true;
        },
        this.trigger === 'click' ? 0 : this.showDelay
      );
    },

    hide() {
      clearTimeout(this.hideTimer);

      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }

      this.hideTimer = setTimeout(
        () => {
          this.showWindow = false;
        },
        this.trigger === 'click' ? 0 : this.hideDelay
      );
    },

    initiateComponent() {
      if (this.trigger === 'click') {
        this.$refs.trigger.addEventListener('click', this.handleTrigger);
      } else if (this.trigger === 'hover') {
        this.$refs.trigger.addEventListener('mouseenter', this.show);
        this.$refs.trigger.addEventListener('mouseleave', this.hide);
      }
    },

    initiateWindow() {
      if (this.trigger === 'click') {
        document.addEventListener('click', this.handleTriggerOutside);
        document.addEventListener('keyup', this.handleEscape);
      }
    },

    checkIfTargetOrDecendants(ref, event) {
      return !ref?.contains(event.target) && ref?.window !== event.target;
    },

    handleTriggerOutside(e) {
      if (
        this.checkIfTargetOrDecendants(this.$refs.window, e) &&
        this.checkIfTargetOrDecendants(this.$refs.trigger, e)
      ) {
        this.hide();
      }
    },

    handleEscape(e) {
      if (e.key === 'Escape') {
        this.hide();
      }
    }
  }
};
</script>

<style scoped>
.anchor {
  width: max-content;
  position: relative;
}

.window {
  width: v-bind(width + 'px');
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: v-bind(borderRadiusSize);
  transition: all 0.5s ease-out;
  backdrop-filter: blur(80px);
  z-index: 999;

  @supports (backdrop-filter: blur(80px)) {
    background-color: var(--dark-95);
  }

  position: absolute;
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

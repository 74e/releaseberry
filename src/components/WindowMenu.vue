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
import useColorStore from '../state/accentColor.js'
import { mapState } from 'pinia'

export default {
  name: 'WindowComponent',

  props: {
    width: {
      type: String,
      default: 'auto'
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
        ].includes(value)
      }
    },

    margin: {
      type: Number,
      default: 12
    },

    trigger: {
      type: String,
      default: 'click',
      validator(value) {
        return ['click', 'hover'].includes(value)
      }
    },

    hideDelay: {
      type: Number,
      default: 0
    },

    showDelay: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      showWindow: false,
      hideTimer: null,
      showTimer: null
    }
  },

  computed: {
    ...mapState(useColorStore, ['accentColor', 'duration']),

    windowPosition() {
      let [primary, secondary] = this.position.split('-')
      let variation = { center: 50, left: 100, right: 0, top: 100, bottom: 0 }
      let reversePosition = { top: 'bottom', bottom: 'top', right: 'left', left: 'right' }

      let direction = `${reversePosition[primary]}: calc(100% + ${this.margin}px);`
      let alignment = ['bottom', 'top'].includes(primary)
        ? `left: ${variation[secondary]}%; transform: translateX(-${variation[secondary]}%);`
        : `top: ${variation[secondary]}%; transform: translateY(-${variation[secondary]}%);`

      return `${direction} ${alignment}`
    },

    borderStyle() {
      return this.accentBorders.reduce((border, selectedBorder) => {
        return (border += `border-${selectedBorder}: ${this.borderWidth}px solid ${this.accentColor};`)
      }, '')
    }
  },

  mounted() {
    this.initiateComponent()
  },

  unmounted() {
    if (this.trigger === 'click') {
      document.removeEventListener('click', this.handleTriggerOutside)
      document.removeEventListener('keyup', this.handleEscape)
    }
  },

  watch: {
    showWindow(newValue) {
      if (newValue && this.trigger === 'click') {
        this.initiateWindow()
      }
    }
  },

  methods: {
    handleTrigger() {
      this.showWindow ? this.hide() : this.show()
    },

    // I could make show and hide the same function but for
    // the sake of clarity I'm keeping them seperate.
    show() {
      clearTimeout(this.showTimer)

      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
      }

      this.showTimer = setTimeout(
        () => {
          this.showWindow = true
        },
        this.trigger === 'click' ? 0 : this.showDelay
      )
    },

    hide() {
      clearTimeout(this.hideTimer)

      if (this.showTimer) {
        clearTimeout(this.showTimer)
        this.showTimer = null
      }

      this.hideTimer = setTimeout(
        () => {
          this.showWindow = false
        },
        this.trigger === 'click' ? 0 : this.hideDelay
      )
    },

    initiateComponent() {
      if (this.trigger === 'click') {
        this.$refs.trigger.addEventListener('click', this.handleTrigger)
      } else if (this.trigger === 'hover') {
        this.$refs.trigger.addEventListener('mouseenter', this.show)
        this.$refs.trigger.addEventListener('mouseleave', this.hide)
      }
    },

    initiateWindow() {
      if (this.trigger === 'click') {
        document.addEventListener('click', this.handleTriggerOutside)
        document.addEventListener('keyup', this.handleEscape)
      }
    },

    checkIfTargetOrDecendants(ref, event) {
      return !ref?.contains(event.target) && ref?.window !== event.target
    },

    handleTriggerOutside(e) {
      if (
        this.checkIfTargetOrDecendants(this.$refs.window, e) &&
        this.checkIfTargetOrDecendants(this.$refs.trigger, e)
      ) {
        this.hide()
      }
    },

    handleEscape(e) {
      if (e.key === 'Escape') {
        this.hide()
      }
    }
  }
}
</script>

<style>
.anchor {
  position: relative;
}

.window {
  width: v-bind(width);
  background-color: var(--dark-50);
  box-shadow: var(--shadow-default);
  border-radius: var(--radius-l);
  transition: all v-bind(duration) ease-out;
  backdrop-filter: blur(80px);

  @supports (backdrop-filter: blur(80px)) {
    background-color: var(--dark-95);
  }

  padding: 16px;
  height: 300px;

  position: absolute;
  z-index: 1000;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease-out;
}
</style>

import { defineStore } from 'pinia'

const initialColor = '#26b3bd'
const initialPosition = 'left'
const transitionedPosition = 'right'
const initialDuration = 0.3
const extendedDuration = 1.5

const colorStore = defineStore('accentColor', {
  state: () => ({
    color: initialColor,
    bgColor: initialColor,
    bgPosition: initialPosition,
    animDuration: initialDuration,
    colorTimeout: null
  }),

  getters: {
    accentColor: (state) => state.color,
    backgroundColor: (state) => state.bgColor,
    backgroundPosition: (state) => state.bgPosition,
    duration: (state) => state.animDuration
  },

  actions: {
    // Add actions to get color from hovered card to then apply to global accent color
    setDefaultColor() {
      clearTimeout(this.colorTimeout)

      this.color = initialColor
      this.bgPosition = initialPosition

      this.colorTimeout = setTimeout(() => {
        this.animDuration = initialDuration
      }, extendedDuration * 1000)
    },

    setNewColor(payloadColor) {
      clearTimeout(this.colorTimeout)

      this.animDuration = extendedDuration
      this.color = payloadColor
      this.bgColor = payloadColor
      this.bgPosition = transitionedPosition
    }
  }
})

export default colorStore

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="anim-container">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube3" />
        <div class="sk-cube sk-cube2" />
        <div class="sk-cube sk-cube1" />
        <div class="sk-cube sk-cube9" />
        <div class="sk-cube sk-cube5" />
        <div class="sk-cube sk-cube4" />
        <div class="sk-cube sk-cube8" />
        <div class="sk-cube sk-cube7" />
        <div class="sk-cube sk-cube6" />
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'LoadingOverlay',

  props: {
    isLoading: {
      type: Boolean,
      default: false
    },

    cubeDimensions: {
      type: String,
      default: '20'
    }
  },

  methods: {
    cubeSize(dimensionType) {
      if (this.cubeDimensions.includes(' ')) {
        const index = ['width', 'height'].indexOf(dimensionType);
        return this.cubeDimensions?.split(' ')[index];
      }

      return this.cubeDimensions;
    }
  }
};
</script>

<style scoped>
.anim-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.25);
}

.sk-cube-grid {
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(3, 1fr);
}

.sk-cube-grid .sk-cube {
  width: v-bind(cubeSize('width') + 'px');
  height: v-bind(cubeSize('height') + 'px');
  background-color: rgba(var(--accentColor));
  border-radius: 2px;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-out-out;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-out-out;
}

.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.loading-text span::after {
  display: block;
  position: absolute;
  left: calc(100% + 4px);
  animation: dots steps(1, end) 1s infinite;
  content: '';
  letter-spacing: 3px;
}

@keyframes dots {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>

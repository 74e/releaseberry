<template>
  <ModalPopup
    class="external"
    :isCustomModal="true"
    :clickOutside="true"
    :closeButton="false"
    :exteriorcloseButton="true"
    :accentBorders="['none']"
  >
    <button class="nav-btn left" @click="prevImage()"><TinyArrowIcon /></button>
    <img :src="displayImage" alt="image" />
    <button class="nav-btn right" @click="nextImage()"><TinyArrowIcon /></button>
  </ModalPopup>
</template>

<script>
import ModalPopup from './uiComponents/ModalPopup.vue';

export default {
  name: 'ImageViewModal',
  components: { ModalPopup },
  props: ['screenshots', 'index'],

  data() {
    return {
      currentIndex: null
    };
  },

  mounted() {
    this.currentIndex = this.index;
    window.addEventListener('keydown', this.handleKeydown);
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown);
  },

  computed: {
    displayImage() {
      return this.screenshots[this.currentIndex];
    }
  },

  methods: {
    nextImage() {
      if (this.currentIndex + 2 > this.screenshots.length) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    },

    prevImage() {
      if (this.currentIndex - 1 < 0) {
        this.currentIndex = this.screenshots.length - 1;
      } else {
        this.currentIndex--;
      }
    },

    handleKeydown(event) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      }
    }
  }
};
</script>
<style scoped>
.external:deep(.custom) {
  max-width: 1300px;
  max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

img {
  max-height: 100vh;
  max-width: 100vw;
}

.nav-btn.left {
  left: 12px;
  transform: translateY(-50%) rotate(90deg);
}

.nav-btn.right {
  right: 12px;
  transform: translateY(-50%) rotate(-90deg);
}

.nav-btn {
  height: 40px;
  width: 40px;
  position: absolute;
  top: 50%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  svg {
    height: 16px;
    width: 16px;
    transform: translateY(2px);
  }

  &:hover {
    svg {
      filter: var(--hover-filter-effect);
    }
  }
}
</style>

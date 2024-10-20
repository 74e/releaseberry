<template>
  <div class="toast-container">
    <TransitionGroup
      tag="ul"
      class="transition"
      enter-from-class="transition-enter-from"
      enter-active-class="transition-enter-active"
      leave-active-class="transition-leave-active"
      leave-to-class="transition-leave-to"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @before-leave="interacting = true"
      @after-leave="handleAfterLeave"
    >
      <li
        v-for="(toast, index) in toasts"
        ref="toast"
        :key="toast.id"
        :class="['toaster-item', { overlap: index > 2 }]"
        :style="[
          index === 0
            ? { zIndex: toast.id }
            : {
                zIndex: toast.id,
                transform: `scaleX(${Math.max(0, 1 - (index * sOffset) / 100)}) translateY(-${index * yOffset}px)`
              }
        ]"
      >
        <div
          :class="['content', { isError: toast.icon == 'NoticeIcon' }]"
          @click="handleRemoveClick()"
        >
          <component :is="toast.icon" class="icon" />
          <div class="message" v-html="toast.message" />
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { toastStore } from '../state/toastStore';

export default {
  name: 'ToasterComponent',

  inject: ['accentColor'],

  props: {
    scaleOffset: {
      type: Number,
      default: 10
    },

    horizontalOffset: {
      type: Number,
      default: 12
    },

    gap: {
      type: Number,
      default: 16
    }
  },

  data() {
    return {
      outside: true,
      interacting: false,
      sOffset: this.scaleOffset,
      yOffset: this.horizontalOffset,
      yGap: this.gap
    };
  },

  computed: {
    toasts() {
      return toastStore().toasts;
    }
  },

  methods: {
    ...mapActions(toastStore, ['add', 'remove', 'pause', 'resume']),

    handleAddClick() {
      this.add({
        icon: 'NoticeIcon',
        title: 'toastTile',
        message: 'toastmsg'
      });
    },

    resetStack() {
      this.sOffset = this.scaleOffset;
      this.yOffset = this.horizontalOffset;
    },

    handleRemoveClick() {
      this.remove();
      this.resume();
    },

    handleMouseEnter() {
      this.outside = false;
      this.sOffset = 0;
      this.yOffset = this.$refs.toast[0].offsetHeight + this.yGap;

      this.pause();
    },

    handleMouseLeave() {
      this.outside = true;

      if (!this.interacting) {
        this.resetStack();
        this.resume();
      }
    },

    handleAfterLeave() {
      if (this.outside) {
        this.resetStack();
        this.resume();

        this.interacting = false;
      }
    }
  }
};
</script>

<style scoped>
.transition {
  list-style-type: none;
}
.toast-container {
  position: fixed;
  bottom: 4rem;
  left: 0;
  right: 0;
  z-index: 99999;
  margin: 0 auto;
  width: 21rem;

  @media (min-width: 640px) {
    left: auto;
    right: 2.5rem;
    bottom: 1.25rem;
  }
}

.toaster-item {
  position: absolute;
  bottom: 0;
  width: 100%;
  transform-origin: center;
  cursor: pointer;
  user-select: none;
  border-radius: var(--radius-m);
  border-top: 2px solid v-bind(accentColor);
  background-color: var(--dark-50);
  padding: 4px;
  font-weight: 500;
  color: v-bind(accentColor);
  box-shadow: 0px 0px 12px rgba(82, 82, 82, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 100%;
    height: 1rem;
    width: 100%;
    cursor: default;
  }

  &.overlap {
    pointer-events: none;
    opacity: 0;
  }

  .content {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 8px;

    &.isError {
      .icon {
        filter: invert(100%);
      }
    }

    .icon {
      margin-right: 0.75rem;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .message {
      text-align: center;
      width: 100%;
      text-wrap: pretty;
      /* overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; */
    }
  }
}

.transition-enter-from {
  opacity: 0;
  transform: translateY(5rem);
}

.transition-enter-active,
.transition-leave-active {
  transition: all 400ms ease-out;
  pointer-events: none;
}

.transition-leave-to {
  opacity: 0;
  transform: translateY(5rem);
}
</style>

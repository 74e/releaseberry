<template>
  <div class="tab">
    <div @click="toggleVisibility" class="trigger">
      <slot>
        <div @click="$emit('handleTabClick')" :class="['tab-btn', { active, completed }]">
          <h3 v-if="title">{{ title }}</h3>

          <div :class="['wrapper', { active }]">
            <div class="inner">
              <Transition name="fade-custom">
                <span v-if="description && active" class="description">
                  {{ description }}
                </span>
              </Transition>
            </div>
          </div>

          <CheckmarkIcon :class="{ completed }" />
        </div>
      </slot>
    </div>

    <div :class="['wrapper', { active }]">
      <div class="inner">
        <Transition name="fade-custom">
          <slot v-if="active" name="content" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccordionItem',

  inject: ['accentColor'],

  props: {
    title: {
      type: String
    },

    description: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: false
    },

    tabType: {
      type: String,
      default: 'accordion',
      validator: function (value) {
        return ['accordion', 'tab'].indexOf(value) !== -1;
      }
    },

    completed: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      open: true
    };
  },

  computed: {
    active() {
      if (this.tabType === 'tab') return this.open;

      return this.isActive;
    }
  },

  methods: {
    toggleVisibility() {
      if (this.tabType === 'tab') {
        this.open = !this.open;
      }
    }
  }
};
</script>

<style scoped>
.tab {
  .tab-btn {
    padding: 6px 16px;
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: var(--radius-s);
    outline: 1px solid #ffffff28;
    position: relative;
    transition: all 0.3s ease-out;

    h3 {
      font-size: 18px;
      transition: color 0.3s ease-out;
      color: rgba(201, 192, 192, 0.479);
    }

    .under-title {
      display: block;
      font-size: 12px;
      color: rgb(187, 194, 201);
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 24px;
      width: 5px;
      border-radius: 4px;
      background-color: v-bind(accentColor);
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }

    &.active {
      padding: 12px 16px;

      h3 {
        color: rgb(201, 192, 192);
      }

      &::before {
        opacity: 1;
      }
    }

    &.completed {
      outline: 2px solid v-bind(accentColor + '80');
      cursor: pointer;

      h3 {
        color: v-bind(accentColor + 'ce');
      }

      &:hover {
        filter: brightness(125%);
      }
    }

    .checkmark-icon {
      margin-right: 16px;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(calc(-50% + -1.5px));
      opacity: 0;

      &.completed {
        opacity: 1;
      }
    }
  }
}

.fade-custom-enter-from,
.fade-custom-enter-active {
  animation: fadeIn 0.5s ease-out;
}

.fade-custom-leave-to,
.fade-custom-leave-active {
  animation: fadeOut 0.5s ease-out;
}

.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s ease-out;

  &.active {
    grid-template-rows: 1fr;
  }
}

.inner {
  overflow: hidden;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}
</style>

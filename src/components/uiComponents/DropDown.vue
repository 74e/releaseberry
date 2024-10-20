<template>
  <div v-if="selectedValue && optionValues?.length" ref="dropdown" class="drop-down">
    <span :class="['label', labelPosition]">{{ label }}</span>

    <div class="input-preview" @click="handletoggleDropdown">
      {{ targetDisplay ? selectedValue[targetDisplay] : selectedValue }}

      <TinyArrowIcon :class="{ active: isDropDownOpen }" />
    </div>

    <div class="dropdown-options" :class="{ active: isDropDownOpen }">
      <div class="height-auto-fix">
        <div
          class="option"
          @click="selectNewOption(option)"
          v-for="option in optionValues"
          :class="{ active: isActiveValue(option) }"
          :key="option"
        >
          {{ targetDisplay ? option[targetDisplay] : option }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropDown',

  inject: ['accentColor'],

  props: {
    label: {
      type: String,
      default: ''
    },

    labelPosition: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'center'].includes(value);
      }
    },

    selectedValue: {
      type: [Object, String, null],
      default: null,
      required: true
    },

    optionValues: {
      type: [Array, null],
      default: null,
      required: true
    },

    targetDisplay: {
      type: [String, null],
      default: null
    },

    targetIdentifier: {
      type: [String, null],
      default: null
    },

    width: {
      type: String,
      default: '230'
    },

    dropdownCount: {
      type: Number,
      default: 3,
      validator(value) {
        return value > 0;
      }
    },

    padding: {
      type: String,
      default: '12'
    }
  },

  data() {
    return {
      isDropDownOpen: false
    };
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  computed: {
    selectedValueComputed() {
      if (this.targetIdentifier) {
        return this.targetIdentifier;
      } else {
        return this.targetDisplay
          ? this.selectedValue[this.targetDisplay]
          : this.selectedValue;
      }
    }
  },

  methods: {
    handletoggleDropdown() {
      this.isDropDownOpen = !this.isDropDownOpen;
    },

    selectNewOption(option) {
      if (this.isActiveValue(option)) return;

      this.$emit('update:selectedValue', option);
      this.$emit('onSelect');

      this.isDropDownOpen = false;
    },

    handleClickOutside(e) {
      if (!this.$refs.dropdown.contains(e.target) && this.$refs.dropdown !== e.target) {
        this.isDropDownOpen = false;
      }
    },

    selecteedValueComputed() {
      if (this.targetIdentifier) {
        return this.selectedValue[this.targetIdentifier];
      } else {
        return this.targetDisplay
          ? this.selectedValue[this.targetDisplay]
          : this.selectedValue;
      }
    },

    isActiveValue(option) {
      if (this.targetIdentifier) {
        return (
          this.selectedValue[this.targetIdentifier] === option[this.targetIdentifier]
        );
      } else if (this.targetDisplay) {
        return this.selectedValue[this.targetDisplay] === option[this.targetDisplay];
      } else {
        return this.selectedValue === option;
      }
    }
  }
};
</script>

<style scoped>
ul,
li {
  text-decoration: none;
  list-style-type: none;
}

.drop-down {
  position: relative;
  height: fit-content;

  .label {
    width: fit-content;
    display: block;
    font-size: 14px;

    &.default {
      margin: 0 0 4px 16px;
    }

    &.center {
      margin: 0 auto 4px auto;
    }
  }

  .input-preview {
    width: v-bind(width + 'px');
    border-radius: 8px;
    padding: v-bind(padding + 'px') 16px;
    background-color: var(--dark-fg);
    border: 1px solid rgba(255, 255, 255, 0.123);
    display: flex;
    align-items: center;
    position: relative;
    transition: background-color 0.3s ease-out;
    cursor: pointer;
    text-wrap: nowrap;

    .tiny-arrow-icon {
      width: 13px;
      height: 13px;
      position: absolute;
      right: 0;
      margin-right: 16px;

      transform: rotateZ(90deg);
      transition: all 0.15s ease-out;

      &.active {
        transform: rotateZ(0deg);
      }
    }

    &:hover {
      background-color: rgb(15, 15, 15);
    }
  }

  .dropdown-options {
    width: v-bind(width + 'px');
    border-radius: 8px;
    position: absolute;
    margin-top: 6px;
    top: 100%;
    left: 0;
    background-color: var(--dark-fg);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border: 0px solid rgba(255, 255, 255, 0.041);
    padding: 0 8px;
    display: grid;
    grid-template-rows: 0fr;
    transition: all 0.3s ease-out;
    z-index: 2;
    position: absolute;
    backdrop-filter: blur(10px);

    &.active {
      grid-template-rows: 1fr;
      border-width: 1px;
      border: 1px solid rgba(255, 255, 255, 0.123);
    }

    .height-auto-fix {
      overflow-y: scroll;
      max-height: calc(16px + (44px * v-bind(dropdownCount)));

      .option {
        border-radius: 8px;
        padding: 12px 8px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0);
        transition: all 0.15s ease-out;
        position: relative;

        &:first-child {
          margin-top: 8px;
        }

        &:last-child {
          margin-bottom: 8px;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.16);
        }

        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 4px;
          height: 18px;
          border-radius: 3px;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background-color: v-bind(accentColor);
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }

        &.active::before {
          opacity: 1;
        }
      }
    }
  }
}
</style>

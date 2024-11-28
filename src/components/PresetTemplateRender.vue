<template>
  <div class="render-container" v-if="preset">
    <div
      :class="[
        'property-section',
        { individual: isComponent(property), top: key === 'displaySettings' }
      ]"
      v-for="(property, key) in configCopy"
      :key="key"
    >
      <span class="property-label">{{ camelCaseToWords(key) }}</span>
      <div class="property">
        <template v-if="isComponent(property)">
          <component
            :is="property.componentType"
            :orignialObj="property"
            :alphaChannel="true"
            v-model="property.value"
          />
        </template>
        <template v-else>
          <template v-for="(nestedProperty, nestedKey) in property" :key="nestedKey">
            <div
              :class="[
                'sub-property',
                { toggle: nestedProperty.componentType === 'ToggleInput' }
              ]"
            >
              <span class="sub-property-label">{{ camelCaseToWords(nestedKey) }}</span>
              <component
                :is="nestedProperty.componentType"
                :orignialObj="nestedProperty"
                v-model="nestedProperty.value"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { camelCaseToWords } from '../helperFunctions/common';
import ColorPicker from './uiComponents/ColorPicker.vue';
import SliderInput from './uiComponents/SliderInput.vue';
import ToggleInput from './uiComponents/ToggleInput.vue';

export default {
  name: 'PresetTemplateRender',

  components: {
    ColorPicker,
    SliderInput,
    ToggleInput
  },

  props: {
    preset: {
      type: [Object, null],
      required: true
    }
  },

  mounted() {
    this.copyPreset();
  },

  data() {
    return {
      name: null,
      configCopy: {}
    };
  },

  watch: {
    preset() {
      this.copyPreset();
    }
  },

  methods: {
    camelCaseToWords,

    isComponent(obj) {
      return Object.keys(obj).some((property) => property === 'componentType');
    },

    isSliderObj(obj) {
      return obj.componentType === 'SilderInput' ? obj : obj.value;
    },

    copyPreset() {
      /* eslint-disable no-unused-vars */
      const { name, ...preset } = this.preset.config;
      /* eslint-enable no-unused-vars */

      this.name = name;
      this.configCopy = preset;
    }
  }
};
</script>

<style scoped>
.render-container {
  display: flex;
  flex-direction: column;
}

.property-section {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.123);
  border-radius: 12px;
  margin-bottom: 12px;

  .property-label {
    font-size: 16px;
  }

  &.individual {
    display: flex;
    align-items: center;
  }

  &.top {
    order: -1;
  }
}

.property {
  padding: 8px 0 8px 8px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.sub-property {
  position: relative;
  margin-top: 18px;

  .sub-property-label {
    display: inline-block;
    position: absolute;
    bottom: 100%;
    width: max-content;
    font-size: 15px;
    display: block;
    margin: 0 0 2px 12px;
    color: rgba(255, 255, 255, 0.658);
  }

  &.toggle {
    display: flex;
    align-items: center;
    margin: 0;

    .sub-property-label {
      font-size: 15px;
      position: static;
      display: block;
      margin: 0 6px 0 8px;
    }
  }
}
</style>

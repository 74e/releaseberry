<template>
  <div v-if="preset">
    <div
      :class="['property-section', { individual: isComponent(property) }]"
      v-for="(property, key) in presetCopy"
      :key="key"
    >
      <span class="property-label">{{ convertToWords(key) }}</span>
      <div class="property">
        <template v-if="isComponent(property)">
          <component
            :is="property.componentType"
            :orignialObj="property"
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
              <span class="sub-property-label">{{ convertToWords(nestedKey) }}</span>
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
import camelCaseToWords from '../helperFunctions/camelCaseToWords'
import ColorPicker from './uiComponents/ColorPicker.vue'
import SliderInput from './uiComponents/SliderInput.vue'
import ToggleInput from './uiComponents/ToggleInput.vue'

export default {
  name: 'PresetTemplateRenderComponent',

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
    this.copyPreset()
  },

  data() {
    return {
      name: null,
      presetCopy: {}
    }
  },

  watch: {
    preset() {
      this.copyPreset()
    }
  },

  methods: {
    isComponent(obj) {
      return Object.keys(obj).some((property) => property === 'componentType')
    },

    isSliderObj(obj) {
      return obj.componentType === 'SilderInput' ? obj : obj.value
    },

    copyPreset() {
      /* eslint-disable no-unused-vars */
      const { id, name, ...preset } = this.preset
      /* eslint-enable no-unused-vars */

      this.name = name
      this.presetCopy = preset
    },

    convertToWords(value) {
      return camelCaseToWords(value)
    }
  }
}
</script>

<style scoped>
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
}

.property {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 0 8px 8px;
}

.sub-property {
  .sub-property-label {
    font-size: 15px;
    display: block;
    margin: 0 0 2px 12px;
    color: rgba(255, 255, 255, 0.658);
  }

  &.toggle {
    display: flex;
    align-items: center;

    .sub-property-label {
      font-size: 15px;
      display: block;
      margin: 0 6px 0 8px;
    }
  }
}
</style>

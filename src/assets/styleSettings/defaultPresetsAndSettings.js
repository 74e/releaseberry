// function uuid() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//     (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
//   )
// }

export default {
  releaseBerryStandard: {
    name: 'Release Berry',
    component: 'ReleaseBerryDefaultCard',
    presetTemplateConfig: {
      displaySettings: {
        showTitle: { componentType: 'ToggleInput' }
      },
      cardBackground: {
        gradientColorOne: { componentType: 'ColorPicker' },
        gradientColorTwo: { componentType: 'ColorPicker' },
        gradientDirection: { componentType: 'SliderInput', min: 0, max: 360 },
        edgeGradientColor: { componentType: 'ColorPicker' },
        edgeGradientSoftness: { componentType: 'SliderInput', min: 0, max: 50 },
        edgeGradientSize: { componentType: 'SliderInput', min: -10, max: 20 }
      },
      cardProperties: {
        titleColor: { componentType: 'ColorPicker' },
        innerBorderSize: { componentType: 'SliderInput', min: 0, max: 4 },
        innerBorderColor: { componentType: 'ColorPicker' },
        thickness: { componentType: 'SliderInput', min: 0, max: 6 },
        thicknessColor: { componentType: 'ColorPicker' },
        cornerRadius: { componentType: 'SliderInput', min: 0, max: 20 }
      },
      counterBackground: {
        gradientColorOne: { componentType: 'ColorPicker' },
        gradientColorTwo: { componentType: 'ColorPicker' },
        gradientDirection: { componentType: 'SliderInput', min: 0, max: 360 }
      },
      counterProperties: {
        counterTextColor: { componentType: 'ColorPicker' },
        borderColor: { componentType: 'ColorPicker' },
        borderSize: { componentType: 'SliderInput', min: 0, max: 4 },
        thickness: { componentType: 'SliderInput', min: 0, max: 6 },
        thicknessColor: { componentType: 'ColorPicker' },
        cornerRadius: { componentType: 'SliderInput', min: 0, max: 20 }
      },
      coverProperties: {
        borderColor: { componentType: 'ColorPicker' },
        borderSize: { componentType: 'SliderInput', min: 0, max: 4 },
        thickness: { componentType: 'SliderInput', min: 0, max: 6 },
        thicknessColor: { componentType: 'ColorPicker' },
        cornerRadius: { componentType: 'SliderInput', min: 0, max: 20 }
      }
    },
    presets: [
      {
        id: 'e4d7c1c9-2098-482a-b6d7-580e3aced5ea',
        name: 'Release Berry Blue',
        displaySettings: {
          showTitle: { value: true }
        },
        cardBackground: {
          gradientColorOne: { value: [39, 194, 212, 0.25] },
          gradientColorTwo: { value: [0, 138, 192, 0.25] },
          gradientDirection: { value: 328 },
          edgeGradientColor: { value: [102, 188, 205, 0.66] },
          edgeGradientSoftness: { value: 31.6 },
          edgeGradientSize: { value: 2 }
        },
        cardProperties: {
          titleColor: { value: [255, 255, 255, 0.647] },
          innerBorderSize: { value: 1 },
          innerBorderColor: { value: [102, 188, 205, 0.66] },
          thickness: { value: 3 },
          thicknessColor: { value: [13, 77, 87, 0.75] },
          cornerRadius: { value: 4 }
        },
        counterBackground: {
          gradientColorOne: { value: [39, 194, 212, 0.25] },
          gradientColorTwo: { value: [0, 138, 192, 0.25] },
          gradientDirection: { value: 328 }
        },
        counterProperties: {
          counterTextColor: { value: [6, 214, 255, 0.847] },
          borderColor: { value: [102, 188, 205, 0.66] },
          borderSize: { value: 1 },
          thickness: { value: 3 },
          thicknessColor: { value: [13, 77, 87, 0.75] },
          cornerRadius: { value: 4 }
        },
        coverProperties: {
          borderColor: { value: [102, 188, 205, 0.66] },
          borderSize: { value: 1 },
          thickness: { value: 3 },
          thicknessColor: { value: [13, 77, 87, 0.75] },
          cornerRadius: { value: 4 }
        }
      }
    ]
  },

  releaseBerryMinimal: {
    name: 'Release Berry Minimal',
    component: 'ReleaseBerryMinimalCard',
    presetTemplateConfig: {
      displaySettings: {
        showTitle: { componentType: 'ToggleInput' },
        showBackdrop: { componentType: 'ToggleInput' }
      },
      cardBackground: {
        gradientColorOne: { componentType: 'ColorPicker' },
        gradientColorTwo: { componentType: 'ColorPicker' },
        gradientDirection: { componentType: 'SliderInput', min: 0, max: 360 }
      },
      cardProperties: {
        titleColor: { componentType: 'ColorPicker' },
        counterColor: { componentType: 'ColorPicker' },
        thickness: { componentType: 'SliderInput', min: 0, max: 6 },
        thicknessColor: { componentType: 'ColorPicker' },
        borderColor: { componentType: 'ColorPicker' }
      },
      backdrop: {
        gradientColorOne: { componentType: 'ColorPicker' },
        gradientColorTwo: { componentType: 'ColorPicker' },
        gradientDirection: { componentType: 'SliderInput', min: 0, max: 360 },
        innerBorderColor: { componentType: 'ColorPicker' }
      }
    },
    presets: [
      {
        id: '895e838e-8b45-4b6a-ac73-79b6f54b7fac',
        name: 'Release Berry Blue',
        displaySettings: {
          showTitle: { value: false },
          showBackdrop: { value: false }
        },
        cardBackground: {
          gradientColorOne: { value: [39, 194, 212, 0.4] },
          gradientColorTwo: { value: [0, 138, 192, 0.4] },
          gradientDirection: { value: 328 }
        },
        cardProperties: {
          titleColor: { value: [255, 255, 255, 0.647] },
          counterColor: { value: [6, 214, 255, 0.847] },
          thickness: { value: 3 },
          thicknessColor: { value: [13, 77, 87, 0.75] },
          borderColor: { value: [102, 188, 205, 0.66] }
        },
        backdrop: {
          gradientColorOne: { value: [39, 194, 212, 0.4] },
          gradientColorTwo: { value: [0, 138, 192, 0.4] },
          gradientDirection: { value: 328 },
          innerBorderColor: { value: [102, 188, 205, 0.66] }
        }
      }
    ]
  }
}

function injectTemplateConfig(templates) {
  for (const cardName in templates) {
    const templateConfig = templates[cardName].presetTemplateConfig
    const targetCardPresets = templates[cardName].presets

    for (let i = 0; i < targetCardPresets.length; i++) {
      for (const config in targetCardPresets[i]) {
        if (targetCardPresets[i][config].value) {
          targetCardPresets[i][config] = {
            ...templateConfig[config],
            ...targetCardPresets[i][config]
          }
        } else {
          for (const nestedConfig in targetCardPresets[i][config]) {
            if (typeof targetCardPresets[i][config][nestedConfig] === 'object') {
              targetCardPresets[i][config][nestedConfig] = {
                ...templateConfig[config][nestedConfig],
                ...targetCardPresets[i][config][nestedConfig]
              }
            }
          }
        }
      }
    }
  }
}

export default injectTemplateConfig

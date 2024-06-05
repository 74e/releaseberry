const releaseBerryStandard = {
  settings: {
    showTitle: true,
    timerFormat: 'dd:hh:ss'
  },
  presets: [
    {
      name: 'Release Berry Blue',
      backgroundTint: {
        colorOne: { R: 39, G: 194, B: 212, A: 0.25 },
        colorTwo: { R: 0, G: 138, B: 192, A: 0.25 }
      },
      edgeGradient: {
        color: { R: 102, G: 188, B: 205, A: 0.66 },
        blur: 31.6,
        spread: 2
      },
      timerFontColor: { R: 6, G: 214, B: 255, A: 0.847 },
      borderAccent: { R: 102, G: 188, B: 205, A: 0.66 },
      fakeDepth: {
        color: { R: 13, G: 77, B: 87, A: 0.75 },
        width: 3
      }
    }
  ]
}

const releaseBerryMinimal = {
  settings: {
    showTitle: false,
    showBackdrop: false,
    timerFormat: 'dd:hh:ss'
  },
  presets: [
    {
      name: 'Release Berry Blue Minimal',
      backgroundTint: {
        colorOne: { R: 39, G: 194, B: 212, A: 0.4 },
        colorTwo: { R: 0, G: 138, B: 192, A: 0.4 }
      },
      timerFontColor: { R: 6, G: 214, B: 255, A: 0.847 },
      borderAccent: { R: 102, G: 188, B: 205, A: 0.66 },
      fakeDepth: {
        color: { R: 13, G: 77, B: 87, A: 0.75 },
        width: 3
      }
    }
  ]
}

export { releaseBerryStandard, releaseBerryMinimal }

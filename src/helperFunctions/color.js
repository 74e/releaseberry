const ColorConverter = {
  hexToRgba(hex) {
    hex = hex.replace(/^#/, '')
    let bigint
    let r,
      g,
      b,
      a = 1

    if (hex.length === 8) {
      bigint = parseInt(hex, 16)
      r = (bigint >> 24) & 255
      g = (bigint >> 16) & 255
      b = (bigint >> 8) & 255
      a = (bigint & 255) / 255
    } else if (hex.length === 6) {
      bigint = parseInt(hex, 16)
      r = (bigint >> 16) & 255
      g = (bigint >> 8) & 255
      b = bigint & 255
    } else {
      return false
    }

    return [Math.round(r), Math.round(g), Math.round(b), Number(a.toFixed(2))]
  },

  rgbaToHsla(r, g, b, a = 1) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100),
      Number(a.toFixed(2))
    ]
  },

  hexToHsla(hex) {
    const [r, g, b, a] = this.hexToRgba(hex)
    return this.rgbaToHsla(r, g, b, a)
  },

  hslaToRgba(h, s, l, a = 1) {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]
  },

  rgbaToHex(r, g, b, a = 1) {
    const hexR = r.toString(16).padStart(2, '0')
    const hexG = g.toString(16).padStart(2, '0')
    const hexB = b.toString(16).padStart(2, '0')
    const hexA = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
    return `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase()
  },

  hslaToHex(h, s, l, a = 1) {
    const [r, g, b, alpha] = this.hslaToRgba(h, s, l, a)
    return this.rgbaToHex(r, g, b, alpha)
  }
}

export default ColorConverter

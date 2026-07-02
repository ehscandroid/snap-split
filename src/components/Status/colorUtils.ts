const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '')
  return [
    parseInt(value.substring(0, 2), 16),
    parseInt(value.substring(2, 4), 16),
    parseInt(value.substring(4, 6), 16),
  ]
}

export const lighten = (hex: string, ratio: number): string => {
  const [r, g, b] = hexToRgb(hex)
  const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

export const darken = (hex: string, ratio: number): string => {
  const [r, g, b] = hexToRgb(hex)
  const mix = (channel: number) => Math.round(channel * (1 - ratio))
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

export const withAlpha = (hex: string, alphaHex: string): string => `${hex}${alphaHex}`

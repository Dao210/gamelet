export function createSeededRandom(seed: string | number) {
  const text = String(seed)
  let value = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffled<T>(items: readonly T[], random: () => number) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const held = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = held
  }
  return result
}

export function dateSeed(namespace: string, date = new Date()) {
  return `${namespace}:${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
}

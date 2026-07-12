export const INSTRUMENT_IDS = [
  'shadow-cartographer',
  'mobius-mailroom',
  'echo-orchard',
  'gravity-grammar',
  'rule-fossil',
  'clockwork-alibi'
] as const

export type InstrumentId = (typeof INSTRUMENT_IDS)[number]
export type Difficulty = 'easy' | 'standard' | 'hard'

export interface InstrumentMeta {
  id: InstrumentId
  file: string
  title: string
  titleZh: string
  subtitle: string
  subtitleZh: string
  accent: string
  route: `/${InstrumentId}`
  glyph: string
}

export const INSTRUMENTS: Record<InstrumentId, InstrumentMeta> = {
  'shadow-cartographer': { id: 'shadow-cartographer', file: '13-A', title: 'Shadow Cartographer', titleZh: '影子制图仪', subtitle: 'Draw with the absence of light', subtitleZh: '用光的缺席绘制地图', accent: '#ffb347', route: '/shadow-cartographer', glyph: '◐' },
  'mobius-mailroom': { id: 'mobius-mailroom', file: '13-B', title: 'Möbius Mailroom', titleZh: '莫比乌斯邮局', subtitle: 'Deliver across both sides of space', subtitleZh: '穿越空间正反两面完成投递', accent: '#56d6c9', route: '/mobius-mailroom', glyph: '∞' },
  'echo-orchard': { id: 'echo-orchard', file: '13-C', title: 'Echo Orchard', titleZh: '回声果园', subtitle: 'Predict how memory transforms itself', subtitleZh: '预测记忆如何改变自身', accent: '#a9e34b', route: '/echo-orchard', glyph: '♬' },
  'gravity-grammar': { id: 'gravity-grammar', file: '13-D', title: 'Gravity Grammar', titleZh: '重力语法机', subtitle: 'Write the laws that move matter', subtitleZh: '书写推动物质的规则', accent: '#ef8354', route: '/gravity-grammar', glyph: '¶' },
  'rule-fossil': { id: 'rule-fossil', file: '13-E', title: 'Rule Fossil', titleZh: '规则化石台', subtitle: 'Excavate a hidden law with experiments', subtitleZh: '通过实验发掘隐藏规律', accent: '#d4a373', route: '/rule-fossil', glyph: '⌬' },
  'clockwork-alibi': { id: 'clockwork-alibi', file: '13-F', title: 'Clockwork Alibi', titleZh: '发条不在场证明', subtitle: 'Build a timeline that keeps every witness true', subtitleZh: '构建让所有证词成立的时间线', accent: '#e76f8a', route: '/clockwork-alibi', glyph: '◷' }
}

export interface InstrumentProgress {
  version: 1
  completed: Partial<Record<InstrumentId, number>>
  bestScores: Partial<Record<InstrumentId, number>>
}

export const EMPTY_INSTRUMENT_PROGRESS: InstrumentProgress = { version: 1, completed: {}, bestScores: {} }
export const INSTRUMENT_PROGRESS_KEY = 'gamelet:impossible-instruments:v1'

export { createSeededRandom, shuffled } from '@/lib/puzzle-core/random'

export function dailySeed(id: InstrumentId, date = new Date()) {
  const day = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
  return `${id}:${day}`
}

export function parseInstrumentProgress(value: string | null): InstrumentProgress {
  if (!value) return EMPTY_INSTRUMENT_PROGRESS
  try {
    const parsed = JSON.parse(value) as Partial<InstrumentProgress>
    if (parsed.version !== 1 || typeof parsed.completed !== 'object' || typeof parsed.bestScores !== 'object') return EMPTY_INSTRUMENT_PROGRESS
    return { version: 1, completed: parsed.completed ?? {}, bestScores: parsed.bestScores ?? {} }
  } catch {
    return EMPTY_INSTRUMENT_PROGRESS
  }
}

export function updateInstrumentProgress(progress: InstrumentProgress, id: InstrumentId, completed: number, score: number): InstrumentProgress {
  return {
    version: 1,
    completed: { ...progress.completed, [id]: Math.max(progress.completed[id] ?? 0, completed) },
    bestScores: { ...progress.bestScores, [id]: Math.max(progress.bestScores[id] ?? 0, score) }
  }
}

import { createSeededRandom } from '@/lib/puzzle-core/random'

export type FoldDirection = 'left' | 'right' | 'up' | 'down'
export interface PaperLayer { id: string; face: 0 | 1 }
export interface PaperState { width: number; height: number; stacks: PaperLayer[][] }
export interface FoldTarget { first: string; second: string }
export interface FoldLevel { seed: string; initial: PaperState; targets: FoldTarget[]; solution: FoldDirection[] }

export function createPaper(width: number, height: number): PaperState {
  return { width, height, stacks: Array.from({ length: width * height }, (_, index) => [{ id: `p${index}`, face: 0 }]) }
}

const flipStack = (stack: PaperLayer[]) => stack.slice().reverse().map((layer) => ({ ...layer, face: (1 - layer.face) as 0 | 1 }))
const at = (state: PaperState, row: number, col: number) => state.stacks[row * state.width + col]

export function availableFolds(state: PaperState): FoldDirection[] {
  const folds: FoldDirection[] = []
  if (state.width > 1 && state.width % 2 === 0) folds.push('left', 'right')
  if (state.height > 1 && state.height % 2 === 0) folds.push('up', 'down')
  return folds
}

export function foldPaper(state: PaperState, direction: FoldDirection): PaperState | null {
  if (!availableFolds(state).includes(direction)) return null
  const horizontal = direction === 'left' || direction === 'right'
  const width = horizontal ? state.width / 2 : state.width
  const height = horizontal ? state.height : state.height / 2
  const stacks: PaperLayer[][] = []
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (direction === 'left') stacks.push([...at(state, row, width + col), ...flipStack(at(state, row, width - 1 - col))])
      else if (direction === 'right') stacks.push([...at(state, row, col), ...flipStack(at(state, row, state.width - 1 - col))])
      else if (direction === 'up') stacks.push([...at(state, height + row, col), ...flipStack(at(state, height - 1 - row, col))])
      else stacks.push([...at(state, row, col), ...flipStack(at(state, state.height - 1 - row, col))])
    }
  }
  return { width, height, stacks }
}

export function applyFoldSequence(initial: PaperState, sequence: FoldDirection[]) {
  return sequence.reduce<PaperState | null>((state, direction) => state ? foldPaper(state, direction) : null, initial)
}

export function isFoldSolved(state: PaperState, targets: FoldTarget[]) {
  return targets.every((target) => state.stacks.some((stack) => {
    const ids = new Set(stack.map((layer) => layer.id))
    return ids.has(target.first) && ids.has(target.second)
  }))
}

const stateKey = (state: PaperState) => `${state.width}x${state.height}:${state.stacks.map((stack) => stack.map((layer) => `${layer.id}${layer.face}`).join('.')).join('|')}`

export function findFoldSolution(initial: PaperState, targets: FoldTarget[], maxDepth = 6) {
  if (isFoldSolved(initial, targets)) return []
  const queue: Array<{ state: PaperState; path: FoldDirection[] }> = [{ state: initial, path: [] }]
  const visited = new Set([stateKey(initial)])
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]
    if (current.path.length >= maxDepth) continue
    for (const direction of availableFolds(current.state)) {
      const state = foldPaper(current.state, direction)!
      const key = stateKey(state)
      if (visited.has(key)) continue
      const path = [...current.path, direction]
      if (isFoldSolved(state, targets)) return path
      visited.add(key)
      queue.push({ state, path })
    }
  }
  return null
}

export function generateFoldLevel(seed: string, width = 4, height = 4, steps = 2): FoldLevel {
  const random = createSeededRandom(seed)
  const initial = createPaper(width, height)
  const solution: FoldDirection[] = []
  let state = initial
  for (let index = 0; index < steps; index += 1) {
    const options = availableFolds(state)
    if (!options.length) break
    const direction = options[Math.floor(random() * options.length)]
    solution.push(direction)
    state = foldPaper(state, direction)!
  }
  const candidates = state.stacks.filter((stack) => stack.length >= 2)
  const targets = candidates.slice(0, Math.min(3, candidates.length)).map((stack) => ({ first: stack[0].id, second: stack.at(-1)!.id }))
  return { seed, initial, targets, solution }
}

export const FOLD_FIXED_LEVELS: FoldLevel[] = [
  generateFoldLevel('fold-fixed-1', 4, 4, 1),
  generateFoldLevel('fold-fixed-2', 4, 4, 1),
  generateFoldLevel('fold-fixed-3', 4, 4, 2),
  generateFoldLevel('fold-fixed-4', 4, 8, 2),
  generateFoldLevel('fold-fixed-5', 8, 4, 3),
  generateFoldLevel('fold-fixed-6', 8, 8, 4)
]

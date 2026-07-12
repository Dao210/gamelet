import { createSeededRandom, shuffled } from '@/lib/puzzle-core/random'

export type ProofValue = 'stable' | 'anomaly'
export type ProofBoard = Array<ProofValue | null>
export interface ProofClue { id: string; cells: number[]; requiredStable: number; label: string }
export interface ProofLevel { seed: string; size: number; solution: ProofValue[]; initial: ProofBoard; clues: ProofClue[] }
export interface ProofMove { cell: number; value: ProofValue; clueId: string; reason: string }

const isStable = (value: ProofValue) => value === 'stable'

export function getProvableMoves(board: ProofBoard, clues: ProofClue[]): ProofMove[] {
  const moves = new Map<number, ProofMove>()
  clues.forEach((clue) => {
    const unknown = clue.cells.filter((cell) => board[cell] === null)
    if (!unknown.length) return
    const knownStable = clue.cells.filter((cell) => board[cell] === 'stable').length
    const remaining = clue.requiredStable - knownStable
    if (remaining === 0 || remaining === unknown.length) {
      const value: ProofValue = remaining === 0 ? 'anomaly' : 'stable'
      unknown.forEach((cell) => {
        if (!moves.has(cell)) moves.set(cell, { cell, value, clueId: clue.id, reason: remaining === 0 ? `${clue.label} already has all required stable organisms.` : `${clue.label} needs every unresolved organism to be stable.` })
      })
    }
  })
  return [...moves.values()]
}

export function applyProofMove(board: ProofBoard, move: ProofMove) {
  if (board[move.cell] !== null) return board
  return board.map((value, index) => index === move.cell ? move.value : value)
}

export function isProofSolved(board: ProofBoard, level: ProofLevel) {
  return board.length === level.solution.length && board.every((value, index) => value === level.solution[index])
}

export function generateProofLevel(seed: string, size = 4): ProofLevel {
  const random = createSeededRandom(seed)
  const cellCount = size * size
  const solution: ProofValue[] = Array.from({ length: cellCount }, () => random() > 0.45 ? 'stable' : 'anomaly')
  const order = shuffled(Array.from({ length: cellCount }, (_, index) => index), random)
  const initial: ProofBoard = Array(cellCount).fill(null)
  initial[order[0]] = solution[order[0]]
  const clues: ProofClue[] = []
  for (let index = 1; index < order.length; index += 1) {
    const cells = [order[index - 1], order[index]]
    clues.push({ id: `chain-${index}`, cells, requiredStable: cells.filter((cell) => isStable(solution[cell])).length, label: `Link ${String(index).padStart(2, '0')}` })
  }
  for (let row = 0; row < size; row += 1) {
    const cells = Array.from({ length: size }, (_, col) => row * size + col)
    clues.push({ id: `row-${row}`, cells, requiredStable: cells.filter((cell) => isStable(solution[cell])).length, label: `Habitat row ${row + 1}` })
  }
  return { seed, size, solution, initial, clues }
}

export const PROOF_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateProofLevel(`proof-fixed-${index + 1}`, index < 2 ? 4 : index < 5 ? 5 : 6))

export function solveProofLevel(level: ProofLevel) {
  let board = [...level.initial]
  const proof: ProofMove[] = []
  while (!isProofSolved(board, level)) {
    const move = getProvableMoves(board, level.clues).find((candidate) => board[candidate.cell] === null)
    if (!move) return null
    board = applyProofMove(board, move)
    proof.push(move)
    if (proof.length > level.solution.length) return null
  }
  return proof
}

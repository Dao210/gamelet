import { createSeededRandom, dateSeed } from '@/lib/puzzle-core/random'

export interface RoomClue { id: string; encoded: string; detail: string; detailZh: string }
export interface RoomPuzzle { seed: string; code: number[]; clues: RoomClue[] }

export function generateRoomPuzzle(seed = dateSeed('room-nineteen')): RoomPuzzle {
  const random = createSeededRandom(seed)
  const code = Array.from({ length: 4 }, () => Math.floor(random() * 10))
  const clues: RoomClue[] = [
    { id: 'brass', encoded: String((code[0] + 3) % 10), detail: 'The brass plate reads three steps ahead of the truth.', detailZh: '黄铜铭牌显示的数字比真值向前走了三步。' },
    { id: 'moth', encoded: code[1] === 0 ? '○' : '●'.repeat(code[1]), detail: 'Count the dark moth eyes. An empty eye means zero.', detailZh: '数一数飞蛾的黑色眼睛；空心眼代表零。' },
    { id: 'clock', encoded: `${code[2] + 4} − 4`, detail: 'The clock refuses to perform its final subtraction.', detailZh: '时钟拒绝完成最后一次减法。' },
    { id: 'mirror', encoded: String(9 - code[3]), detail: 'The mirror complements every digit to nine.', detailZh: '镜子会把每个数字变成与它相加等于九的数字。' }
  ]
  return { seed, code, clues }
}

export function isRoomCodeCorrect(input: number[], puzzle: RoomPuzzle) {
  return input.length === puzzle.code.length && input.every((digit, index) => digit === puzzle.code[index])
}

export function roomShareGrid(puzzle: RoomPuzzle, attempts: number, emergencyReveals: number) {
  return `ROOM 19 ${puzzle.seed.split(':').at(-1)}\n${'◆'.repeat(Math.max(1, 5 - attempts))}${'◇'.repeat(Math.min(4, attempts))} · ${emergencyReveals} interventions`
}

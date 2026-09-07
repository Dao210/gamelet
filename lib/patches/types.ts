export type Difficulty = 'easy' | 'medium' | 'hard'
export type Shape = 'any' | 'square' | 'wide' | 'tall'
export type Mode = 'practice' | 'daily' | 'learn'
export type Rect = readonly [top: number, left: number, bottom: number, right: number]
export interface Clue { readonly cell: number; readonly area: number | null; readonly shape: Shape }
export interface HintStep { readonly clue: number; readonly rule: 'single' | 'cover'; readonly cell?: number }
export interface Puzzle {
  readonly id: string
  readonly version: 1
  readonly rows: number
  readonly cols: number
  readonly difficulty: Difficulty
  readonly clues: readonly Clue[]
  readonly solution: readonly Rect[]
  readonly hints: readonly HintStep[]
  readonly score: number
}
export interface PlayState {
  readonly rects: readonly Rect[]
  readonly past: readonly (readonly Rect[])[]
  readonly future: readonly (readonly Rect[])[]
}
export type PlacementError = 'bounds' | 'overlap' | 'clue' | 'area' | 'shape'

import type { MazeLevel } from './mirror-maze-engine'

export const MIRROR_MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1, name: 'First Light', hint: 'Two reflections make a clean corner.', size: 5, par: 2,
    source: { row: 2, col: 0, direction: 'right' }, target: { row: 0, col: 0 },
    mirrors: [
      { id: '1-a', row: 2, col: 2, orientation: '\\' },
      { id: '1-b', row: 0, col: 2, orientation: '/' }
    ],
    blockers: [{ row: 2, col: 4 }]
  },
  {
    id: 2, name: 'Blue Shift', hint: 'Climb first, then send the beam west.', size: 6, par: 2,
    source: { row: 4, col: 0, direction: 'right' }, target: { row: 1, col: 0 },
    mirrors: [
      { id: '2-a', row: 4, col: 3, orientation: '\\' },
      { id: '2-b', row: 1, col: 3, orientation: '/' },
      { id: '2-c', row: 3, col: 5, orientation: '/', locked: true }
    ],
    blockers: [{ row: 4, col: 5 }, { row: 0, col: 3 }]
  },
  {
    id: 3, name: 'Long Exposure', hint: 'Trace the light around the outer edge.', size: 6, par: 2,
    source: { row: 0, col: 0, direction: 'down' }, target: { row: 0, col: 5 },
    mirrors: [
      { id: '3-a', row: 4, col: 0, orientation: '/' },
      { id: '3-b', row: 4, col: 5, orientation: '\\' },
      { id: '3-c', row: 2, col: 3, orientation: '/', locked: true }
    ],
    blockers: [{ row: 5, col: 0 }, { row: 4, col: 3 }]
  },
  {
    id: 4, name: 'Prism Alley', hint: 'Build a zig-zag through the dark glass.', size: 7, par: 3,
    source: { row: 6, col: 0, direction: 'right' }, target: { row: 0, col: 6 },
    mirrors: [
      { id: '4-a', row: 6, col: 2, orientation: '\\' },
      { id: '4-b', row: 3, col: 2, orientation: '/' },
      { id: '4-c', row: 3, col: 6, orientation: '\\' },
      { id: '4-d', row: 1, col: 4, orientation: '/', locked: true }
    ],
    blockers: [{ row: 6, col: 5 }, { row: 0, col: 2 }, { row: 3, col: 4 }]
  },
  {
    id: 5, name: 'Night Circuit', hint: 'Four turns. No wasted light.', size: 7, par: 4,
    source: { row: 1, col: 0, direction: 'right' }, target: { row: 5, col: 6 },
    mirrors: [
      { id: '5-a', row: 1, col: 2, orientation: '\\' },
      { id: '5-b', row: 4, col: 2, orientation: '/' },
      { id: '5-c', row: 4, col: 5, orientation: '\\' },
      { id: '5-d', row: 5, col: 5, orientation: '/' }
    ],
    blockers: [{ row: 1, col: 6 }, { row: 6, col: 2 }, { row: 4, col: 6 }]
  }
]

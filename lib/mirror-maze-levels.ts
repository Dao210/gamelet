import type { MazeLevel } from './mirror-maze-engine'

export const MIRROR_MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1, name: 'First Light', hint: 'Two reflections make a clean corner.', size: 5, par: 2, difficulty: 'calibration',
    source: { row: 2, col: 0, direction: 'right' }, target: { row: 0, col: 0 },
    mirrors: [
      { id: '1-a', row: 2, col: 2, orientation: '\\' },
      { id: '1-b', row: 0, col: 2, orientation: '/' }
    ],
    blockers: [{ row: 2, col: 4 }]
  },
  {
    id: 2, name: 'Blue Shift', hint: 'Climb first, then send the beam west.', size: 6, par: 2, difficulty: 'calibration',
    source: { row: 4, col: 0, direction: 'right' }, target: { row: 1, col: 0 },
    mirrors: [
      { id: '2-a', row: 4, col: 3, orientation: '\\' },
      { id: '2-b', row: 1, col: 3, orientation: '/' },
      { id: '2-c', row: 3, col: 5, orientation: '/', locked: true }
    ],
    blockers: [{ row: 4, col: 5 }, { row: 0, col: 3 }]
  },
  {
    id: 3, name: 'Long Exposure', hint: 'Trace the light around the outer edge.', size: 6, par: 2, difficulty: 'tricky',
    source: { row: 0, col: 0, direction: 'down' }, target: { row: 0, col: 5 },
    mirrors: [
      { id: '3-a', row: 4, col: 0, orientation: '/' },
      { id: '3-b', row: 4, col: 5, orientation: '\\' },
      { id: '3-c', row: 2, col: 3, orientation: '/', locked: true }
    ],
    blockers: [{ row: 5, col: 0 }]
  },
  {
    id: 4, name: 'Prism Alley', hint: 'Build a zig-zag through the dark glass.', size: 7, par: 3, difficulty: 'tricky',
    source: { row: 6, col: 0, direction: 'right' }, target: { row: 0, col: 6 },
    mirrors: [
      { id: '4-a', row: 6, col: 2, orientation: '\\' },
      { id: '4-b', row: 3, col: 2, orientation: '\\' },
      { id: '4-c', row: 3, col: 6, orientation: '\\' },
      { id: '4-d', row: 1, col: 4, orientation: '/', locked: true }
    ],
    blockers: [{ row: 6, col: 5 }, { row: 0, col: 2 }]
  },
  {
    id: 5, name: 'Night Circuit', hint: 'Four turns. No wasted light.', size: 7, par: 4, difficulty: 'expert',
    source: { row: 1, col: 0, direction: 'right' }, target: { row: 5, col: 6 },
    mirrors: [
      { id: '5-a', row: 1, col: 2, orientation: '/' },
      { id: '5-b', row: 4, col: 2, orientation: '/' },
      { id: '5-c', row: 4, col: 5, orientation: '/' },
      { id: '5-d', row: 5, col: 5, orientation: '/' }
    ],
    blockers: [{ row: 1, col: 6 }, { row: 6, col: 2 }, { row: 4, col: 6 }]
  },
  {
    id: 6, name: 'Dead Channel', hint: 'The obvious lane is a trap. Fold the beam back through the lower chamber.', size: 8, par: 4, difficulty: 'expert',
    source: { row: 7, col: 0, direction: 'right' }, target: { row: 6, col: 3 },
    mirrors: [
      { id: '6-a', row: 7, col: 2, orientation: '\\' },
      { id: '6-b', row: 4, col: 2, orientation: '\\' },
      { id: '6-c', row: 4, col: 6, orientation: '/' },
      { id: '6-d', row: 6, col: 6, orientation: '\\' },
      { id: '6-x', row: 2, col: 4, orientation: '/', locked: true }
    ],
    blockers: [{ row: 7, col: 5 }, { row: 3, col: 2 }, { row: 5, col: 7 }, { row: 1, col: 4 }]
  },
  {
    id: 7, name: 'Black Relay', hint: 'Ride the perimeter, then cut across the top of the absorbers.', size: 8, par: 5, difficulty: 'expert',
    source: { row: 0, col: 0, direction: 'down' }, target: { row: 2, col: 1 },
    mirrors: [
      { id: '7-a', row: 3, col: 0, orientation: '/' },
      { id: '7-b', row: 3, col: 5, orientation: '/' },
      { id: '7-c', row: 7, col: 5, orientation: '/' },
      { id: '7-d', row: 7, col: 7, orientation: '\\' },
      { id: '7-e', row: 2, col: 7, orientation: '/' },
      { id: '7-x', row: 5, col: 3, orientation: '\\', locked: true }
    ],
    blockers: [{ row: 5, col: 0 }, { row: 3, col: 6 }, { row: 6, col: 4 }, { row: 1, col: 4 }, { row: 4, col: 3 }]
  },
  {
    id: 8, name: 'Glass Serpent', hint: 'Six bends form a serpent. Watch which side of each mirror catches the light.', size: 9, par: 6, difficulty: 'master',
    source: { row: 4, col: 0, direction: 'right' }, target: { row: 2, col: 4 },
    mirrors: [
      { id: '8-a', row: 4, col: 3, orientation: '\\' },
      { id: '8-b', row: 1, col: 3, orientation: '/' },
      { id: '8-c', row: 1, col: 1, orientation: '\\' },
      { id: '8-d', row: 7, col: 1, orientation: '/' },
      { id: '8-e', row: 7, col: 7, orientation: '\\' },
      { id: '8-f', row: 2, col: 7, orientation: '/' },
      { id: '8-x', row: 5, col: 5, orientation: '/', locked: true },
      { id: '8-y', row: 3, col: 8, orientation: '\\', locked: true }
    ],
    blockers: [{ row: 4, col: 6 }, { row: 0, col: 3 }, { row: 6, col: 3 }, { row: 8, col: 4 }, { row: 5, col: 8 }, { row: 2, col: 8 }]
  },
  {
    id: 9, name: 'Event Horizon', hint: 'A wide orbit is safer than the center. Seven precise reflections close the circuit.', size: 9, par: 7, difficulty: 'master',
    source: { row: 8, col: 0, direction: 'right' }, target: { row: 2, col: 7 },
    mirrors: [
      { id: '9-a', row: 8, col: 2, orientation: '\\' },
      { id: '9-b', row: 5, col: 2, orientation: '\\' },
      { id: '9-c', row: 5, col: 6, orientation: '\\' },
      { id: '9-d', row: 1, col: 6, orientation: '/' },
      { id: '9-e', row: 1, col: 1, orientation: '\\' },
      { id: '9-f', row: 6, col: 1, orientation: '/' },
      { id: '9-g', row: 6, col: 7, orientation: '\\' },
      { id: '9-x', row: 3, col: 4, orientation: '/', locked: true }
    ],
    blockers: [{ row: 8, col: 5 }, { row: 4, col: 3 }, { row: 5, col: 8 }, { row: 0, col: 6 }, { row: 3, col: 2 }, { row: 7, col: 5 }]
  },
  {
    id: 10, name: 'Singularity', hint: 'There is no shortcut. Spiral inward, skim both walls, and trust the final ascent.', size: 10, par: 8, difficulty: 'master',
    source: { row: 0, col: 0, direction: 'down' }, target: { row: 1, col: 1 },
    mirrors: [
      { id: '10-a', row: 4, col: 0, orientation: '/' },
      { id: '10-b', row: 4, col: 8, orientation: '/' },
      { id: '10-c', row: 8, col: 8, orientation: '/' },
      { id: '10-d', row: 8, col: 9, orientation: '\\' },
      { id: '10-e', row: 2, col: 9, orientation: '/' },
      { id: '10-f', row: 2, col: 5, orientation: '\\' },
      { id: '10-g', row: 6, col: 5, orientation: '\\' },
      { id: '10-h', row: 6, col: 1, orientation: '/' },
      { id: '10-x', row: 5, col: 3, orientation: '/', locked: true },
      { id: '10-y', row: 7, col: 7, orientation: '\\', locked: true }
    ],
    blockers: [{ row: 7, col: 0 }, { row: 5, col: 4 }, { row: 6, col: 7 }, { row: 9, col: 9 }, { row: 0, col: 9 }, { row: 2, col: 2 }, { row: 9, col: 5 }, { row: 7, col: 3 }]
  }
]

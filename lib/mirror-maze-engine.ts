export type Direction = 'up' | 'right' | 'down' | 'left'
export type MirrorOrientation = '/' | '\\'

export interface Position {
  row: number
  col: number
}

export interface Mirror extends Position {
  id: string
  orientation: MirrorOrientation
  locked?: boolean
}

export interface MazeLevel {
  id: number
  name: string
  hint: string
  size: number
  source: Position & { direction: Direction }
  target: Position
  mirrors: Mirror[]
  blockers: Position[]
  par: number
}

export type BeamStatus = 'target' | 'blocked' | 'escaped' | 'loop'

export interface BeamTrace {
  path: Position[]
  status: BeamStatus
}

const vectors: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 }
}

const reflections: Record<MirrorOrientation, Record<Direction, Direction>> = {
  '/': { up: 'right', right: 'up', down: 'left', left: 'down' },
  '\\': { up: 'left', left: 'up', down: 'right', right: 'down' }
}

const keyOf = ({ row, col }: Position) => `${row}:${col}`

export function rotateMirror(orientation: MirrorOrientation): MirrorOrientation {
  return orientation === '/' ? '\\' : '/'
}

export function traceBeam(level: MazeLevel, mirrors: Mirror[] = level.mirrors): BeamTrace {
  const mirrorMap = new Map(mirrors.map((mirror) => [keyOf(mirror), mirror]))
  const blockerSet = new Set(level.blockers.map(keyOf))
  const visited = new Set<string>()
  const path: Position[] = [{ row: level.source.row, col: level.source.col }]
  let position: Position = level.source
  let direction = level.source.direction

  for (;;) {
    const vector = vectors[direction]
    const next = { row: position.row + vector.row, col: position.col + vector.col }

    if (next.row < 0 || next.row >= level.size || next.col < 0 || next.col >= level.size) {
      path.push(next)
      return { path, status: 'escaped' }
    }

    path.push(next)
    if (next.row === level.target.row && next.col === level.target.col) {
      return { path, status: 'target' }
    }
    if (blockerSet.has(keyOf(next))) return { path, status: 'blocked' }

    const mirror = mirrorMap.get(keyOf(next))
    if (mirror) direction = reflections[mirror.orientation][direction]

    const stateKey = `${keyOf(next)}:${direction}`
    if (visited.has(stateKey)) return { path, status: 'loop' }
    visited.add(stateKey)
    position = next
  }
}

export function isLevelSolved(level: MazeLevel, mirrors: Mirror[]) {
  return traceBeam(level, mirrors).status === 'target'
}

export function getStars(moves: number, par: number) {
  if (moves <= par) return 3
  if (moves <= par + 2) return 2
  return 1
}

import { getStars, rotateMirror, traceBeam } from '@/lib/mirror-maze-engine'
import { MIRROR_MAZE_LEVELS } from '@/lib/mirror-maze-levels'

describe('mirror-maze-engine', () => {
  it('reflects both mirror orientations correctly', () => {
    expect(rotateMirror('/')).toBe('\\')
    expect(rotateMirror('\\')).toBe('/')
  })

  it('reports the unsolved initial beam outcome', () => {
    expect(traceBeam(MIRROR_MAZE_LEVELS[0]).status).not.toBe('target')
  })

  it('reaches the target when the first level mirrors are aligned', () => {
    const level = MIRROR_MAZE_LEVELS[0]
    const mirrors = level.mirrors.map((mirror) => ({ ...mirror, orientation: rotateMirror(mirror.orientation) }))
    const result = traceBeam(level, mirrors)

    expect(result.status).toBe('target')
    expect(result.path.at(-1)).toEqual(level.target)
  })

  it.each(MIRROR_MAZE_LEVELS.map((level) => [level.name, level] as const))(
    'keeps the designed solution for %s valid',
    (_, level) => {
      const solution = level.mirrors.map((mirror) => mirror.locked
        ? mirror
        : { ...mirror, orientation: rotateMirror(mirror.orientation) })

      expect(traceBeam(level, solution).status).toBe('target')
    }
  )

  it('awards stars relative to par', () => {
    expect(getStars(3, 3)).toBe(3)
    expect(getStars(5, 3)).toBe(2)
    expect(getStars(6, 3)).toBe(1)
  })
})

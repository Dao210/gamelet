'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { getStars, rotateMirror, traceBeam, type Mirror } from '@/lib/mirror-maze-engine'
import { MIRROR_MAZE_LEVELS } from '@/lib/mirror-maze-levels'

const STORAGE_KEY = 'gamelet:mirror-maze:v1'

const copy = {
  en: {
    eyebrow: 'OPTICAL PUZZLE / 01', title: 'MIRROR', titleAccent: 'MAZE',
    intro: 'Turn the mirrors. Bend the beam. Find the only clean path through the dark.',
    level: 'LEVEL', moves: 'MOVES', par: 'PAR', reset: 'Reset optics', hint: 'Field note',
    target: 'TARGET ACQUIRED', continue: 'Next chamber', replay: 'Replay level', complete: 'All chambers cleared',
    locked: 'Complete the previous chamber first', status: { target: 'Target acquired', blocked: 'Beam absorbed', escaped: 'Light escaped', loop: 'Beam loop detected' },
    help: 'Tap an unlocked mirror to rotate it 90°. Guide the amber beam into the circular receiver. Dark blocks absorb light.'
  },
  zh: {
    eyebrow: '光学谜题 / 01', title: '镜面', titleAccent: '迷宫',
    intro: '旋转镜面，折射光束，在黑暗中找出唯一干净的通路。',
    level: '关卡', moves: '步数', par: '标准', reset: '重置镜片', hint: '实验笔记',
    target: '目标已锁定', continue: '下一间暗室', replay: '重玩本关', complete: '所有暗室已通关',
    locked: '请先完成上一关', status: { target: '目标已锁定', blocked: '光束被吸收', escaped: '光束逸出', loop: '检测到光路循环' },
    help: '点击未锁定的镜片可旋转 90°。将琥珀色光束引入圆形接收器；黑色障碍会吸收光线。'
  }
} as const

type SavedProgress = { unlocked: number; best: Record<number, number> }

export default function MirrorMazeGame() {
  const locale = useLocale()
  const t = locale === 'zh' ? copy.zh : copy.en
  const [levelIndex, setLevelIndex] = useState(0)
  const level = MIRROR_MAZE_LEVELS[levelIndex]
  const [mirrors, setMirrors] = useState<Mirror[]>(level.mirrors)
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [progress, setProgress] = useState<SavedProgress>({ unlocked: 1, best: {} })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setProgress(JSON.parse(saved) as SavedProgress)
    } catch {
      // A blocked storage API should never prevent play.
    }
    setHydrated(true)
  }, [])

  const trace = useMemo(() => traceBeam(level, mirrors), [level, mirrors])
  const mirrorByCell = useMemo(() => new Map(mirrors.map((mirror) => [`${mirror.row}:${mirror.col}`, mirror])), [mirrors])
  const blockerCells = useMemo(() => new Set(level.blockers.map(({ row, col }) => `${row}:${col}`)), [level])

  const loadLevel = (index: number) => {
    const next = MIRROR_MAZE_LEVELS[index]
    setLevelIndex(index)
    setMirrors(next.mirrors.map((mirror) => ({ ...mirror })))
    setMoves(0)
    setSolved(false)
  }

  const turnMirror = (id: string) => {
    if (solved) return
    const selected = mirrors.find((mirror) => mirror.id === id)
    if (!selected || selected.locked) return

    const nextMoves = moves + 1
    const nextMirrors = mirrors.map((mirror) => mirror.id === id
      ? { ...mirror, orientation: rotateMirror(mirror.orientation) }
      : mirror)
    setMirrors(nextMirrors)
    setMoves(nextMoves)

    if (traceBeam(level, nextMirrors).status === 'target') {
      setSolved(true)
      setProgress((current) => {
        const next = {
          unlocked: Math.max(current.unlocked, Math.min(MIRROR_MAZE_LEVELS.length, levelIndex + 2)),
          best: { ...current.best, [level.id]: Math.min(current.best[level.id] ?? Infinity, nextMoves) }
        }
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
        return next
      })
    }
  }

  const points = trace.path.map(({ row, col }) => `${((col + 0.5) / level.size) * 100},${((row + 0.5) / level.size) * 100}`).join(' ')
  const best = progress.best[level.id]

  return (
    <div className="mirror-maze mobile-screen safe-bottom relative overflow-hidden bg-[#071018] text-[#edf7f6]">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 70% 15%, #174a55 0, transparent 32%), linear-gradient(rgba(100,220,220,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,220,.035) 1px, transparent 1px)', backgroundSize: 'auto, 32px 32px, 32px 32px' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:py-12">
        <header className="grid gap-7 border-b border-[#8fbdba]/20 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[.32em] text-[#81c8c2]">{t.eyebrow}</p>
            <h1 className="whitespace-nowrap font-mono text-[clamp(2.75rem,8vw,7.5rem)] font-black leading-[.85] tracking-[-.09em] text-white">
              {t.title}<span className="text-[#ffc857]">{t.titleAccent}</span>
            </h1>
          </div>
          <p className="max-w-md border-l-2 border-[#ffc857] pl-5 text-sm leading-7 text-[#a8bfbd] sm:text-base">{t.intro}</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs tracking-[.25em] text-[#81c8c2]">{t.level} {String(level.id).padStart(2, '0')}</span>
                <h2 className="text-xl font-bold tracking-tight">{level.name}</h2>
              </div>
              <button onClick={() => loadLevel(levelIndex)} className="border border-[#9ac8c4]/25 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#a9c7c4] transition hover:border-[#ffc857] hover:text-[#ffc857]">↻ {t.reset}</button>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[680px] border border-[#8bc6c2]/25 bg-[#0a1720] p-2 shadow-[0_35px_100px_rgba(0,0,0,.45)] sm:p-4">
              <div className="relative grid h-full w-full" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }} role="grid" aria-label="Mirror maze board">
                {Array.from({ length: level.size * level.size }, (_, index) => {
                  const row = Math.floor(index / level.size)
                  const col = index % level.size
                  const key = `${row}:${col}`
                  const mirror = mirrorByCell.get(key)
                  const isSource = row === level.source.row && col === level.source.col
                  const isTarget = row === level.target.row && col === level.target.col
                  const isBlocker = blockerCells.has(key)
                  return (
                    <div key={key} role="gridcell" className="relative flex items-center justify-center border-b border-r border-[#9bd8d3]/10">
                      {isBlocker && <div className="h-[72%] w-[72%] border border-[#30424a] bg-[#02070a] shadow-[inset_0_0_14px_#000]" aria-label="Light absorber" />}
                      {isSource && <div className="z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#ffc857] bg-[#332b17] text-[#ffc857] shadow-[0_0_25px_#ffc857]" aria-label="Light source">✦</div>}
                      {isTarget && <div className={`z-20 h-10 w-10 rounded-full border-[3px] transition-all duration-500 ${solved ? 'scale-110 border-white bg-[#ffc857] shadow-[0_0_40px_#ffc857]' : 'border-[#70d0c7] bg-[#0b292c] shadow-[inset_0_0_0_5px_#071018]'}`} aria-label="Target receiver" />}
                      {mirror && (
                        <button type="button" onClick={() => turnMirror(mirror.id)} disabled={mirror.locked || solved} aria-label={`${mirror.locked ? 'Locked ' : ''}mirror ${mirror.orientation}`} className={`group z-20 flex h-[78%] w-[78%] items-center justify-center rounded-full border transition-all ${mirror.locked ? 'cursor-not-allowed border-[#526168] bg-[#101a20] opacity-65' : 'border-[#82aaa9]/50 bg-[#142731] hover:scale-105 hover:border-[#ffc857]'}`}>
                          <span className={`block h-[3px] w-[82%] bg-gradient-to-r from-[#52706f] via-white to-[#52706f] shadow-[0_0_8px_white] transition-transform duration-300 ${mirror.orientation === '/' ? '-rotate-45' : 'rotate-45'}`} />
                          {mirror.locked && <span className="absolute text-[10px] text-[#91a3a3]">●</span>}
                        </button>
                      )}
                    </div>
                  )
                })}
                <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <polyline points={points} fill="none" stroke="#ffc857" strokeWidth="1.1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_7px_#ffc857]" />
                  <polyline points={points} fill="none" stroke="#fff4c2" strokeWidth=".25" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="grid grid-cols-3 border border-[#8fbdba]/20 bg-[#0b1821]">
              {[[t.moves, moves], [t.par, level.par], ['BEST', best ?? '—']].map(([label, value]) => <div key={label} className="border-r border-[#8fbdba]/15 p-4 last:border-r-0"><div className="font-mono text-[9px] tracking-[.2em] text-[#71938f]">{label}</div><div className="mt-1 font-mono text-2xl font-bold text-white">{value}</div></div>)}
            </div>
            <div className={`border p-5 transition-colors ${solved ? 'border-[#ffc857] bg-[#2b2617]' : 'border-[#8fbdba]/20 bg-[#0b1821]'}`}>
              <div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${trace.status === 'target' ? 'bg-[#ffc857] shadow-[0_0_12px_#ffc857]' : 'bg-[#e76f51]'}`} /><span className="font-mono text-xs font-bold tracking-[.16em]">{t.status[trace.status]}</span></div>
              {solved && <div className="mt-5"><p className="text-2xl font-black text-[#ffc857]">{'★'.repeat(getStars(moves, level.par))}{'☆'.repeat(3 - getStars(moves, level.par))}</p><p className="mt-2 font-mono text-xs tracking-[.18em] text-white">{t.target}</p></div>}
            </div>
            <div className="border border-[#8fbdba]/20 p-5"><p className="font-mono text-[10px] tracking-[.25em] text-[#81c8c2]">{t.hint}</p><p className="mt-3 text-sm leading-6 text-[#b3c7c5]">{level.hint}</p><p className="mt-4 border-t border-[#8fbdba]/15 pt-4 text-xs leading-5 text-[#718c8a]">{t.help}</p></div>
            {solved && <button onClick={() => loadLevel(levelIndex === MIRROR_MAZE_LEVELS.length - 1 ? levelIndex : levelIndex + 1)} className="w-full bg-[#ffc857] px-5 py-4 font-mono text-xs font-black uppercase tracking-[.18em] text-[#17130a] transition hover:bg-white">{levelIndex === MIRROR_MAZE_LEVELS.length - 1 ? t.replay : t.continue} →</button>}
            <div className="grid grid-cols-5 gap-2" aria-label="Level selector">
              {MIRROR_MAZE_LEVELS.map((item, index) => {
                const locked = hydrated && item.id > progress.unlocked
                return <button key={item.id} disabled={locked} title={locked ? t.locked : item.name} onClick={() => loadLevel(index)} className={`aspect-square border font-mono text-xs ${index === levelIndex ? 'border-[#ffc857] bg-[#ffc857] text-black' : locked ? 'cursor-not-allowed border-[#263940] text-[#3d5558]' : 'border-[#52706f] text-[#9fc1be] hover:border-white'}`}>{locked ? '×' : String(item.id).padStart(2, '0')}</button>
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

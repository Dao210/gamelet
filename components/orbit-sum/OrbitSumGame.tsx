'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import {
  ORBIT_SUM_LEVELS,
  cloneOrbitValues,
  findBestOrbitSwap,
  getOrbitStars,
  getOrbitSums,
  isOrbitSolved,
  swapOrbitValues,
  type OrbitPosition,
  type OrbitValues
} from '@/lib/orbit-sum-engine'

const STORAGE_KEY = 'gamelet:orbit-sum:v1'
const RING_COLORS = ['#56d6ff', '#ffcf5a', '#ff6f91']
const RADII = [43, 30, 17]
const ANGLES = [-90, 0, 90, 180]

const copy = {
  en: {
    eyebrow: 'ORBITAL CALIBRATION / SYSTEM 06', title: 'ORBIT', accent: 'SUM',
    intro: 'Exchange two satellites at a time. Balance all three orbital frequencies without losing the signal.',
    level: 'SECTOR', moves: 'MOVES', par: 'PAR', best: 'BEST', target: 'TARGET', live: 'LIVE SUM',
    instruction: 'Select two satellites to exchange', reset: 'Reset system', undo: 'Undo', hint: 'Plot best transfer',
    hintReady: 'Two recommended satellites are pulsing.', balanced: 'ORBIT BALANCED', next: 'Enter next sector', replay: 'Replay sector',
    help: 'Satellites may exchange across any rings. A ring locks green when its live sum equals the target.', locked: 'Clear the previous sector first', allClear: 'All sectors aligned'
  },
  zh: {
    eyebrow: '轨道校准系统 / 系统 06', title: '轨道', accent: '配平',
    intro: '每次交换两颗数字卫星，在信号消失前让三条轨道的频率同时达到平衡。',
    level: '区域', moves: '步数', par: '标准', best: '最佳', target: '目标', live: '当前总和',
    instruction: '依次选择两颗卫星进行交换', reset: '重置系统', undo: '撤销', hint: '计算最佳转移',
    hintReady: '推荐交换的两颗卫星正在闪烁。', balanced: '轨道已配平', next: '进入下一区域', replay: '重玩本区域',
    help: '任意轨道之间都能交换卫星。当当前总和等于目标时，该轨道会亮起绿色。', locked: '请先完成前一区域', allClear: '所有区域均已对齐'
  }
} as const

type Progress = { unlocked: number; best: Record<number, number> }

const keyOf = ({ ring, slot }: OrbitPosition) => `${ring}:${slot}`

export default function OrbitSumGame() {
  const locale = useLocale()
  const t = locale === 'zh' ? copy.zh : copy.en
  const [levelIndex, setLevelIndex] = useState(0)
  const level = ORBIT_SUM_LEVELS[levelIndex]
  const [values, setValues] = useState<OrbitValues>(() => cloneOrbitValues(level.initial))
  const [selected, setSelected] = useState<OrbitPosition | null>(null)
  const [history, setHistory] = useState<OrbitValues[]>([])
  const [moves, setMoves] = useState(0)
  const [hints, setHints] = useState(0)
  const [hintPair, setHintPair] = useState<OrbitPosition[]>([])
  const [solved, setSolved] = useState(false)
  const [progress, setProgress] = useState<Progress>({ unlocked: 1, best: {} })
  const [hydrated, setHydrated] = useState(false)
  const sums = useMemo(() => getOrbitSums(values), [values])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setProgress(JSON.parse(saved) as Progress)
    } catch {}
    setHydrated(true)
  }, [])

  const loadLevel = (index: number) => {
    const next = ORBIT_SUM_LEVELS[index]
    setLevelIndex(index)
    setValues(cloneOrbitValues(next.initial))
    setSelected(null); setHistory([]); setMoves(0); setHints(0); setHintPair([]); setSolved(false)
  }

  const selectSatellite = (position: OrbitPosition) => {
    if (solved) return
    if (!selected) {
      setSelected(position)
      return
    }
    if (keyOf(selected) === keyOf(position)) {
      setSelected(null)
      return
    }
    const next = swapOrbitValues(values, selected, position)
    const nextMoves = moves + 1
    setHistory((current) => [...current, values])
    setValues(next); setMoves(nextMoves); setSelected(null); setHintPair([])
    if (isOrbitSolved(next, level.targets)) {
      setSolved(true)
      setProgress((current) => {
        const updated = { unlocked: Math.max(current.unlocked, Math.min(ORBIT_SUM_LEVELS.length, levelIndex + 2)), best: { ...current.best, [level.id]: Math.min(current.best[level.id] ?? Infinity, nextMoves) } }
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
        return updated
      })
    }
  }

  const undo = () => {
    const previous = history.at(-1)
    if (!previous || solved) return
    setValues(previous); setHistory((current) => current.slice(0, -1)); setMoves((current) => Math.max(0, current - 1)); setSelected(null); setHintPair([])
  }

  const showHint = () => {
    const hint = findBestOrbitSwap(values, level.targets)
    if (!hint || solved) return
    setHintPair([hint.first, hint.second]); setHints((current) => current + 1); setSelected(null)
  }

  return (
    <main className="mobile-screen safe-bottom relative overflow-hidden bg-[#050812] text-[#eef6ff]">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 20% 15%, #122e52 0, transparent 25%), radial-gradient(circle at 80% 70%, #30152f 0, transparent 28%), radial-gradient(#a9d8ff 0.6px, transparent 0.8px)', backgroundSize: 'auto, auto, 29px 29px' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:py-12">
        <header className="grid gap-6 border-b border-[#8fcff5]/20 pb-8 lg:grid-cols-[1fr_410px] lg:items-end">
          <div><p className="mb-4 font-mono text-[10px] font-bold tracking-[.34em] text-[#56d6ff]">{t.eyebrow}</p><h1 className="font-mono text-[clamp(3.6rem,9vw,8rem)] font-black leading-[.76] tracking-[-.095em]">{t.title}<span className="text-[#ffcf5a]">{t.accent}</span></h1></div>
          <p className="border-l-2 border-[#ffcf5a] pl-5 text-sm leading-7 text-[#9eb1c5] sm:text-base">{t.intro}</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[.24em] text-[#56d6ff]">{t.level} {String(level.id).padStart(2, '0')}</p><h2 className="mt-1 text-xl font-bold">{level.name}</h2></div><p className="font-mono text-[10px] tracking-wider text-[#8294a8]">{t.instruction}</p></div>

            <div className="relative mx-auto aspect-square w-full max-w-[700px] overflow-hidden border border-[#8fcff5]/20 bg-[#070c18]/90 shadow-[0_35px_100px_#000]" role="group" aria-label={t.instruction}>
              <div className="absolute left-1/2 top-1/2 z-0 h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_#fff,0_0_55px_#56d6ff]" aria-hidden="true" />
              {RADII.map((radius, ring) => {
                const size = radius * 2
                const balanced = sums[ring] === level.targets[ring]
                return <div key={ring} className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${balanced ? 'shadow-[0_0_18px_#65e6a1]' : ''}`} style={{ width: `${size}%`, height: `${size}%`, borderColor: balanced ? '#65e6a1' : `${RING_COLORS[ring]}66` }} />
              })}
              {values.flatMap((ringValues, ring) => ringValues.map((value, slot) => {
                const angle = ANGLES[slot] * Math.PI / 180
                const position = { ring, slot }
                const positionKey = keyOf(position)
                const isSelected = selected && keyOf(selected) === positionKey
                const hinted = hintPair.some((item) => keyOf(item) === positionKey)
                return <button key={positionKey} type="button" onClick={() => selectSatellite(position)} aria-pressed={Boolean(isSelected)} aria-label={`Orbit ${ring + 1}, satellite ${value}`} className={`absolute z-10 flex h-[9.5%] w-[9.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-[clamp(.75rem,3vw,1.45rem)] font-black transition-all focus:outline-none focus:ring-2 focus:ring-white ${isSelected ? 'scale-125 border-white bg-white text-[#07101c] shadow-[0_0_25px_white]' : hinted ? 'animate-pulse scale-110 border-[#ffcf5a] bg-[#ffcf5a] text-black shadow-[0_0_25px_#ffcf5a]' : 'bg-[#101a2b] hover:scale-110'}`} style={{ left: `${50 + RADII[ring] * Math.cos(angle)}%`, top: `${50 + RADII[ring] * Math.sin(angle)}%`, borderColor: isSelected ? 'white' : RING_COLORS[ring], color: isSelected || hinted ? undefined : RING_COLORS[ring] }}>{value}</button>
              }))}
              <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[9px] tracking-[.18em] text-[#526578]">{level.note}</div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <dl className="grid grid-cols-3 border border-white/15 bg-[#0c1321]">{[[t.moves, moves], [t.par, level.par], [t.best, progress.best[level.id] ?? '—']].map(([label, value]) => <div key={label} className="border-r border-white/10 p-3 last:border-r-0"><dt className="font-mono text-[8px] tracking-[.18em] text-[#667b90]">{label}</dt><dd className="mt-1 font-mono text-2xl font-black">{value}</dd></div>)}</dl>
            <div className="space-y-2">{sums.map((sum, ring) => { const balanced = sum === level.targets[ring]; return <div key={ring} className={`border p-4 transition ${balanced ? 'border-[#65e6a1]/70 bg-[#10271f]' : 'border-white/15 bg-[#0c1321]'}`}><div className="flex items-center justify-between"><span className="font-mono text-[9px] tracking-[.2em]" style={{ color: RING_COLORS[ring] }}>ORBIT {ring + 1}</span><span className={`text-xs font-bold ${balanced ? 'text-[#65e6a1]' : 'text-[#64788c]'}`}>{balanced ? '● LOCKED' : '○ DRIFT'}</span></div><div className="mt-2 flex items-end justify-between font-mono"><div><span className="text-[8px] text-[#607387]">{t.live}</span><strong className="ml-2 text-2xl">{sum}</strong></div><div className="text-right"><span className="text-[8px] text-[#607387]">{t.target}</span><strong className="ml-2 text-2xl text-[#ffcf5a]">{level.targets[ring]}</strong></div></div></div> })}</div>
            {hintPair.length > 0 && <p className="border border-[#ffcf5a]/40 bg-[#2b2512] p-3 font-mono text-[10px] leading-5 text-[#ffcf5a]" aria-live="polite">{t.hintReady}</p>}
            <div className="grid grid-cols-3 gap-2"><button onClick={undo} disabled={!history.length || solved} className="border border-white/15 px-2 py-3 font-mono text-[9px] uppercase text-[#9aacbe] disabled:opacity-25">↶ {t.undo}</button><button onClick={() => loadLevel(levelIndex)} className="border border-white/15 px-2 py-3 font-mono text-[9px] uppercase text-[#9aacbe]">↻ {t.reset}</button><button onClick={showHint} disabled={solved} className="border border-[#ffcf5a]/50 px-2 py-3 font-mono text-[9px] uppercase text-[#ffcf5a]">⌁ {t.hint}</button></div>
            <p className="border-l-2 border-[#56d6ff] px-4 py-2 text-xs leading-6 text-[#778ba0]">{t.help}</p>
            {solved && <div className="border border-[#65e6a1] bg-[#10271f] p-5 text-center"><p className="font-mono text-xs font-black tracking-[.18em] text-[#65e6a1]">{t.balanced}</p><p className="mt-3 text-2xl text-[#ffcf5a]">{'★'.repeat(getOrbitStars(moves, level.par, hints))}{'☆'.repeat(3 - getOrbitStars(moves, level.par, hints))}</p><button onClick={() => loadLevel(levelIndex === ORBIT_SUM_LEVELS.length - 1 ? levelIndex : levelIndex + 1)} className="mt-4 w-full bg-[#65e6a1] px-4 py-3 font-mono text-[10px] font-black uppercase tracking-wider text-[#07140e]">{levelIndex === ORBIT_SUM_LEVELS.length - 1 ? t.replay : t.next} →</button></div>}
            <div className="grid grid-cols-5 gap-2" aria-label="Level selector">{ORBIT_SUM_LEVELS.map((item, index) => { const locked = hydrated && item.id > progress.unlocked; return <button key={item.id} disabled={locked} title={locked ? t.locked : item.name} onClick={() => loadLevel(index)} className={`aspect-square border font-mono text-xs ${index === levelIndex ? 'border-[#56d6ff] bg-[#56d6ff] text-black' : locked ? 'border-white/5 text-white/15' : 'border-white/20 text-[#8ca0b3] hover:border-white'}`}>{locked ? '×' : item.id}</button> })}</div>
          </aside>
        </div>
      </div>
    </main>
  )
}

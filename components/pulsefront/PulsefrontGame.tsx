'use client'

import { useEffect, useReducer, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  battleReducer, createBattle, DISPATCH_RATIOS, FACTIONS, medalFor, parseRecords,
  productionRate, PULSEFRONT_SECTORS, RECORDS_KEY, recordKey, STEP_SECONDS,
  type BattleRecords, type Difficulty
} from '@/lib/pulsefront-engine'
import styles from './pulsefront.module.css'

const COLORS = { cyan: '#64e7ee', magenta: '#f17cab', gold: '#f5c76b', neutral: '#8799ae' }
const SYMBOLS = { cyan: '◆', magenta: '▲', gold: '●', neutral: '○' }
const DIFFICULTIES: Difficulty[] = ['cadet', 'commander', 'admiral']
const time = (seconds: number) => {
  const whole = Math.floor(seconds + 0.000001)
  return `${Math.floor(whole / 60).toString().padStart(2, '0')}:${(whole % 60).toString().padStart(2, '0')}`
}

export default function PulsefrontGame() {
  const t = useTranslations('pulsefront')
  const [battle, dispatch] = useReducer(battleReducer, undefined, () => createBattle())
  const [records, setRecords] = useState<BattleRecords>({})
  const [storageReady, setStorageReady] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showHelp, setShowHelp] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const consoleRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const { sector, phase } = battle
  const playing = phase === 'running'
  const finished = phase === 'won' || phase === 'lost'
  const selected = battle.selected === null ? null : battle.cores[battle.selected]
  const best = records[recordKey(battle)]
  const factions = FACTIONS.map(owner => ({
    owner, count: battle.cores.filter(core => core.owner === owner).length,
    energy: battle.cores.filter(core => core.owner === owner).reduce((sum, core) => sum + core.energy, 0)
      + battle.fleets.filter(fleet => fleet.owner === owner).reduce((sum, fleet) => sum + fleet.amount, 0)
  }))

  useEffect(() => {
    try { setRecords(parseRecords(localStorage.getItem(RECORDS_KEY))) } catch {}
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (phase !== 'won' || !storageReady) return
    const key = recordKey(battle)
    setRecords(current => {
      if (current[key] && current[key].seconds <= battle.elapsed) return current
      const updated = { ...current, [key]: { seconds: battle.elapsed, launches: battle.launches } }
      try { localStorage.setItem(RECORDS_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [phase, battle, storageReady])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let previous = performance.now()
    let remaining = 0
    const animate = (now: number) => {
      remaining += Math.min(now - previous, 250)
      previous = now
      while (remaining >= STEP_SECONDS * 1000) {
        dispatch({ type: 'tick' })
        remaining -= STEP_SECONDS * 1000
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    const pauseWhenHidden = () => { if (document.hidden) dispatch({ type: 'pause' }) }
    const pauseOnBlur = () => dispatch({ type: 'pause' })
    document.addEventListener('visibilitychange', pauseWhenHidden)
    window.addEventListener('blur', pauseOnBlur)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      window.removeEventListener('blur', pauseOnBlur)
    }
  }, [playing])

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (target?.matches('input, select, textarea, [contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
      if (['1', '2', '3'].includes(event.key)) {
        dispatch({ type: 'ratio', ratio: DISPATCH_RATIOS[Number(event.key) - 1] })
      } else if (event.code === 'Space' && !target?.closest('button, a')) {
        event.preventDefault()
        setShowHelp(false)
        dispatch({ type: playing ? 'pause' : 'start' })
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setShowHelp(false)
        dispatch({ type: playing ? 'pause' : 'start' })
      } else if (event.key === 'Escape') {
        dispatch({ type: 'cancel' })
      }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [playing])

  const resetView = () => {
    setZoom(1)
    viewportRef.current?.scrollTo({ left: 0, top: 0 })
  }

  const changeZoom = (amount: number) => setZoom(current => Math.max(1, Math.min(2.5, current + amount)))
  const start = () => {
    setShowHelp(false)
    dispatch({ type: 'start' })
    consoleRef.current?.scrollIntoView({ block: 'start' })
    boardRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <Link className={styles.back} href="/">← {t('arcade')}</Link>
            <p className={styles.eyebrow}><span /> {t('eyebrow')}</p>
            <h1>PULSE<span>FRONT</span><sup>22</sup></h1>
            <p className={styles.intro}>{t('intro')}</p>
          </div>
          <div className={styles.headerNote}><span>01 — 03</span><p>{t('tagline')}</p><small>{t('solo')}</small></div>
        </header>

        <div className={styles.layout}>
          <section ref={consoleRef} className={styles.console} aria-label={t('battlefield')}>
            <div className={styles.consoleTop}>
              <div><span className={styles.liveDot} data-live={playing} />{t(`phases.${phase}`)}</div>
              <span>{t(`maps.${sector.id}.name`)}</span>
              <time data-testid="battle-clock">{time(battle.elapsed)}</time>
            </div>
            <div className={styles.scoreboard}>
              {factions.map(({ owner, count, energy }) => <div key={owner} style={{ '--faction': COLORS[owner] } as CSSProperties}>
                <span className={styles.factionSymbol}>{SYMBOLS[owner]}</span>
                <div><strong>{t(`factions.${owner}`)}</strong><small>{owner === 'cyan' ? t('you') : t('ai')}</small></div>
                <div className={styles.factionScore}><b>{String(count).padStart(2, '0')}</b><small>{energy} {t('energy')}</small></div>
              </div>)}
            </div>

            <div className={styles.boardFrame}>
              <div
                ref={viewportRef} className={styles.viewport}
                onPointerDown={event => {
                  if (zoom <= 1 || (event.target as HTMLElement).closest('button') || event.pointerType === 'touch') return
                  const element = event.currentTarget
                  dragRef.current = { x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop }
                  element.setPointerCapture(event.pointerId)
                }}
                onPointerMove={event => {
                  if (!dragRef.current) return
                  event.currentTarget.scrollLeft = dragRef.current.left - event.clientX + dragRef.current.x
                  event.currentTarget.scrollTop = dragRef.current.top - event.clientY + dragRef.current.y
                }}
                onPointerUp={() => { dragRef.current = null }}
                onPointerCancel={() => { dragRef.current = null }}
              >
                <div
                  ref={boardRef} className={styles.board} tabIndex={0} role="group" aria-label={t('boardLabel')}
                  style={{ width: `${zoom * 100}%` }} data-testid="pulsefront-board"
                >
                  <div className={styles.radar} aria-hidden="true" />
                  <svg className={styles.space} viewBox={`0 0 ${sector.size} ${sector.size}`} aria-hidden="true">
                    {Array.from({ length: 90 }, (_, index) => <circle key={index} cx={(index * 193 + 41) % sector.size} cy={(index * 307 + 87) % sector.size} r={index % 5 === 0 ? 1.6 : 0.7} fill="#9bb3ca" opacity={index % 3 === 0 ? 0.5 : 0.18} />)}
                    {sector.links.map(([a, b]) => {
                      const source = battle.cores[a]
                      const target = battle.cores[b]
                      const linked = source.owner && source.owner === target.owner
                      return <line key={`${a}:${b}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={linked ? COLORS[source.owner!] : '#233747'} strokeWidth={linked ? 2.5 : 1.4} opacity={linked ? 0.65 : 0.8} />
                    })}
                    {battle.fleets.map(fleet => {
                      const source = battle.cores[fleet.from]
                      const target = battle.cores[fleet.to]
                      const x = source.x + (target.x - source.x) * fleet.progress
                      const y = source.y + (target.y - source.y) * fleet.progress
                      const tail = Math.max(0, fleet.progress - 0.05)
                      return <g key={fleet.id}>
                        <line x1={source.x + (target.x - source.x) * tail} y1={source.y + (target.y - source.y) * tail} x2={x} y2={y} stroke={COLORS[fleet.owner]} strokeWidth="3" opacity="0.6" />
                        <g style={{ transform: `translate(${x}px, ${y}px)` }} className={styles.fleet}>
                          <circle r={sector.mode === 'expanse' ? 9 : 7} fill={COLORS[fleet.owner]} />
                          <text y={-13} textAnchor="middle" fill={COLORS[fleet.owner]} fontSize={sector.mode === 'expanse' ? 20 : 14}>{fleet.amount}</text>
                        </g>
                      </g>
                    })}
                  </svg>
                  {battle.cores.map(core => {
                    const owner = core.owner ?? 'neutral'
                    return <button
                      type="button" key={core.id} data-testid={`core-${core.id}`} data-owner={owner}
                      className={styles.core} data-selected={battle.selected === core.id} data-size={sector.mode}
                      disabled={!playing} aria-pressed={battle.selected === core.id}
                      aria-label={t('coreLabel', { id: core.id + 1, owner: t(`factions.${owner}`), energy: core.energy })}
                      onClick={() => dispatch({ type: 'select', id: core.id })}
                      style={{ left: `${core.x / sector.size * 100}%`, top: `${core.y / sector.size * 100}%`, '--faction': COLORS[owner] } as CSSProperties}
                    ><span>{SYMBOLS[owner]}</span><strong>{core.energy}</strong><small>{String(core.id + 1).padStart(2, '0')}</small></button>
                  })}
                </div>
              </div>
              <div className={styles.coordinates} aria-hidden="true">{t('sector')} / {sector.mode === 'classic' ? 'α' : 'ω'}<br />{battle.cores.length} {t('cores')}</div>
              <div className={styles.viewControls}>
                <button onClick={() => changeZoom(-0.5)} disabled={zoom === 1} aria-label={t('zoomOut')}>−</button>
                <button onClick={resetView} aria-label={t('resetView')}>{Math.round(zoom * 100)}%</button>
                <button onClick={() => changeZoom(0.5)} disabled={zoom === 2.5} aria-label={t('zoomIn')}>+</button>
              </div>

              {(phase !== 'running' || showHelp) && <div className={styles.overlay}>
                <div className={styles.overlayPanel} role="region" aria-label={t(`phases.${phase}`)}>
                  <span className={styles.overlayGlyph}>{phase === 'won' ? '✦' : phase === 'lost' ? '◇' : '⌁'}</span>
                  <p className={styles.eyebrow}>{t('mission')}</p>
                  <h2>{showHelp ? t('howToPlay') : t(`headings.${phase}`)}</h2>
                  <p>{finished ? t(phase === 'won' ? 'victoryDetail' : 'defeatDetail') : showHelp ? t('ruleDispatch') : t(phase === 'paused' ? 'pauseDetail' : 'briefing')}</p>
                  {phase === 'ready' && !showHelp && <div className={styles.briefingSteps}><span>01 {t('stepSelect')}</span><span>02 {t('stepSend')}</span><span>03 {t('stepConquer')}</span></div>}
                  {finished && <div className={styles.resultStats}><strong>{time(battle.elapsed)}</strong><span>{battle.launches} {t('launches')}</span>{phase === 'won' && <b>{t(`medals.${medalFor(battle.elapsed, sector.par)}`)}</b>}</div>}
                  <button className={styles.primary} onClick={finished ? () => { dispatch({ type: 'restart' }); resetView() } : start}>
                    {finished ? t('playAgain') : phase === 'ready' ? t('start') : t('resume')} <span>↗</span>
                  </button>
                  {phase === 'ready' && <small>{t('yourFaction')}</small>}
                </div>
              </div>}
            </div>

            <div className={styles.commandBar}>
              <div><span>{t('dispatch')}</span><div className={styles.ratios}>{DISPATCH_RATIOS.map((ratio, index) => <button key={ratio} aria-label={`${ratio * 100}%`} aria-pressed={battle.ratio === ratio} onClick={() => dispatch({ type: 'ratio', ratio })}><kbd aria-hidden="true">{index + 1}</kbd>{ratio * 100}%</button>)}</div></div>
              <button className={styles.pause} disabled={finished || phase === 'ready'} onClick={() => playing ? dispatch({ type: 'pause' }) : start()}>{playing ? 'Ⅱ' : '▷'} <span>{playing ? t('pause') : t('resume')}</span></button>
            </div>
            <div className={styles.status} role="status">{selected && battle.notice === 'target' ? t('readyToSend', { count: Math.floor(selected.energy * battle.ratio), rate: productionRate(battle, selected).toFixed(2) }) : t(`notices.${battle.notice}`)}</div>
          </section>

          <aside className={styles.sidebar}>
            <section className={styles.settings}>
              <p className={styles.sectionLabel}>01 / {t('missionControl')}</p>
              <div className={styles.modeTabs}>{(['classic', 'expanse'] as const).map(mode => <button key={mode} disabled={phase !== 'ready'} aria-pressed={sector.mode === mode} onClick={() => { dispatch({ type: 'configure', sector: PULSEFRONT_SECTORS.find(item => item.mode === mode)!, difficulty: battle.difficulty }); resetView() }}>{t(mode)}</button>)}</div>
              <label className={styles.field}>{t('sector')}<select disabled={phase !== 'ready'} value={sector.id} onChange={event => { dispatch({ type: 'configure', sector: PULSEFRONT_SECTORS.find(item => item.id === event.target.value)!, difficulty: battle.difficulty }); resetView() }}>{PULSEFRONT_SECTORS.filter(item => item.mode === sector.mode).map(item => <option key={item.id} value={item.id}>{t(`maps.${item.id}.name`)} · {item.cores.length}</option>)}</select></label>
              <p className={styles.mapDescription}>{t(`maps.${sector.id}.description`)}</p>
              <label className={styles.field}>{t('difficulty')}<select disabled={phase !== 'ready'} value={battle.difficulty} onChange={event => dispatch({ type: 'configure', sector, difficulty: event.target.value as Difficulty })}>{DIFFICULTIES.map(item => <option key={item} value={item}>{t(`difficulties.${item}`)}</option>)}</select></label>
              <p className={styles.smallNote}>{t('difficultyNote')}</p>
              <div className={styles.record}><div><span>{t('personalBest')}</span><strong>{best ? time(best.seconds) : '— : —'}</strong></div><span className={styles.medal}>{best ? t(`medals.${medalFor(best.seconds, sector.par)}`) : '◇'}</span></div>
              <p className={styles.smallNote}>{t('goldTarget', { time: time(sector.par) })}</p>
              <button className={styles.secondary} onClick={() => { setShowHelp(false); dispatch({ type: 'restart' }); resetView() }} disabled={phase === 'ready'}>↶ {t('newMission')}</button>
            </section>

            <section className={styles.fieldGuide}>
              <p className={styles.sectionLabel}>02 / {t('fieldGuide')}</p>
              {([['◆', 'ruleDispatch'], ['↗', 'ruleNetwork'], ['◎', 'ruleWin']] as const).map(([icon, key]) => <div key={key}><span>{icon}</span><p>{t(key)}</p></div>)}
              <button onClick={() => { dispatch({ type: 'pause' }); setShowHelp(true) }}>{t('howToPlay')} ↗</button>
              <p className={styles.shortcuts}>{t('keyboard')}<br />{t('panHint')}</p>
            </section>
            <div className={styles.source}><span>03 / {t('origin')}</span><p>{t('credit')} <a href="https://homegames.io/game.html?id=827050bf838a8b19ffb3528d364e38a7" target="_blank" rel="noreferrer">Joseph Garcia · Homegames ↗</a></p></div>
          </aside>
        </div>
      </div>
    </div>
  )
}

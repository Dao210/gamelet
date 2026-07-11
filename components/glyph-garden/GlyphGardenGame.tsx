'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import {
  MAX_ROUNDS,
  createGlyphPuzzle,
  createInitialGlyphState,
  createSeededRandom,
  scoreGuess,
  type GlyphGameState
} from '@/lib/glyph-garden-engine'

const STORAGE_KEY = 'gamelet:glyph-garden:best:v1'
const FLOWERS = ['✿', '❀', '❁', '✾', '⚘', '❃', '✽', '❋', '✤', '❊', '✥', '✣']

const copy = {
  en: {
    eyebrow: 'A STUDY IN SEEING / 04', title: 'GLYPH', accent: 'GARDEN',
    intro: 'One mark grew differently. Find it, and give the strange little thing a place to bloom.',
    round: 'BED', score: 'HARVEST', streak: 'STREAK', best: 'BEST', dew: 'DEW',
    instruction: 'Find the unusual glyph', correct: 'A rare bloom!', wrong: 'That one belongs here.',
    complete: 'The garden is in bloom', wilted: 'The garden needs rest',
    result: 'You raised {blooms} blooms and harvested {score} points.',
    again: 'Plant another garden', hint: 'Observe shape, fill and tiny details. The beds expand as your eye sharpens.',
    progress: 'Garden progress', selected: 'Selected glyph'
  },
  zh: {
    eyebrow: '视觉观察标本 / 04', title: '字形', accent: '花园',
    intro: '有一个符号长得不太一样。找到它，让这株古怪的小东西拥有盛放的位置。',
    round: '苗圃', score: '收获', streak: '连击', best: '最佳', dew: '露珠',
    instruction: '找出不同的字形', correct: '稀有花朵绽放了！', wrong: '这株其实很普通。',
    complete: '花园已经盛放', wilted: '花园需要休息',
    result: '你培育了 {blooms} 朵花，收获 {score} 分。',
    again: '再种一座花园', hint: '观察轮廓、填充和微小细节。随着眼力提升，苗圃也会扩大。',
    progress: '花园进度', selected: '已选择字形'
  }
} as const

type Feedback = { correct: boolean; points: number } | null

export default function GlyphGardenGame() {
  const locale = useLocale()
  const t = locale === 'zh' ? copy.zh : copy.en
  const [state, setState] = useState<GlyphGameState>(createInitialGlyphState)
  const [gameSeed, setGameSeed] = useState(() => Date.now())
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [finished, setFinished] = useState(false)
  const [bestScore, setBestScore] = useState(0)

  const puzzle = useMemo(
    () => createGlyphPuzzle(state.round, createSeededRandom(gameSeed + state.round * 2654435761)),
    [gameSeed, state.round]
  )

  useEffect(() => {
    try { setBestScore(Number(localStorage.getItem(STORAGE_KEY)) || 0) } catch {}
  }, [])

  const chooseGlyph = (index: number) => {
    if (feedback || finished) return
    const result = scoreGuess(state, index, puzzle)
    setFeedback({ correct: result.correct, points: result.points })
    window.setTimeout(() => {
      setState(result.state)
      setFinished(result.finished)
      setFeedback(null)
      if (result.finished && result.state.score > bestScore) {
        setBestScore(result.state.score)
        try { localStorage.setItem(STORAGE_KEY, String(result.state.score)) } catch {}
      }
    }, 650)
  }

  const restart = () => {
    setState(createInitialGlyphState())
    setGameSeed(Date.now())
    setFeedback(null)
    setFinished(false)
  }

  const visibleRound = Math.min(state.round, MAX_ROUNDS)

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#f1eddf] text-[#25382b]">
      <div className="pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(#49634f 0.7px, transparent 0.7px), linear-gradient(115deg, transparent 48%, rgba(91,74,46,.08) 49%, transparent 51%)', backgroundSize: '13px 13px, 180px 180px' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:py-12">
        <header className="grid gap-6 border-b border-[#506652]/25 pb-8 lg:grid-cols-[1fr_440px] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-[10px] font-bold tracking-[.32em] text-[#9b4d37]">{t.eyebrow}</p>
            <h1 className="font-serif text-[clamp(3.7rem,9vw,8.5rem)] font-black leading-[.76] tracking-[-.075em] text-[#203428]">
              {t.title}<span className="block italic text-[#9b4d37] sm:inline"> {t.accent}</span>
            </h1>
          </div>
          <p className="max-w-md border-l border-[#9b4d37] pl-5 font-serif text-lg italic leading-7 text-[#59675c]">{t.intro}</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="relative border border-[#5b705c]/30 bg-[#e8e2d1] p-3 shadow-[10px_12px_0_rgba(65,79,61,.10)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[.22em] text-[#8f553f]">{t.round} {String(visibleRound).padStart(2, '0')} / {MAX_ROUNDS}</p>
                <h2 className="mt-1 font-serif text-2xl font-bold italic">{t.instruction}</h2>
              </div>
              <div className="flex" aria-label={`${t.dew}: ${state.dew}`}>{Array.from({ length: 3 }, (_, i) => <span key={i} className={`text-xl ${i < state.dew ? 'text-[#4c7a72]' : 'text-[#bdbaa9]'}`}>●</span>)}</div>
            </div>

            <div className="mx-auto grid max-w-[650px] gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }} role="grid" aria-label={t.instruction}>
              {puzzle.glyphs.map((glyph, index) => {
                const revealed = Boolean(feedback) && index === puzzle.oddIndex
                return (
                  <button
                    key={`${puzzle.id}-${index}`}
                    type="button"
                    role="gridcell"
                    onClick={() => chooseGlyph(index)}
                    disabled={Boolean(feedback) || finished}
                    aria-label={`${t.selected} ${index + 1}`}
                    className={`group relative aspect-square border font-serif text-[clamp(1.7rem,6vw,4.2rem)] font-bold transition-all duration-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-[#9b4d37] focus:ring-offset-2 ${revealed ? 'z-10 rotate-2 scale-105 border-[#9b4d37] bg-[#fff8df] text-[#9b4d37] shadow-[4px_4px_0_#9b4d37]' : 'border-[#667766]/30 bg-[#f7f1df] text-[#314936] hover:z-10 hover:-rotate-2 hover:scale-[1.04] hover:border-[#9b4d37] hover:bg-[#fffaf0]'}`}
                  >
                    {glyph}
                    {revealed && <span className="absolute -right-1 -top-3 text-2xl text-[#d3914a]" aria-hidden="true">✿</span>}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 min-h-7 text-center font-mono text-xs font-bold uppercase tracking-[.16em]" aria-live="polite">
              {feedback && <span className={feedback.correct ? 'text-[#35705b]' : 'text-[#a34032]'}>{feedback.correct ? `${t.correct} +${feedback.points}` : t.wrong}</span>}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="grid grid-cols-2 border border-[#5b705c]/30 bg-[#f8f2df]">
              {[[t.score, state.score], [t.streak, `×${state.streak}`], [t.best, bestScore], [t.dew, state.dew]].map(([label, value]) => (
                <div key={label} className="border-b border-r border-[#5b705c]/20 p-4 even:border-r-0">
                  <dt className="font-mono text-[9px] font-bold tracking-[.2em] text-[#7b6855]">{label}</dt><dd className="mt-1 font-serif text-3xl font-bold text-[#273d2d]">{value}</dd>
                </div>
              ))}
            </div>

            <div className="border border-[#5b705c]/30 bg-[#263b2d] p-5 text-[#f5eedb]">
              <p className="font-mono text-[9px] tracking-[.22em] text-[#d8ae72]">{t.progress}</p>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {FLOWERS.map((flower, index) => <span key={index} className={`flex aspect-square items-center justify-center text-2xl transition-all ${index < state.blooms ? 'scale-100 text-[#f0bf73]' : 'scale-75 text-white/15'}`}>{index < state.blooms ? flower : '·'}</span>)}
              </div>
            </div>

            <p className="border-l-2 border-[#9b4d37] px-4 py-2 font-serif text-sm italic leading-6 text-[#677064]">{t.hint}</p>
          </aside>
        </div>
      </div>

      {finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251c]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="glyph-result-title">
          <div className="w-full max-w-lg border border-[#ead8aa] bg-[#f5eedb] p-8 text-center shadow-[12px_12px_0_#9b4d37] sm:p-12">
            <div className="mb-5 text-5xl text-[#b56a46]" aria-hidden="true">{state.dew > 0 ? '✿ ❋ ✾' : '☾'}</div>
            <h2 id="glyph-result-title" className="font-serif text-4xl font-black text-[#24382a]">{state.dew > 0 ? t.complete : t.wilted}</h2>
            <p className="mt-4 font-serif text-lg italic text-[#657066]">{t.result.replace('{blooms}', String(state.blooms)).replace('{score}', String(state.score))}</p>
            <button type="button" onClick={restart} className="mt-8 w-full bg-[#9b4d37] px-6 py-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-white transition hover:bg-[#263b2d] focus:outline-none focus:ring-2 focus:ring-[#9b4d37] focus:ring-offset-2">{t.again} →</button>
          </div>
        </div>
      )}
    </main>
  )
}

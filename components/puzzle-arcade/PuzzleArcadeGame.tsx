'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useLocale } from 'next-intl'
import {
  PUZZLE_ARCADES,
  answerArcadeQuestion,
  createArcadeSession,
  getHintedOptions,
  type PuzzleArcadeId
} from '@/lib/puzzle-arcade-engine'

const copy = {
  en: { round: 'ROUND', score: 'SCORE', streak: 'STREAK', best: 'BEST', signal: 'SIGNAL', hint: 'Remove two decoys', correct: 'Signal confirmed', wrong: 'Signal rejected', next: 'Next puzzle', complete: 'Run complete', failed: 'Signal lost', result: '{correct} of {total} solved · {score} points', replay: 'Run it again', explanation: 'FIELD ANALYSIS' },
  zh: { round: '关卡', score: '得分', streak: '连击', best: '最佳', signal: '信号', hint: '排除两个干扰项', correct: '答案确认', wrong: '答案错误', next: '下一题', complete: '挑战完成', failed: '信号中断', result: '解出 {correct}/{total} 题 · {score} 分', replay: '重新挑战', explanation: '规则解析' }
} as const

export default function PuzzleArcadeGame({ gameId }: { gameId: PuzzleArcadeId }) {
  const game = PUZZLE_ARCADES[gameId]
  const locale = useLocale()
  const zh = locale === 'zh'
  const t = zh ? copy.zh : copy.en
  const [session, setSession] = useState(createArcadeSession)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ correct: boolean; points: number } | null>(null)
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([])
  const [usedHint, setUsedHint] = useState(false)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState(0)
  const question = game.questions[Math.min(session.round, game.questions.length - 1)]
  const storageKey = `gamelet:puzzle-arcade:${gameId}:v1`

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(storageKey)) || 0) } catch {}
  }, [storageKey])

  const choose = (index: number) => {
    if (feedback || finished || hiddenOptions.includes(index)) return
    const result = answerArcadeQuestion(session, question, index, usedHint)
    setSelected(index)
    setFeedback({ correct: result.correct, points: result.points })
    const isLast = result.session.round >= game.questions.length
    window.setTimeout(() => {
      setSession(result.session)
      setSelected(null); setFeedback(null); setHiddenOptions([]); setUsedHint(false)
      if (result.finished || isLast) {
        setFinished(true)
        if (result.session.score > best) {
          setBest(result.session.score)
          try { localStorage.setItem(storageKey, String(result.session.score)) } catch {}
        }
      }
    }, 1050)
  }

  const useHint = () => {
    if (usedHint || feedback || finished) return
    setHiddenOptions(getHintedOptions(question))
    setUsedHint(true)
  }

  const restart = () => {
    setSession(createArcadeSession()); setSelected(null); setFeedback(null); setHiddenOptions([]); setUsedHint(false); setFinished(false)
  }

  const theme = useMemo(() => ({ '--arcade-accent': game.accent, '--arcade-secondary': game.secondary, '--arcade-bg': game.background } as CSSProperties), [game])

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--arcade-bg)] text-[#f7f3ea]" style={theme}>
      <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px), radial-gradient(circle at 78% 16%, var(--arcade-accent) 0, transparent 23%)', backgroundSize: '36px 36px, 36px 36px, auto' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:py-12">
        <header className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[1fr_410px] lg:items-end">
          <div><p className="mb-4 font-mono text-[10px] font-black tracking-[.34em] text-[var(--arcade-accent)]">{game.discipline}</p><h1 className="font-mono text-[clamp(3.1rem,7.4vw,7rem)] font-black leading-[.78] tracking-[-.09em]">{game.title}<span className="block text-[var(--arcade-accent)] sm:inline"> {game.accentTitle}</span></h1></div>
          <p className="border-l-2 border-[var(--arcade-accent)] pl-5 text-sm leading-7 text-white/60 sm:text-base">{zh ? game.introZh : game.intro}</p>
        </header>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <section className="border border-white/15 bg-black/20 p-4 shadow-[12px_12px_0_rgba(0,0,0,.35)] sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.25em] text-[var(--arcade-accent)]">{t.round} {session.round + 1} / {game.questions.length}</p><h2 className="mt-2 text-xl font-bold sm:text-2xl">{zh ? game.instructionZh : game.instruction}</h2></div><div className="font-mono text-xs tracking-wider text-white/45">{game.motif}</div></div>

            <div className="border-y border-white/10 bg-black/20 px-3 py-8 text-center sm:px-8 sm:py-11">
              <p className="mb-7 font-serif text-lg italic text-white/60">{question.prompt}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label={question.prompt}>{question.display.map((token, index) => <span key={`${token}-${index}`} className="flex min-h-16 min-w-14 items-center justify-center border border-white/15 bg-white/[.05] px-3 font-mono text-2xl font-black shadow-[3px_3px_0_var(--arcade-accent)] sm:min-h-20 sm:min-w-16 sm:text-3xl">{token}</span>)}</div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">{question.options.map((option, index) => {
              const hidden = hiddenOptions.includes(index)
              const chosen = selected === index
              const correct = feedback && index === question.answer
              return <button key={`${option}-${index}`} type="button" onClick={() => choose(index)} disabled={hidden || Boolean(feedback)} className={`min-h-16 border px-4 font-mono text-lg font-black transition focus:outline-none focus:ring-2 focus:ring-[var(--arcade-accent)] focus:ring-offset-2 focus:ring-offset-[var(--arcade-bg)] ${hidden ? 'border-white/5 text-transparent opacity-25' : correct ? 'border-[#68e0a2] bg-[#68e0a2] text-[#07130c]' : chosen ? 'border-[#ff647c] bg-[#ff647c] text-white' : 'border-white/15 bg-white/[.04] hover:-translate-y-0.5 hover:border-[var(--arcade-accent)] hover:text-[var(--arcade-accent)]'}`}>{hidden ? '×' : option}</button>
            })}</div>

            <div className="mt-5 min-h-16 border-l-2 border-[var(--arcade-secondary)] px-4 py-2" aria-live="polite">{feedback ? <><p className={`font-mono text-xs font-black uppercase tracking-wider ${feedback.correct ? 'text-[#68e0a2]' : 'text-[#ff7185]'}`}>{feedback.correct ? `${t.correct} +${feedback.points}` : t.wrong}</p><p className="mt-2 text-sm text-white/55"><span className="mr-2 font-mono text-[9px] text-[var(--arcade-secondary)]">{t.explanation}</span>{question.explanation}</p></> : <p className="text-sm text-white/40">{question.prompt}</p>}</div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <dl className="grid grid-cols-2 border border-white/15 bg-black/20">{[[t.score, session.score], [t.best, best], [t.streak, `×${session.streak}`], [t.signal, `${session.lives}/3`]].map(([label, value]) => <div key={label} className="border-b border-r border-white/10 p-4 even:border-r-0"><dt className="font-mono text-[8px] tracking-[.2em] text-white/40">{label}</dt><dd className="mt-1 font-mono text-2xl font-black">{value}</dd></div>)}</dl>
            <div className="border border-white/15 bg-black/20 p-5"><div className="flex gap-2">{game.questions.map((_, index) => <span key={index} className={`h-2 flex-1 ${index < session.round ? 'bg-[var(--arcade-accent)]' : index === session.round ? 'animate-pulse bg-[var(--arcade-secondary)]' : 'bg-white/10'}`} />)}</div><p className="mt-4 text-xs leading-6 text-white/45">{zh ? game.introZh : game.intro}</p></div>
            <button type="button" onClick={useHint} disabled={usedHint || Boolean(feedback)} className="w-full border border-[var(--arcade-secondary)] px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[.14em] text-[var(--arcade-secondary)] transition hover:bg-[var(--arcade-secondary)] hover:text-black disabled:opacity-25">⌁ {t.hint}</button>
          </aside>
        </div>
      </div>

      {finished && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={`${gameId}-result`}><div className="w-full max-w-lg border border-[var(--arcade-accent)] bg-[var(--arcade-bg)] p-8 text-center shadow-[12px_12px_0_var(--arcade-accent)] sm:p-11"><div className="font-mono text-5xl text-[var(--arcade-accent)]">{session.lives ? '◆ ✓' : '◇ ×'}</div><h2 id={`${gameId}-result`} className="mt-5 font-mono text-4xl font-black">{session.lives ? t.complete : t.failed}</h2><p className="mt-4 text-white/60">{t.result.replace('{correct}', String(session.correct)).replace('{total}', String(game.questions.length)).replace('{score}', String(session.score))}</p><button onClick={restart} className="mt-8 w-full bg-[var(--arcade-accent)] px-5 py-4 font-mono text-xs font-black uppercase tracking-[.16em] text-black">{t.replay} →</button></div></div>}
    </main>
  )
}

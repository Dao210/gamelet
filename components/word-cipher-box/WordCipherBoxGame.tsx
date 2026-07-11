'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import {
  CIPHER_LEVELS,
  assignCipherLetter,
  calculateCipherScore,
  clearCipherLetter,
  createCipherPuzzle,
  isCipherComplete,
  isCipherSolved,
  revealCipherHint,
  type CipherAssignments
} from '@/lib/word-cipher-engine'

const STORAGE_KEY = 'gamelet:word-cipher-box:v1'
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const MAX_MISTAKES = 3

const copy = {
  en: {
    eyebrow: 'CLASSIFIED WORD UNIT / FILE 05', title: 'WORD CIPHER', accent: 'BOX',
    intro: 'Every repeated mark hides the same letter. Open the compartments, establish the key, recover the phrase.',
    file: 'FILE', clue: 'FIELD NOTE', mapping: 'LIVE KEY', score: 'SCORE', best: 'BEST', seals: 'SEALS',
    select: 'Select a cipher mark, then assign a letter.', submit: 'Verify decryption', hint: 'Open one compartment', clear: 'Clear',
    incomplete: 'The file still has empty compartments.', conflict: 'That letter is already assigned to another mark.',
    wrong: 'Rejected. The substitution key is not yet correct.', solved: 'File decrypted', next: 'Open next file',
    complete: 'Archive recovered', result: 'All six files decrypted. Final score: {score}.', again: 'Restart archive',
    instructions: 'Equal symbols always mean equal letters. Each letter can belong to only one symbol.', revealed: 'A compartment was opened for you.'
  },
  zh: {
    eyebrow: '机密文字组 / 档案 05', title: '文字密码', accent: '盒',
    intro: '重复符号始终代表同一个字母。打开隔间、建立密钥，还原被隐藏的词组。',
    file: '档案', clue: '现场线索', mapping: '实时密钥', score: '得分', best: '最佳', seals: '封印',
    select: '先选择一个密码符号，再分配字母。', submit: '核验解密结果', hint: '打开一个隔间', clear: '清除',
    incomplete: '档案中还有空白隔间。', conflict: '这个字母已经分配给另一个符号。',
    wrong: '核验失败，替换密钥仍不正确。', solved: '档案已解密', next: '打开下一份档案',
    complete: '机密档案已复原', result: '六份档案全部解密，最终得分：{score}。', again: '重新破解档案',
    instructions: '相同符号始终代表相同字母；每个字母只能属于一个符号。', revealed: '已为你打开一个隔间。'
  }
} as const

type Notice = { kind: 'neutral' | 'error' | 'success'; text: string }

export default function WordCipherBoxGame() {
  const locale = useLocale()
  const t = locale === 'zh' ? copy.zh : copy.en
  const [levelIndex, setLevelIndex] = useState(0)
  const [assignments, setAssignments] = useState<CipherAssignments>({})
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [solved, setSolved] = useState(false)
  const [finished, setFinished] = useState(false)
  const [notice, setNotice] = useState<Notice>({ kind: 'neutral', text: t.select })
  const puzzle = useMemo(() => createCipherPuzzle(CIPHER_LEVELS[levelIndex]), [levelIndex])

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(STORAGE_KEY)) || 0) } catch {}
  }, [])

  const enterLetter = useCallback((letter: string) => {
    if (!selectedSymbol || solved) return
    const result = assignCipherLetter(assignments, selectedSymbol, letter)
    if (!result.ok) {
      setNotice({ kind: 'error', text: t.conflict })
      return
    }
    setAssignments(result.assignments)
    setNotice({ kind: 'neutral', text: t.select })
  }, [assignments, selectedSymbol, solved, t])

  const clearSelected = useCallback(() => {
    if (!selectedSymbol || solved) return
    setAssignments((current) => clearCipherLetter(current, selectedSymbol))
  }, [selectedSymbol, solved])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (/^[a-z]$/i.test(event.key)) enterLetter(event.key)
      if (event.key === 'Backspace' || event.key === 'Delete') clearSelected()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clearSelected, enterLetter])

  const verify = () => {
    if (!isCipherComplete(puzzle, assignments)) {
      setNotice({ kind: 'error', text: t.incomplete })
      return
    }
    if (isCipherSolved(puzzle, assignments)) {
      const earned = calculateCipherScore(mistakes, hints)
      setScore((current) => current + earned)
      setSolved(true)
      setNotice({ kind: 'success', text: `${t.solved} +${earned}` })
      return
    }
    const nextMistakes = mistakes + 1
    setMistakes(nextMistakes)
    setNotice({ kind: 'error', text: t.wrong })
    if (nextMistakes >= MAX_MISTAKES) {
      const hint = revealCipherHint(puzzle, assignments)
      setAssignments(hint.assignments)
      setHints((current) => current + 1)
      setMistakes(0)
    }
  }

  const useHint = () => {
    if (solved) return
    const hint = revealCipherHint(puzzle, assignments)
    if (!hint.revealedSymbol) return
    setAssignments(hint.assignments)
    setSelectedSymbol(hint.revealedSymbol)
    setHints((current) => current + 1)
    setNotice({ kind: 'neutral', text: t.revealed })
  }

  const nextLevel = () => {
    if (levelIndex === CIPHER_LEVELS.length - 1) {
      setFinished(true)
      if (score > best) {
        setBest(score)
        try { localStorage.setItem(STORAGE_KEY, String(score)) } catch {}
      }
      return
    }
    setLevelIndex((current) => current + 1)
    setAssignments({})
    setSelectedSymbol(null)
    setMistakes(0)
    setHints(0)
    setSolved(false)
    setNotice({ kind: 'neutral', text: t.select })
  }

  const restart = () => {
    setLevelIndex(0); setAssignments({}); setSelectedSymbol(null); setMistakes(0); setHints(0)
    setScore(0); setSolved(false); setFinished(false); setNotice({ kind: 'neutral', text: t.select })
  }

  const usedLetters = new Set(Object.values(assignments))

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#17191c] text-[#f2ead9]">
      <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px), radial-gradient(circle at 75% 12%, #c24b36 0, transparent 26%)', backgroundSize: '24px 24px, 24px 24px, auto' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:py-12">
        <header className="grid gap-6 border-b border-[#f2ead9]/15 pb-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div><p className="mb-4 font-mono text-[10px] font-bold tracking-[.34em] text-[#f06449]">{t.eyebrow}</p><h1 className="font-mono text-[clamp(3.1rem,7.5vw,7.3rem)] font-black leading-[.78] tracking-[-.085em]">{t.title}<span className="block text-[#f06449] sm:inline"> {t.accent}</span></h1></div>
          <p className="border-l-2 border-[#f06449] pl-5 text-sm leading-7 text-[#b9b4aa] sm:text-base">{t.intro}</p>
        </header>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <section className="border border-[#f2ead9]/15 bg-[#202328] p-4 shadow-[12px_12px_0_#0d0e10] sm:p-7">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#f06449]">{t.file} {String(puzzle.id).padStart(2, '0')} / {CIPHER_LEVELS.length} · {puzzle.category}</p><h2 className="mt-2 font-serif text-2xl italic text-[#f2ead9]">“{puzzle.clue}”</h2></div><div className="flex gap-1" aria-label={`${t.seals}: ${MAX_MISTAKES - mistakes}`}>{Array.from({ length: MAX_MISTAKES }, (_, i) => <span key={i} className={`h-3 w-3 rotate-45 border ${i < MAX_MISTAKES - mistakes ? 'border-[#f06449] bg-[#f06449]' : 'border-white/20'}`} />)}</div></div>

            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 border-y border-white/10 bg-[#17191c] px-3 py-8 sm:px-6">
              {puzzle.encoded.map((symbol, index) => symbol === null ? <span key={index} className="w-5 sm:w-8" aria-label="space" /> : (
                <button key={index} type="button" onClick={() => setSelectedSymbol(symbol)} aria-pressed={selectedSymbol === symbol} className={`relative h-20 w-12 border-b-2 pb-1 font-mono transition sm:h-24 sm:w-16 ${selectedSymbol === symbol ? 'border-[#f06449] bg-[#f06449]/10' : 'border-[#7e858b] hover:bg-white/5'}`}>
                  <span className="block text-3xl font-black text-[#f2ead9] sm:text-4xl">{assignments[symbol] ?? '·'}</span><span className="mt-2 block text-[11px] text-[#7f878c] sm:text-sm">{symbol}</span>
                </button>
              ))}
            </div>

            <div className={`min-h-12 px-2 py-4 text-center font-mono text-xs font-bold tracking-[.08em] ${notice.kind === 'error' ? 'text-[#ff8069]' : notice.kind === 'success' ? 'text-[#77d6ab]' : 'text-[#9ca2a4]'}`} aria-live="polite">{notice.text}</div>

            <div className="mx-auto grid max-w-2xl grid-cols-9 gap-1.5" aria-label="Letter keyboard">
              {KEYS.map((letter) => <button key={letter} type="button" onClick={() => enterLetter(letter)} disabled={!selectedSymbol || solved || usedLetters.has(letter) && assignments[selectedSymbol ?? ''] !== letter} className={`aspect-square border font-mono text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#f06449] ${assignments[selectedSymbol ?? ''] === letter ? 'border-[#f06449] bg-[#f06449] text-white' : usedLetters.has(letter) ? 'border-white/5 text-white/15' : 'border-white/15 bg-[#292d32] text-[#e5dfd2] hover:border-[#f06449] hover:text-[#f06449]'}`}>{letter}</button>)}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <button type="button" onClick={verify} disabled={solved} className="bg-[#f06449] px-5 py-3 font-mono text-xs font-black uppercase tracking-[.16em] text-white transition hover:bg-[#ff7a61] disabled:opacity-40">{t.submit}</button>
              <button type="button" onClick={useHint} disabled={solved} className="border border-white/20 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-wider hover:border-[#f06449]">⌁ {t.hint}</button>
              <button type="button" onClick={clearSelected} disabled={!selectedSymbol || solved} className="border border-white/20 px-5 py-3 font-mono text-[10px] uppercase text-[#aaa] hover:text-white">{t.clear}</button>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <dl className="grid grid-cols-2 border border-white/15 bg-[#202328]">{[[t.score, score], [t.best, best]].map(([label, value]) => <div key={label} className="border-r border-white/10 p-4 last:border-r-0"><dt className="font-mono text-[9px] tracking-[.2em] text-[#888f92]">{label}</dt><dd className="mt-1 font-mono text-2xl font-black">{value}</dd></div>)}</dl>
            <div className="border border-white/15 bg-[#e8dfcc] p-5 text-[#22252a]"><p className="font-mono text-[9px] font-bold tracking-[.22em] text-[#b23f2c]">{t.mapping}</p><div className="mt-4 grid grid-cols-4 gap-2">{puzzle.uniqueSymbols.map((symbol) => <button key={symbol} onClick={() => setSelectedSymbol(symbol)} className={`border p-2 text-center font-mono ${selectedSymbol === symbol ? 'border-[#c94e38] bg-[#c94e38] text-white' : 'border-black/15'}`}><span className="block text-xs opacity-50">{symbol}</span><span className="text-lg font-black">{assignments[symbol] ?? '—'}</span></button>)}</div></div>
            <p className="border-l-2 border-[#f06449] px-4 py-2 text-xs leading-6 text-[#999e9f]">{t.instructions}</p>
            {solved && <button type="button" onClick={nextLevel} className="w-full bg-[#77d6ab] px-5 py-4 font-mono text-xs font-black uppercase tracking-[.16em] text-[#112219]">{t.next} →</button>}
          </aside>
        </div>
      </div>

      {finished && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cipher-result"><div className="w-full max-w-lg border border-[#f06449] bg-[#e8dfcc] p-9 text-center text-[#202328] shadow-[12px_12px_0_#f06449]"><div className="text-5xl">▣ ✓</div><h2 id="cipher-result" className="mt-5 font-mono text-4xl font-black tracking-[-.06em]">{t.complete}</h2><p className="mt-4 font-serif text-lg italic">{t.result.replace('{score}', String(score))}</p><button onClick={restart} className="mt-8 w-full bg-[#202328] px-5 py-4 font-mono text-xs font-black uppercase tracking-[.18em] text-white">{t.again} →</button></div></div>}
    </main>
  )
}

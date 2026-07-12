'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { INSTRUMENTS, type InstrumentId } from '@/lib/impossible-instruments/core'

interface InstrumentShellProps {
  id: InstrumentId
  level: number
  levelCount: number
  score: number
  hints: number
  children: ReactNode
  aside: ReactNode
}

export default function InstrumentShell({ id, level, levelCount, score, hints, children, aside }: InstrumentShellProps) {
  const locale = useLocale()
  const zh = locale === 'zh'
  const meta = INSTRUMENTS[id]
  const style = { '--instrument-accent': meta.accent } as CSSProperties

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#12100d] text-[#f1eadc]" style={style}>
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(239,226,198,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,226,198,.05) 1px, transparent 1px), radial-gradient(circle at 82% 12%, var(--instrument-accent) 0, transparent 22%)', backgroundSize: '28px 28px, 28px 28px, auto' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:py-10">
        <header className="grid gap-5 border-b border-[#d8c9ac]/20 pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="mb-3 font-mono text-[10px] font-black tracking-[.34em] text-[var(--instrument-accent)]">THE CABINET OF IMPOSSIBLE INSTRUMENTS / {meta.file}</p><h1 className="font-serif text-[clamp(2.8rem,7vw,6.6rem)] font-black leading-[.82] tracking-[-.06em]">{zh ? meta.titleZh : meta.title}</h1><p className="mt-4 text-sm italic text-white/50">{zh ? meta.subtitleZh : meta.subtitle}</p></div>
          <dl className="grid grid-cols-3 border border-white/15 bg-black/20"><div className="p-3"><dt className="font-mono text-[8px] tracking-widest text-white/35">{zh ? '记录' : 'RECORD'}</dt><dd className="mt-1 font-mono text-xl font-black">{level}/{levelCount}</dd></div><div className="border-x border-white/10 p-3"><dt className="font-mono text-[8px] tracking-widest text-white/35">{zh ? '得分' : 'SCORE'}</dt><dd className="mt-1 font-mono text-xl font-black">{score}</dd></div><div className="p-3"><dt className="font-mono text-[8px] tracking-widest text-white/35">{zh ? '干预' : 'HINTS'}</dt><dd className="mt-1 font-mono text-xl font-black">{hints}</dd></div></dl>
        </header>
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"><section className="min-w-0 border border-white/15 bg-black/20 p-3 shadow-[10px_10px_0_rgba(0,0,0,.35)] sm:p-6">{children}</section><aside className="space-y-4 lg:sticky lg:top-24">{aside}</aside></div>
      </div>
    </main>
  )
}

export function InstrumentButton({ children, onClick, disabled = false, primary = false }: { children: ReactNode; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={`min-h-11 border px-4 py-3 font-mono text-[10px] font-black uppercase tracking-[.12em] transition focus:outline-none focus:ring-2 focus:ring-[var(--instrument-accent)] disabled:cursor-not-allowed disabled:opacity-25 ${primary ? 'border-[var(--instrument-accent)] bg-[var(--instrument-accent)] text-[#17120d] hover:brightness-110' : 'border-white/20 text-white/65 hover:border-[var(--instrument-accent)] hover:text-[var(--instrument-accent)]'}`}>{children}</button>
}

export function InstrumentResult({ title, detail, onNext, nextLabel }: { title: string; detail: string; onNext: () => void; nextLabel: string }) {
  return <div className="border border-[var(--instrument-accent)] bg-[color-mix(in_srgb,var(--instrument-accent)_12%,transparent)] p-5 text-center"><p className="font-serif text-2xl font-black text-[var(--instrument-accent)]">{title}</p><p className="mt-2 text-sm text-white/55">{detail}</p><button type="button" onClick={onNext} className="mt-4 min-h-11 w-full bg-[var(--instrument-accent)] px-4 font-mono text-[10px] font-black uppercase tracking-wider text-[#17120d]">{nextLabel} →</button></div>
}

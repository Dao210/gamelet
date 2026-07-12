'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useLocale } from 'next-intl'

interface Props { title: string; titleZh: string; eyebrow: string; intro: string; introZh: string; accent: string; level: number; levelCount: number; score: number; children: ReactNode; aside: ReactNode }

export default function AdvancedPuzzleShell({ title, titleZh, eyebrow, intro, introZh, accent, level, levelCount, score, children, aside }: Props) {
  const zh = useLocale() === 'zh'
  const style = { '--advanced-accent': accent } as CSSProperties
  return <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#101415] text-[#f1eee5]" style={style}><div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px),radial-gradient(circle at 80% 10%,var(--advanced-accent) 0,transparent 24%)', backgroundSize: '30px 30px,30px 30px,auto' }} /><div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:py-11"><header className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[1fr_390px] lg:items-end"><div><p className="mb-4 font-mono text-[10px] font-black tracking-[.32em] text-[var(--advanced-accent)]">{eyebrow}</p><h1 className="font-serif text-[clamp(3rem,8vw,7rem)] font-black leading-[.8] tracking-[-.07em]">{zh ? titleZh : title}</h1></div><div className="border-l-2 border-[var(--advanced-accent)] pl-5"><p className="text-sm leading-7 text-white/55">{zh ? introZh : intro}</p><p className="mt-3 font-mono text-[9px] tracking-[.2em] text-[var(--advanced-accent)]">{zh ? '记录' : 'RECORD'} {level}/{levelCount} · {zh ? '得分' : 'SCORE'} {score}</p></div></header><div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start"><section className="min-w-0 border border-white/15 bg-black/20 p-3 shadow-[10px_10px_0_rgba(0,0,0,.35)] sm:p-6">{children}</section><aside className="space-y-4 lg:sticky lg:top-24">{aside}</aside></div></div></main>
}

export function AdvancedButton({ children, onClick, disabled = false, primary = false }: { children: ReactNode; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={`min-h-11 border px-4 py-3 font-mono text-[10px] font-black uppercase tracking-[.12em] transition focus:outline-none focus:ring-2 focus:ring-[var(--advanced-accent)] disabled:opacity-25 ${primary ? 'border-[var(--advanced-accent)] bg-[var(--advanced-accent)] text-[#111]' : 'border-white/20 text-white/65 hover:border-[var(--advanced-accent)] hover:text-[var(--advanced-accent)]'}`}>{children}</button>
}

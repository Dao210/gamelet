'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const filters = ['all', 'playable', 'math', 'spatial', 'observation', 'word'] as const

type Filter = (typeof filters)[number]

type Game = {
  id: 'nerdle' | 'fibonacci' | 'mirrorMaze' | 'glyphGarden' | 'cipherBento' | 'orbitSum'
  title: string
  href?: string
  filters: Filter[]
  accent: string
  surface: string
  glyph: string
  pattern: string[]
}

type SparkPuzzle = {
  id: 'sequence' | 'shape' | 'equation'
  tiles: string[]
  options: string[]
  answer: string
}

const games: Game[] = [
  {
    id: 'nerdle',
    title: 'Nerdle',
    href: '/nerd/game',
    filters: ['math', 'playable'],
    accent: '#00a676',
    surface: '#eefcf5',
    glyph: '12+7=19',
    pattern: ['1', '2', '+', '7', '=', '1', '9', '?']
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci 2584',
    href: '/2584',
    filters: ['math', 'spatial', 'playable'],
    accent: '#f07c2f',
    surface: '#fff3e6',
    glyph: '1 1 2 3',
    pattern: ['1', '1', '2', '3', '5', '8', '13', '21']
  },
  {
    id: 'mirrorMaze',
    title: 'Mirror Maze',
    href: '/mirror-maze',
    filters: ['spatial', 'observation'],
    accent: '#2f7df0',
    surface: '#edf5ff',
    glyph: '↗︎ ↘︎ ↙︎',
    pattern: ['╱', '•', '╲', '→', '◇', '╱', '•', '◎']
  },
  {
    id: 'glyphGarden',
    title: 'Glyph Garden',
    href: '/glyph-garden',
    filters: ['observation', 'playable'],
    accent: '#7c5cff',
    surface: '#f3f0ff',
    glyph: '△ ◇ ✦',
    pattern: ['△', '△', '◇', '△', '◇', '◇', '✦', '?']
  },
  {
    id: 'cipherBento',
    title: 'Word Cipher Box',
    href: '/word-cipher-box',
    filters: ['word', 'observation', 'playable'],
    accent: '#db3f5d',
    surface: '#fff0f3',
    glyph: 'A1 B2 C3',
    pattern: ['A', '1', 'B', '2', 'C', '3', 'D', '?']
  },
  {
    id: 'orbitSum',
    title: 'Orbit Sum',
    href: '/orbit-sum',
    filters: ['math', 'spatial', 'playable'],
    accent: '#00a0b0',
    surface: '#e9fbfd',
    glyph: '9 + ? = 14',
    pattern: ['9', '5', '4', '◎', '7', '2', '6', '3']
  }
]

const sparkPuzzles: SparkPuzzle[] = [
  {
    id: 'sequence',
    tiles: ['2', '3', '5', '8', '13', '?'],
    options: ['18', '21', '23'],
    answer: '21'
  },
  {
    id: 'shape',
    tiles: ['△', '◇', '△', '◇', '◇', '?'],
    options: ['△', '◇', '○'],
    answer: '△'
  },
  {
    id: 'equation',
    tiles: ['9', '+', '?', '=', '14'],
    options: ['4', '5', '6'],
    answer: '5'
  }
]

export default function GameCollectionHome() {
  const t = useTranslations('homePage')
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentPuzzle = sparkPuzzles[puzzleIndex]
  const filteredGames = useMemo(() => {
    if (activeFilter === 'all') return games
    if (activeFilter === 'playable') return games.filter((game) => Boolean(game.href))
    return games.filter((game) => game.filters.includes(activeFilter))
  }, [activeFilter])

  const goToNextPuzzle = () => {
    setPuzzleIndex((index) => (index + 1) % sparkPuzzles.length)
    setSelectedAnswer(null)
  }

  return (
    <div className="gamelet-arcade min-h-screen bg-[#f8faf6] text-[#171711]">
      <section className="relative isolate overflow-hidden border-b border-black/[0.06] bg-[#f7f8f2]">
        <div className="absolute -right-32 -top-48 -z-10 h-[560px] w-[560px] rounded-full bg-[#d9f3e7]/70 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-64 left-[18%] -z-10 h-[480px] w-[480px] rounded-full bg-[#fff0bc]/50 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)] lg:items-center lg:gap-20 lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-7 inline-flex w-fit items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#4d554e]">
              <span className="h-2 w-2 rounded-full bg-[#00a676]" aria-hidden="true" />
              Gamelet Puzzle Arcade
            </p>
            <h1 className="arcade-display max-w-4xl text-[clamp(3.5rem,7vw,6.8rem)] font-black leading-[0.92] tracking-[-0.045em] text-[#151713]">
              {t('hero.title')}
              <span className="block text-[#008f66]">{t('hero.titleAccent')}</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#5e655f] sm:text-lg sm:leading-8">
              {t('hero.description')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nerd/game"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171a17] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#008f66] focus:outline-none focus:ring-2 focus:ring-[#008f66] focus:ring-offset-2"
              >
                {t('hero.playNerdle')}
              </Link>
              <a
                href="#games"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-bold text-[#242924] transition-all hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
              >
                {t('hero.browseGames')}
              </a>
            </div>

            <dl className="mt-12 flex max-w-xl items-center text-sm">
              <div className="flex min-w-24 flex-col">
                <dt className="order-2 mt-0.5 text-xs text-[#7a817a]">{t('stats.games')}</dt>
                <dd className="arcade-display order-1 text-2xl font-black text-[#20241f]">6</dd>
              </div>
              <div className="flex min-w-24 flex-col border-l border-black/10 pl-6">
                <dt className="order-2 mt-0.5 text-xs text-[#7a817a]">{t('stats.playable')}</dt>
                <dd className="arcade-display order-1 text-2xl font-black text-[#20241f]">6</dd>
              </div>
              <div className="flex min-w-24 flex-col border-l border-black/10 pl-6">
                <dt className="order-2 mt-0.5 text-xs text-[#7a817a]">{t('stats.styles')}</dt>
                <dd className="arcade-display order-1 text-2xl font-black text-[#20241f]">4</dd>
              </div>
            </dl>
          </div>

          <aside className="self-center rounded-[2rem] border border-black/[0.07] bg-white/75 p-5 text-[#20241f] shadow-[0_24px_80px_rgba(39,64,48,0.10)] backdrop-blur-md sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#008f66]">
                Daily Spark
              </span>
              <span className="rounded-full bg-[#eef3ee] px-2.5 py-1 text-xs text-[#747c74]">#{puzzleIndex + 1}</span>
            </div>
            <h2 className="arcade-display text-3xl font-black leading-[1.05] tracking-[-0.02em]">
              {t(`puzzles.${currentPuzzle.id}.prompt`)}
            </h2>
            <div className="my-6 grid grid-cols-3 gap-2" aria-label={t('puzzles.ariaLabel')}>
              {currentPuzzle.tiles.map((tile, index) => (
                <div
                  key={`${tile}-${index}`}
                  className="flex aspect-square items-center justify-center rounded-xl border border-black/[0.06] bg-[#f3f5f1] text-2xl font-black text-[#20241f]"
                >
                  {tile}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {currentPuzzle.options.map((option) => {
                const isSelected = selectedAnswer === option
                const isAnswer = option === currentPuzzle.answer

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedAnswer(option)}
                    className={`min-h-12 rounded-xl border px-3 text-lg font-black transition-all focus:outline-none focus:ring-2 focus:ring-[#008f66] focus:ring-offset-2 ${
                      isSelected && isAnswer
                        ? 'border-[#00a676] bg-[#00a676] text-white'
                        : isSelected
                          ? 'border-[#db3f5d] bg-[#db3f5d] text-white'
                        : 'border-black/[0.08] bg-white text-[#343a34] hover:border-[#008f66]/40 hover:bg-[#f3faf6]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 min-h-6 text-sm text-[#747c74]">
              {selectedAnswer
                ? selectedAnswer === currentPuzzle.answer
                  ? t('puzzles.correct', { note: t(`puzzles.${currentPuzzle.id}.note`) })
                  : t('puzzles.incorrect')
                : t('puzzles.choose')}
            </p>
            <button
              type="button"
              onClick={goToNextPuzzle}
              className="mt-5 min-h-11 w-full rounded-xl bg-[#171a17] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[#008f66] focus:outline-none focus:ring-2 focus:ring-[#008f66] focus:ring-offset-2"
            >
              {t('puzzles.next')}
            </button>
          </aside>
        </div>
      </section>

      <section id="games" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#00a676]">
              Game Shelf
            </p>
            <h2 className="arcade-display mt-2 text-4xl font-black leading-tight sm:text-5xl">
              {t('shelf.title')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('filters.ariaLabel')}>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`min-h-10 border px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2 ${
                  activeFilter === filter
                    ? 'border-[#171711] bg-[#171711] text-white'
                    : 'border-black/15 bg-white text-[#34342a] hover:border-[#171711]'
                }`}
                role="tab"
                aria-selected={activeFilter === filter}
              >
                {t(`filters.${filter}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <article
              key={game.title}
              className="group flex min-h-[410px] flex-col border border-black/10 p-5 shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: game.surface,
                '--game-accent': game.accent
              } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-accent)]">
                    {t(`games.${game.id}.kicker`)}
                  </p>
                  <h3 className="arcade-display mt-2 text-3xl font-black leading-tight">
                    {game.title}
                  </h3>
                </div>
                <span className="border border-black/10 bg-white/70 px-2 py-1 text-xs font-bold text-[#34342a]">
                  {t(`games.${game.id}.status`)}
                </span>
              </div>

              <div className="my-5 border border-black/10 bg-white/60 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6c6b5b]">
                    Pattern
                  </span>
                  <span className="text-xs font-bold text-[var(--game-accent)]">
                    {game.glyph}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2" aria-hidden="true">
                  {game.pattern.map((item, index) => (
                    <span
                      key={`${game.title}-${item}-${index}`}
                      className="flex aspect-square items-center justify-center border border-black/10 bg-white text-lg font-black text-[#171711]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <p className="min-h-20 text-base leading-7 text-[#424235]">
                {t(`games.${game.id}.description`)}
              </p>

              <dl className="mt-auto grid grid-cols-2 gap-2 pt-5 text-sm">
                <div className="border-t border-black/10 pt-3">
                  <dt className="text-[#6c6b5b]">{t('card.duration')}</dt>
                  <dd className="font-black">{t(`games.${game.id}.time`)}</dd>
                </div>
                <div className="border-t border-black/10 pt-3">
                  <dt className="text-[#6c6b5b]">{t('card.difficulty')}</dt>
                  <dd className="font-black">{t(`games.${game.id}.level`)}</dd>
                </div>
              </dl>

              <div className="mt-5">
                {game.href ? (
                  <Link
                    href={game.href}
                    className="inline-flex min-h-11 w-full items-center justify-center border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_var(--game-accent)] transition-transform group-hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
                  >
                    {t('card.play')}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 w-full items-center justify-center border border-black/15 bg-white/55 px-4 py-2 text-sm font-black text-[#6c6b5b]">
                    {t('card.planned')}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#171711] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#ffe66d]">
              Next Drop
            </p>
            <h2 className="arcade-display mt-2 text-4xl font-black">
              {t('nextDrop.title')}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {(['short', 'fresh', 'mobile'] as const).map((value) => (
              <div key={value} className="border border-white/15 bg-white/5 p-4">
                <p className="text-lg font-black">{t(`nextDrop.items.${value}`)}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {t('nextDrop.description')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

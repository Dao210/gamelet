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
    filters: ['spatial', 'observation'],
    accent: '#2f7df0',
    surface: '#edf5ff',
    glyph: '↗︎ ↘︎ ↙︎',
    pattern: ['╱', '•', '╲', '→', '◇', '╱', '•', '◎']
  },
  {
    id: 'glyphGarden',
    title: 'Glyph Garden',
    filters: ['observation'],
    accent: '#7c5cff',
    surface: '#f3f0ff',
    glyph: '△ ◇ ✦',
    pattern: ['△', '△', '◇', '△', '◇', '◇', '✦', '?']
  },
  {
    id: 'cipherBento',
    title: 'Cipher Bento',
    filters: ['word', 'observation'],
    accent: '#db3f5d',
    surface: '#fff0f3',
    glyph: 'A1 B2 C3',
    pattern: ['A', '1', 'B', '2', 'C', '3', 'D', '?']
  },
  {
    id: 'orbitSum',
    title: 'Orbit Sum',
    filters: ['math', 'spatial'],
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
      <section className="relative overflow-hidden border-b border-black/10 bg-[#f7f8ee]">
        <div className="arcade-grid-bg absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-16">
          <div className="flex min-h-[520px] flex-col justify-center">
            <p className="mb-5 inline-flex w-fit items-center gap-2 border border-black/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-[#2f2f22] shadow-[3px_3px_0_#171711]">
              Gamelet Puzzle Arcade
            </p>
            <h1 className="arcade-display max-w-4xl text-5xl font-black leading-[0.96] text-[#11110d] sm:text-6xl lg:text-7xl">
              {t('hero.title')}
              <span className="block text-[#db3f5d]">{t('hero.titleAccent')}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#424235]">
              {t('hero.description')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nerd/game"
                className="inline-flex min-h-12 items-center justify-center border border-[#171711] bg-[#171711] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#00a676] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
              >
                {t('hero.playNerdle')}
              </Link>
              <a
                href="#games"
                className="inline-flex min-h-12 items-center justify-center border border-[#171711] bg-[#ffe66d] px-5 py-3 text-sm font-bold text-[#171711] shadow-[4px_4px_0_#171711] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
              >
                {t('hero.browseGames')}
              </a>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-black/10 py-5 text-sm">
              <div>
                <dt className="text-[#6c6b5b]">{t('stats.games')}</dt>
                <dd className="arcade-display mt-1 text-3xl font-black">6</dd>
              </div>
              <div>
                <dt className="text-[#6c6b5b]">{t('stats.playable')}</dt>
                <dd className="arcade-display mt-1 text-3xl font-black">2</dd>
              </div>
              <div>
                <dt className="text-[#6c6b5b]">{t('stats.styles')}</dt>
                <dd className="arcade-display mt-1 text-3xl font-black">4</dd>
              </div>
            </dl>
          </div>

          <aside className="self-center border border-[#171711] bg-[#10100d] p-4 text-white shadow-[8px_8px_0_#db3f5d]">
            <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffe66d]">
                Daily Spark
              </span>
              <span className="text-xs text-white/60">#{puzzleIndex + 1}</span>
            </div>
            <h2 className="arcade-display text-3xl font-black leading-tight">
              {t(`puzzles.${currentPuzzle.id}.prompt`)}
            </h2>
            <div className="my-6 grid grid-cols-3 gap-2" aria-label={t('puzzles.ariaLabel')}>
              {currentPuzzle.tiles.map((tile, index) => (
                <div
                  key={`${tile}-${index}`}
                  className="flex aspect-square items-center justify-center border border-white/15 bg-white text-2xl font-black text-[#171711]"
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
                    className={`min-h-12 border px-3 text-lg font-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffe66d] focus:ring-offset-2 focus:ring-offset-[#10100d] ${
                      isSelected && isAnswer
                        ? 'border-[#00a676] bg-[#00a676] text-white'
                        : isSelected
                          ? 'border-[#db3f5d] bg-[#db3f5d] text-white'
                          : 'border-white/30 bg-white/5 text-white hover:bg-white/15'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 min-h-6 text-sm text-white/75">
              {selectedAnswer
                ? selectedAnswer === currentPuzzle.answer
                  ? t('puzzles.correct', { note: t(`puzzles.${currentPuzzle.id}.note`) })
                  : t('puzzles.incorrect')
                : t('puzzles.choose')}
            </p>
            <button
              type="button"
              onClick={goToNextPuzzle}
              className="mt-5 min-h-11 w-full border border-white/25 bg-[#ffe66d] px-4 py-2 text-sm font-black text-[#171711] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#ffe66d] focus:ring-offset-2 focus:ring-offset-[#10100d]"
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

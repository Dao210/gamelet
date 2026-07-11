'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from '@/i18n/routing'

const filters = ['全部', '可玩', '数学', '空间', '观察', '文字'] as const

type Filter = (typeof filters)[number]

type Game = {
  title: string
  kicker: string
  description: string
  href?: string
  status: string
  filters: Filter[]
  time: string
  level: string
  accent: string
  surface: string
  glyph: string
  pattern: string[]
}

type SparkPuzzle = {
  prompt: string
  tiles: string[]
  options: string[]
  answer: string
  note: string
}

const games: Game[] = [
  {
    title: 'Nerdle',
    kicker: '方程侦探',
    description: '用 6 次猜测拆开隐藏算式，颜色反馈会一点点暴露答案。',
    href: '/nerd/game',
    status: '现在可玩',
    filters: ['数学', '可玩'],
    time: '4 分钟',
    level: '中等',
    accent: '#00a676',
    surface: '#eefcf5',
    glyph: '12+7=19',
    pattern: ['1', '2', '+', '7', '=', '1', '9', '?']
  },
  {
    title: 'Fibonacci 2584',
    kicker: '数列合成',
    description: '像 2048 一样滑动方块，但只有相邻斐波那契数字才能合并。',
    href: '/2584',
    status: '现在可玩',
    filters: ['数学', '空间', '可玩'],
    time: '7 分钟',
    level: '进阶',
    accent: '#f07c2f',
    surface: '#fff3e6',
    glyph: '1 1 2 3',
    pattern: ['1', '1', '2', '3', '5', '8', '13', '21']
  },
  {
    title: 'Mirror Maze',
    kicker: '反射迷宫',
    description: '旋转镜面，让一束光绕过陷阱抵达目标出口。',
    status: '新游戏设计中',
    filters: ['空间', '观察'],
    time: '5 分钟',
    level: '中等',
    accent: '#2f7df0',
    surface: '#edf5ff',
    glyph: '↗︎ ↘︎ ↙︎',
    pattern: ['╱', '•', '╲', '→', '◇', '╱', '•', '◎']
  },
  {
    title: 'Glyph Garden',
    kicker: '图形生长',
    description: '观察符号的成长规则，选择下一朵会出现的图形。',
    status: '新游戏设计中',
    filters: ['观察'],
    time: '3 分钟',
    level: '轻松',
    accent: '#7c5cff',
    surface: '#f3f0ff',
    glyph: '△ ◇ ✦',
    pattern: ['△', '△', '◇', '△', '◇', '◇', '✦', '?']
  },
  {
    title: 'Cipher Bento',
    kicker: '文字密码盒',
    description: '用极短线索破解词组，像拆便当一样一格一格打开。',
    status: '新游戏设计中',
    filters: ['文字', '观察'],
    time: '6 分钟',
    level: '烧脑',
    accent: '#db3f5d',
    surface: '#fff0f3',
    glyph: 'A1 B2 C3',
    pattern: ['A', '1', 'B', '2', 'C', '3', 'D', '?']
  },
  {
    title: 'Orbit Sum',
    kicker: '轨道加法',
    description: '把数字推入轨道，让每一圈都刚好配平目标和。',
    status: '新游戏设计中',
    filters: ['数学', '空间'],
    time: '8 分钟',
    level: '高手',
    accent: '#00a0b0',
    surface: '#e9fbfd',
    glyph: '9 + ? = 14',
    pattern: ['9', '5', '4', '◎', '7', '2', '6', '3']
  }
]

const sparkPuzzles: SparkPuzzle[] = [
  {
    prompt: '补齐这一组数列',
    tiles: ['2', '3', '5', '8', '13', '?'],
    options: ['18', '21', '23'],
    answer: '21',
    note: '每一格是前两格相加。'
  },
  {
    prompt: '下一个图形是哪一个',
    tiles: ['△', '◇', '△', '◇', '◇', '?'],
    options: ['△', '◇', '○'],
    answer: '△',
    note: '图形按一短一长的节奏交替。'
  },
  {
    prompt: '让等式成立',
    tiles: ['9', '+', '?', '=', '14'],
    options: ['4', '5', '6'],
    answer: '5',
    note: '9 + 5 = 14。'
  }
]

export default function GameCollectionHome() {
  const [activeFilter, setActiveFilter] = useState<Filter>('全部')
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentPuzzle = sparkPuzzles[puzzleIndex]
  const filteredGames = useMemo(() => {
    if (activeFilter === '全部') return games
    if (activeFilter === '可玩') return games.filter((game) => Boolean(game.href))
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
              聪明一点，
              <span className="block text-[#db3f5d]">也快乐一点。</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#424235]">
              一个轻量益智小游戏集合：数学推理、空间合成、图形观察和文字密码都在这里。
              先玩现有佳作，再等一批更怪、更短、更上头的新游戏上线。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nerd/game"
                className="inline-flex min-h-12 items-center justify-center border border-[#171711] bg-[#171711] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#00a676] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
              >
                先玩 Nerdle
              </Link>
              <a
                href="#games"
                className="inline-flex min-h-12 items-center justify-center border border-[#171711] bg-[#ffe66d] px-5 py-3 text-sm font-bold text-[#171711] shadow-[4px_4px_0_#171711] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
              >
                浏览游戏馆
              </a>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-black/10 py-5 text-sm">
              <div>
                <dt className="text-[#6c6b5b]">游戏</dt>
                <dd className="arcade-display mt-1 text-3xl font-black">6</dd>
              </div>
              <div>
                <dt className="text-[#6c6b5b]">可玩</dt>
                <dd className="arcade-display mt-1 text-3xl font-black">2</dd>
              </div>
              <div>
                <dt className="text-[#6c6b5b]">风格</dt>
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
              {currentPuzzle.prompt}
            </h2>
            <div className="my-6 grid grid-cols-3 gap-2" aria-label="今日益智题">
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
                  ? `答对了，${currentPuzzle.note}`
                  : '差一点，再观察一下规律。'
                : '选一个答案试试看。'}
            </p>
            <button
              type="button"
              onClick={goToNextPuzzle}
              className="mt-5 min-h-11 w-full border border-white/25 bg-[#ffe66d] px-4 py-2 text-sm font-black text-[#171711] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#ffe66d] focus:ring-offset-2 focus:ring-offset-[#10100d]"
            >
              换一题
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
              今天想挑战哪一种脑回路？
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="游戏类型筛选">
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
                {filter}
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
                    {game.kicker}
                  </p>
                  <h3 className="arcade-display mt-2 text-3xl font-black leading-tight">
                    {game.title}
                  </h3>
                </div>
                <span className="border border-black/10 bg-white/70 px-2 py-1 text-xs font-bold text-[#34342a]">
                  {game.status}
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
                {game.description}
              </p>

              <dl className="mt-auto grid grid-cols-2 gap-2 pt-5 text-sm">
                <div className="border-t border-black/10 pt-3">
                  <dt className="text-[#6c6b5b]">单局</dt>
                  <dd className="font-black">{game.time}</dd>
                </div>
                <div className="border-t border-black/10 pt-3">
                  <dt className="text-[#6c6b5b]">难度</dt>
                  <dd className="font-black">{game.level}</dd>
                </div>
              </dl>

              <div className="mt-5">
                {game.href ? (
                  <Link
                    href={game.href}
                    className="inline-flex min-h-11 w-full items-center justify-center border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_var(--game-accent)] transition-transform group-hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#171711] focus:ring-offset-2"
                  >
                    开始玩
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 w-full items-center justify-center border border-black/15 bg-white/55 px-4 py-2 text-sm font-black text-[#6c6b5b]">
                    加入开发排期
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
              小游戏会持续上新
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['短局制', '规则新鲜', '手机友好'].map((value) => (
              <div key={value} className="border border-white/15 bg-white/5 p-4">
                <p className="text-lg font-black">{value}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  每个游戏都适合碎片时间，但保留一点值得琢磨的策略空间。
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

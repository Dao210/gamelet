export type Faction = 'cyan' | 'magenta' | 'gold'
export type Difficulty = 'cadet' | 'commander' | 'admiral'
export type DispatchRatio = 0.25 | 0.5 | 1
export type SectorId = 'first-light' | 'parallax' | 'helix' | 'citadel' | 'far-reach' | 'starfall'
export type Core = { id: number; x: number; y: number; owner: Faction | null; energy: number; production: number }
export type Fleet = { id: number; owner: Faction; from: number; to: number; amount: number; progress: number; duration: number }
export type Sector = { id: SectorId; mode: 'classic' | 'expanse'; cores: Core[]; links: [number, number][]; size: number; par: number }
export type Battle = {
  sector: Sector
  difficulty: Difficulty
  cores: Core[]
  fleets: Fleet[]
  phase: 'ready' | 'running' | 'paused' | 'won' | 'lost'
  elapsed: number
  aiClock: number
  nextFleet: number
  selected: number | null
  ratio: DispatchRatio
  launches: number
  notice: 'select' | 'target' | 'sent' | 'energy' | 'capacity' | 'friendly'
}

export const FACTIONS: Faction[] = ['cyan', 'magenta', 'gold']
export const DISPATCH_RATIOS: DispatchRatio[] = [0.25, 0.5, 1]
export const MAX_FLEETS = 72
export const STEP_SECONDS = 0.1
const AI_INTERVAL: Record<Difficulty, number> = { cadet: 3.6, commander: 2, admiral: 1.2 }

// Original Gamelet maps: concentric constellations, connected by their nearest lanes.
function constellation(id: SectorId, rings: number, twist: number, stretch = 1): Sector {
  const mode = rings === 4 ? 'expanse' : 'classic'
  const size = mode === 'expanse' ? 1400 : 800
  const cores: Core[] = [{ id: 0, x: size / 2, y: size / 2, owner: null, energy: 42, production: 0 }]
  for (let ring = 1; ring <= rings; ring++) {
    const count = rings === 4 ? ring * 6 : 6
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2 + (ring % 2 === 0 ? twist : 0)
      const radius = (ring / rings) * size * 0.39
      const owner = ring === rings && i % (count / 3) === 0 ? FACTIONS[i / (count / 3)] : null
      cores.push({
        id: cores.length,
        x: size / 2 + Math.cos(angle) * radius * stretch,
        y: size / 2 + Math.sin(angle) * radius,
        owner, energy: owner ? 34 : 7 + ((i * 7 + ring * 3) % 18), production: 0
      })
    }
  }
  const pairs = new Map<string, [number, number]>()
  const orbitalRadius = (core: Core) => Math.hypot((core.x - size / 2) / stretch, core.y - size / 2)
  for (const core of cores) {
    const nearest = cores.filter(other => other.id !== core.id)
      .sort((a, b) => distance(core, a) - distance(core, b)).slice(0, 3)
    // An inward lane keeps dense outer rings connected to the rest of the network.
    const inward = cores.filter(other => orbitalRadius(other) < orbitalRadius(core) - 1)
      .sort((a, b) => distance(core, a) - distance(core, b))[0]
    if (inward) nearest.push(inward)
    for (const neighbor of nearest) {
      const pair: [number, number] = [Math.min(core.id, neighbor.id), Math.max(core.id, neighbor.id)]
      pairs.set(pair.join(':'), pair)
    }
  }
  return { id, mode, size, cores, links: [...pairs.values()], par: mode === 'expanse' ? 720 : 210 + rings * 30 }
}

export const PULSEFRONT_SECTORS: Sector[] = [
  constellation('first-light', 2, Math.PI / 6),
  constellation('parallax', 2, 0, 0.8),
  constellation('helix', 3, Math.PI / 5),
  constellation('citadel', 3, 0, 0.85),
  constellation('far-reach', 4, Math.PI / 12),
  constellation('starfall', 4, Math.PI / 7, 0.85)
]

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function createBattle(sector = PULSEFRONT_SECTORS[0], difficulty: Difficulty = 'commander'): Battle {
  return {
    sector, difficulty, cores: sector.cores.map(core => ({ ...core })), fleets: [],
    phase: 'ready', elapsed: 0, aiClock: 0, nextFleet: 1, selected: null,
    ratio: 0.5, launches: 0, notice: 'select'
  }
}

export function energyCap(battle: Battle): number {
  return battle.sector.mode === 'expanse' ? 120 : 99
}

export function productionRate(battle: Battle, core: Core): number {
  if (!core.owner) return 0
  const neighbors = battle.sector.links.reduce((count, [a, b]) => {
    const other = a === core.id ? b : b === core.id ? a : null
    return count + (other !== null && battle.cores[other]?.owner === core.owner ? 1 : 0)
  }, 0)
  return 0.9 * (1 + Math.min(0.3, neighbors * 0.1))
}

function flightDuration(battle: Battle, from: Core, to: Core): number {
  return Math.max(0.4, distance(from, to) / (battle.sector.mode === 'expanse' ? 150 : 88))
}

// Mutates only a freshly copied battle; all exported state transitions are immutable.
function dispatch(battle: Battle, owner: Faction, from: number, to: number, ratio: DispatchRatio): boolean {
  const source = battle.cores[from]
  const target = battle.cores[to]
  if (!source || !target || from === to || source.owner !== owner || !DISPATCH_RATIOS.includes(ratio)) return false
  if (battle.fleets.length >= MAX_FLEETS) return false
  const amount = Math.floor(source.energy * ratio)
  if (amount < 2) return false
  source.energy -= amount
  battle.fleets.push({ id: battle.nextFleet++, owner, from, to, amount, progress: 0, duration: flightDuration(battle, source, target) })
  return true
}

export function sendFleet(battle: Battle, owner: Faction, from: number, to: number, ratio: DispatchRatio): Battle {
  if (battle.phase !== 'running') return battle
  const next = { ...battle, cores: battle.cores.map(core => ({ ...core })), fleets: [...battle.fleets] }
  return dispatch(next, owner, from, to, ratio) ? next : battle
}

export function selectCore(battle: Battle, id: number): Battle {
  if (battle.phase !== 'running' || !battle.cores[id]) return battle
  if (battle.selected === id) return { ...battle, selected: null, notice: 'select' }
  const source = battle.selected === null ? null : battle.cores[battle.selected]
  if (!source || source.owner !== 'cyan') {
    return battle.cores[id].owner === 'cyan'
      ? { ...battle, selected: id, notice: 'target' }
      : { ...battle, selected: null, notice: 'friendly' }
  }
  const next = sendFleet(battle, 'cyan', source.id, id, battle.ratio)
  if (next === battle) return { ...battle, notice: battle.fleets.length >= MAX_FLEETS ? 'capacity' : 'energy' }
  return { ...next, selected: null, launches: battle.launches + 1, notice: 'sent' }
}

function incoming(battle: Battle, core: Core, faction: Faction, friendly: boolean): number {
  return battle.fleets.reduce((sum, fleet) => sum + (
    fleet.to === core.id && (friendly ? fleet.owner === faction : fleet.owner !== faction) ? fleet.amount : 0
  ), 0)
}

function takeAiTurn(battle: Battle, faction: Faction): void {
  const owned = battle.cores.filter(core => core.owner === faction).sort((a, b) => b.energy - a.energy)
  if (!owned.length) return
  // Reinforce endangered cores first. AI sees the same public fleet information as the player.
  const threatened = owned.find(core => incoming(battle, core, faction, false) > core.energy + incoming(battle, core, faction, true))
  if (threatened) {
    const donor = owned.find(core => core.id !== threatened.id && core.energy >= 16)
    if (donor && dispatch(battle, faction, donor.id, threatened.id, 0.5)) return
  }
  const reserve = battle.difficulty === 'cadet' ? 10 : battle.difficulty === 'commander' ? 6 : 3
  let best: { from: number; to: number; ratio: DispatchRatio; score: number } | null = null
  for (const source of owned) {
    if (source.energy < 12) continue
    for (const target of battle.cores) {
      if (target.owner === faction) continue
      const duration = flightDuration(battle, source, target)
      const support = incoming(battle, target, faction, true)
      const required = target.energy + productionRate(battle, target) * duration + 2 - support
      if (required <= 0) continue
      const ratio = DISPATCH_RATIOS.find(value => Math.floor(source.energy * value) >= required && source.energy * (1 - value) >= reserve)
        ?? (source.energy >= energyCap(battle) - 2 && source.energy >= required ? 1 : undefined)
      if (!ratio) continue
      const score = (target.owner === null ? 20 : 12) - required * 0.35 - duration * 2
      if (!best || score > best.score) best = { from: source.id, to: target.id, ratio, score }
    }
  }
  if (best) {
    dispatch(battle, faction, best.from, best.to, best.ratio)
    return
  }
  // A full enemy core cannot be beaten by one capped source. Commit a combined
  // wave so a mature network can still break a defended frontier.
  const targets = battle.cores.filter(core => core.owner !== faction).sort((a, b) => a.energy - b.energy)
  for (const target of targets) {
    const support = incoming(battle, target, faction, true)
    if (support > target.energy) continue
    const donors = owned.filter(core => core.energy >= 40)
      .sort((a, b) => distance(a, target) - distance(b, target))
    let force = support
    let travel = 0
    const wave: Core[] = []
    for (const donor of donors) {
      if (battle.fleets.length + wave.length >= MAX_FLEETS) break
      wave.push(donor)
      force += Math.floor(donor.energy * 0.5)
      travel = Math.max(travel, flightDuration(battle, donor, target))
      if (force >= target.energy + productionRate(battle, target) * travel + 3) {
        for (const source of wave) dispatch(battle, faction, source.id, target.id, 0.5)
        return
      }
    }
  }
  // Move rear reserves towards the front when no single core can afford an attack.
  const source = owned.find(core => core.energy >= 35)
  const enemies = battle.cores.filter(core => core.owner !== faction)
  if (!source || owned.length < 2 || !enemies.length) return
  const nearestThreat = (core: Core) => Math.min(...enemies.map(other => distance(core, other)))
  const frontier = [...owned].sort((a, b) => nearestThreat(a) - nearestThreat(b))[0]
  if (source.id !== frontier.id && frontier.energy + incoming(battle, frontier, faction, true) < energyCap(battle) - 15) {
    dispatch(battle, faction, source.id, frontier.id, 0.5)
  }
}

export function livingFactions(battle: Battle): Faction[] {
  return FACTIONS.filter(owner => battle.cores.some(core => core.owner === owner) || battle.fleets.some(fleet => fleet.owner === owner))
}

export function tickBattle(battle: Battle, seconds = STEP_SECONDS): Battle {
  if (battle.phase !== 'running' || !Number.isFinite(seconds) || seconds <= 0) return battle
  // Bound each step so returning from a background tab cannot skip an entire battle.
  const delta = Math.min(seconds, 0.25)
  const next: Battle = {
    ...battle, elapsed: battle.elapsed + delta, aiClock: battle.aiClock + delta,
    cores: battle.cores.map(core => ({ ...core })), fleets: battle.fleets.map(fleet => ({ ...fleet }))
  }
  const cap = energyCap(next)
  for (const core of next.cores) {
    if (core.owner && core.energy < cap) {
      core.production += productionRate(battle, core) * delta
      const added = Math.floor(core.production)
      core.production -= added
      core.energy = Math.min(cap, core.energy + added)
    }
  }
  const arrived: Fleet[] = []
  for (const fleet of next.fleets) {
    fleet.progress += delta / fleet.duration
    if (fleet.progress >= 1) arrived.push(fleet)
  }
  // Resolve by actual arrival time, then launch order, independent of array ordering.
  arrived.sort((a, b) => (1 - a.progress) * a.duration - (1 - b.progress) * b.duration || a.id - b.id)
  for (const fleet of arrived) {
    const target = next.cores[fleet.to]
    if (target.owner === fleet.owner) target.energy = Math.min(cap, target.energy + fleet.amount)
    else if (fleet.amount >= target.energy) {
      target.owner = fleet.owner
      target.energy = Math.max(1, fleet.amount - target.energy)
      target.production = 0
      if (next.selected === target.id) { next.selected = null; next.notice = 'select' }
    } else target.energy -= fleet.amount
  }
  next.fleets = next.fleets.filter(fleet => fleet.progress < 1)
  const alive = livingFactions(next)
  if (!alive.includes('cyan')) next.phase = 'lost'
  else if (alive.length === 1) next.phase = 'won'
  if (next.phase !== 'running') { next.selected = null; return next }
  if (next.aiClock >= AI_INTERVAL[next.difficulty]) {
    next.aiClock %= AI_INTERVAL[next.difficulty]
    takeAiTurn(next, 'magenta')
    takeAiTurn(next, 'gold')
  }
  return next
}

export type BattleAction =
  | { type: 'tick' }
  | { type: 'start' | 'pause' | 'cancel' | 'restart' }
  | { type: 'select'; id: number }
  | { type: 'ratio'; ratio: DispatchRatio }
  | { type: 'configure'; sector: Sector; difficulty: Difficulty }

export function battleReducer(battle: Battle, action: BattleAction): Battle {
  switch (action.type) {
    case 'tick': return tickBattle(battle)
    case 'select': return selectCore(battle, action.id)
    case 'ratio': return { ...battle, ratio: action.ratio }
    case 'cancel': return { ...battle, selected: null, notice: 'select' }
    case 'start': return battle.phase === 'ready' || battle.phase === 'paused' ? { ...battle, phase: 'running' } : battle
    case 'pause': return battle.phase === 'running' ? { ...battle, phase: 'paused' } : battle
    case 'restart': return createBattle(battle.sector, battle.difficulty)
    case 'configure': return createBattle(action.sector, action.difficulty)
  }
}

export type BattleRecords = Record<string, { seconds: number; launches: number }>
export const RECORDS_KEY = 'gamelet:pulsefront:v1'
export const recordKey = (battle: Battle) => `${battle.sector.id}:${battle.difficulty}`
export const medalFor = (seconds: number, par: number) => seconds <= par ? 'gold' : seconds <= par * 1.5 ? 'silver' : 'bronze'

export function parseRecords(raw: string | null): BattleRecords {
  try {
    const parsed: unknown = JSON.parse(raw ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const valid: BattleRecords = {}
    for (const sector of PULSEFRONT_SECTORS) {
      for (const difficulty of ['cadet', 'commander', 'admiral']) {
        const key = `${sector.id}:${difficulty}`
        const entry = (parsed as BattleRecords)[key]
        if (entry && Number.isFinite(entry.seconds) && entry.seconds > 0 && Number.isInteger(entry.launches) && entry.launches >= 0) {
          valid[key] = { seconds: entry.seconds, launches: entry.launches }
        }
      }
    }
    return valid
  } catch { return {} }
}

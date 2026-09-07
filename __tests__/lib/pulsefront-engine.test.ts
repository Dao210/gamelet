import {
  battleReducer, createBattle, energyCap, livingFactions, MAX_FLEETS, parseRecords,
  productionRate, PULSEFRONT_SECTORS, selectCore, sendFleet, tickBattle, type Battle,
  type Fleet, type Sector
} from '@/lib/pulsefront-engine'

const fixture: Sector = {
  id: 'first-light', mode: 'classic', size: 800, par: 60,
  cores: [
    { id: 0, x: 100, y: 100, owner: 'cyan', energy: 40, production: 0 },
    { id: 1, x: 200, y: 100, owner: null, energy: 10, production: 0 },
    { id: 2, x: 300, y: 100, owner: 'magenta', energy: 30, production: 0 },
    { id: 3, x: 400, y: 100, owner: 'gold', energy: 30, production: 0 }
  ], links: [[0, 1], [1, 2], [2, 3]]
}
const running = (): Battle => ({ ...createBattle(fixture), phase: 'running', aiClock: -10000 })
const arrival = (overrides: Partial<Fleet> = {}): Fleet => ({ id: 1, owner: 'cyan', from: 0, to: 1, amount: 20, duration: 1, progress: 0.99, ...overrides })
const advance = (battle: Battle, count: number): Battle => {
  let next = battle
  for (let tick = 0; tick < count; tick++) next = tickBattle(next)
  return next
}

describe('Pulsefront battle rules', () => {
  it('dispatches directly without requiring a lane and conserves energy', () => {
    const before = running()
    const after = sendFleet(before, 'cyan', 0, 3, 0.5)
    expect(after.cores[0].energy).toBe(20)
    expect(after.fleets[0]).toMatchObject({ amount: 20, from: 0, to: 3, owner: 'cyan' })
    expect(after.fleets[0].duration).toBeCloseTo(300 / 88)
    expect(before.cores[0].energy).toBe(40)
    expect(before.fleets).toEqual([])
  })

  it.each([[0.25, 10], [0.5, 20], [1, 40]] as const)('sends the selected %s fraction', (ratio, amount) => {
    const result = sendFleet(running(), 'cyan', 0, 1, ratio)
    expect(result.fleets[0].amount).toBe(amount)
    expect(result.cores[0].energy + amount).toBe(40)
  })

  it('rejects enemy sources, invalid destinations, same-core sends and tiny fleets', () => {
    const battle = running()
    expect(sendFleet(battle, 'cyan', 2, 1, 1)).toBe(battle)
    expect(sendFleet(battle, 'cyan', 0, 99, 1)).toBe(battle)
    expect(sendFleet(battle, 'cyan', 0, 0, 1)).toBe(battle)
    battle.cores[0].energy = 3
    expect(sendFleet(battle, 'cyan', 0, 1, 0.5)).toBe(battle)
  })

  it('bounds fleet traffic without consuming energy', () => {
    const battle = running()
    battle.fleets = Array.from({ length: MAX_FLEETS }, (_, id) => arrival({ id }))
    expect(sendFleet(battle, 'cyan', 0, 1, 1)).toBe(battle)
    expect(selectCore({ ...battle, selected: 0 }, 1).notice).toBe('capacity')
  })

  it('selects only owned cores, cancels a repeated selection, and clears selection after dispatch', () => {
    expect(selectCore(running(), 2)).toMatchObject({ selected: null, notice: 'friendly' })
    const selected = selectCore(running(), 0)
    expect(selected.selected).toBe(0)
    expect(selectCore(selected, 0)).toMatchObject({ selected: null, launches: 0 })
    expect(selectCore(selected, 1)).toMatchObject({ selected: null, launches: 1, notice: 'sent' })
  })

  it('regenerates empty owned cores, leaves neutral cores idle, and caps production', () => {
    const battle = running()
    battle.cores[0].energy = 0
    battle.cores[2].energy = 99
    const after = advance(battle, 20)
    expect(after.cores[0].energy).toBe(1)
    expect(after.cores[1].energy).toBe(10)
    expect(after.cores[2].energy).toBe(99)
  })

  it('grants a production bonus only for connected same-owner cores', () => {
    const battle = running()
    expect(productionRate(battle, battle.cores[0])).toBe(0.9)
    battle.cores[1].owner = 'cyan'
    expect(productionRate(battle, battle.cores[0])).toBeCloseTo(0.99)
    expect(productionRate(battle, battle.cores[2])).toBe(0.9)
    const allCyan = createBattle(PULSEFRONT_SECTORS[4])
    allCyan.cores.forEach(core => { core.owner = 'cyan' })
    expect(Math.max(...allCyan.cores.map(core => productionRate(allCyan, core)))).toBeCloseTo(1.17)
  })

  it('reinforces friendly cores up to the energy cap', () => {
    const battle = running()
    battle.cores[1].owner = 'cyan'
    battle.cores[1].energy = 95
    battle.fleets = [arrival()]
    expect(tickBattle(battle).cores[1].energy).toBe(99)
  })

  it.each([[7, null, 3], [10, 'cyan', 1], [20, 'cyan', 10]] as const)('resolves %s attacking energy against 10 defense', (amount, owner, energy) => {
    const battle = running()
    battle.fleets = [arrival({ amount })]
    const result = tickBattle(battle)
    expect(result.cores[1]).toMatchObject({ owner, energy })
    expect(result.fleets).toHaveLength(0)
  })

  it('uses ownership at arrival, even when the departure core has been captured', () => {
    const battle = running()
    battle.cores[0].owner = 'gold'
    battle.cores[1].owner = 'magenta'
    battle.fleets = [arrival()]
    expect(tickBattle(battle).cores[1]).toMatchObject({ owner: 'cyan', energy: 10 })
  })

  it('orders arrivals by time, rather than fleet array order', () => {
    const battle = running()
    battle.fleets = [arrival({ id: 2, owner: 'gold', progress: 0.91, amount: 7 }), arrival({ id: 1, progress: 0.99, amount: 15 })]
    expect(tickBattle(battle).cores[1]).toMatchObject({ owner: 'gold', energy: 2 })
  })

  it('keeps a faction alive while its final fleet can still capture a core', () => {
    const battle = running()
    battle.cores[0].owner = 'gold'
    battle.fleets = [arrival({ progress: 0 })]
    expect(livingFactions(battle)).toContain('cyan')
    expect(tickBattle(battle).phase).toBe('running')
    const recaptured = advance(battle, 11)
    expect(recaptured.cores[1].owner).toBe('cyan')
    expect(recaptured.phase).toBe('running')
  })

  it('wins with neutral cores remaining only after all hostile fleets are gone', () => {
    const battle = running()
    battle.cores[2].owner = 'cyan'
    battle.cores[3].owner = 'cyan'
    battle.fleets = [arrival({ owner: 'gold', amount: 3, to: 0, progress: 0 })]
    expect(tickBattle(battle).phase).toBe('running')
    expect(advance(battle, 11).phase).toBe('won')
    expect(battle.cores[1].owner).toBeNull()
  })

  it('ends a defeat and freezes all further commands and ticks', () => {
    const battle = running()
    battle.cores[0].owner = 'gold'
    const lost = tickBattle(battle)
    expect(lost.phase).toBe('lost')
    expect(tickBattle(lost)).toBe(lost)
    expect(sendFleet(lost, 'gold', 0, 1, 1)).toBe(lost)
  })

  it('pauses all clocks and fleets, resumes, and resets the entire battle', () => {
    const battle = sendFleet(running(), 'cyan', 0, 1, 0.5)
    const paused = battleReducer(battle, { type: 'pause' })
    expect(advance(paused, 50)).toBe(paused)
    expect(selectCore(paused, 0)).toBe(paused)
    expect(battleReducer(paused, { type: 'start' }).phase).toBe('running')
    expect(battleReducer(paused, { type: 'restart' })).toEqual(createBattle(fixture))
    expect(tickBattle(battle, Number.NaN)).toBe(battle)
    expect(tickBattle(battle, 60).elapsed).toBeCloseTo(0.25)
  })
})

describe('Pulsefront campaigns and records', () => {
  it.each(PULSEFRONT_SECTORS)('$id has a connected network, legal positions, and equal starting forces', sector => {
    expect(sector.cores).toHaveLength(sector.mode === 'expanse' ? 61 : sector.id === 'first-light' || sector.id === 'parallax' ? 13 : 19)
    for (const owner of ['cyan', 'magenta', 'gold']) {
      expect(sector.cores.filter(core => core.owner === owner).map(core => core.energy)).toEqual([34])
    }
    const visited = new Set([0])
    for (let pass = 0; pass < sector.cores.length; pass++) {
      for (const [a, b] of sector.links) if (visited.has(a) || visited.has(b)) { visited.add(a); visited.add(b) }
    }
    expect(visited.size).toBe(sector.cores.length)
    expect(sector.cores.every((core, id) => core.id === id && core.x > 0 && core.y > 0 && core.x < sector.size && core.y < sector.size)).toBe(true)
  })

  it.each(PULSEFRONT_SECTORS)('AI expands on $id without corrupting state or map templates', sector => {
    const original = JSON.stringify(sector)
    const battle = advance({ ...createBattle(sector), phase: 'running' }, 300)
    expect(battle.nextFleet).toBeGreaterThan(3)
    expect(battle.cores.filter(core => core.owner === 'gold' || core.owner === 'magenta').length).toBeGreaterThan(2)
    expect(battle.cores.every(core => Number.isFinite(core.energy) && core.energy >= 0 && core.energy <= energyCap(battle))).toBe(true)
    expect(JSON.stringify(sector)).toBe(original)
  })

  it('AI combines fleets to break a fully defended core instead of stalling at the energy cap', () => {
    const battle = running()
    battle.aiClock = 2
    battle.cores.forEach(core => { core.energy = 99; core.owner = core.id === 0 ? 'cyan' : 'magenta' })
    const wave = tickBattle(battle)
    expect(wave.fleets).toHaveLength(3)
    expect(wave.fleets.every(fleet => fleet.owner === 'magenta' && fleet.to === 0)).toBe(true)
    expect(advance(wave, 50).phase).toBe('lost')
  })

  it('recovers safely from corrupt, stale, or malformed saved scores', () => {
    expect(parseRecords('broken')).toEqual({})
    expect(parseRecords('null')).toEqual({})
    expect(parseRecords('[]')).toEqual({})
    expect(parseRecords(JSON.stringify({
      'first-light:cadet': { seconds: 61, launches: 5 },
      'first-light:admiral': { seconds: -4, launches: 5 },
      'parallax:commander': { seconds: 34, launches: 'bad' },
      'unknown:cadet': { seconds: 34, launches: 5 }
    }))).toEqual({ 'first-light:cadet': { seconds: 61, launches: 5 } })
  })
})

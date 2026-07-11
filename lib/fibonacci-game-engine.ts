// Fibonacci 2584 Game Engine
// Based on 2048 but using Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584...

export const GRID_SIZE = 4
export const WINNING_VALUE = 2584

export type TileValue = number // Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584

export interface Tile {
  id: number
  value: TileValue
  row: number
  col: number
  mergedFrom?: Tile[] // Track tiles that merged into this one (for animation)
  isNew?: boolean // For spawn animation
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameState {
  tiles: Tile[]
  score: number
  bestScore: number
  won: boolean
  over: boolean
  canContinue: boolean // After winning, can continue playing
}

let tileIdCounter = 0

export const FIBONACCI_SEQUENCE = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584]

// Check if a number is a Fibonacci number
export function isFibonacci(n: number): boolean {
  return FIBONACCI_SEQUENCE.includes(n)
}

// Get next Fibonacci number in sequence (for merging)
export function getNextFibonacci(n: number): number | null {
  const idx = FIBONACCI_SEQUENCE.indexOf(n)
  if (idx === -1 || idx >= FIBONACCI_SEQUENCE.length - 1) return null
  return FIBONACCI_SEQUENCE[idx + 1]
}

export function getMergedFibonacciValue(a: number, b: number): number | null {
  if (a === 1 && b === 1) return 2

  const firstIndex = FIBONACCI_SEQUENCE.indexOf(a)
  const secondIndex = FIBONACCI_SEQUENCE.indexOf(b)
  if (firstIndex === -1 || secondIndex === -1) return null
  if (Math.abs(firstIndex - secondIndex) !== 1) return null

  const mergedValue = a + b
  return isFibonacci(mergedValue) ? mergedValue : null
}

export function canMergeValues(a: number, b: number): boolean {
  return getMergedFibonacciValue(a, b) !== null
}

// Create a new tile with random value (90% 1, 10% 2)
export function createTile(row: number, col: number, value?: number): Tile {
  const tileValue = value ?? (Math.random() < 0.9 ? 1 : 2)
  return {
    id: tileIdCounter++,
    value: tileValue as TileValue,
    row,
    col,
    isNew: true
  }
}

// Get empty positions on the grid
export function getEmptyPositions(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`))
  const empty: { row: number; col: number }[] = []

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col })
      }
    }
  }

  return empty
}

// Add a random tile to the grid
export function addRandomTile(tiles: Tile[]): Tile[] {
  const empty = getEmptyPositions(tiles)
  if (empty.length === 0) return tiles
  
  const pos = empty[Math.floor(Math.random() * empty.length)]
  const newTile = createTile(pos.row, pos.col)
  return [...tiles, newTile]
}

// Initialize a new game
export function initializeGame(bestScore: number = 0): GameState {
  tileIdCounter = 0
  let tiles: Tile[] = []
  tiles = addRandomTile(tiles)
  tiles = addRandomTile(tiles)
  
  return {
    tiles,
    score: 0,
    bestScore,
    won: false,
    over: false,
    canContinue: false
  }
}

// Slide tiles in a direction and merge
function slideTiles(
  tiles: Tile[],
  direction: Direction
): { tiles: Tile[]; score: number; moved: boolean } {
  let workingTiles = tiles.map(tile => ({
    ...tile,
    mergedFrom: undefined,
    isNew: false
  }))

  // Create a grid representation
  const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  
  workingTiles.forEach(tile => {
    grid[tile.row][tile.col] = tile
  })
  
  let score = 0
  let moved = false
  
  // Determine iteration order based on direction
  const rowRange = direction === 'down' ? [GRID_SIZE - 1, 0, -1] : [0, GRID_SIZE - 1, 1]
  const colRange = direction === 'right' ? [GRID_SIZE - 1, 0, -1] : [0, GRID_SIZE - 1, 1]
  
  for (let row = rowRange[0]; direction === 'down' ? row >= rowRange[1] : row <= rowRange[1]; row += rowRange[2]) {
    for (let col = colRange[0]; direction === 'right' ? col >= colRange[1] : col <= colRange[1]; col += colRange[2]) {
      const tile = grid[row][col]
      if (!tile) continue
      
      // Find the farthest position
      let newRow = row
      let newCol = col
      let nextRow = row
      let nextCol = col
      
      while (true) {
        // Calculate next position
        switch (direction) {
          case 'up': nextRow = newRow - 1; break
          case 'down': nextRow = newRow + 1; break
          case 'left': nextCol = newCol - 1; break
          case 'right': nextCol = newCol + 1; break
        }
        
        // Check bounds
        if (nextRow < 0 || nextRow >= GRID_SIZE || nextCol < 0 || nextCol >= GRID_SIZE) break
        
        const nextTile = grid[nextRow][nextCol]
        
        if (!nextTile) {
          // Empty space, can move
          newRow = nextRow
          newCol = nextCol
        } else if (!nextTile.mergedFrom && canMergeValues(tile.value, nextTile.value)) {
          // Can merge
          newRow = nextRow
          newCol = nextCol
          break
        } else {
          // Blocked
          break
        }
      }
      
      if (newRow !== row || newCol !== col) {
        moved = true
        grid[row][col] = null
        
        const targetTile = grid[newRow][newCol]
        
        if (targetTile) {
          // Merge tiles
          const nextValue = getMergedFibonacciValue(tile.value, targetTile.value)!
          targetTile.value = nextValue
          targetTile.mergedFrom = [tile, targetTile]
          targetTile.isNew = false
          score += nextValue
          
          // Remove the old tile
          workingTiles = workingTiles.filter(t => t.id !== tile.id)
          
          // Check for win (WINNING_VALUE)
          if (nextValue === WINNING_VALUE) {
            // Will be handled in move function
          }
        } else {
          // Just move
          tile.row = newRow
          tile.col = newCol
          tile.isNew = false
          grid[newRow][newCol] = tile
        }
      }
    }
  }
  
  return { tiles: workingTiles, score, moved }
}

// Main move function
export function move(state: GameState, direction: Direction): GameState {
  if (state.over && !state.canContinue) return state
  
  const { tiles, score, moved } = slideTiles(state.tiles, direction)
  
  if (!moved) return state
  
  // Add new tile
  const newTiles = addRandomTile(tiles)
  
  // Check for win (WINNING_VALUE)
  const hasWon = newTiles.some(t => t.value === WINNING_VALUE)
  
  // Check for game over
  const gameOver = !canMove(newTiles)
  
  return {
    tiles: newTiles,
    score: state.score + score,
    bestScore: Math.max(state.bestScore, state.score + score),
    won: state.won || hasWon,
    over: gameOver && !state.canContinue,
    canContinue: state.canContinue || hasWon
  }
}

// Check if any move is possible
export function canMove(tiles: Tile[]): boolean {
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true

  const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  tiles.forEach(tile => {
    grid[tile.row][tile.col] = tile
  })

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col]
      if (!tile) return true

      // Check adjacent cells for possible merge
      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 }
      ]

      for (const n of neighbors) {
        if (n.row >= 0 && n.row < GRID_SIZE && n.col >= 0 && n.col < GRID_SIZE) {
          const neighbor = grid[n.row][n.col]
          if (!neighbor || canMergeValues(tile.value, neighbor.value)) {
            return true
          }
        }
      }
    }
  }

  return false
}

// Get tile color based on Fibonacci value
export function getTileColor(value: number): string {
  const colors: Record<number, string> = {
    1: 'bg-amber-100 dark:bg-amber-900',
    2: 'bg-amber-200 dark:bg-amber-800',
    3: 'bg-orange-200 dark:bg-orange-800',
    5: 'bg-orange-300 dark:bg-orange-700',
    8: 'bg-red-300 dark:bg-red-700',
    13: 'bg-red-400 dark:bg-red-600',
    21: 'bg-red-500 dark:bg-red-500',
    34: 'bg-pink-400 dark:bg-pink-600',
    55: 'bg-pink-500 dark:bg-pink-500',
    89: 'bg-purple-400 dark:bg-purple-600',
    144: 'bg-purple-500 dark:bg-purple-500',
    233: 'bg-violet-400 dark:bg-violet-600',
    377: 'bg-violet-500 dark:bg-violet-500',
    610: 'bg-blue-400 dark:bg-blue-600',
    987: 'bg-blue-500 dark:bg-blue-500',
    1597: 'bg-cyan-400 dark:bg-cyan-600',
    2584: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 dark:from-yellow-600 dark:via-amber-600 dark:to-orange-700'
  }
  
  return colors[value] || 'bg-gray-300 dark:bg-gray-600'
}

// Get text color based on value
export function getTextColor(value: number): string {
  if (value <= 3) return 'text-amber-900 dark:text-amber-100'
  if (value <= 34) return 'text-orange-900 dark:text-orange-100'
  return 'text-white'
}

// Get font size based on value length
export function getFontSize(value: number): string {
  const digits = value.toString().length
  if (digits <= 2) return 'text-4xl'
  if (digits <= 3) return 'text-3xl'
  if (digits <= 4) return 'text-2xl'
  return 'text-xl'
}

// Helper to get tile at position (O(n) lookup)
export function getTileAt(tiles: Tile[], row: number, col: number): Tile | undefined {
  return tiles.find(t => t.row === row && t.col === col)
}

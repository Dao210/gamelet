import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Equation Vault - Arithmetic Puzzle', description: 'Find missing values and unlock secure equations.' }
export default function Page() { return <PuzzleArcadeGame gameId="equation-vault" /> }

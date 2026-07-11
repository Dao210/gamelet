import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Sequence Forge - Number Pattern Game', description: 'Read number patterns and forge each missing value.' }
export default function Page() { return <PuzzleArcadeGame gameId="sequence-forge" /> }

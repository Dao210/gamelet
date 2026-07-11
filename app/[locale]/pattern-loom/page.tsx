import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Pattern Loom - Symbol Pattern Game', description: 'Complete woven visual patterns one tile at a time.' }
export default function Page() { return <PuzzleArcadeGame gameId="pattern-loom" /> }

import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Word Bridge - Word Ladder Puzzle', description: 'Change one letter at a time and bridge pairs of words.' }
export default function Page() { return <PuzzleArcadeGame gameId="word-bridge" /> }

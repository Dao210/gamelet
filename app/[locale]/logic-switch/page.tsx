import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Logic Switch - Boolean Logic Game', description: 'Trace binary rules and resolve each control circuit.' }
export default function Page() { return <PuzzleArcadeGame gameId="logic-switch" /> }

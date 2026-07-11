import type { Metadata } from 'next'
import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
export const metadata: Metadata = { title: 'Shape Signal - Spatial Transformation Game', description: 'Infer rotations, reflections and shape transformations.' }
export default function Page() { return <PuzzleArcadeGame gameId="shape-signal" /> }

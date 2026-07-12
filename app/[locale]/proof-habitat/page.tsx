import type { Metadata } from 'next'
import ProofHabitatGame from '@/components/advanced-puzzles/ProofHabitatGame'
export const metadata: Metadata = { title: 'Proof Habitat - No-Guess Deduction Puzzle', description: 'Resolve a living logic grid where every accepted claim must be formally provable.' }
export default function Page() { return <ProofHabitatGame /> }

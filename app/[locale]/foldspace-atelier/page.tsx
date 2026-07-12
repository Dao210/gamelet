import type { Metadata } from 'next'
import FoldspaceAtelierGame from '@/components/advanced-puzzles/FoldspaceAtelierGame'
export const metadata: Metadata = { title: 'Foldspace Atelier - Two-Sided Paper Puzzle', description: 'Fold a layered paper world until distant marks share the same physical position.' }
export default function Page() { return <FoldspaceAtelierGame /> }

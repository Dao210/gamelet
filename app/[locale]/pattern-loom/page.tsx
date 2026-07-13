import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/pattern-loom', title: 'Pattern Loom - Symbol Pattern Game', description: 'Complete woven visual patterns one tile at a time.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="pattern-loom" /> }

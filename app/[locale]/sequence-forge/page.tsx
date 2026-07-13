import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/sequence-forge', title: 'Sequence Forge - Number Pattern Game', description: 'Read number patterns and forge each missing value.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="sequence-forge" /> }

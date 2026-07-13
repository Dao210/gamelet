import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/word-bridge', title: 'Word Bridge - Word Ladder Puzzle', description: 'Change one letter at a time and bridge pairs of words.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="word-bridge" /> }

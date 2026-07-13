import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/logic-switch', title: 'Logic Switch - Boolean Logic Game', description: 'Trace binary rules and resolve each control circuit.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="logic-switch" /> }

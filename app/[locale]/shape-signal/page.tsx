import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/shape-signal', title: 'Shape Signal - Spatial Transformation Game', description: 'Infer rotations, reflections and shape transformations.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="shape-signal" /> }

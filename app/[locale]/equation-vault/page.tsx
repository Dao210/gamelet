import PuzzleArcadeGame from '@/components/puzzle-arcade/PuzzleArcadeGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/equation-vault', title: 'Equation Vault - Arithmetic Puzzle', description: 'Find missing values and unlock secure equations.' }) }
export default function Page() { return <PuzzleArcadeGame gameId="equation-vault" /> }

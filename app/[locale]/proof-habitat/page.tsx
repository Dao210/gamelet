import ProofHabitatGame from '@/components/advanced-puzzles/ProofHabitatGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/proof-habitat', title: 'Proof Habitat - No-Guess Deduction Puzzle', description: 'Resolve a living logic grid where every accepted claim must be formally provable.' }) }
export default function Page() { return <ProofHabitatGame /> }

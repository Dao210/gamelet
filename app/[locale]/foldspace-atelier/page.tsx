import FoldspaceAtelierGame from '@/components/advanced-puzzles/FoldspaceAtelierGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/foldspace-atelier', title: 'Foldspace Atelier - Two-Sided Paper Puzzle', description: 'Fold a layered paper world until distant marks share the same physical position.' }) }
export default function Page() { return <FoldspaceAtelierGame /> }

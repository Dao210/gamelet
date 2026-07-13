import GravityGrammarGame from '@/components/impossible-instruments/GravityGrammarGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/gravity-grammar', title: 'Gravity Grammar - Physical Word Puzzle', description: 'Rearrange words to write the physical laws that move matter.' }) }
export default function Page() { return <GravityGrammarGame /> }

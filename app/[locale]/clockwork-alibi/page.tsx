import ClockworkAlibiGame from '@/components/impossible-instruments/ClockworkAlibiGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/clockwork-alibi', title: 'Clockwork Alibi - Causal Timeline Puzzle', description: 'Reorder events until every changing witness statement is simultaneously true.' }) }
export default function Page() { return <ClockworkAlibiGame /> }

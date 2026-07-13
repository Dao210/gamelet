import EchoOrchardGame from '@/components/impossible-instruments/EchoOrchardGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/echo-orchard', title: 'Echo Orchard - Transforming Memory Puzzle', description: 'Predict how a sequence transforms itself instead of merely repeating it.' }) }
export default function Page() { return <EchoOrchardGame /> }

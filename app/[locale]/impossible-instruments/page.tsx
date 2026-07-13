import InstrumentCabinet from '@/components/impossible-instruments/InstrumentCabinet'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/impossible-instruments', title: 'The Cabinet of Impossible Instruments', description: 'Six unusual puzzle instruments built around shadows, topology, transforming memory, physical language, scientific inference and causal timelines.' }) }
export default function Page() { return <InstrumentCabinet /> }

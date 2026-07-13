import RuleFossilGame from '@/components/impossible-instruments/RuleFossilGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/rule-fossil', title: 'Rule Fossil - Experimental Logic Game', description: 'Design experiments and excavate the hidden rule behind accepted specimens.' }) }
export default function Page() { return <RuleFossilGame /> }

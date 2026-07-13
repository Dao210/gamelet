import MobiusMailroomGame from '@/components/impossible-instruments/MobiusMailroomGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/mobius-mailroom', title: 'Möbius Mailroom - Two-Sided Route Puzzle', description: 'Place signs and deliver parcels across both sides of a Möbius strip.' }) }
export default function Page() { return <MobiusMailroomGame /> }

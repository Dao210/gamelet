import RoomNineteenGame from '@/components/advanced-puzzles/RoomNineteenGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/room-nineteen', title: 'Room Nineteen - Gamelet Meta Puzzle', description: 'Decode fragments collected across the Gamelet archive and unlock a changing daily room.' }) }
export default function Page() { return <RoomNineteenGame /> }

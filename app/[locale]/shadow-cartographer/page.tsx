import ShadowCartographerGame from '@/components/impossible-instruments/ShadowCartographerGame'
import { createPageMetadata } from '@/lib/seo-utils'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ locale, pathname: '/shadow-cartographer', title: 'Shadow Cartographer - Draw With Darkness', description: 'Rotate light around an impossible instrument and map a route using shadows.' }) }
export default function Page() { return <ShadowCartographerGame /> }

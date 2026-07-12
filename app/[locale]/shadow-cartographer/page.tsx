import type { Metadata } from 'next'; import ShadowCartographerGame from '@/components/impossible-instruments/ShadowCartographerGame'
export const metadata: Metadata = { title: 'Shadow Cartographer - Draw With Darkness', description: 'Rotate light around an impossible instrument and map a route using shadows.' }
export default function Page() { return <ShadowCartographerGame /> }

import type { Metadata } from 'next'; import MobiusMailroomGame from '@/components/impossible-instruments/MobiusMailroomGame'
export const metadata: Metadata = { title: 'Möbius Mailroom - Two-Sided Route Puzzle', description: 'Place signs and deliver parcels across both sides of a Möbius strip.' }
export default function Page() { return <MobiusMailroomGame /> }

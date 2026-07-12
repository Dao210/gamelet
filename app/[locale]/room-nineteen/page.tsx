import type { Metadata } from 'next'
import RoomNineteenGame from '@/components/advanced-puzzles/RoomNineteenGame'
export const metadata: Metadata = { title: 'Room Nineteen - Gamelet Meta Puzzle', description: 'Decode fragments collected across the Gamelet archive and unlock a changing daily room.' }
export default function Page() { return <RoomNineteenGame /> }

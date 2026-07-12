import type { Metadata } from 'next'; import EchoOrchardGame from '@/components/impossible-instruments/EchoOrchardGame'
export const metadata: Metadata = { title: 'Echo Orchard - Transforming Memory Puzzle', description: 'Predict how a sequence transforms itself instead of merely repeating it.' }
export default function Page() { return <EchoOrchardGame /> }

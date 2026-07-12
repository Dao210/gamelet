import type { Metadata } from 'next'
import InstrumentCabinet from '@/components/impossible-instruments/InstrumentCabinet'
export const metadata: Metadata = { title: 'The Cabinet of Impossible Instruments', description: 'Six unusual puzzle instruments built around shadows, topology, transforming memory, physical language, scientific inference and causal timelines.' }
export default function Page() { return <InstrumentCabinet /> }

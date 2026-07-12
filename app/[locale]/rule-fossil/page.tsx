import type { Metadata } from 'next'; import RuleFossilGame from '@/components/impossible-instruments/RuleFossilGame'
export const metadata: Metadata = { title: 'Rule Fossil - Experimental Logic Game', description: 'Design experiments and excavate the hidden rule behind accepted specimens.' }
export default function Page() { return <RuleFossilGame /> }

import type { Metadata } from 'next'; import ClockworkAlibiGame from '@/components/impossible-instruments/ClockworkAlibiGame'
export const metadata: Metadata = { title: 'Clockwork Alibi - Causal Timeline Puzzle', description: 'Reorder events until every changing witness statement is simultaneously true.' }
export default function Page() { return <ClockworkAlibiGame /> }

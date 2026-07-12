import type { Metadata } from 'next'; import GravityGrammarGame from '@/components/impossible-instruments/GravityGrammarGame'
export const metadata: Metadata = { title: 'Gravity Grammar - Physical Word Puzzle', description: 'Rearrange words to write the physical laws that move matter.' }
export default function Page() { return <GravityGrammarGame /> }

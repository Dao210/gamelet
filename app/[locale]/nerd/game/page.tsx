import { Metadata } from 'next';
import GamePageClient from './GamePageClient';

export const metadata: Metadata = {
  title: 'Play Nerdle Game - Daily Math Equation Challenge',
  description: 'Play the daily Nerdle game! Guess the hidden mathematical equation in 6 tries. Features multiple difficulty levels, instant feedback, and brain-training puzzles.',
  openGraph: {
    title: 'Play Nerdle Game - Daily Math Equation Challenge',
    description: 'Play the daily Nerdle game! Guess the hidden mathematical equation in 6 tries.',
    type: 'website',
  },
};

export default function GamePage() {
  return <GamePageClient />;
}
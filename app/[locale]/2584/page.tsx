import { Metadata } from 'next';
import FibonacciGameClient from '@/components/fibonacci/FibonacciGameClient';

export const metadata: Metadata = {
  title: 'Fibonacci 2584 - Free Online Math Puzzle Game',
  description: 'Play Fibonacci 2584 - a free online puzzle game based on the Fibonacci sequence. Join numbers to reach 2584! Similar to 2048 but with Fibonacci math.',
  openGraph: {
    title: 'Fibonacci 2584 - Free Online Math Puzzle Game',
    description: 'Join Fibonacci numbers to reach 2584! A free puzzle game based on the mathematical Fibonacci sequence.',
    type: 'website',
  },
};

export default function Fibonacci2584Page() {
  return <FibonacciGameClient />;
}
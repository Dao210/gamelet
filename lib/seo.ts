import { NextSeoProps } from 'next-seo'

export const defaultSEO: NextSeoProps = {
  title: 'Nerdle - Daily Math Equation Puzzle Game | Play Free Online',
  description: 'Play Nerdle, the addictive daily math equation guessing game! Challenge your mathematical skills with our free online puzzle game. Guess the hidden equation in 6 tries or less.',
  canonical: 'https://chimii.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chimii.com',
    siteName: 'Nerdle Math Game',
    title: 'Nerdle - Daily Math Equation Puzzle Game',
    description: 'Play Nerdle, the addictive daily math equation guessing game! Challenge your mathematical skills with our free online puzzle game.',
    images: [
      {
        url: 'https://chimii.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nerdle Math Game - Daily Equation Puzzle',
      },
    ],
  },
  twitter: {
    handle: '@nerdlemathgame',
    site: '@nerdlemathgame',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'nerdle, mathle, math game, equation puzzle, daily challenge, mathematical puzzle, number game, arithmetic game, logic puzzle, brain training, math brain teaser, equation solver, math quiz, educational game',
    },
    {
      name: 'author',
      content: 'Chimii.com',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
}

export const gameSEO: NextSeoProps = {
  title: 'Play Nerdle Game - Daily Math Equation Challenge',
  description: 'Play the daily Nerdle game! Guess the hidden mathematical equation in 6 tries. Features multiple difficulty levels, instant feedback, and brain-training puzzles.',
  canonical: 'https://chimii.com/game',
  openGraph: {
    type: 'game',
    locale: 'en_US',
    url: 'https://chimii.com/game',
    siteName: 'Nerdle Math Game',
    title: 'Play Nerdle Game - Daily Math Equation Challenge',
    description: 'Play the daily Nerdle game! Guess the hidden mathematical equation in 6 tries. Features multiple difficulty levels, instant feedback, and brain-training puzzles.',
    images: [
      {
        url: 'https://chimii.com/og-game.png',
        width: 1200,
        height: 630,
        alt: 'Nerdle Game Interface - Math Equation Puzzle',
      },
    ],
  },
}

export const aboutSEO: NextSeoProps = {
  title: 'About Nerdle - The Math Equation Guessing Game',
  description: 'Learn about Nerdle, the popular math equation guessing game. Discover how to play, game rules, tips and strategies for solving daily math puzzles.',
  canonical: 'https://chimii.com/about',
}

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Game',
  name: 'Nerdle',
  description: 'A daily math equation guessing game where players try to solve a hidden mathematical equation in 6 attempts or less.',
  genre: 'Puzzle Game',
  gamePlatform: 'Web Browser',
  operatingSystem: 'Any',
  applicationCategory: 'Game',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
  author: {
    '@type': 'Organization',
    name: 'Nerdle Math Game',
  },
}

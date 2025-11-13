import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'
import HeroSection from '@/components/nerd/HeroSection'
import StatsBar from '@/components/nerd/StatsBar'
import BentoFeatures from '@/components/nerd/BentoFeatures'
import RulesVisual from '@/components/nerd/RulesVisual'
import FinalCTA from '@/components/nerd/FinalCTA'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/nerd'

  return {
    title: 'Nerdle - Daily Math Equation Puzzle Game',
    description: 'Challenge your mathematical skills with our addictive daily puzzle game. Guess the hidden equation in 6 tries or less. Perfect for math enthusiasts and puzzle lovers!',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    },
    openGraph: {
      title: 'Nerdle - Daily Math Equation Puzzle Game',
      description: 'Challenge your mathematical skills with our addictive daily puzzle game. Guess the hidden equation in 6 tries or less.',
      type: 'website',
    },
  }
}

export default function NerdleHomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <StatsBar />
      <BentoFeatures />
      <RulesVisual />
      <FinalCTA />
    </div>
  )
}

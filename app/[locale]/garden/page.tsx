import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'
import HeroSection from '@/components/garden/hero/HeroSection'
import StatsBar from '@/components/garden/stats/StatsBar'
import PlantFeed from '@/components/garden/feed/PlantFeed'
import { mockStats, mockPlants } from '@/lib/garden-mock-data'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/garden'

  return {
    title: 'Global Trellis - 全球藤架 | 创意花园社区',
    description: '在全球藤架上展示你的创作，用赞点亮植物生命。每一次点赞，都是一滴滋养创意的甘露。',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    },
    openGraph: {
      title: 'Global Trellis - 全球藤架 | 创意花园社区',
      description: '在全球藤架上展示你的创作，用赞点亮植物生命。种下创意，浇灌成长。',
      type: 'website',
    },
  }
}

export default async function GardenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with animated background */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsBar stats={mockStats} />

      {/* Main Plant Feed */}
      <PlantFeed initialPlants={mockPlants} />
    </main>
  )
}

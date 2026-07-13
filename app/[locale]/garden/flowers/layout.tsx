import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return createPageMetadata({
    locale,
    pathname: '/garden/flowers',
    title: 'Interactive Flower Garden - Gamelet',
    description: 'Explore an experimental animated flower garden.',
    index: false
  })
}

export default function FlowerGardenLayout({ children }: { children: React.ReactNode }) {
  return children
}

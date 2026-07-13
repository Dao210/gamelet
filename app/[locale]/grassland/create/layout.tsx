import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return createPageMetadata({
    locale,
    pathname: '/grassland/create',
    title: 'Create a Plant - Grassland',
    description: 'Draw a unique plant and add it to the Gamelet global prairie garden.',
    index: false
  })
}

export default function CreatePlantLayout({ children }: { children: React.ReactNode }) {
  return children
}

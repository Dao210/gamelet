/**
 * Plant Detail Page
 * 路由: /[locale]/grassland/[plantId]
 * 文档来源: Action Plan - Module 4.1
 *
 * 显示单个植物的详细信息、成长历史、浇水记录
 */

import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; plantId: string }> }) {
  const { locale, plantId } = await params
  return createPageMetadata({ locale, pathname: `/grassland/${plantId}`, title: 'Plant Details - Grassland', description: 'View detailed information about a plant in the global prairie garden.', index: false })
}

export default async function PlantDetailPage({
  params
}: {
  params: Promise<{ locale: string; plantId: string }>
}) {
  const { plantId } = await params

  return (
    <main className="min-h-screen">
      <h1>Plant Details</h1>
      <p>Plant ID: {plantId}</p>
      <p>Detailed plant information coming soon...</p>
    </main>
  )
}

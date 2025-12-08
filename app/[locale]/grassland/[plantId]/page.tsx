/**
 * Plant Detail Page
 * 路由: /[locale]/grassland/[plantId]
 * 文档来源: Action Plan - Module 4.1
 *
 * 显示单个植物的详细信息、成长历史、浇水记录
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plant Details | Grassland',
  description: 'View detailed information about a plant in the global prairie garden.'
}

export default async function PlantDetailPage({
  params
}: {
  params: Promise<{ plantId: string }>
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

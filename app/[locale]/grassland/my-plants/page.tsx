/**
 * My Plants Page
 * 路由: /[locale]/grassland/my-plants
 * 文档来源: Action Plan - Module 4.1
 *
 * 显示当前用户创建的所有植物及统计信息
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Plants | Grassland',
  description: 'View and manage your plants in the global prairie garden.'
}

export default function MyPlantsPage() {
  return (
    <main className="min-h-screen">
      <h1>My Plants</h1>
      <p>Plant gallery and statistics coming soon...</p>
    </main>
  )
}

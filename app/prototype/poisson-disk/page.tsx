/**
 * Poisson Disk Sampling 演示页面
 * 路由: /prototype/poisson-disk
 */

import PoissonDiskDemo from '@/components/garden/prototype/PoissonDiskDemo'

export const metadata = {
  title: 'Poisson Disk Sampling - 技术预研',
  description: '全球草原花园植物布局算法原型演示'
}

export default function PoissonDiskPage() {
  return <PoissonDiskDemo />
}

import type { Metadata } from 'next'
import OrbitSumGame from '@/components/orbit-sum/OrbitSumGame'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'zh' ? '轨道配平 - 数字交换益智游戏' : 'Orbit Sum - Orbital Number Puzzle'
  const description = locale === 'zh' ? '交换三条轨道上的数字卫星，让每一圈同时达到目标总和。' : 'Swap numbered satellites between three rings until every orbit reaches its target sum.'
  return { title, description, openGraph: { title, description, type: 'website' } }
}

export default function OrbitSumPage() {
  return <OrbitSumGame />
}

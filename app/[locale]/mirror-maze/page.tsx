import type { Metadata } from 'next'
import MirrorMazeGame from '@/components/mirror-maze/MirrorMazeGame'
import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'zh' ? '镜面迷宫 - 光线反射益智游戏' : 'Mirror Maze - Optical Reflection Puzzle'
  const description = locale === 'zh' ? '旋转镜面，引导光束绕过障碍并抵达目标。' : 'Rotate mirrors and guide a beam of light through the dark to its target.'
  return createPageMetadata({ locale, pathname: '/mirror-maze', title, description })
}

export default function MirrorMazePage() {
  return <MirrorMazeGame />
}

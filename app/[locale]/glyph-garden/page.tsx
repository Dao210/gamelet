import type { Metadata } from 'next'
import GlyphGardenGame from '@/components/glyph-garden/GlyphGardenGame'
import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'zh' ? '字形花园 - 视觉观察游戏' : 'Glyph Garden - Visual Observation Game'
  const description = locale === 'zh' ? '找出字形苗圃里唯一不同的符号，让你的花园盛放。' : 'Find the one unusual symbol in each glyph bed and grow a garden in bloom.'
  return createPageMetadata({ locale, pathname: '/glyph-garden', title, description })
}

export default function GlyphGardenPage() {
  return <GlyphGardenGame />
}

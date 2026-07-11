import { Metadata } from 'next'
import FibonacciGameClient from '@/components/fibonacci/FibonacciGameClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isChinese = locale === 'zh'
  const title = isChinese ? '合成 2584 - 斐波那契数字益智游戏' : 'Fibonacci 2584 - Free Online Math Puzzle Game'
  const description = isChinese
    ? '沿着斐波那契数列合成数字，挑战抵达 2584。支持键盘方向键与手机滑动操作。'
    : 'Join Fibonacci numbers to reach 2584 in this free mathematical puzzle game.'

  return { title, description, openGraph: { title, description, type: 'website' } }
}

export default function Fibonacci2584Page() {
  return <FibonacciGameClient />
}

import type { Metadata } from 'next'
import WordCipherBoxGame from '@/components/word-cipher-box/WordCipherBoxGame'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'zh' ? '文字密码盒 - 替换密码益智游戏' : 'Word Cipher Box - Substitution Cipher Puzzle'
  const description = locale === 'zh' ? '打开一层层密码档案盒，根据线索破解符号替换密码。' : 'Open a sequence of classified boxes and decode symbol substitution ciphers from compact clues.'
  return { title, description, openGraph: { title, description, type: 'website' } }
}

export default function WordCipherBoxPage() {
  return <WordCipherBoxGame />
}

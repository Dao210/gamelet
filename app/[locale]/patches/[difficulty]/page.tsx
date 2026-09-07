import { notFound } from 'next/navigation'
import PatchesLanding from '@/components/patches/PatchesLanding'
import { patchesMetadata } from '@/lib/patches/metadata'
import { isDifficulty } from '@/lib/patches/progress'
type Props = { params: Promise<{ locale: string; difficulty: string }> }
export function generateStaticParams() { return ['easy', 'medium', 'hard'].map(difficulty => ({ difficulty })) }
export async function generateMetadata({ params }: Props) {
  const { locale, difficulty } = await params
  if (!isDifficulty(difficulty)) notFound()
  return patchesMetadata(locale, difficulty)
}
export default async function Page({ params }: Props) {
  const { locale, difficulty } = await params
  if (!isDifficulty(difficulty)) notFound()
  return <PatchesLanding locale={locale} difficulty={difficulty} />
}

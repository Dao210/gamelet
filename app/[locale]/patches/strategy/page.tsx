import PatchesArticle from '@/components/patches/PatchesArticle'
import { patchesMetadata } from '@/lib/patches/metadata'
type Props = { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: Props) { return patchesMetadata((await params).locale, undefined, 'strategy') }
export default async function Page({ params }: Props) { return <PatchesArticle locale={(await params).locale} kind="strategy" /> }

import PatchesLanding from '@/components/patches/PatchesLanding'
import { patchesMetadata } from '@/lib/patches/metadata'
type Props = { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: Props) { return patchesMetadata((await params).locale) }
export default async function Page({ params }: Props) { return <PatchesLanding locale={(await params).locale} /> }

import { redirect } from 'next/navigation'

export default async function CreatePlantPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/grassland/create`)
}

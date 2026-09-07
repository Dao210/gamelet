import { getTranslations } from 'next-intl/server'
import { createPageMetadata } from '@/lib/seo-utils'
import type { Difficulty } from './types'

export async function patchesMetadata(locale: string, difficulty?: Difficulty, article?: 'how' | 'strategy') {
  const t = await getTranslations({ locale, namespace: 'patches' })
  const pathname = article ? `/patches/${article === 'how' ? 'how-to-play' : 'strategy'}` : difficulty ? `/patches/${difficulty}` : '/patches'
  return createPageMetadata({
    locale, pathname,
    title: article ? t(`${article}Title`) : difficulty ? t('difficultyTitle', { difficulty: t(`difficulties.${difficulty}`) }) : t('metaTitle'),
    description: article ? t(`${article}Description`) : difficulty ? t('difficultyDescription', { difficulty: t(`difficulties.${difficulty}`) }) : t('metaDescription')
  })
}


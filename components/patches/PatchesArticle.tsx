import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import styles from './patches.module.css'

export default async function PatchesArticle({ locale, kind }: { locale: string; kind: 'how' | 'strategy' }) {
  const t = await getTranslations({ locale, namespace: 'patches' })
  return <div className={styles.page}><article className={styles.article}>
    <Link href="/patches">← {t('title')}</Link>
    <h1>{t(`${kind}Title`)}</h1><p>{t(`${kind}Description`)}</p>
    <div className={styles.example} aria-label="6 = 3 × 2"><span>6 ▭</span><span>→</span><span>3 × 2</span><span>✓</span></div>
    {(['one', 'two', 'three', 'four'] as const).map(key => <section key={key}><h2>{t(`${kind}Sections.${key}Title`)}</h2><p>{t(`${kind}Sections.${key}`)}</p></section>)}
    <div className={styles.links}><Link href="/patches">{t('playNow')}</Link><Link href={kind === 'how' ? '/patches/strategy' : '/patches/how-to-play'}>{t(kind === 'how' ? 'strategyLink' : 'learnRules')}</Link><Link href="/patches/easy">{t('easyLink')}</Link><Link href="/patches/hard">{t('hardLink')}</Link></div>
    <p className={styles.disclosure}>{t('disclosure')}</p>
  </article></div>
}

import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import type { Difficulty } from '@/lib/patches/types'
import { starter as easy } from '@/lib/patches/levels/starter-easy'
import { starter as medium } from '@/lib/patches/levels/starter-medium'
import { starter as hard } from '@/lib/patches/levels/starter-hard'
import PatchesGame from './PatchesGame'
import styles from './patches.module.css'

export default async function PatchesLanding({ locale, difficulty }: { locale: string; difficulty?: Difficulty }) {
  const t = await getTranslations({ locale, namespace: 'patches' })
  const initial = { easy, medium, hard }[difficulty ?? 'easy']
  return <div className={styles.page}><div className={styles.inner}>
    <div className={styles.topline}><Link href="/">← {t('back')}</Link><span>{t('kicker')}</span></div>
    <header className={styles.hero}><div><h1>{t('title')}{difficulty && <span style={{ fontSize: '.42em', marginLeft: 14 }}>{t(`difficulties.${difficulty}`)}</span>}</h1><p>{t('subtitle')}</p></div><div className={styles.stamp}><strong>{t('stamp')}</strong>{t('stampDetail')}</div></header>
    <PatchesGame initialPuzzle={initial} preferredDifficulty={difficulty} />
    <div className={styles.content}>
      <section><h2>{t('aboutTitle')}</h2><p>{difficulty ? t(`difficultyIntros.${difficulty}`) : t('aboutText')}</p><p>{t('dailyText')}</p></section>
      <section><h2>{t('practiceTitle')}</h2><p>{t('practiceText')}</p><div className={styles.links}><Link href="/patches/how-to-play">{t('learnRules')}</Link><Link href="/patches/strategy">{t('strategyLink')}</Link>{(['easy', 'medium', 'hard'] as const).map(d => <Link key={d} href={`/patches/${d}`}>{t(`${d}Link`)}</Link>)}</div></section>
    </div>
    <p className={styles.disclosure}>{t('disclosure')}</p>
  </div></div>
}

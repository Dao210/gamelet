'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { publicLocales, localeNames } from '@/i18n/config'
import { footerGroups, siteLinks } from '@/lib/site-navigation'
import GameletLogo from './GameletLogo'
import styles from './site-navigation.module.css'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('navigation')
  const pathname = usePathname()
  const locale = useLocale()

  return <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <div className={styles.footerIntro}>
        <GameletLogo width={40} height={40} linkClassName={styles.brand} showBrandName brandNameClassName={styles.brandName} />
        <p>{t('browseDescription')}</p>
      </div>
      {/* Visible from first paint: no scroll animation or hydration gate. */}
      <nav aria-label={t('navigationLabel')} className={styles.footerGrid}>
        {footerGroups.map(group => <section key={group.id} className={styles.footerGroup} aria-labelledby={`footer-${group.id}`}>
          <h2 id={`footer-${group.id}`}>{nav(`groups.${group.id}`)}</h2>
          <ul>{group.links.map(key => <li key={key}>
            <Link href={siteLinks[key]} prefetch={false} aria-current={pathname === siteLinks[key] ? 'page' : undefined}>
              {nav(`links.${key}`)}
            </Link>
          </li>)}</ul>
        </section>)}
      </nav>
      <div className={styles.footerBottom}>
        <nav aria-label={t('language')}>
          <ul className={styles.languages}>{publicLocales.map(loc => <li key={loc}>
            <Link href={pathname} locale={loc} hrefLang={loc} lang={loc} prefetch={false} aria-current={loc === locale ? 'page' : undefined}>
              {localeNames[loc]}
            </Link>
          </li>)}</ul>
        </nav>
        <div className={styles.socials}>
          <span>{t('followUs')}</span>
          <a href="https://twitter.com/nerdlemathgame" target="_blank" rel="noopener noreferrer">X / Twitter</a>
          <a href="https://discord.gg/nerdle" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <a href="https://agentpage.io" target="_blank" rel="noopener noreferrer">agentpage.io <span aria-hidden="true">↗</span></a>
        <button type="button" className={styles.backTop} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
          {t('backToTop')} <span aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  </footer>
}

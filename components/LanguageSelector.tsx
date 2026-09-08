'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { publicLocales, localeNames, type Locale } from '@/i18n/config'
import styles from './site-navigation.module.css'

export default function LanguageSelector() {
  const locale = useLocale() as Locale
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const detail = dropdownRef.current
      if (detail && !detail.contains(event.target as Node)) detail.open = false
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return <details ref={dropdownRef} className={styles.language} name="gamelet-navigation"
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false }}
    onKeyDown={event => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      event.currentTarget.open = false
      event.currentTarget.querySelector<HTMLElement>('summary')?.focus()
    }}>
    <summary className={styles.languageSummary} aria-label={t('selectLanguage')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
      </svg>
      <span className={styles.languageName} lang={locale}>{localeNames[locale]}</span>
      <span className={styles.chevron} aria-hidden="true" />
    </summary>
    <ul className={styles.dropdown}>
      {publicLocales.map(loc => <li key={loc}>
        <Link href={pathname} locale={loc} hrefLang={loc} lang={loc} prefetch={false}
          aria-current={loc === locale ? 'page' : undefined}
          className={loc === locale ? styles.active : undefined}
          onClick={() => { if (dropdownRef.current) dropdownRef.current.open = false }}>
          {localeNames[loc]}{loc === locale && <span aria-hidden="true">✓</span>}
        </Link>
      </li>)}
    </ul>
  </details>
}

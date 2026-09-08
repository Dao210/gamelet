'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { headerGroups, isNavigationSection, primaryLinks, siteLinks, type SiteLink } from '@/lib/site-navigation'
import LanguageSelector from './LanguageSelector'
import GameletLogo from './GameletLogo'
import styles from './site-navigation.module.css'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('navigation')

  useEffect(() => {
    setIsMenuOpen(false)
    headerRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(detail => { detail.open = false })
  }, [pathname, locale])

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return
      setIsMenuOpen(false)
      headerRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(detail => { detail.open = false })
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  useEffect(() => {
    if (isMenuOpen) menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
  }, [isMenuOpen])

  const closeMenu = () => {
    setIsMenuOpen(false)
    headerRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(detail => { detail.open = false })
  }
  const link = (key: SiteLink, primary = false) => {
    const href = siteLinks[key]
    return <Link href={href} prefetch={false} onClick={closeMenu}
      aria-current={pathname === href ? 'page' : undefined}
      className={`${primary ? styles.primaryLink : ''} ${isNavigationSection(pathname, href) ? styles.active : ''}`}>
      {t(`links.${key}`)}
    </Link>
  }

  return <header ref={headerRef} className={styles.header} onKeyDown={event => {
    if (event.key !== 'Escape') return
    const detail = (event.target as HTMLElement).closest<HTMLDetailsElement>('details[open]')
    if (detail) {
      detail.open = false
      detail.querySelector<HTMLElement>('summary')?.focus()
    } else if (isMenuOpen) { closeMenu(); menuButtonRef.current?.focus() }
  }}>
    <div className={styles.bar}>
      <GameletLogo width={36} height={36} linkClassName={styles.brand} showBrandName brandNameClassName={styles.brandName} />
      {/* Keep the same crawlable link tree in the initial HTML at every width. */}
      <nav ref={menuRef} id="primary-navigation" aria-label={t('primaryLabel')} className={`${styles.primary} ${isMenuOpen ? styles.primaryOpen : ''}`}>
        <ul className={styles.primaryList}>
          {primaryLinks.map(key => <li key={key}>{link(key, true)}</li>)}
          {headerGroups.map(group => <li key={group.id}>
            <details className={styles.disclosure} name="gamelet-navigation" onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
            }}>
              <summary className={`${styles.summary} ${group.links.some(key => isNavigationSection(pathname, siteLinks[key])) ? styles.active : ''}`}>
                {t(`groups.${group.id}`)}<span className={styles.chevron} aria-hidden="true" />
              </summary>
              <ul className={styles.dropdown}>{group.links.map(key => <li key={key}>{link(key)}</li>)}</ul>
            </details>
          </li>)}
        </ul>
      </nav>
      <div className={styles.controls}>
        <LanguageSelector />
        <button ref={menuButtonRef} type="button" className={styles.menuButton} onClick={() => setIsMenuOpen(open => !open)}
          aria-label={t('toggleMenu')} aria-expanded={isMenuOpen} aria-controls="primary-navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d={isMenuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
    </div>
  </header>
}

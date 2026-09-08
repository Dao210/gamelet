import { fireEvent, render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LanguageSelector from '@/components/LanguageSelector'
import { footerGroups, isNavigationSection, siteLinks } from '@/lib/site-navigation'
import messages from '@/messages/en.json'

let mockLocale = 'en'
let mockPathname = '/patches/strategy'
jest.mock('next-intl', () => ({
  useLocale: () => mockLocale,
  useTranslations: (namespace: 'navigation' | 'footer') => (key: string, values: Record<string, string | number> = {}) => {
    let result: unknown = messages[namespace]
    for (const part of key.split('.')) result = (result as Record<string, unknown>)[part]
    return String(result).replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? name))
  }
}))
jest.mock('@/i18n/routing', () => ({
  usePathname: () => mockPathname,
  Link: ({ href, locale = mockLocale, prefetch, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: string; prefetch?: boolean }) => <a {...props} href={`/${locale}${href === '/' ? '' : href}`} data-prefetch={String(prefetch)} />
}))
jest.mock('@/components/GameletLogo', () => ({ __esModule: true, default: () => <a href={`/${mockLocale}`}>Gamelet</a> }))

beforeEach(() => { mockLocale = 'en'; mockPathname = '/patches/strategy' })

describe('Crawlable site navigation', () => {
  it('includes game, guide and language links before hydration or opening a menu', () => {
    const html = renderToStaticMarkup(<Navigation />)
    for (const href of ['/patches', '/mirror-maze', '/pulsefront', '/patches/how-to-play', '/patches/strategy']) expect(html).toContain(`href="/en${href}"`)
    expect(html).toContain('href="/de/patches/strategy"')
    expect(html).toContain('hrefLang="de"')
    expect(html).not.toContain('opacity:0')
  })
  it('offers distinct footer destinations with descriptive labels and no false FAQ', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: 'Explore Gamelet' })
    const links = within(nav).getAllByRole('link')
    const hrefs = links.map(a => a.getAttribute('href'))
    expect(new Set(hrefs).size).toBe(links.length)
    expect(links.length).toBe(Object.keys(siteLinks).length)
    expect(within(nav).getByRole('link', { name: 'How to play Patches' })).toHaveAttribute('href', '/en/patches/how-to-play')
    expect(within(nav).getByRole('link', { name: 'Nerdle solving tips' })).toHaveAttribute('href', '/en/nerd/nerdle-answer-today')
    expect(screen.queryByRole('link', { name: 'FAQ' })).not.toBeInTheDocument()
    expect(links.every(a => a.getAttribute('data-prefetch') === 'false')).toBe(true)
    expect(footerGroups.flatMap(g => [...g.links])).toHaveLength(links.length)
  })
  it('keeps locale links on the same page and exposes only public languages', () => {
    mockLocale = 'zh'; mockPathname = '/patches/hard'
    render(<Footer />)
    const languages = screen.getByRole('navigation', { name: 'Language' })
    const links = within(languages).getAllByRole('link')
    expect(links.map(a => a.getAttribute('hreflang')).sort()).toEqual(['de', 'en', 'es', 'ja', 'zh'])
    expect(within(languages).getByRole('link', { name: '简体中文' })).toHaveAttribute('aria-current', 'page')
    expect(links.every(a => a.getAttribute('href')?.endsWith('/patches/hard'))).toBe(true)
  })
  it('marks the actual page current, without treating a shared prefix as a parent', () => {
    expect(isNavigationSection('/nerd/game', '/nerd')).toBe(true)
    expect(isNavigationSection('/nerdle-other', '/nerd')).toBe(false)
    expect(isNavigationSection('/patches', '/')).toBe(false)
    const { container } = render(<Navigation />)
    expect(container.querySelector('a[href="/en/patches/strategy"]')).toHaveAttribute('aria-current', 'page')
    expect(container.querySelector('a[href="/en/patches"]')).not.toHaveAttribute('aria-current')
  })
})

describe('Navigation interaction', () => {
  it('opens the mobile menu, focuses its first link and returns focus on Escape', () => {
    render(<Navigation />)
    const button = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'All games' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('link', { name: 'All games' }), { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })
  it('closes the menu on outside interaction and route changes', () => {
    const view = render(<Navigation />)
    const button = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(button)
    fireEvent.pointerDown(document.body)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    mockPathname = '/nerd'
    view.rerender(<Navigation />)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
  it('closes a native language disclosure on Escape and restores its summary focus', () => {
    const { container } = render(<LanguageSelector />)
    const detail = container.querySelector('details')!
    detail.open = true
    const link = container.querySelector('a[hreflang="de"]')!
    fireEvent.keyDown(link, { key: 'Escape' })
    expect(detail.open).toBe(false)
    expect(container.querySelector('summary')).toHaveFocus()
  })
})

import {
  createPageMetadata,
  generateLanguageAlternates,
  getCanonicalUrl,
  getLocalizedPath
} from '@/lib/seo-utils'

describe('SEO URL helpers', () => {
  it('keeps the explicit locale prefix on every localized URL', () => {
    expect(getLocalizedPath('/', 'en')).toBe('/en')
    expect(getCanonicalUrl('/mirror-maze', 'zh')).toBe('https://gamelet.app/zh/mirror-maze')
  })

  it('only advertises public, reciprocal hreflang locales', () => {
    const alternates = generateLanguageAlternates('/2584')

    expect(alternates.en).toBe('https://gamelet.app/en/2584')
    expect(alternates['x-default']).toBe('https://gamelet.app/en/2584')
    expect(alternates.fr).toBeUndefined()
    expect(alternates.it).toBeUndefined()
    expect(alternates.ru).toBeUndefined()
  })

  it('builds a self-referencing canonical for public pages', () => {
    const metadata = createPageMetadata({
      locale: 'de',
      pathname: '/logic-switch',
      title: 'Logic Switch',
      description: 'A logic puzzle.'
    })

    expect(metadata.alternates?.canonical).toBe('https://gamelet.app/de/logic-switch')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
  })

  it('keeps hidden and private pages out of the index and hreflang cluster', () => {
    const hiddenLocale = createPageMetadata({
      locale: 'fr',
      pathname: '/logic-switch',
      title: 'Logic Switch',
      description: 'A logic puzzle.'
    })
    const privatePage = createPageMetadata({
      locale: 'en',
      pathname: '/grassland/my-plants',
      title: 'My Plants',
      description: 'Private plants.',
      index: false
    })

    expect(hiddenLocale.robots).toMatchObject({ index: false, follow: true })
    expect(hiddenLocale.alternates?.languages).toBeUndefined()
    expect(privatePage.robots).toMatchObject({ index: false, follow: true })
    expect(privatePage.alternates?.languages).toBeUndefined()
  })
})

// Curated links shared by the header and footer. Targets are existing pages;
// game rules and catalogs remain in their own feature modules.
export const siteLinks = {
  allGames: '/',
  patches: '/patches',
  nerdle: '/nerd',
  fibonacci: '/2584',
  mirrorMaze: '/mirror-maze',
  pulsefront: '/pulsefront',
  orbitSum: '/orbit-sum',
  logicSwitch: '/logic-switch',
  wordBridge: '/word-bridge',
  cipher: '/word-cipher-box',
  glyphGarden: '/glyph-garden',
  instruments: '/impossible-instruments',
  patchesHow: '/patches/how-to-play',
  patchesStrategy: '/patches/strategy',
  patchesEasy: '/patches/easy',
  patchesMedium: '/patches/medium',
  patchesHard: '/patches/hard',
  nerdleTips: '/nerd/nerdle-answer-today',
  about: '/about',
  contact: '/contact',
  garden: '/grassland',
  privacy: '/privacy',
  terms: '/terms'
} as const

export type SiteLink = keyof typeof siteLinks
export const primaryLinks = ['allGames', 'patches', 'nerdle'] as const satisfies readonly SiteLink[]
export const headerGroups = [
  { id: 'moreGames', links: ['fibonacci', 'mirrorMaze', 'pulsefront', 'orbitSum', 'wordBridge', 'cipher'] },
  { id: 'guides', links: ['patchesHow', 'patchesStrategy', 'patchesEasy', 'nerdleTips'] }
] as const satisfies readonly { id: string; links: readonly SiteLink[] }[]
export const footerGroups = [
  { id: 'logicGames', links: ['patches', 'nerdle', 'fibonacci', 'orbitSum', 'logicSwitch'] },
  { id: 'moreToPlay', links: ['mirrorMaze', 'pulsefront', 'wordBridge', 'cipher', 'glyphGarden', 'instruments'] },
  { id: 'learnPractice', links: ['patchesHow', 'patchesStrategy', 'patchesEasy', 'patchesMedium', 'patchesHard', 'nerdleTips'] },
  { id: 'gamelet', links: ['allGames', 'about', 'contact', 'garden', 'privacy', 'terms'] }
] as const satisfies readonly { id: string; links: readonly SiteLink[] }[]

export function isNavigationSection(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

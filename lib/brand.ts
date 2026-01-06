/**
 * Brand Management System
 * Comprehensive brand utilities for Gamelet ecosystem
 * Supports multiple brands, SEO optimization, and internationalization
 */

export type BrandType = 'primary' | 'game' | 'creative' | 'platform'
export type BrandStyle = 'modern' | 'educational' | 'organic' | 'professional' | 'playful'
export type BrandContext = 'seo' | 'social' | 'app-store' | 'legal' | 'marketing'
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ru' | 'zh'

export interface BrandConfig {
  name: string
  tagline: string
  description: string
  keywords: string[]
  tone: string
  values: string[]
  mission: string
}

export interface BrandValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface SEOConfig {
  title: string
  description: string
  keywords: string
  canonical: string
  ogTitle: string
  ogDescription: string
}

/**
 * Core brand configurations for Gamelet ecosystem
 */
export const BRAND_CONFIGS: Record<BrandType, BrandConfig> = {
  primary: {
    name: 'Gamelet',
    tagline: 'Creative Technology Platform',
    description: 'Innovative creative technology platform connecting communities through engaging experiences',
    keywords: ['creative', 'platform', 'technology', 'innovation', 'community'],
    tone: 'Professional yet approachable',
    values: ['Innovation', 'Accessibility', 'Community', 'Quality'],
    mission: 'To democratize creative technology and build meaningful connections'
  },
  game: {
    name: 'Nerdle',
    tagline: 'Daily Math Equation Puzzle Game',
    description: 'Challenge your mathematical skills with daily equation puzzles',
    keywords: ['math', 'puzzle', 'daily', 'equation', 'game', 'educational'],
    tone: 'Playful and educational',
    values: ['Education', 'Challenge', 'Fun', 'Accessibility'],
    mission: 'Make mathematics engaging and accessible to everyone'
  },
  creative: {
    name: 'Global Trellis',
    tagline: 'Creative Garden Social Platform',
    description: 'Grow your creativity in a collaborative digital garden',
    keywords: ['garden', 'creative', 'social', 'growth', 'canvas', 'collaboration'],
    tone: 'Organic and inspiring',
    values: ['Creativity', 'Growth', 'Connection', 'Sustainability'],
    mission: 'Cultivate creativity through collaborative digital experiences'
  },
  platform: {
    name: 'Gamelet Platform',
    tagline: 'Unified Creative Experience',
    description: 'Comprehensive platform for creative games and social experiences',
    keywords: ['platform', 'unified', 'creative', 'experience', 'integrated'],
    tone: 'Professional and comprehensive',
    values: ['Integration', 'Quality', 'Scalability', 'User Experience'],
    mission: 'Provide seamless creative experiences across all touchpoints'
  }
}

/**
 * Internationalized brand configurations
 */
export const INTERNATIONALIZED_BRANDS: Record<Language, Partial<Record<BrandType, Partial<BrandConfig>>>> = {
  en: BRAND_CONFIGS, // English as base
  es: {
    game: {
      name: 'Nerdle',
      tagline: 'Juego Diario de Ecuaciones Matemáticas',
      description: 'Desafía tus habilidades matemáticas con acertijos de ecuaciones diarios',
      keywords: ['matemáticas', 'acertijo', 'diario', 'ecuación', 'juego', 'educativo']
    },
    creative: {
      name: 'Global Trellis',
      tagline: 'Plataforma Social de Jardín Creativo',
      description: 'Cultiva tu creatividad en un jardín digital colaborativo'
    }
  },
  fr: {
    game: {
      name: 'Nerdle',
      tagline: 'Jeu Quotidien d\'Équations Mathématiques',
      description: 'Défiez vos compétences mathématiques avec des casse-tête d\'équations quotidiens',
      keywords: ['mathématiques', 'casse-tête', 'quotidien', 'équation', 'jeu', 'éducatif']
    },
    creative: {
      name: 'Global Trellis',
      tagline: 'Plateforme Sociale de Jardin Créatif',
      description: 'Faites pousser votre créativité dans un jardin numérique collaboratif'
    }
  },
  de: {
    game: {
      name: 'Nerdle',
      tagline: 'Tägliches Mathematik-Gleichungsrätsel',
      description: 'Fordern Sie Ihre mathematischen Fähigkeiten mit täglichen Gleichungsrätseln heraus',
      keywords: ['mathematik', 'rätsel', 'täglich', 'gleichung', 'spiel', 'bildung']
    },
    creative: {
      name: 'Global Trellis',
      tagline: 'Kreative Garten-Social-Plattform',
      description: 'Lassen Sie Ihre Kreativität in einem kollaborativen digitalen Garten wachsen'
    }
  },
  it: {
    game: {
      name: 'Nerdle',
      tagline: 'Gioco Quotidiano di Equazioni Matematiche',
      description: 'Sfida le tue abilità matematiche con rompicapi di equazioni quotidiani',
      keywords: ['matematica', 'rompicapo', 'quotidiano', 'equazione', 'gioco', 'educativo']
    },
    creative: {
      name: 'Global Trellis',
      tagline: 'Piattaforma Social di Giardino Creativo',
      description: 'Coltiva la tua creatività in un giardino digitale collaborativo'
    }
  },
  ja: {
    game: {
      name: 'ナードル',
      tagline: '毎日の数学方程式パズルゲーム',
      description: '毎日の方程式パズルで数学スキルに挑戦しましょう',
      keywords: ['数学', 'パズル', '毎日', '方程式', 'ゲーム', '教育']
    },
    creative: {
      name: 'グローバルトレリス',
      tagline: 'クリエイティブガーデンソーシャルプラットフォーム',
      description: 'コラボレーティブなデジタルガーデンで創造性を育みましょう'
    }
  },
  ru: {
    game: {
      name: 'Нердл',
      tagline: 'Ежедневная Математическая Игра с Уравнениями',
      description: 'Проверьте свои математические способности ежедневными головоломками с уравнениями',
      keywords: ['математика', 'головоломка', 'ежедневно', 'уравнение', 'игра', 'образование']
    },
    creative: {
      name: 'Глобальный Треллис',
      tagline: 'Творческая Садовая Социальная Платформа',
      description: 'Развивайте свое творчество в совместном цифровом саду'
    }
  },
  zh: {
    game: {
      name: '数学猜谜',
      tagline: '每日数学方程式益智游戏',
      description: '通过每日方程式谜题挑战您的数学技能',
      keywords: ['数学', '益智', '每日', '方程式', '游戏', '教育']
    },
    creative: {
      name: '全球花架',
      tagline: '创意花园社交平台',
      description: '在协作数字花园中培养您的创造力'
    }
  }
}

/**
 * Get brand configuration for a specific type and language
 */
export function getBrandConfig(type: BrandType, language: Language = 'en'): BrandConfig {
  const baseConfig = BRAND_CONFIGS[type]
  const localizedConfig = INTERNATIONALIZED_BRANDS[language]?.[type]

  if (!localizedConfig) return baseConfig

  return {
    ...baseConfig,
    ...localizedConfig
  } as BrandConfig
}

/**
 * Generate SEO-optimized brand content
 */
export function generateSEOContent(
  type: BrandType,
  language: Language = 'en',
  context: BrandContext = 'seo'
): SEOConfig {
  const config = getBrandConfig(type, language)

  const seoTemplates = {
    seo: {
      title: `${config.name} - ${config.tagline} | ${getPrimaryBenefit(type)}`,
      description: `${config.description}. ${getCallToAction(type)}`,
      keywords: config.keywords.join(', '),
      canonical: getCanonicalUrl(type),
      ogTitle: config.name,
      ogDescription: config.description
    },
    social: {
      title: config.name,
      description: config.description,
      keywords: config.keywords.slice(0, 5).join(', '),
      canonical: getCanonicalUrl(type),
      ogTitle: `${config.name} - ${config.tagline}`,
      ogDescription: `${config.description}. Perfect for sharing!`
    },
    'app-store': {
      title: `${config.name}: ${config.tagline}`,
      description: `${config.description} Download now for free!`,
      keywords: [...config.keywords, 'app', 'mobile', 'download'].join(', '),
      canonical: getCanonicalUrl(type),
      ogTitle: config.name,
      ogDescription: `Download ${config.name} - ${config.tagline}`
    },
    legal: {
      title: `${config.name} - Legal & Privacy`,
      description: `Legal information, privacy policy, and terms of service for ${config.name}`,
      keywords: [...config.keywords, 'legal', 'privacy', 'terms', 'policy'].join(', '),
      canonical: getCanonicalUrl(type),
      ogTitle: `${config.name} - Legal Information`,
      ogDescription: `Legal and privacy information for ${config.name}`
    },
    marketing: {
      title: `${config.name}: ${getPrimaryBenefit(type)}`,
      description: `${config.description}. Join thousands of satisfied users today!`,
      keywords: [...config.keywords, 'marketing', 'promotion', 'features', 'benefits'].join(', '),
      canonical: getCanonicalUrl(type),
      ogTitle: `${config.name} - ${config.tagline}`,
      ogDescription: `Discover why ${config.name} is the best choice for ${getTargetAudience(type)}`
    }
  }

  return seoTemplates[context] || seoTemplates.seo
}

/**
 * Validate brand name and configuration
 */
export function validateBrand(
  name: string,
  type: BrandType,
  context: BrandContext = 'seo'
): BrandValidation {
  const validation: BrandValidation = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  }

  // Length validation
  if (name.length < 3) {
    validation.isValid = false
    validation.errors.push('Brand name must be at least 3 characters long')
  }

  if (name.length > 50) {
    validation.warnings.push('Brand name is quite long - consider shortening for better memorability')
  }

  // Character validation
  if (!/^[a-zA-Z0-9\s\-']+$/.test(name)) {
    validation.isValid = false
    validation.errors.push('Brand name contains invalid characters. Use only letters, numbers, spaces, hyphens, and apostrophes')
  }

  // Context-specific validation
  if (context === 'seo') {
    if (!name.toLowerCase().includes(type)) {
      validation.suggestions.push(`Consider including "${type}" related keywords for better SEO`)
    }
  }

  if (context === 'social') {
    if (name.length > 20) {
      validation.warnings.push('Long brand names may be truncated on some social platforms')
    }
  }

  if (context === 'legal') {
    if (name.toLowerCase().includes('inc') || name.toLowerCase().includes('llc')) {
      validation.suggestions.push('Consider removing legal entity designations from brand name')
    }
  }

  return validation
}

/**
 * Check brand consistency across the project
 */
export function checkBrandConsistency(
  scope: 'project' | 'marketing' | 'legal' = 'project',
  language: Language = 'en'
): string[] {
  const issues: string[] = []

  // This would typically scan files and check for consistency
  // For now, return common consistency guidelines

  if (scope === 'project') {
    issues.push('Ensure consistent brand name capitalization across all files')
    issues.push('Verify brand logo usage matches style guide')
    issues.push('Check that brand colors are used consistently')
  }

  if (scope === 'marketing') {
    issues.push('Ensure consistent messaging across all marketing materials')
    issues.push('Verify brand voice and tone alignment')
    issues.push('Check for consistent use of taglines and slogans')
  }

  if (scope === 'legal') {
    issues.push('Verify trademark symbols are used correctly')
    issues.push('Ensure proper attribution and copyright notices')
    issues.push('Check for consistent legal entity references')
  }

  return issues
}

/**
 * Generate brand variants for A/B testing
 */
export function generateBrandVariants(
  baseName: string,
  type: BrandType,
  count: number = 3
): string[] {
  const variants: string[] = [baseName]

  const modifiers = {
    primary: ['Pro', 'Plus', 'One', 'Hub', 'Core'],
    game: ['Daily', 'Challenge', 'Puzzle', 'Quest', 'Adventure'],
    creative: ['Garden', 'Studio', 'Space', 'Lab', 'Works'],
    platform: ['Network', 'Hub', 'System', 'Cloud', 'Suite']
  }

  const typeModifiers = modifiers[type] || modifiers.primary

  for (let i = 0; i < Math.min(count - 1, typeModifiers.length); i++) {
    variants.push(`${baseName} ${typeModifiers[i]}`)
  }

  return variants
}

/**
 * Helper functions
 */
function getPrimaryBenefit(type: BrandType): string {
  const benefits = {
    primary: 'Creative Technology Solutions',
    game: 'Play Free Online',
    creative: 'Collaborative Creation',
    platform: 'Unified Experience'
  }
  return benefits[type] || benefits.primary
}

function getCallToAction(type: BrandType): string {
  const ctas = {
    primary: 'Join our creative community today!',
    game: 'Start playing now!',
    creative: 'Begin creating today!',
    platform: 'Experience the difference!'
  }
  return ctas[type] || ctas.primary
}

function getTargetAudience(type: BrandType): string {
  const audiences = {
    primary: 'creative professionals and enthusiasts',
    game: 'puzzle lovers and math enthusiasts',
    creative: 'artists and creative individuals',
    platform: 'users seeking integrated creative experiences'
  }
  return audiences[type] || audiences.primary
}

function getCanonicalUrl(type: BrandType): string {
  const urls = {
    primary: 'https://gamelet.app',
    game: 'https://gamelet.app/nerd',
    creative: 'https://gamelet.app/garden',
    platform: 'https://gamelet.app'
  }
  return urls[type] || urls.primary
}

/**
 * Export all brand utilities
 */
export const BrandUtils = {
  getBrandConfig,
  generateSEOContent,
  validateBrand,
  checkBrandConsistency,
  generateBrandVariants,
  BRAND_CONFIGS,
  INTERNATIONALIZED_BRANDS
}
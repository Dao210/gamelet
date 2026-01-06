/**
 * Brand Constants
 * Centralized brand-related constants for the Gamelet ecosystem
 */

/**
 * Brand types and their primary purposes
 */
export const BRAND_TYPES = {
  PRIMARY: 'primary' as const,
  GAME: 'game' as const,
  CREATIVE: 'creative' as const,
  PLATFORM: 'platform' as const
}

/**
 * Supported languages for internationalization
 */
export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en' as const,
  SPANISH: 'es' as const,
  FRENCH: 'fr' as const,
  GERMAN: 'de' as const,
  ITALIAN: 'it' as const,
  JAPANESE: 'ja' as const,
  RUSSIAN: 'ru' as const,
  CHINESE: 'zh' as const
}

/**
 * Brand contexts for different use cases
 */
export const BRAND_CONTEXTS = {
  SEO: 'seo' as const,
  SOCIAL: 'social' as const,
  APP_STORE: 'app-store' as const,
  LEGAL: 'legal' as const,
  MARKETING: 'marketing' as const
}

/**
 * Brand styles for different visual approaches
 */
export const BRAND_STYLES = {
  MODERN: 'modern' as const,
  EDUCATIONAL: 'educational' as const,
  ORGANIC: 'organic' as const,
  PROFESSIONAL: 'professional' as const,
  PLAYFUL: 'playful' as const
}

/**
 * Default brand configurations
 */
export const DEFAULT_BRANDS = {
  GAMELET: 'Gamelet',
  NERDLE: 'Nerdle',
  GLOBAL_TRELLIS: 'Global Trellis'
} as const

/**
 * URL patterns for different brand contexts
 */
export const BRAND_URLS = {
  PRIMARY: 'https://gamelet.app',
  GAME: 'https://gamelet.app/nerd',
  CREATIVE: 'https://gamelet.app/garden',
  PLATFORM: 'https://gamelet.app'
} as const

/**
 * Social media handle patterns
 */
export const SOCIAL_HANDLES = {
  GAMELET: '@gameletapp',
  NERDLE: '@nerdlemathgame',
  GLOBAL_TRELLIS: '@globaltrellis'
} as const

/**
 * SEO keyword groups for different brands
 */
export const SEO_KEYWORDS = {
  GAMELET: ['creative platform', 'technology', 'innovation', 'community'],
  NERDLE: ['math game', 'equation puzzle', 'daily challenge', 'educational'],
  GLOBAL_TRELLIS: ['creative garden', 'social platform', 'collaboration', 'digital art']
} as const

/**
 * Brand color schemes (Tailwind classes)
 */
export const BRAND_COLORS = {
  GAMELET: {
    primary: 'blue-600',
    secondary: 'purple-600',
    accent: 'indigo-500',
    dark: {
      primary: 'blue-400',
      secondary: 'purple-400',
      accent: 'indigo-300'
    }
  },
  NERDLE: {
    primary: 'green-600',
    secondary: 'blue-600',
    accent: 'teal-500',
    dark: {
      primary: 'green-400',
      secondary: 'blue-400',
      accent: 'teal-300'
    }
  },
  GLOBAL_TRELLIS: {
    primary: 'emerald-600',
    secondary: 'lime-600',
    accent: 'green-500',
    dark: {
      primary: 'emerald-400',
      secondary: 'lime-400',
      accent: 'green-300'
    }
  }
} as const

/**
 * Brand logo configurations (Square 1:1 ratio)
 */
export const LOGO_CONFIGS = {
  DEFAULT_SIZE: { width: 48, height: 48 },
  MINI_SIZE: { width: 32, height: 32 },
  LARGE_SIZE: { width: 64, height: 64 },
  ASPECT_RATIOS: {
    HORIZONTAL: 3 as const,
    SQUARE: 1 as const,
    VERTICAL: 0.75 as const
  }
} as const

/**
 * Validation rules for brand names
 */
export const VALIDATION_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 50,
  MAX_SOCIAL_LENGTH: 20,
  MAX_APP_STORE_LENGTH: 30,
  ALLOWED_CHARACTERS: /^[a-zA-Z0-9\s\-']+$/,
  RESERVED_WORDS: ['admin', 'root', 'system', 'test'],
  PROHIBITED_PATTERNS: [
    /\b(inc|llc|corp|ltd)\b/i, // Legal entities
    /\b(tm|r|c)\b/i, // Trademark symbols
    /[^\x00-\x7F]/ // Non-ASCII characters (except in specific contexts)
  ]
} as const

/**
 * Default SEO configurations
 */
export const DEFAULT_SEO = {
  TITLE_SEPARATOR: ' | ',
  DESCRIPTION_MAX_LENGTH: 155,
  TITLE_MAX_LENGTH: 60,
  OG_IMAGE_SIZE: { width: 1200, height: 630 },
  TWITTER_CARD_TYPE: 'summary_large_image' as const
} as const

/**
 * File paths for brand assets
 */
export const BRAND_ASSET_PATHS = {
  LOGOS: '/images/logos/',
  FAVICONS: '/favicon/',
  OG_IMAGES: '/images/og/',
  SOCIAL_IMAGES: '/images/social/',
  MANIFEST: '/site.webmanifest'
} as const

/**
 * Internationalization file patterns
 */
export const I18N_PATTERNS = {
  MESSAGES_FILE: 'messages/{language}.json',
  BRAND_SECTION: 'common.brand',
  FALLBACK_LANGUAGE: 'en' as const
} as const

/**
 * Error messages for brand validation
 */
export const VALIDATION_ERRORS = {
  TOO_SHORT: `Brand name must be at least ${VALIDATION_RULES.MIN_LENGTH} characters`,
  TOO_LONG: `Brand name should not exceed ${VALIDATION_RULES.MAX_LENGTH} characters`,
  INVALID_CHARACTERS: 'Brand name contains invalid characters',
  RESERVED_WORD: 'Brand name uses a reserved word',
  LEGAL_ENTITY: 'Brand name should not include legal entity designations',
  TRADEMARK_SYMBOL: 'Brand name should not include trademark symbols'
} as const

/**
 * Success messages for brand operations
 */
export const SUCCESS_MESSAGES = {
  VALIDATION_PASSED: 'Brand validation successful',
  SEO_GENERATED: 'SEO content generated successfully',
  CONSISTENCY_CHECKED: 'Brand consistency verified',
  VARIANTS_GENERATED: 'Brand variants generated successfully',
  TRANSLATION_COMPLETED: 'Brand translation completed'
} as const

/**
 * Brand usage guidelines
 */
export const USAGE_GUIDELINES = {
  CAPITALIZATION: 'Use consistent capitalization across all instances',
  SPACING: 'Maintain consistent spacing around brand names',
  CONTEXT: 'Use appropriate brand variant for the context',
  CONSISTENCY: 'Maintain visual and verbal consistency',
  ACCESSIBILITY: 'Ensure brand elements meet accessibility standards',
  PERFORMANCE: 'Optimize brand assets for web performance'
} as const

/**
 * Type exports for convenience
 */
export type BrandType = typeof BRAND_TYPES[keyof typeof BRAND_TYPES]
export type Language = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES]
export type BrandContext = typeof BRAND_CONTEXTS[keyof typeof BRAND_CONTEXTS]
export type BrandStyle = typeof BRAND_STYLES[keyof typeof BRAND_STYLES]
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const withoutLegacyReactRules = (configs) => configs.map((config) => ({
  ...config,
  rules: Object.fromEntries(
    Object.entries(config.rules ?? {}).filter(([ruleName]) => !ruleName.startsWith('react/'))
  )
}))

export default defineConfig([
  ...withoutLegacyReactRules(nextVitals),
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'coverage/**',
    'generated/**',
    'node_modules/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off'
    }
  },
  {
    files: ['*.js', '*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
])

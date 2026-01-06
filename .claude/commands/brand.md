# Brand Command - Multi-Brand Management System

## Overview
This command provides comprehensive brand name management for the Gamelet ecosystem, supporting multiple brands (Gamelet, Nerdle, Global Trellis) with SEO optimization, internationalization, and consistency validation.

## Core Features

### 1. Brand Name Management
- **Primary Brand**: Gamelet (platform/company)
- **Game Brand**: Nerdle (math puzzle game)
- **Creative Brand**: Global Trellis (garden/social platform)
- **SEO-Optimized**: All brand names include relevant keywords
- **Internationalized**: Support for 8 languages (EN, ES, FR, DE, IT, JA, RU, ZH)

### 2. Brand Validation & Consistency
- Validates brand name format and length
- Ensures SEO-friendly naming conventions
- Checks for consistent usage across files
- Prevents conflicting brand references

### 3. Multi-Platform Support
- Website headers and meta tags
- Social media profiles and sharing
- App store listings
- Marketing materials
- Legal documentation

## Usage Examples

### Basic Brand Generation
```
/brand generate --type=primary --language=en --style=modern
/brand generate --type=game --language=es --style=educational
/brand generate --type=creative --language=ja --style=organic
```

### Brand Validation
```
/brand validate --name="Gamelet" --context=seo
/brand validate --name="Nerdle Daily Math" --context=app-store
/brand validate --name="Global Trellis Garden" --context=social
```

### Brand Consistency Check
```
/brand check-consistency --scope=project
/brand check-consistency --scope=marketing --language=fr
/brand check-consistency --scope=legal --format=trademark
```

### Internationalization
```
/brand translate --name="Nerdle" --target-languages=es,fr,de,it
/brand localize --context=game --region=EU --style=formal
/brand adapt --brand=global-trellis --market=asia --cultural=adjusted
```

## Brand Architecture

### Primary Brand (Gamelet)
- **Mission**: Creative technology platform
- **Values**: Innovation, Accessibility, Community
- **Tone**: Professional yet approachable
- **Keywords**: creative, platform, technology, innovation

### Game Brand (Nerdle)
- **Mission**: Daily math puzzle entertainment
- **Values**: Education, Challenge, Fun
- **Tone**: Playful and educational
- **Keywords**: math, puzzle, daily, equation, game

### Creative Brand (Global Trellis)
- **Mission**: Social creative platform with plant growth
- **Values**: Creativity, Growth, Connection
- **Tone**: Organic and inspiring
- **Keywords**: garden, creative, social, growth, canvas

## SEO Optimization Rules

### Title Tags
- Primary: "[Brand] - [What it does] | [Key Benefit]"
- Example: "Nerdle - Daily Math Equation Puzzle Game | Play Free Online"

### Meta Descriptions
- Include primary keyword within first 155 characters
- Mention key benefits and features
- Include call-to-action

### URL Structure
- Primary brand: `/`
- Game: `/nerd/`, `/nerd/game/`
- Creative: `/garden/`

## Internationalization Guidelines

### Language-Specific Considerations
- **Spanish**: Maintain mathematical terminology accuracy
- **French**: Preserve educational game context
- **German**: Emphasize logic and structure
- **Italian**: Balance formality with accessibility
- **Japanese**: Respect cultural gaming preferences
- **Russian**: Ensure technical translation accuracy
- **Chinese**: Simplified characters for broader reach

### Cultural Adaptation
- Colors and symbolism appropriate to market
- Number formats and mathematical notation
- Cultural references and examples
- Local gaming and social platform preferences

## Implementation Standards

### Code Integration
```typescript
import { getBrandName, validateBrand, generateSEO } from '@/lib/brand'

const brandName = getBrandName('game', 'en')
const seoData = generateSEO('primary', 'en', {
  includeKeywords: true,
  optimizeForSocial: true
})
```

### File Naming
- Brand utilities: `lib/brand.ts`
- Brand constants: `lib/brand-constants.ts`
- Brand validation: `lib/brand-validation.ts`
- Brand i18n: `messages/brand.json`

### Component Usage
```tsx
import BrandLogo from '@/components/BrandLogo'
import BrandHeader from '@/components/BrandHeader'

<BrandLogo brand="gamelet" variant="horizontal" theme="dark" />
<BrandHeader brand="nerdle" includeTagline={true} />
```

## Quality Assurance

### Validation Checks
- Brand name length (3-50 characters)
- Trademark availability
- Domain name availability
- Social media handle availability
- SEO keyword density
- Cultural appropriateness

### Consistency Monitoring
- Cross-reference brand usage across all files
- Flag inconsistent brand representations
- Suggest standardized alternatives
- Maintain brand guideline documentation

## Advanced Features

### A/B Testing Support
```
/brand test --name="Nerdle" --variants="Nerdle Math,Nerdle Daily,Nerdle Puzzle" --metric=click-through
```

### Competitive Analysis
```
/brand analyze --competitors="wordle,mathler,numble" --market=educational-games
```

### Brand Evolution
```
/brand evolve --current="Nerdle" --direction=expand --target-audience=students
```

## Best Practices

1. **Consistency**: Use the same brand name across all touchpoints
2. **Clarity**: Ensure brand names are easy to pronounce and remember
3. **SEO**: Include relevant keywords naturally
4. **Cultural**: Research cultural implications in target markets
5. **Legal**: Verify trademark availability before finalizing
6. **Future-proof**: Choose names that allow for business expansion

## Error Handling

### Common Issues
- Brand name conflicts with existing trademarks
- Cultural insensitivity in target markets
- SEO keyword stuffing detection
- Inconsistent brand usage across platforms

### Resolution Strategies
- Suggest alternative brand names
- Provide cultural consultation resources
- Recommend SEO best practices
- Offer brand audit services

This command system ensures professional, consistent, and effective brand management across the entire Gamelet ecosystem while maintaining SEO optimization and cultural sensitivity.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const messagesDirectory = path.join(root, 'messages')
const publicLocales = ['de', 'en', 'es', 'ja', 'zh']
const localeFiles = fs.readdirSync(messagesDirectory).filter(file => file.endsWith('.json')).sort()

function flatten(value, prefix = '', result = {}) {
  for (const [key, child] of Object.entries(value)) {
    const messageKey = prefix ? `${prefix}.${key}` : key
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flatten(child, messageKey, result)
    } else {
      result[messageKey] = String(child)
    }
  }
  return result
}

function placeholders(message) {
  return [...message.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map(match => match[1]).sort()
}

const english = flatten(JSON.parse(fs.readFileSync(path.join(messagesDirectory, 'en.json'), 'utf8')))
let hasErrors = false

for (const file of localeFiles) {
  const locale = path.basename(file, '.json')
  const messages = flatten(JSON.parse(fs.readFileSync(path.join(messagesDirectory, file), 'utf8')))
  const missing = Object.keys(english).filter(key => !(key in messages))
  const extra = Object.keys(messages).filter(key => !(key in english))
  const placeholderMismatches = Object.keys(english).filter(key => {
    if (!(key in messages)) return false
    return placeholders(english[key]).join(',') !== placeholders(messages[key]).join(',')
  })
  const translated = Object.keys(english).length - missing.length
  const coverage = ((translated / Object.keys(english).length) * 100).toFixed(1)

  console.log(`${locale}: ${coverage}% coverage, ${missing.length} missing, ${extra.length} extra`)

  if (publicLocales.includes(locale) && missing.length > 0) {
    console.error(`  Missing public-locale keys: ${missing.join(', ')}`)
    hasErrors = true
  }
  if (placeholderMismatches.length > 0) {
    console.error(`  Placeholder mismatches: ${placeholderMismatches.join(', ')}`)
    hasErrors = true
  }
}

if (hasErrors) process.exit(1)
console.log(`i18n check passed (${Object.keys(english).length} source messages)`)

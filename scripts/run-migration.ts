/**
 * Run grassland migration script
 * Executes the safe SQL migration that adds grassland tables without dropping existing data
 */

import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  process.exit(1)
}

async function runMigration() {
  const sql = postgres(DATABASE_URL, {
    max: 1,
    onnotice: () => {} // Suppress notices
  })

  try {
    console.log('📖 Reading migration SQL file...')
    const migrationPath = path.join(__dirname, 'migrate-grassland-only.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    console.log('🚀 Executing migration...')
    await sql.unsafe(migrationSQL)

    console.log('✅ Migration completed successfully!')
    console.log('\n📊 Created tables:')
    console.log('  - users (if not exists)')
    console.log('  - plants')
    console.log('  - waterings')
    console.log('\n📌 Created indexes:')
    console.log('  - plants: author_id, level, created_at, position')
    console.log('  - waterings: plant_id, user_id, created_at')

    // Verify tables exist
    console.log('\n🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users', 'plants', 'waterings')
      ORDER BY table_name
    `

    if (tables.length === 3) {
      console.log('✅ All grassland tables verified:')
      tables.forEach(t => console.log(`  ✓ ${t.table_name}`))
    } else {
      console.warn('⚠️  Some tables may be missing:', tables)
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()

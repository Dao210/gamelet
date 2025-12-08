/**
 * Database Migration Script
 * Manually execute SQL migrations to Supabase
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
import postgres from 'postgres'

// Load environment variables from .env
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.error('Please ensure your .env file is configured correctly.')
  process.exit(1)
}

// Create postgres connection
const sql = postgres(DATABASE_URL, { max: 1 })

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n')

    // Read SQL file
    const sqlPath = join(process.cwd(), 'db/migrations/0001_manual_fix.sql')
    const migrationSQL = readFileSync(sqlPath, 'utf-8')

    console.log('📄 Executing SQL migration...')
    console.log('─'.repeat(60))

    // Execute entire SQL as one batch to maintain proper order
    await sql.unsafe(migrationSQL)

    console.log('✓ All SQL statements executed successfully')
    console.log('─'.repeat(60))

    // Verify tables
    console.log('🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'plants', 'waterings')
      ORDER BY table_name
    `

    console.log('\nCreated tables:')
    tables.forEach((table) => {
      console.log(`  ✓ ${table.table_name}`)
    })

    // Verify indexes
    console.log('\n🔍 Verifying indexes...')
    const indexes = await sql`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('plants', 'waterings')
      ORDER BY indexname
    `

    console.log('\nCreated indexes:')
    indexes.forEach((index) => {
      console.log(`  ✓ ${index.indexname}`)
    })

    console.log('\n🎉 Database setup complete!')
    console.log('\nNext steps:')
    console.log('  1. Verify tables in Supabase Dashboard')
    console.log('  2. Configure Supabase Storage bucket "plants"')
    console.log('  3. Set up Row Level Security (RLS) policies')
    console.log('  4. Run: pnpm db:studio (optional - view data)\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()

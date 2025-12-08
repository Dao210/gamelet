/**
 * Supabase Storage Setup Script
 * Creates the 'plants' bucket for storing plant images
 *
 * Usage: npx tsx scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function setupStorage() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase environment variables')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🚀 Setting up Supabase Storage...\n')

  try {
    // Check if bucket already exists
    const { data: existingBuckets } = await supabase.storage.listBuckets()
    const plantsBucket = existingBuckets?.find(bucket => bucket.name === 'plants')

    if (plantsBucket) {
      console.log('✅ Bucket "plants" already exists')
      console.log(`   ID: ${plantsBucket.id}`)
      console.log(`   Public: ${plantsBucket.public}`)
      console.log(`   Created: ${plantsBucket.created_at}\n`)
    } else {
      // Create bucket
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('plants', {
        public: true, // Enable public access
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })

      if (createError) {
        throw createError
      }

      console.log('✅ Created bucket "plants" successfully')
      console.log(`   Public: true`)
      console.log(`   File size limit: 5MB`)
      console.log(`   Allowed types: PNG, JPG, JPEG, WebP\n`)
    }

    // Test upload to verify permissions (using a valid image format)
    console.log('🧪 Testing upload permissions...')

    // Create a minimal 1x1 PNG image (base64 encoded)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const pngBuffer = Buffer.from(pngBase64, 'base64')

    const testFileName = `test-${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('plants')
      .upload(testFileName, pngBuffer, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    console.log('✅ Upload test successful')

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plants')
      .getPublicUrl(testFileName)

    console.log(`   Test file URL: ${publicUrl}`)

    // Clean up test file
    await supabase.storage.from('plants').remove([testFileName])
    console.log('✅ Test file cleaned up\n')

    // Display storage info
    console.log('📦 Storage Configuration:')
    console.log(`   Bucket name: plants`)
    console.log(`   Public access: Enabled`)
    console.log(`   Base URL: ${SUPABASE_URL}/storage/v1/object/public/plants/`)
    console.log(`   Max file size: 5MB`)
    console.log(`   Allowed formats: PNG, JPG, JPEG, WebP\n`)

    console.log('✅ Supabase Storage setup complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Start dev server: pnpm dev')
    console.log('   2. Navigate to /en/grassland/create')
    console.log('   3. Draw and upload your first plant!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setupStorage()

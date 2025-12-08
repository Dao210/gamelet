/**
 * Verify Supabase Storage Setup
 * Checks if 'plants' bucket exists and has correct configuration
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL ? '✓' : '✗')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_KEY ? '✓' : '✗')
  process.exit(1)
}

async function verifyStorage() {
  console.log('🔍 Verifying Supabase Storage setup...\n')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    // Check if 'plants' bucket exists
    console.log('📦 Checking for "plants" bucket...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('❌ Failed to list buckets:', listError.message)
      process.exit(1)
    }

    const plantsBucket = buckets?.find(b => b.name === 'plants')

    if (!plantsBucket) {
      console.error('❌ "plants" bucket does not exist!')
      console.log('\n📝 To create the bucket, go to:')
      console.log('   Supabase Dashboard → Storage → Create new bucket')
      console.log('   - Name: plants')
      console.log('   - Public: true (for public plant image access)')
      console.log('   - File size limit: 5MB (recommended)')
      process.exit(1)
    }

    console.log('✅ "plants" bucket exists')
    console.log(`   - ID: ${plantsBucket.id}`)
    console.log(`   - Public: ${plantsBucket.public ? '✓' : '✗ (should be public)'}`)
    console.log(`   - Created: ${plantsBucket.created_at}`)

    // Test upload and public URL generation
    console.log('\n🧪 Testing upload and public URL...')
    const testFileName = `test_${Date.now()}.txt`
    const testContent = new Blob(['Grassland test file'], { type: 'text/plain' })

    const { error: uploadError } = await supabase.storage
      .from('plants')
      .upload(testFileName, testContent)

    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message)
      if (uploadError.message.includes('not found')) {
        console.log('\n⚠️  Bucket exists but may not be accessible. Check:')
        console.log('   - RLS policies (Storage should allow uploads)')
        console.log('   - Service role key has correct permissions')
      }
      process.exit(1)
    }

    console.log('✅ Upload test successful')

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('plants')
      .getPublicUrl(testFileName)

    console.log('✅ Public URL generated:', urlData.publicUrl)

    // Clean up test file
    await supabase.storage.from('plants').remove([testFileName])
    console.log('✅ Test file cleaned up')

    console.log('\n🎉 Supabase Storage is configured correctly!')
    console.log('   Ready for grassland plant uploads 🌱')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

verifyStorage()

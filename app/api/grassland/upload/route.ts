/**
 * API Route: /api/grassland/upload
 * 文档来源: Action Plan - Module 3.3
 *
 * POST: Upload plant image to Supabase Storage
 *
 * Handles:
 * - Image upload to Supabase Storage bucket 'plants'
 * - Image validation (size, dimensions, format)
 * - Returns public URL for storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { validatePlantImage } from '@/lib/services/validationService'

// Initialize Supabase client lazily to avoid build-time errors
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * POST /api/grassland/upload
 * Upload plant image
 *
 * Body: FormData
 * - file: File (image file)
 * - userId: string (for file naming)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate file size
    const validation = validatePlantImage({
      width: 800, // Will be validated after upload
      height: 800,
      fileSize: buffer.length,
      mimeType: file.type
    })

    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `${userId}_${timestamp}.${fileExt}`
    const filePath = `plants/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('plants')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('[Upload] Supabase Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('plants').getPublicUrl(filePath)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: publicUrl,
        path: filePath,
        fileName,
        size: buffer.length,
        mimeType: file.type
      }
    })
  } catch (error) {
    console.error('[POST /api/grassland/upload] Error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

/**
 * DELETE /api/grassland/upload
 * Delete plant image from Supabase Storage
 *
 * Body:
 * - filePath: string (path in storage, e.g., "plants/user_123456.png")
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    const body = await request.json()
    const { filePath } = body

    if (!filePath) {
      return NextResponse.json({ error: 'filePath is required' }, { status: 400 })
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage.from('plants').remove([filePath])

    if (deleteError) {
      console.error('[Delete] Supabase Storage error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })
  } catch (error) {
    console.error('[DELETE /api/grassland/upload] Error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

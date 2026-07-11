/**
 * GrasslandPlantCreationForm Component
 * 文档来源: Action Plan - Module 4.5
 *
 * Simplified plant creation form for grassland
 * - No name/description/tags (grassland plants are anonymous artworks)
 * - Uploads image to Supabase Storage
 * - Creates plant with API integration
 * - Shows preview and submission progress
 */

'use client'

import { useState } from 'react'
import { getGrasslandAnonymousUserId } from '@/lib/grassland-anonymous-user'

interface GrasslandPlantCreationFormProps {
  /** Canvas image data (base64 PNG) */
  imageData: string
  /** Canvas dimensions */
  canvasWidth: number
  canvasHeight: number
  /** Success callback */
  onSuccess: () => void
  /** Optional custom class */
  className?: string
}

export default function GrasslandPlantCreationForm({
  imageData,
  canvasWidth,
  canvasHeight,
  onSuccess,
  className = ''
}: GrasslandPlantCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  /**
   * Convert base64 dataURL to Blob
   */
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const userId = getGrasslandAnonymousUserId()

      // Step 1: Convert canvas data to Blob
      setUploadProgress('Preparing image...')
      const blob = dataURLtoBlob(imageData)
      const file = new File([blob], `plant_${Date.now()}.png`, { type: 'image/png' })

      // Step 2: Upload image to Supabase Storage
      setUploadProgress('Uploading image...')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const uploadResponse = await fetch('/api/grassland/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json()
        throw new Error(uploadError.error || 'Failed to upload image')
      }

      const uploadResult = await uploadResponse.json()
      const imageUrl = uploadResult.data.url

      // Step 3: Create plant in database
      setUploadProgress('Planting in grassland...')
      const createResponse = await fetch('/api/grassland/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          width: canvasWidth,
          height: canvasHeight,
          authorId: userId
        })
      })

      if (!createResponse.ok) {
        const createError = await createResponse.json()
        throw new Error(createError.error || 'Failed to create plant')
      }

      // Step 4: Success!
      setUploadProgress('Success! Redirecting...')
      setTimeout(() => {
        onSuccess()
      }, 500)
    } catch (err: unknown) {
      const error = err as Error
      console.error('Failed to create plant:', error)
      setError(error.message || 'Failed to create plant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          👁️ Preview
        </label>
        <div className="border-2 border-green-200 rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
          <img
            src={imageData}
            alt="Plant preview"
            className="w-full h-40 object-contain rounded"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="font-semibold mb-2 text-blue-800 dark:text-blue-300">
          🌱 Your plant will:
        </div>
        <ul className="space-y-1 text-blue-700 dark:text-blue-400">
          <li>• Start at Level 1 (Seedling)</li>
          <li>• Appear in the global grassland</li>
          <li>• Grow as others water it (+10 XP per watering)</li>
          <li>• Gain 5 XP per day automatically</li>
        </ul>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Progress indicator */}
      {isSubmitting && uploadProgress && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-green-700 dark:text-green-400">{uploadProgress}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center space-x-2">
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Planting...</span>
          </span>
        ) : (
          '🌱 Plant in Grassland'
        )}
      </button>

      {/* Info note */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-500">
        By planting, you agree that your artwork will be publicly visible in the global grassland.
      </p>
    </form>
  )
}

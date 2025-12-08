/**
 * Grassland Create Page
 * 路由: /[locale]/grassland/create
 * 文档来源: Action Plan - Module 4.5
 *
 * Canvas-based plant creation for Global Prairie Garden
 * - Reuses FabricCanvas and SimpleFabricToolbar from garden
 * - Uses GrasslandPlantCreationForm for submission
 * - Redirects to /grassland after successful creation
 */

'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import FabricCanvas from '@/components/garden/canvas/FabricCanvas'
import SimpleFabricToolbar from '@/components/garden/canvas/SimpleFabricToolbar'
import GrasslandPlantCreationForm from '@/components/grassland/plant/GrasslandPlantCreationForm'
import { useFabricStore } from '@/lib/fabric-store'

export default function GrasslandCreatePage() {
  const [canvasData, setCanvasData] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const canvas = useFabricStore(state => state.canvas)
  const router = useRouter()

  // Canvas dimensions (fixed for grassland)
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 800

  /**
   * Export canvas as PNG data URL
   */
  const handleExport = useCallback(() => {
    if (!canvas) {
      alert('Canvas not ready. Please wait a moment and try again.')
      return
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    })

    setCanvasData(dataURL)
    setShowForm(true)
  }, [canvas])

  /**
   * Clear canvas
   */
  const handleClear = useCallback(() => {
    if (!canvas) return
    if (!confirm('Are you sure you want to clear the canvas? This cannot be undone.')) return

    canvas.clear()
    canvas.backgroundColor = '#ffffff'
    canvas.renderAll()
    setCanvasData(null)
    setShowForm(false)
  }, [canvas])

  /**
   * Success handler - redirect to grassland
   */
  const handleSuccess = () => {
    router.push('/grassland')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900 relative overflow-hidden">
      {/* Background grass pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,179,66,0.3)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-lime-600 to-yellow-600 bg-clip-text text-transparent">
            🎨 Create Your Plant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Draw a unique plant and watch it grow in the global grassland. Others can water it to help it level up!
          </p>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <motion.button
              onClick={handleExport}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 Save Artwork
            </motion.button>

            <motion.button
              onClick={handleClear}
              className="px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 backdrop-blur-md border border-white/20 shadow-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear Canvas
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 max-w-7xl mx-auto">
          {/* Left: Toolbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SimpleFabricToolbar />

            {/* Creation tips */}
            <motion.div
              className="mt-6 backdrop-blur-xl bg-green-400/20 dark:bg-green-600/20 rounded-3xl border border-white/20 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                💡 Drawing Tips
              </h3>
              <ul className="space-y-2 text-xs text-green-700 dark:text-green-300">
                <li>• B - Brush tool</li>
                <li>• E - Eraser tool</li>
                <li>• V - Select tool</li>
                <li>• [ ] - Adjust size</li>
                <li>• Ctrl+Z/Y - Undo/Redo</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Center: Canvas area */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FabricCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </motion.div>

            {/* Creation form (conditional) */}
            {showForm && canvasData && (
              <motion.div
                className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-6"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🌱 Plant Your Creation
                </h3>
                <GrasslandPlantCreationForm
                  imageData={canvasData}
                  canvasWidth={CANVAS_WIDTH}
                  canvasHeight={CANVAS_HEIGHT}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            )}

            {/* Creation guide */}
            {!showForm && (
              <motion.div
                className="backdrop-blur-xl bg-lime-400/20 dark:bg-lime-600/20 rounded-3xl border border-white/20 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-lime-800 dark:text-lime-300 mb-4 flex items-center gap-2">
                  ✨ Creation Guide
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-lime-700 dark:text-lime-300">
                  <div>
                    <p className="font-semibold mb-2">🌿 Draw Freely</p>
                    <p className="text-xs opacity-90">
                      Let your imagination run wild - abstract or realistic, anything goes!
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">🎨 Use Colors</p>
                    <p className="text-xs opacity-90">
                      Vibrant colors make your plant stand out in the grassland
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">✏️ Keep It Simple</p>
                    <p className="text-xs opacity-90">
                      Simple designs can be just as beautiful and memorable
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">🌱 Watch It Grow</p>
                    <p className="text-xs opacity-90">
                      After planting, your artwork will grow as others water it
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Back to grassland link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => router.push('/grassland')}
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium underline underline-offset-4 transition-colors"
          >
            ← Back to Grassland
          </button>
        </motion.div>
      </div>
    </main>
  )
}

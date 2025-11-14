'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import AnimatedOrbs from '@/components/garden/hero/AnimatedOrbs'
import FabricCanvas from '@/components/garden/canvas/FabricCanvas'
import SimpleFabricToolbar from '@/components/garden/canvas/SimpleFabricToolbar'
import PlantCreationForm from '@/components/garden/plant/PlantCreationForm'
import { useFabricStore } from '@/lib/fabric-store'

export default function CreatePlantPage() {
  const [canvasData, setCanvasData] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const canvas = useFabricStore(state => state.canvas)

  // 导出画布数据
  const handleExport = useCallback(() => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    })

    setCanvasData(dataURL)
    setShowForm(true)
  }, [canvas])

  // 清空画布
  const handleClear = useCallback(() => {
    if (!canvas) return
    if (!confirm('确定要清空画布吗？此操作无法撤销。')) return

    canvas.clear()
    canvas.backgroundColor = '#ffffff'
    canvas.renderAll()
    setCanvasData(null)
    setShowForm(false)
  }, [canvas])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* 动画背景 */}
      <AnimatedOrbs />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎨 创作你的植物
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            发挥你的创意，绘制一幅独特的植物涂鸦。完成后，它将成为全球藤架中的一员！
          </p>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-center mt-6">
            <motion.button
              onClick={handleExport}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 保存作品
            </motion.button>

            <motion.button
              onClick={handleClear}
              className="px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 backdrop-blur-md border border-white/20 shadow-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ 清空画布
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 max-w-7xl mx-auto">
          {/* 左侧：工具栏 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SimpleFabricToolbar />

            {/* 创作提示 */}
            <motion.div
              className="mt-6 backdrop-blur-xl bg-blue-400/20 dark:bg-blue-600/20 rounded-3xl border border-white/20 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                💡 创作小贴士
              </h3>
              <ul className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
                <li>• B - 画笔工具</li>
                <li>• E - 橡皮擦工具</li>
                <li>• V - 选择工具</li>
                <li>• [ ] - 调整大小</li>
                <li>• Ctrl+Z/Y - 撤销/重做</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* 中间：画布区域 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FabricCanvas width={800} height={800} />
            </motion.div>

            {/* 创作表单 (条件显示) */}
            {showForm && canvasData && (
              <motion.div
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-6"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🌱 植物信息
                </h3>
                <PlantCreationForm
                  imageData={canvasData}
                  onSuccess={() => {
                    window.location.href = '/garden'
                  }}
                />
              </motion.div>
            )}

            {/* 创作指南 */}
            {!showForm && (
              <motion.div
                className="backdrop-blur-xl bg-purple-400/20 dark:bg-purple-600/20 rounded-3xl border border-white/20 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                  ✨ 创作指南
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
                  <div>
                    <p className="font-semibold mb-2">🎨 自由创作</p>
                    <p className="text-xs opacity-90">想象你心中的理想植物，自由发挥创意</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">🌈 使用颜色</p>
                    <p className="text-xs opacity-90">不同的颜色让植物更加生动有趣</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">✏️ 简约风格</p>
                    <p className="text-xs opacity-90">简单的线条也能创造出独特的风格</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">📝 取个名字</p>
                    <p className="text-xs opacity-90">完成后记得给你的植物取个好听的名字</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
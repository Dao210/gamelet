/**
 * Grassland Client Component
 * 路由: /[locale]/grassland
 *
 * Client component for the Grassland page
 * Renders the PrairieScene with all visual layers and PlantLayer
 */

'use client'

import { useState } from 'react'
import PrairieScene from '@/components/grassland/scene/PrairieScene'
import PlantLayer from '@/components/grassland/scene/PlantLayer'
import CreateFAB from '@/components/grassland/ui/CreateFAB'

export default function GrasslandClient() {
  const [showStats, setShowStats] = useState(false)

  return (
    <main className="viewport-screen relative w-full overflow-hidden">
      {/* Prairie Scene with all layers */}
      <PrairieScene
        autoTimeSystem={true}
        weatherEffect="none"
        windStrength="gentle"
        grassBladeCount={250}
        showStats={showStats}
      >
        {/* Plant Layer - 虚拟滚动渲染植物 */}
        <PlantLayer
          enableInfiniteScroll={true}
          rowHeight={200}
        />

        {/* 欢迎提示卡片 (可选显示) */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-md">
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Global Prairie Garden
            </h1>
            <p className="text-sm text-gray-700 mb-3">
              Watch plants from users around the world grow together under the changing sky.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>✨ Real-time sky changes</span>
              <span>🌱 Click plants to view</span>
              <span>💧 Water to help grow</span>
            </div>

            {/* Dev toggle */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="mt-3 w-full px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>
      </PrairieScene>

      {/* 创建按钮 */}
      <CreateFAB />
    </main>
  )
}

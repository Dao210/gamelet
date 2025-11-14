'use client'

import { motion } from 'framer-motion'
import { useFabricStore } from '@/lib/fabric-store'

export default function SimpleFabricToolbar() {
  const currentTool = useFabricStore(state => state.currentTool)
  const setTool = useFabricStore(state => state.setTool)
  const brushColor = useFabricStore(state => state.brushColor)
  const setBrushColor = useFabricStore(state => state.setBrushColor)
  const brushSize = useFabricStore(state => state.brushSize)
  const setBrushSize = useFabricStore(state => state.setBrushSize)
  const brushOpacity = useFabricStore(state => state.brushOpacity)
  const setBrushOpacity = useFabricStore(state => state.setBrushOpacity)
  const canUndo = useFabricStore(state => state.canUndo())
  const canRedo = useFabricStore(state => state.canRedo())
  const undo = useFabricStore(state => state.undo)
  const redo = useFabricStore(state => state.redo)
  const colorHistory = useFabricStore(state => state.colorHistory)

  const tools = [
    { id: 'select', name: '选择', icon: '↖', shortcut: 'V' },
    { id: 'brush', name: '画笔', icon: '🖌️', shortcut: 'B' },
    { id: 'eraser', name: '橡皮擦', icon: '🧹', shortcut: 'E' }
  ]

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ]

  const presetSizes = [1, 3, 5, 8, 12, 20]

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl p-4 space-y-6">
      {/* 工具选择 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          工具
        </h3>
        <div className="flex flex-col gap-2">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setTool(tool.id as any)}
              className={`
                w-full px-4 py-3 rounded-xl text-left
                flex items-center justify-between
                transition-all duration-200
                ${
                  currentTool === tool.id
                    ? 'bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gradient-to-br from-green-400/20 to-blue-400/20 hover:from-green-500/50 hover:to-blue-500/50 text-gray-900 dark:text-white'
                }
                border border-white/20
              `}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{tool.icon}</span>
                <span className="font-semibold">{tool.name}</span>
              </span>
              <span className="text-xs opacity-70">{tool.shortcut}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 撤销/重做 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          历史
        </h3>
        <div className="flex gap-2">
          <motion.button
            onClick={undo}
            disabled={!canUndo}
            className={`
              flex-1 px-4 py-2 rounded-xl
              ${
                canUndo
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
              }
              border border-white/20
              text-gray-900 dark:text-white font-semibold
              transition-all
            `}
            whileHover={canUndo ? { scale: 1.05 } : {}}
            whileTap={canUndo ? { scale: 0.95 } : {}}
          >
            ↶ 撤销
          </motion.button>
          <motion.button
            onClick={redo}
            disabled={!canRedo}
            className={`
              flex-1 px-4 py-2 rounded-xl
              ${
                canRedo
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
              }
              border border-white/20
              text-gray-900 dark:text-white font-semibold
              transition-all
            `}
            whileHover={canRedo ? { scale: 1.05 } : {}}
            whileTap={canRedo ? { scale: 0.95 } : {}}
          >
            ↷ 重做
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Ctrl+Z / Ctrl+Y
        </p>
      </div>

      {/* 颜色选择 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          颜色
        </h3>

        {/* 当前颜色显示 */}
        <div className="mb-3 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border-2 border-white shadow-lg"
            style={{ backgroundColor: brushColor }}
          />
          <div>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-20 h-8 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {brushColor.toUpperCase()}
            </p>
          </div>
        </div>

        {/* 预设颜色 */}
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <motion.button
              key={color}
              onClick={() => setBrushColor(color)}
              className={`
                w-10 h-10 rounded-lg border-2
                ${
                  brushColor === color
                    ? 'border-green-500 ring-2 ring-green-500/50'
                    : 'border-white/50 hover:border-green-400'
                }
                shadow-md transition-all
              `}
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={color}
            />
          ))}
        </div>

        {/* 颜色历史 */}
        {colorHistory.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              最近使用
            </p>
            <div className="flex gap-2">
              {colorHistory.slice(0, 5).map((color, index) => (
                <motion.button
                  key={`${color}-${index}`}
                  onClick={() => setBrushColor(color)}
                  className="w-8 h-8 rounded-lg border border-white/50 shadow-md"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 画笔大小 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          大小: {brushSize}px
        </h3>

        {/* 滑块 */}
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />

        {/* 预设大小 */}
        <div className="flex gap-2 mt-3">
          {presetSizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`
                flex-1 py-2 rounded-lg text-sm font-semibold
                ${
                  brushSize === size
                    ? 'bg-gradient-to-br from-green-500 to-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }
                border border-white/20
                transition-all
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {size}
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          [ ] 快捷调整
        </p>
      </div>

      {/* 不透明度 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          不透明度: {brushOpacity}%
        </h3>

        <input
          type="range"
          min="0"
          max="100"
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>透明</span>
          <span>不透明</span>
        </div>
      </div>
    </div>
  )
}

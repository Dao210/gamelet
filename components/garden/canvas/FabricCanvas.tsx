'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as fabric from 'fabric'
import { useFabricStore } from '@/lib/fabric-store'
import { BrushTool } from '@/lib/fabric-tools/brush-tool'
import { EraserTool } from '@/lib/fabric-tools/eraser-tool'

export interface FabricCanvasProps {
  width?: number
  height?: number
  className?: string
}

export default function FabricCanvas({ width = 600, height = 600, className = '' }: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const brushToolRef = useRef<BrushTool | null>(null)
  const eraserToolRef = useRef<EraserTool | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Store状态
  const setCanvas = useFabricStore(state => state.setCanvas)
  const currentTool = useFabricStore(state => state.currentTool)
  const brushColor = useFabricStore(state => state.brushColor)
  const brushSize = useFabricStore(state => state.brushSize)
  const brushOpacity = useFabricStore(state => state.brushOpacity)
  const brushType = useFabricStore(state => state.brushType)
  const saveHistoryState = useFabricStore(state => state.saveHistoryState)

  // 初始化 Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
      allowTouchScrolling: false
    })

    fabricCanvasRef.current = canvas
    setCanvas(canvas)

    // 初始化工具
    brushToolRef.current = new BrushTool(canvas)
    eraserToolRef.current = new EraserTool(canvas)

    // 监听绘制完成事件，保存历史记录
    canvas.on('path:created', () => {
      saveHistoryState()
    })

    canvas.on('object:modified', () => {
      saveHistoryState()
    })

    canvas.on('object:removed', () => {
      saveHistoryState()
    })

    // 清理
    return () => {
      canvas.dispose()
      fabricCanvasRef.current = null
      setCanvas(null)
    }
  }, [width, height, setCanvas, saveHistoryState])

  // 响应式尺寸调整
  useEffect(() => {
    if (!containerRef.current || !fabricCanvasRef.current) return

    const updateSize = () => {
      const container = containerRef.current
      const canvas = fabricCanvasRef.current
      if (!container || !canvas) return

      // 计算最佳尺寸
      const containerWidth = container.clientWidth
      const containerHeight = window.innerHeight - 200
      const size = Math.min(containerWidth - 32, containerHeight, 800)

      canvas.setDimensions({ width: size, height: size })
      canvas.calcOffset()
      canvas.renderAll()
    }

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)

    // 初始调整
    updateSize()

    // 监听窗口尺寸变化
    window.addEventListener('resize', updateSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  // 工具切换
  useEffect(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const brushTool = brushToolRef.current
    const eraserTool = eraserToolRef.current

    if (!brushTool || !eraserTool) return

    // 停用所有工具
    brushTool.deactivate()
    eraserTool.deactivate()
    canvas.isDrawingMode = false

    // 激活当前工具
    switch (currentTool) {
      case 'brush':
        brushTool.activate()
        break
      case 'eraser':
        eraserTool.activate()
        break
      case 'select':
        canvas.isDrawingMode = false
        canvas.selection = true
        break
      default:
        // 其他工具后续实现
        canvas.isDrawingMode = false
        break
    }
  }, [currentTool])

  // 画笔属性更新
  useEffect(() => {
    if (!brushToolRef.current) return

    brushToolRef.current.setColor(brushColor)
    brushToolRef.current.setWidth(brushSize)
    brushToolRef.current.setOpacity(brushOpacity / 100)
    brushToolRef.current.setBrushType(brushType)
  }, [brushColor, brushSize, brushOpacity, brushType])

  // 橡皮擦大小更新
  useEffect(() => {
    if (!eraserToolRef.current) return
    eraserToolRef.current.setWidth(brushSize * 2) // 橡皮擦稍大一些
  }, [brushSize, currentTool])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 撤销/重做
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          useFabricStore.getState().undo()
        }
        if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault()
          useFabricStore.getState().redo()
        }
      }

      // 工具快捷键
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const setTool = useFabricStore.getState().setTool
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            setTool('brush')
            break
          case 'e':
            e.preventDefault()
            setTool('eraser')
            break
          case 'v':
            e.preventDefault()
            setTool('select')
            break
        }
      }

      // 画笔大小调整
      if (e.key === '[') {
        e.preventDefault()
        const currentSize = useFabricStore.getState().brushSize
        useFabricStore.getState().setBrushSize(currentSize - 2)
      }
      if (e.key === ']') {
        e.preventDefault()
        const currentSize = useFabricStore.getState().brushSize
        useFabricStore.getState().setBrushSize(currentSize + 2)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className={`flex items-center justify-center ${className}`}>
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-4">
        <canvas ref={canvasRef} />

        {/* 工具提示 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/60 text-white text-xs px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {currentTool === 'brush' && 'B - 画笔 | E - 橡皮擦 | V - 选择'}
          {currentTool === 'eraser' && '按住绘制擦除 | [ ] 调整大小'}
          {currentTool === 'select' && '点击选择对象 | 拖拽移动'}
        </div>
      </div>
    </div>
  )
}

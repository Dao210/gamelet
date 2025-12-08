import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import * as fabric from 'fabric'
import type { Canvas } from 'fabric/fabric-impl'

// Tool Types
export type ToolType =
  | 'select'      // 选择工具
  | 'brush'       // 画笔
  | 'eraser'      // 橡皮擦
  | 'fill'        // 填充
  | 'shape'       // 形状 (矩形/圆形)
  | 'line'        // 直线
  | 'text'        // 文字
  | 'symmetry'    // 对称工具

export type BrushType = 'pencil' | 'pen' | 'brush' | 'airbrush' | 'watercolor'

export type SymmetryMode =
  | 'none'
  | 'horizontal'
  | 'vertical'
  | 'both'
  | 'radial-3'
  | 'radial-4'
  | 'radial-6'
  | 'radial-8'

// Layer Interface
export interface Layer {
  id: string
  name: string
  type: 'background' | 'drawing' | 'text' | 'shape'
  visible: boolean
  locked: boolean
  opacity: number // 0-100
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay'
  thumbnail?: string // Base64 预览图
  objectIds: string[] // Fabric object IDs
}

// History State Interface
export interface HistoryState {
  canvasState: string // JSON 序列化的 canvas 状态
  layers: Layer[]
  timestamp: number
}

// Main Store Interface
export interface FabricStore {
  // Canvas Instance
  canvas: Canvas | null
  setCanvas: (canvas: Canvas | null) => void

  // Tool State
  currentTool: ToolType
  setTool: (tool: ToolType) => void

  // Brush State
  brushType: BrushType
  setBrushType: (type: BrushType) => void
  brushSize: number
  setBrushSize: (size: number) => void
  brushOpacity: number // 0-100
  setBrushOpacity: (opacity: number) => void
  brushColor: string
  setBrushColor: (color: string) => void

  // Color History
  colorHistory: string[]
  addColorToHistory: (color: string) => void

  // Symmetry State
  symmetryMode: SymmetryMode
  setSymmetryMode: (mode: SymmetryMode) => void
  symmetryCenter: { x: number; y: number }
  setSymmetryCenter: (center: { x: number; y: number }) => void

  // Layer System
  layers: Layer[]
  activeLayerId: string | null
  addLayer: (type: Layer['type'], name?: string) => void
  removeLayer: (id: string) => void
  duplicateLayer: (id: string) => void
  setActiveLayer: (id: string) => void
  toggleLayerVisibility: (id: string) => void
  toggleLayerLock: (id: string) => void
  setLayerOpacity: (id: string, opacity: number) => void
  setLayerBlendMode: (id: string, mode: Layer['blendMode']) => void
  renameLayer: (id: string, name: string) => void
  reorderLayers: (startIndex: number, endIndex: number) => void
  mergeLayerDown: (id: string) => void

  // History Management
  history: HistoryState[]
  historyIndex: number
  maxHistorySize: number
  saveHistoryState: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void

  // Canvas Controls
  zoom: number
  setZoom: (zoom: number) => void
  panOffset: { x: number; y: number }
  setPanOffset: (offset: { x: number; y: number }) => void
  resetView: () => void

  // UI State
  showGrid: boolean
  toggleGrid: () => void
  showRulers: boolean
  toggleRulers: () => void
  showLayerPanel: boolean
  toggleLayerPanel: () => void

  // Draft Management
  hasDraft: boolean
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void

  // Reset All
  reset: () => void
}

// Initial State
const initialState = {
  canvas: null,
  currentTool: 'brush' as ToolType,
  brushType: 'pen' as BrushType,
  brushSize: 5,
  brushOpacity: 100,
  brushColor: '#000000',
  colorHistory: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
  symmetryMode: 'none' as SymmetryMode,
  symmetryCenter: { x: 0, y: 0 },
  layers: [
    {
      id: 'bg-layer',
      name: '背景层',
      type: 'background' as const,
      visible: true,
      locked: true,
      opacity: 100,
      blendMode: 'normal' as const,
      objectIds: []
    },
    {
      id: 'layer-1',
      name: '绘画层 1',
      type: 'drawing' as const,
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal' as const,
      objectIds: []
    }
  ],
  activeLayerId: 'layer-1',
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: false,
  showRulers: false,
  showLayerPanel: true,
  hasDraft: false
}

// Helper Functions
const generateId = () => `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Create Store
export const useFabricStore = create<FabricStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Canvas
      setCanvas: (canvas) => set({ canvas }),

      // Tool
      setTool: (tool) => set({ currentTool: tool }),

      // Brush
      setBrushType: (type) => set({ brushType: type }),
      setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(100, size)) }),
      setBrushOpacity: (opacity) => set({ brushOpacity: Math.max(0, Math.min(100, opacity)) }),
      setBrushColor: (color) => {
        set({ brushColor: color })
        get().addColorToHistory(color)
      },

      // Color History
      addColorToHistory: (color) => set((state) => {
        const filtered = state.colorHistory.filter(c => c !== color)
        state.colorHistory = [color, ...filtered].slice(0, 10)
      }),

      // Symmetry
      setSymmetryMode: (mode) => set({ symmetryMode: mode }),
      setSymmetryCenter: (center) => set({ symmetryCenter: center }),

      // Layer Management
      addLayer: (type, name) => set((state) => {
        const id = generateId()
        const layerCount = state.layers.filter(l => l.type === type).length
        state.layers.push({
          id,
          name: name || `${type === 'background' ? '背景层' : '绘画层'} ${layerCount + 1}`,
          type,
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: 'normal',
          objectIds: []
        })
        state.activeLayerId = id
      }),

      removeLayer: (id) => set((state) => {
        const index = state.layers.findIndex(l => l.id === id)
        if (index === -1) return

        // Don't allow removing last layer
        if (state.layers.length <= 1) return

        // Don't allow removing background layer by default
        const layer = state.layers[index]
        if (layer.type === 'background' && state.layers.filter(l => l.type === 'background').length <= 1) {
          return
        }

        state.layers.splice(index, 1)

        // Update active layer if needed
        if (state.activeLayerId === id) {
          state.activeLayerId = state.layers[Math.max(0, index - 1)]?.id || state.layers[0]?.id
        }
      }),

      duplicateLayer: (id) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (!layer) return

        const newId = generateId()
        const newLayer: Layer = {
          ...layer,
          id: newId,
          name: `${layer.name} 副本`,
          objectIds: [] // Will be populated when canvas objects are duplicated
        }

        const index = state.layers.findIndex(l => l.id === id)
        state.layers.splice(index + 1, 0, newLayer)
        state.activeLayerId = newId
      }),

      setActiveLayer: (id) => set({ activeLayerId: id }),

      toggleLayerVisibility: (id) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (layer) layer.visible = !layer.visible
      }),

      toggleLayerLock: (id) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (layer) layer.locked = !layer.locked
      }),

      setLayerOpacity: (id, opacity) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (layer) layer.opacity = Math.max(0, Math.min(100, opacity))
      }),

      setLayerBlendMode: (id, mode) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (layer) layer.blendMode = mode
      }),

      renameLayer: (id, name) => set((state) => {
        const layer = state.layers.find(l => l.id === id)
        if (layer) layer.name = name
      }),

      reorderLayers: (startIndex, endIndex) => set((state) => {
        const [removed] = state.layers.splice(startIndex, 1)
        state.layers.splice(endIndex, 0, removed)
      }),

      mergeLayerDown: (id) => {
        const state = get()
        const index = state.layers.findIndex(l => l.id === id)
        if (index <= 0) return // Can't merge bottom layer or invalid index

        // TODO: Implement actual canvas layer merging
        console.log('Merge layer down:', id)
      },

      // History Management
      saveHistoryState: () => {
        const state = get()
        if (!state.canvas) return

        // Remove any history after current index
        const newHistory = state.history.slice(0, state.historyIndex + 1)

        // Add new state
        const historyState: HistoryState = {
          canvasState: JSON.stringify(state.canvas.toJSON()),
          layers: JSON.parse(JSON.stringify(state.layers)),
          timestamp: Date.now()
        }

        newHistory.push(historyState)

        // Limit history size
        if (newHistory.length > state.maxHistorySize) {
          newHistory.shift()
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        })
      },

      undo: () => {
        const state = get()
        if (!state.canUndo() || !state.canvas) return

        const newIndex = state.historyIndex - 1
        const historyState = state.history[newIndex]

        if (historyState) {
          state.canvas.loadFromJSON(historyState.canvasState, () => {
            state.canvas?.renderAll()
          })

          set({
            historyIndex: newIndex,
            layers: JSON.parse(JSON.stringify(historyState.layers))
          })
        }
      },

      redo: () => {
        const state = get()
        if (!state.canRedo() || !state.canvas) return

        const newIndex = state.historyIndex + 1
        const historyState = state.history[newIndex]

        if (historyState) {
          state.canvas.loadFromJSON(historyState.canvasState, () => {
            state.canvas?.renderAll()
          })

          set({
            historyIndex: newIndex,
            layers: JSON.parse(JSON.stringify(historyState.layers))
          })
        }
      },

      canUndo: () => {
        const state = get()
        return state.historyIndex > 0
      },

      canRedo: () => {
        const state = get()
        return state.historyIndex < state.history.length - 1
      },

      clearHistory: () => set({ history: [], historyIndex: -1 }),

      // Canvas Controls
      setZoom: (zoom) => {
        const state = get()
        if (!state.canvas) return

        const newZoom = Math.max(0.1, Math.min(5, zoom))
        state.canvas.setZoom(newZoom)
        state.canvas.renderAll()

        set({ zoom: newZoom })
      },

      setPanOffset: (offset) => {
        const state = get()
        if (!state.canvas) return

        state.canvas.absolutePan(new fabric.Point(offset.x, offset.y))
        set({ panOffset: offset })
      },

      resetView: () => {
        const state = get()
        if (!state.canvas) return

        state.canvas.setZoom(1)
        state.canvas.absolutePan(new fabric.Point(0, 0))
        state.canvas.renderAll()

        set({ zoom: 1, panOffset: { x: 0, y: 0 } })
      },

      // UI Controls
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
      toggleLayerPanel: () => set((state) => ({ showLayerPanel: !state.showLayerPanel })),

      // Draft Management
      saveDraft: () => {
        const state = get()
        if (!state.canvas) return

        const draft = {
          canvasState: JSON.stringify(state.canvas.toJSON()),
          layers: state.layers,
          timestamp: Date.now()
        }

        localStorage.setItem('fabric-draft', JSON.stringify(draft))
        set({ hasDraft: true })
      },

      loadDraft: () => {
        const state = get()
        if (!state.canvas) return

        const draftStr = localStorage.getItem('fabric-draft')
        if (!draftStr) return

        try {
          const draft = JSON.parse(draftStr)
          state.canvas.loadFromJSON(draft.canvasState, () => {
            state.canvas?.renderAll()
          })

          set({
            layers: draft.layers,
            hasDraft: true
          })
        } catch (error) {
          console.error('Failed to load draft:', error)
        }
      },

      clearDraft: () => {
        localStorage.removeItem('fabric-draft')
        set({ hasDraft: false })
      },

      // Reset
      reset: () => set(initialState)
    })),
    {
      name: 'fabric-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist certain states
        brushSize: state.brushSize,
        brushOpacity: state.brushOpacity,
        brushColor: state.brushColor,
        brushType: state.brushType,
        colorHistory: state.colorHistory,
        showGrid: state.showGrid,
        showRulers: state.showRulers,
        showLayerPanel: state.showLayerPanel
      })
    }
  )
)

// Selector Hooks for Performance
export const useCanvas = () => useFabricStore(state => state.canvas)
export const useCurrentTool = () => useFabricStore(state => state.currentTool)
export const useBrushState = () => useFabricStore(state => ({
  type: state.brushType,
  size: state.brushSize,
  opacity: state.brushOpacity,
  color: state.brushColor
}))
export const useActiveLayer = () => {
  const layers = useFabricStore(state => state.layers)
  const activeLayerId = useFabricStore(state => state.activeLayerId)
  return layers.find(l => l.id === activeLayerId)
}
export const useCanUndo = () => useFabricStore(state => state.canUndo())
export const useCanRedo = () => useFabricStore(state => state.canRedo())

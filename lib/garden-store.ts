import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 植物相关的类型定义
export interface Plant {
  id: string
  userId: string
  name: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  likeCount: number
  level: number // 0-3 四个生长等级
  tags: string[]
  metadata?: Record<string, any>
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    username: string
    avatarUrl?: string
  }
}

export interface GardenUser {
  id: string
  username: string
  email?: string
  avatarUrl?: string
  totalPlants: number
  totalLikesReceived: number
  isVip: boolean
  createdAt: Date
  lastActive: Date
}

// 绘画状态
export interface DrawingState {
  isDrawing: boolean
  currentTool: 'pen' | 'eraser'
  currentColor: string
  brushSize: number
  history: string[] // 绘画历史记录
  historyStep: number // 当前历史步骤
}

// Garden Store 状态和操作
export interface GardenStore {
  // 用户相关状态
  currentUser: GardenUser | null
  userPlants: Plant[]

  // 绘画状态
  drawingState: DrawingState

  // Feed 相关状态
  feedPlants: Plant[]
  isLoadingFeed: boolean
  hasMoreFeed: boolean

  // 选中的植物
  selectedPlant: Plant | null

  // 用户互动状态
  likedPlants: Set<string> // 用户点赞过的植物ID集合

  // 搜索和过滤状态
  searchQuery: string
  selectedTags: string[]
  sortBy: 'latest' | 'popular' | 'trending'

  // UI 状态
  showCreateModal: boolean
  showPlantDetail: boolean

  // Actions
  setCurrentUser: (user: GardenUser | null) => void
  setUserPlants: (plants: Plant[]) => void

  // 绘画相关操作
  updateDrawingState: (updates: Partial<DrawingState>) => void
  saveDrawingStep: (imageData: string) => void
  undoDrawing: () => void
  redoDrawing: () => void
  clearCanvas: () => void

  // Feed 相关操作
  loadFeed: (options?: { limit?: number; offset?: number }) => Promise<void>
  loadMoreFeed: () => Promise<void>
  refreshFeed: () => Promise<void>

  // 植物操作
  likePlant: (plantId: string) => Promise<void>
  unlikePlant: (plantId: string) => Promise<void>
  createPlant: (plantData: {
    name: string
    description?: string
    imageData: string
    tags?: string[]
  }) => Promise<Plant>
  updatePlant: (plantId: string, updates: Partial<Plant>) => Promise<void>
  deletePlant: (plantId: string) => Promise<void>

  // 选中植物操作
  selectPlant: (plant: Plant | null) => void

  // 搜索和过滤操作
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  setSortBy: (sortBy: 'latest' | 'popular' | 'trending') => void

  // UI 操作
  setShowCreateModal: (show: boolean) => void
  setShowPlantDetail: (show: boolean) => void
}

export const useGardenStore = create<GardenStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      userPlants: [],

      drawingState: {
        isDrawing: false,
        currentTool: 'pen',
        currentColor: '#000000',
        brushSize: 3,
        history: [''], // 空的画布作为初始状态
        historyStep: 0
      },

      feedPlants: [],
      isLoadingFeed: false,
      hasMoreFeed: true,

      selectedPlant: null,
      likedPlants: new Set(),

      searchQuery: '',
      selectedTags: [],
      sortBy: 'latest',

      showCreateModal: false,
      showPlantDetail: false,

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setUserPlants: (plants) => set({ userPlants: plants }),

      // Drawing actions
      updateDrawingState: (updates) =>
        set(state => ({
          drawingState: { ...state.drawingState, ...updates }
        })),

      saveDrawingStep: (imageData) => {
        const state = get()
        const newHistory = state.drawingState.history.slice(0, state.drawingState.historyStep + 1)
        newHistory.push(imageData)

        set({
          drawingState: {
            ...state.drawingState,
            history: newHistory,
            historyStep: newHistory.length - 1
          }
        })
      },

      undoDrawing: () => {
        const state = get()
        if (state.drawingState.historyStep > 0) {
          set({
            drawingState: {
              ...state.drawingState,
              historyStep: state.drawingState.historyStep - 1
            }
          })
        }
      },

      redoDrawing: () => {
        const state = get()
        if (state.drawingState.historyStep < state.drawingState.history.length - 1) {
          set({
            drawingState: {
              ...state.drawingState,
              historyStep: state.drawingState.historyStep + 1
            }
          })
        }
      },

      clearCanvas: () => {
        set({
          drawingState: {
            isDrawing: false,
            currentTool: 'pen',
            currentColor: '#000000',
            brushSize: 3,
            history: [''],
            historyStep: 0
          }
        })
      },

      // Feed actions
      loadFeed: async (options = {}) => {
        set({ isLoadingFeed: true })
        try {
          const response = await fetch('/api/garden/feed?' + new URLSearchParams({
            limit: (options.limit || 20).toString(),
            offset: (options.offset || 0).toString()
          }))

          if (response.ok) {
            const plants: Plant[] = await response.json()
            set({
              feedPlants: options.offset ? [...get().feedPlants, ...plants] : plants,
              hasMoreFeed: plants.length === (options.limit || 20),
              isLoadingFeed: false
            })
          }
        } catch (error) {
          console.error('Failed to load feed:', error)
          set({ isLoadingFeed: false })
        }
      },

      loadMoreFeed: async () => {
        const state = get()
        if (!state.isLoadingFeed && state.hasMoreFeed) {
          await get().loadFeed({
            limit: 20,
            offset: state.feedPlants.length
          })
        }
      },

      refreshFeed: async () => {
        await get().loadFeed({ limit: 20, offset: 0 })
      },

      // Plant actions
      likePlant: async (plantId: string) => {
        const state = get()
        if (state.likedPlants.has(plantId)) return

        try {
          const response = await fetch(`/api/garden/plants/${plantId}/like`, {
            method: 'POST'
          })

          if (response.ok) {
            set(prevState => ({
              likedPlants: new Set([...prevState.likedPlants, plantId]),
              feedPlants: prevState.feedPlants.map(plant =>
                plant.id === plantId
                  ? { ...plant, likeCount: plant.likeCount + 1 }
                  : plant
              ),
              userPlants: prevState.userPlants.map(plant =>
                plant.id === plantId
                  ? { ...plant, likeCount: plant.likeCount + 1 }
                  : plant
              )
            }))
          }
        } catch (error) {
          console.error('Failed to like plant:', error)
        }
      },

      unlikePlant: async (plantId: string) => {
        const state = get()
        if (!state.likedPlants.has(plantId)) return

        try {
          const response = await fetch(`/api/garden/plants/${plantId}/like`, {
            method: 'DELETE'
          })

          if (response.ok) {
            set(prevState => {
              const newLikedPlants = new Set(prevState.likedPlants)
              newLikedPlants.delete(plantId)

              return {
                likedPlants: newLikedPlants,
                feedPlants: prevState.feedPlants.map(plant =>
                  plant.id === plantId
                    ? { ...plant, likeCount: Math.max(0, plant.likeCount - 1) }
                    : plant
                ),
                userPlants: prevState.userPlants.map(plant =>
                  plant.id === plantId
                    ? { ...plant, likeCount: Math.max(0, plant.likeCount - 1) }
                    : plant
                )
              }
            })
          }
        } catch (error) {
          console.error('Failed to unlike plant:', error)
        }
      },

      createPlant: async (plantData) => {
        try {
          const response = await fetch('/api/garden/plants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plantData)
          })

          if (response.ok) {
            const newPlant: Plant = await response.json()
            set(prevState => ({
              userPlants: [newPlant, ...prevState.userPlants],
              feedPlants: [newPlant, ...prevState.feedPlants]
            }))
            return newPlant
          } else {
            throw new Error('Failed to create plant')
          }
        } catch (error) {
          console.error('Failed to create plant:', error)
          throw error
        }
      },

      updatePlant: async (plantId: string, updates: Partial<Plant>) => {
        try {
          const response = await fetch(`/api/garden/plants/${plantId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          })

          if (response.ok) {
            const updatedPlant: Plant = await response.json()
            set(prevState => ({
              userPlants: prevState.userPlants.map(plant =>
                plant.id === plantId ? updatedPlant : plant
              ),
              feedPlants: prevState.feedPlants.map(plant =>
                plant.id === plantId ? updatedPlant : plant
              ),
              selectedPlant: prevState.selectedPlant?.id === plantId ? updatedPlant : prevState.selectedPlant
            }))
          }
        } catch (error) {
          console.error('Failed to update plant:', error)
        }
      },

      deletePlant: async (plantId: string) => {
        try {
          const response = await fetch(`/api/garden/plants/${plantId}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            set(prevState => ({
              userPlants: prevState.userPlants.filter(plant => plant.id !== plantId),
              feedPlants: prevState.feedPlants.filter(plant => plant.id !== plantId),
              selectedPlant: prevState.selectedPlant?.id === plantId ? null : prevState.selectedPlant
            }))
          }
        } catch (error) {
          console.error('Failed to delete plant:', error)
        }
      },

      // Selection actions
      selectPlant: (plant) => set({ selectedPlant: plant }),

      // Search and filter actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      setSortBy: (sortBy) => set({ sortBy }),

      // UI actions
      setShowCreateModal: (show) => set({ showCreateModal: show }),
      setShowPlantDetail: (show) => set({ showPlantDetail: show })
    }),
    {
      name: 'garden-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        likedPlants: Array.from(state.likedPlants),
        searchQuery: state.searchQuery,
        selectedTags: state.selectedTags,
        sortBy: state.sortBy
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.likedPlants)) {
          state.likedPlants = new Set(state.likedPlants)
        }
      }
    }
  )
)
// Mock data for Garden page development
// This will be replaced with real API data in Phase 3

export interface MockPlant {
  id: string
  name: string
  bio: string
  imageUrl: string // Will be SVG component reference for now
  level: 0 | 1 | 2 | 3
  likeCount: number
  commentCount: number
  tags: string[]
  isNew: boolean
  isFeatured: boolean
  createdAt: Date
  user: {
    id: string
    username: string
    avatarUrl: string
  }
}

export interface MockStats {
  totalPlants: number
  totalWaterings: number
  todayNewPlants: number
}

// Helper function to calculate level from like count
export function calculateLevel(likeCount: number): 0 | 1 | 2 | 3 {
  if (likeCount >= 200) return 3
  if (likeCount >= 50) return 2
  if (likeCount >= 10) return 1
  return 0
}

// Helper function to calculate next level threshold
export function getNextLevelThreshold(level: 0 | 1 | 2 | 3): number {
  switch (level) {
    case 0: return 10
    case 1: return 50
    case 2: return 200
    case 3: return Infinity
  }
}

// Helper function to calculate progress percentage
export function calculateProgress(likeCount: number, level: 0 | 1 | 2 | 3): number {
  const nextThreshold = getNextLevelThreshold(level)
  if (nextThreshold === Infinity) return 100

  const currentThreshold = level === 0 ? 0 : getNextLevelThreshold((level - 1) as 0 | 1 | 2)
  const progress = ((likeCount - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  return Math.min(Math.max(progress, 0), 100)
}

// Mock plant names
const plantNames = [
  '彩虹仙人掌', '星光蕨', '梦幻藤蔓', '月光百合',
  '火焰花', '水晶兰', '极光草', '云朵树',
  '钻石叶', '珍珠花', '琥珀草', '翡翠藤',
  '银河玫瑰', '宇宙向日葵', '量子蒲公英', '赛博竹',
  '霓虹兰花', '数码雏菊', '像素玫瑰', '全息郁金香'
]

// Mock bios
const plantBios = [
  '在沙漠中绽放的奇迹',
  '夜空下最闪耀的星',
  '梦想编织的藤蔓',
  '月光下的温柔守护',
  '燃烧着生命的热情',
  '纯净如水晶般透明',
  '极光般梦幻的色彩',
  '轻盈如云朵的存在',
  '坚硬而璀璨的美丽',
  '温润如珍珠的光泽',
  '琥珀中凝固的时光',
  '翡翠般深邃的绿意',
  '银河系的浪漫使者',
  '向着太阳生长的勇气',
  '随风飘散的自由灵魂',
  '东方美学的现代诠释',
  '霓虹灯下的都市精灵',
  '数字世界的自然生命',
  '像素化的浪漫花语',
  '全息投影的未来花园'
]

// Mock usernames
const usernames = [
  'PlantLover', 'GardenArtist', 'NatureCreator', 'FloraDesigner',
  'BotanicalDreamer', 'EcoArtist', 'GreenThumb', 'BloomMaster',
  'LeafWhisperer', 'PetalPainter', 'VineVirtuoso', 'SeedSage',
  'FlowerForge', 'GardenGuru', 'PlantPoet', 'BlossomsBot'
]

// Mock tags
const allTags = [
  'realistic', 'abstract', 'cute', 'quirky', 'minimalist',
  'colorful', 'monochrome', 'fantasy', 'scifi', 'nature',
  'geometric', 'organic', 'surreal', 'elegant', 'playful'
]

// Generate mock plants
export const mockPlants: MockPlant[] = Array.from({ length: 24 }, (_, i) => {
  const likeCount = Math.floor(Math.random() * 300)
  const level = calculateLevel(likeCount)
  const isNew = Math.random() > 0.8
  const isFeatured = Math.random() > 0.9
  const daysSinceCreated = Math.floor(Math.random() * 30)

  return {
    id: `plant-${i + 1}`,
    name: plantNames[i % plantNames.length],
    bio: plantBios[i % plantBios.length],
    imageUrl: `/plants/plant-${level}.svg`, // SVG component reference
    level,
    likeCount,
    commentCount: Math.floor(Math.random() * 50),
    tags: [
      allTags[Math.floor(Math.random() * allTags.length)],
      allTags[Math.floor(Math.random() * allTags.length)]
    ].filter((tag, index, self) => self.indexOf(tag) === index), // Remove duplicates
    isNew,
    isFeatured,
    createdAt: new Date(Date.now() - daysSinceCreated * 24 * 60 * 60 * 1000),
    user: {
      id: `user-${(i % usernames.length) + 1}`,
      username: usernames[i % usernames.length],
      avatarUrl: `/avatars/avatar-${(i % 8) + 1}.png`
    }
  }
})

// Sort by creation date (newest first)
mockPlants.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// Mock stats
export const mockStats: MockStats = {
  totalPlants: 1234,
  totalWaterings: 50678,
  todayNewPlants: 128
}

// Mock featured plants (top 3 most liked)
export const mockFeaturedPlants = [...mockPlants]
  .sort((a, b) => b.likeCount - a.likeCount)
  .slice(0, 3)

// Mock trending plants (high engagement recently)
export const mockTrendingPlants = [...mockPlants]
  .filter(p => p.createdAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
  .slice(0, 6)

// Helper function to simulate watering (like) action
export function mockWaterPlant(plantId: string): MockPlant | null {
  const plant = mockPlants.find(p => p.id === plantId)
  if (!plant) return null

  plant.likeCount += 1
  plant.level = calculateLevel(plant.likeCount)
  return plant
}

// Helper function to filter plants by tag
export function filterPlantsByTag(tag: string): MockPlant[] {
  return mockPlants.filter(p => p.tags.includes(tag))
}

// Helper function to search plants
export function searchPlants(query: string): MockPlant[] {
  const lowerQuery = query.toLowerCase()
  return mockPlants.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.bio.toLowerCase().includes(lowerQuery) ||
    p.user.username.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

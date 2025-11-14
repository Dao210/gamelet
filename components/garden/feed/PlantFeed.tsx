'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import PlantCard from './PlantCard'
import type { MockPlant } from '@/lib/garden-mock-data'
import { mockPlants, searchPlants, filterPlantsByTag } from '@/lib/garden-mock-data'

type SortOption = 'newest' | 'most-liked' | 'trending'

interface PlantFeedProps {
  initialPlants?: MockPlant[]
}

export default function PlantFeed({ initialPlants = mockPlants }: PlantFeedProps) {
  const [plants, setPlants] = useState<MockPlant[]>(initialPlants)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    initialPlants.forEach((plant) => {
      plant.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [initialPlants])

  // Filter and sort plants
  const filteredPlants = useMemo(() => {
    let result = initialPlants

    // Apply search filter
    if (searchQuery.trim()) {
      result = searchPlants(searchQuery)
    }

    // Apply tag filter
    if (selectedTag) {
      result = filterPlantsByTag(selectedTag)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'most-liked':
        result = [...result].sort((a, b) => b.likeCount - a.likeCount)
        break
      case 'trending':
        result = [...result]
          .filter((p) => p.createdAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
          .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
        break
    }

    return result
  }, [initialPlants, searchQuery, selectedTag, sortBy])

  const handleWater = (plantId: string) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, likeCount: p.likeCount + 1 } : p))
    )
  }

  return (
    <section id="feed" className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            全球藤架
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            探索来自世界各地创作者的植物花园
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="max-w-5xl mx-auto mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg p-4">
            <input
              type="text"
              placeholder="搜索植物名称、标签或创作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
            />
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Sort Buttons */}
            <div className="flex gap-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 self-center mr-2">
                排序:
              </span>
              {(['newest', 'most-liked', 'trending'] as SortOption[]).map((option) => (
                <motion.button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${
                      sortBy === option
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option === 'newest' && '最新'}
                  {option === 'most-liked' && '最受欢迎'}
                  {option === 'trending' && '趋势'}
                </motion.button>
              ))}
            </div>

            {/* Results Count */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              共 <span className="font-bold text-green-600 dark:text-green-400">{filteredPlants.length}</span> 个作品
            </span>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 self-center mr-2">
              标签:
            </span>
            <motion.button
              onClick={() => setSelectedTag(null)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-all
                ${
                  selectedTag === null
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              全部
            </motion.button>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-all
                  ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Plant Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
              >
                <PlantCard
                  plant={plant}
                  onWater={handleWater}
                  onComment={(id) => console.log('Comment on:', id)}
                  onShare={(id) => console.log('Share:', id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPlants.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              没有找到匹配的植物
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              试试搜索其他关键词或选择不同的标签
            </p>
          </motion.div>
        )}

        {/* Load More Button (for future infinite scroll) */}
        {filteredPlants.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              加载更多
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

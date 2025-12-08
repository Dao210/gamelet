/**
 * CreateFAB Component
 * 文档来源: Action Plan - Module 4.6
 *
 * 飘浮创建按钮 (Floating Action Button)
 * - 固定在右下角
 * - 点击导航到创建页面
 * - 呼吸动画吸引注意
 * - 响应式尺寸
 */

'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface CreateFABProps {
  /** 按钮位置 */
  position?: {
    bottom?: string
    right?: string
  }
  /** 自定义类名 */
  className?: string
}

export default function CreateFAB({
  position = { bottom: '2rem', right: '2rem' },
  className = ''
}: CreateFABProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push('/grassland/create')
  }

  return (
    <motion.button
      className={`create-fab fixed z-50 flex items-center justify-center rounded-full shadow-2xl ${className}`}
      style={{
        bottom: position.bottom,
        right: position.right,
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #7CB342 0%, #558B2F 100%)',
        border: '3px solid white'
      }}
      onClick={handleClick}
      whileHover={{
        scale: 1.1,
        boxShadow: '0 12px 40px rgba(124, 179, 66, 0.5)'
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 8px 24px rgba(124, 179, 66, 0.4)',
          '0 12px 32px rgba(124, 179, 66, 0.6)',
          '0 8px 24px rgba(124, 179, 66, 0.4)'
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      {/* 加号图标 */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 提示文字 (hover显示) */}
      <motion.div
        className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        Create Your Plant
        <div
          className="absolute top-1/2 -right-1 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"
          style={{ transform: 'translateY(-50%)' }}
        />
      </motion.div>
    </motion.button>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { GameMode } from '../lib/game-engine'
import { trackShare } from '../lib/analytics'

interface GameResultProps {
  className?: string
}

export default function GameResult({ className = '' }: GameResultProps) {
  const { gameState, stats, startNewGame } = useGameStore()
  
  if (!gameState || gameState.status === 'playing') return null
  
  const isWon = gameState.status === 'won'
  const attempts = gameState.attempts.length
  const mode = gameState.mode
  
  const getModeDisplayName = (mode: GameMode): string => {
    switch (mode) {
      case 'classic': return 'Classic Nerdle'
      case 'mini': return 'Mini Nerdle'
      case 'expert': return 'Expert Nerdle'
      default: return 'Nerdle'
    }
  }
  
  const getShareText = (): string => {
    if (isWon) {
      return `🎉 I solved today's ${getModeDisplayName(mode)} in ${attempts}/${gameState.maxAttempts} attempts!\n\nPlay Nerdle - the daily math equation puzzle game:`
    } else {
      return `😔 I didn't solve today's ${getModeDisplayName(mode)} puzzle.\n\nChallenge yourself with Nerdle - the daily math equation puzzle game:`
    }
  }
  
  const getShareUrl = (): string => {
    return typeof window !== 'undefined' ? window.location.origin : 'https://chimii.com'
  }
  
  const getShareImageUrl = (): string => {
    const baseUrl = getShareUrl()
    const params = new URLSearchParams({
      mode: mode,
      attempts: attempts.toString(),
      status: isWon ? 'won' : 'lost',
      streak: stats.currentStreak.toString()
    })
    return `${baseUrl}/api/share-image?${params.toString()}`
  }
  
  const shareData = {
    title: `${getModeDisplayName(mode)} - Daily Math Puzzle`,
    text: getShareText(),
    url: getShareUrl()
  }
  
  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'native') => {
    const url = getShareUrl()
    const text = getShareText()
    
    // Track share event
    trackShare(platform, mode, isWon ? 'won' : 'lost')
    
    if (platform === 'native' && typeof navigator !== 'undefined' && navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        console.log('Native share cancelled or failed')
      }
    }
    
    let shareUrl = ''
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=nerdle,mathgame,puzzle`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }
  
  const handleNextGame = () => {
    startNewGame(mode)
  }
  
  const handleCopyLink = async () => {
    const text = getShareText()
    const url = getShareUrl()
    const fullText = `${text}\n\n${url}`
    
    try {
      await navigator.clipboard.writeText(fullText)
      // You could add a toast notification here
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = fullText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Result Header */}
      <div className="mb-6">
        <motion.div 
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {isWon ? '🎉' : '😔'}
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isWon ? 'Congratulations!' : 'Better luck next time!'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {isWon 
            ? `You solved ${getModeDisplayName(mode)} in ${attempts} attempt${attempts === 1 ? '' : 's'}!`
            : `The answer was: ${gameState.target}`
          }
        </p>
      </div>
      
      {/* Stats Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Your Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.bestStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Best Streak
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.averageAttempts * 10) / 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Attempts
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Share Your Result
        </h3>
        
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            onClick={() => handleShare('twitter')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            onClick={() => handleShare('facebook')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
            onClick={() => handleShare('linkedin')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            onClick={handleCopyLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </motion.button>
          
          {typeof navigator !== 'undefined' && navigator.share && typeof navigator.share === 'function' && (
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              onClick={() => handleShare('native')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </motion.button>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Share your achievement and challenge your friends!
        </div>
      </div>
      
      {/* Next Game Button */}
      <motion.button
        className="
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          text-white font-bold py-3 px-8
          rounded-xl text-lg
          transition-all duration-200
          shadow-lg hover:shadow-xl
        "
        onClick={handleNextGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Another {getModeDisplayName(mode)}
      </motion.button>
    </motion.div>
  )
}

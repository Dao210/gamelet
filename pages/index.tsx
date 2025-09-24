import React from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { defaultSEO, structuredData } from '../lib/seo'

export default function HomePage() {
  return (
    <>
      <NextSeo {...defaultSEO} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Nerdle
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              The Daily Math Equation Puzzle Game
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Challenge your mathematical skills with our addictive daily puzzle game. 
              Guess the hidden equation in 6 tries or less. Perfect for math enthusiasts and puzzle lovers!
            </p>
          </motion.header>

          {/* Game Preview */}
          <motion.div 
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  How to Play Nerdle
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Guess the mathematical equation in 6 attempts
                </p>
              </div>
              
              {/* Game Board Preview */}
              <div className="flex flex-col gap-2 mb-6">
                {Array.from({ length: 3 }, (_, row) => (
                  <div key={row} className="flex gap-2 justify-center">
                    {Array.from({ length: 8 }, (_, col) => (
                      <div 
                        key={col}
                        className={`
                          w-12 h-12 md:w-14 md:h-14
                          flex items-center justify-center
                          text-xl md:text-2xl font-bold
                          rounded-lg
                          ${row === 0 && col < 3 ? 'bg-green-500 text-white' :
                            row === 1 && col === 4 ? 'bg-yellow-500 text-white' :
                            row === 2 && col === 6 ? 'bg-gray-500 text-white' :
                            'bg-white border-2 border-gray-300 text-gray-900'
                          }
                        `}
                      >
                        {row === 0 && col < 3 ? ['1', '2', '+'][col] :
                         row === 1 && col === 4 ? '=' :
                         row === 2 && col === 6 ? '3' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/game">
                  <motion.button
                    className="
                      bg-blue-500 hover:bg-blue-600
                      text-white font-bold py-4 px-8
                      rounded-xl text-lg
                      transition-colors duration-200
                      shadow-lg hover:shadow-xl
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Nerdle Now
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Daily Challenges
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                New math equations every day to keep your brain sharp and engaged.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Multiple Modes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from Classic, Mini, and Expert modes to match your skill level.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your statistics, streaks, and improvement over time.
              </p>
            </div>
          </motion.div>

          {/* Game Rules */}
          <motion.div 
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Nerdle Game Rules
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  How to Play
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Guess the mathematical equation in 6 attempts</li>
                  <li>• Use numbers (0-9) and operators (+, -, *, /, =)</li>
                  <li>• Each equation must be mathematically correct</li>
                  <li>• The equation must contain exactly one equals sign</li>
                  <li>• The result must be a positive integer</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Color Feedback
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <span className="text-green-600 font-semibold">Green</span>: Correct number/operator in correct position</li>
                  <li>• <span className="text-yellow-600 font-semibold">Yellow</span>: Correct number/operator in wrong position</li>
                  <li>• <span className="text-gray-600 font-semibold">Gray</span>: Number/operator not in the equation</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Challenge Your Math Skills?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of players worldwide in the ultimate math puzzle experience!
            </p>
            <Link href="/game">
              <motion.button
                className="
                  bg-gradient-to-r from-blue-500 to-purple-600
                  hover:from-blue-600 hover:to-purple-700
                  text-white font-bold py-4 px-8
                  rounded-xl text-xl
                  transition-all duration-200
                  shadow-lg hover:shadow-xl
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Playing Nerdle
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}
import React from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { aboutSEO } from '../lib/seo'

export default function AboutPage() {
  return (
    <>
      <NextSeo {...aboutSEO} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Nerdle
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The Ultimate Math Equation Puzzle Game
            </p>
          </motion.header>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                What is Nerdle?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Nerdle is an addictive daily math puzzle game that challenges players to guess a hidden 
                mathematical equation within 6 attempts. Inspired by the popular word-guessing game Wordle, 
                Nerdle combines the thrill of deduction with mathematical reasoning.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Each day, players around the world attempt to solve the same mathematical equation, 
                creating a shared experience that brings together math enthusiasts, puzzle lovers, 
                and casual gamers alike.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                How Nerdle Works
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    The Challenge
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your goal is to guess a hidden mathematical equation using numbers (0-9) 
                    and basic operators (+, -, *, /, =). The equation must be mathematically 
                    correct and follow standard arithmetic rules.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    The Feedback
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    After each guess, you'll receive color-coded feedback:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• <span className="text-green-600 font-semibold">Green</span>: Correct in correct position</li>
                    <li>• <span className="text-yellow-600 font-semibold">Yellow</span>: Correct in wrong position</li>
                    <li>• <span className="text-gray-600 font-semibold">Gray</span>: Not in the equation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Game Modes
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Classic Nerdle
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    8-character equations with 6 attempts. The perfect balance of challenge and accessibility.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mini Nerdle
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    6-character equations for quick games. Perfect for a quick mental workout.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Expert Nerdle
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    10-character equations for the ultimate challenge. Only for the most skilled players.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Play Nerdle?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Educational Benefits
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Improves mathematical reasoning and problem-solving skills</li>
                    <li>• Enhances pattern recognition and logical thinking</li>
                    <li>• Builds confidence in arithmetic operations</li>
                    <li>• Develops strategic thinking and planning abilities</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Fun Features
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Daily challenges keep the game fresh and exciting</li>
                    <li>• Multiple difficulty levels for all skill levels</li>
                    <li>• Progress tracking and statistics</li>
                    <li>• Clean, intuitive interface that works on any device</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Playing?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join the global community of Nerdle players and challenge your math skills today!
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
                  Play Nerdle Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import Image from 'next/image';

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Home() {
  // 游戏数据
  const games = [
    {
      id: 'job-finder',
      title: '求职预测器',
      description: '基于AI分析，预测您找到理想工作需要的时间',
      icon: '👔',
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      comingSoon: false
    },
    {
      id: 'salary-guess',
      title: '薪资估算器',
      description: '根据您的技能和经验，AI推算您在市场上的理想薪资',
      icon: '💰',
      bgColor: 'bg-gradient-to-br from-green-400 to-cyan-500',
      comingSoon: true
    },
    {
      id: 'career-path',
      title: '职业路径规划',
      description: '探索不同职业路径，找到适合您的发展方向',
      icon: '🚀',
      bgColor: 'bg-gradient-to-br from-orange-400 to-pink-500',
      comingSoon: true
    },
    {
      id: 'interview-sim',
      title: '面试模拟',
      description: '通过AI面试官的挑战，提升您的面试技巧',
      icon: '🎯',
      bgColor: 'bg-gradient-to-br from-red-500 to-yellow-500',
      comingSoon: true
    },
  ];

  return (
    <Layout>
      <Head>
        <title>AI职场游戏中心 - 用AI预测您的职业未来</title>
        <meta name="description" content="探索AI驱动的职场小游戏，从求职预测到职业规划，让AI助力您的职业发展" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 英雄区域 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="w-full h-full opacity-10">
            {/* 可以添加一个背景图案 */}
            <div className="absolute w-20 h-20 rounded-full bg-white/10 top-20 left-1/4"></div>
            <div className="absolute w-32 h-32 rounded-full bg-white/10 bottom-20 right-1/3"></div>
            <div className="absolute w-16 h-16 rounded-full bg-white/10 top-1/3 right-1/4"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="inline-block">AI驱动的</span>{' '}
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
                职场游戏
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              探索AI技术如何预测和指导您的职业发展，通过有趣的互动游戏了解职场趋势
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/games/job-finder" className="inline-block bg-white text-indigo-900 font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                开始职业预测
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* 波浪分隔符 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
            <path d="M0,96L60,85.3C120,75,240,53,360,53.3C480,53,600,75,720,80C840,85,960,75,1080,58.7C1200,43,1320,21,1380,10.7L1440,0L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* 游戏展示 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">探索我们的AI游戏</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                每个游戏都利用先进的人工智能技术，帮助您获得关于职业发展的洞察
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {games.map((game) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <Link href={game.comingSoon ? '#' : `/games/${game.id}`}>
                    <div className={`${game.bgColor} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full relative`}>
                      {game.comingSoon && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
                          即将推出
                        </div>
                      )}
                      <div className="p-8">
                        <div className="text-4xl mb-4">{game.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                        <p className="text-white text-opacity-90">{game.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 特点说明 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们的AI游戏</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们结合了先进的AI技术和有趣的游戏体验，帮助您更好地了解职场
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl mb-6">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI驱动分析</h3>
                <p className="text-gray-600">
                  基于先进的人工智能算法，分析多维度数据，提供更准确的职业预测
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-6">
                  🎮
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">游戏化体验</h3>
                <p className="text-gray-600">
                  将枯燥的职场分析变成有趣的互动游戏，让学习和规划更加轻松愉快
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mb-6">
                  📊
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">个性化建议</h3>
                <p className="text-gray-600">
                  根据您的个人情况提供定制化的职业建议，帮助您做出更明智的职业决策
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 用户评价 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">用户怎么说</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                听听已经使用我们AI游戏的用户分享他们的经验
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold mr-4">
                    LW
                  </div>
                  <div>
                    <h4 className="font-bold">李伟</h4>
                    <p className="text-gray-500 text-sm">软件工程师</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "求职预测游戏准确预测了我找工作的时间，提供的建议也帮助我优化了简历，最终比预期更快地找到了理想工作！"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold mr-4">
                    ZM
                  </div>
                  <div>
                    <h4 className="font-bold">张敏</h4>
                    <p className="text-gray-500 text-sm">市场营销专员</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "这些AI游戏不仅有趣，而且提供了很多我之前没想到的职业发展建议。特别是薪资估算器，帮我在谈判中争取到了更好的薪资。"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center font-bold mr-4">
                    WJ
                  </div>
                  <div>
                    <h4 className="font-bold">王俊</h4>
                    <p className="text-gray-500 text-sm">应届毕业生</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "作为应届生，我对职场一无所知。这个平台的游戏化方式让我更容易理解职场规则，面试模拟游戏极大提升了我的自信心。"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {'★'.repeat(4)}{'☆'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开始您的AI职场之旅了吗？</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              立即体验我们的AI游戏，获取专业的职业发展建议，提升您在职场中的竞争力
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/games/job-finder" className="bg-white text-indigo-700 font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                立即开始
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 
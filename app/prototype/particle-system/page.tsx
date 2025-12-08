/**
 * Canvas 粒子系统演示页面
 * 路由: /prototype/particle-system
 */

import ParticleSystemDemo from '@/components/garden/prototype/ParticleSystemDemo'

export const metadata = {
  title: 'Canvas Particle System - 技术预研',
  description: '全球草原花园粒子效果性能测试'
}

export default function ParticleSystemPage() {
  return <ParticleSystemDemo />
}

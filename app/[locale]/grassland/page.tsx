/**
 * Grassland Main Page
 * 路由: /[locale]/grassland
 * 文档来源: Action Plan - Module 4.1, /docs/design/UI-UX设计文档.md
 *
 * 全球草原花园主页：展示所有用户创建的植物，在广阔的草原上生长
 */

import { Metadata } from 'next'
import GrasslandClient from './GrasslandClient'

export const metadata: Metadata = {
  title: 'Global Prairie Garden | Grassland',
  description: 'Watch plants grow together in a global prairie garden. Water plants, gain XP, and watch them flourish under the sunshine and gentle breeze.'
}

export default function GrasslandPage() {
  return <GrasslandClient />
}

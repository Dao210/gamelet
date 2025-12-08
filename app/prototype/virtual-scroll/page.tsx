/**
 * 虚拟滚动演示页面
 * 路由: /prototype/virtual-scroll
 */

import VirtualScrollDemo from '@/components/garden/prototype/VirtualScrollDemo'

export const metadata = {
  title: 'Virtual Scroll + Plant Layout - 技术预研',
  description: '全球草原花园虚拟滚动性能测试'
}

export default function VirtualScrollPage() {
  return <VirtualScrollDemo />
}

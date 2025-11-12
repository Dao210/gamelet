import { ReactNode } from 'react';
import { Navigation } from '../../components/Navigation';

export const metadata = {
  title: '全球藤架 - 创意植物花园',
  description: '在全球藤架中绘制你的创意植物，看着它因社区的关爱而生长绽放',
};

export default function GardenLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-green-800 mb-2">
            🌱 全球藤架
          </h1>
          <p className="text-center text-gray-600">
            点赞即生长，滚动即探索
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
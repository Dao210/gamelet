
import Link from 'next/link';

export default function GardenPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 欢迎区域 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8"  >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          欢迎来到全球藤架！
        </h2>
        <p className="text-gray-600 mb-6">
          在这里，每一幅涂鸦都能获得生命。用你的创意绘制植物，看着它在全球社区的关爱下茁壮成长。
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 特色功能卡片 */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              自由创作
            </h3>
            <p className="text-green-600 text-sm">
              使用简单的绘画工具，创作属于你的独特植物涂鸦
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              生长系统
            </h3>
            <p className="text-blue-600 text-sm">
              每一次点赞都会让你的植物向上生长，解锁炫酷动画效果
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              全球社区
            </h3>
            <p className="text-purple-600 text-sm">
              探索来自世界各地的创意作品，与全球创作者互动交流
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              无限探索
            </h3>
            <p className="text-orange-600 text-sm">
              在无限滚动的植物花园中，发现更多精彩创意
            </p>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/grassland/create"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-center"
          >
            🎨 开始创作
          </Link>
          <Link
            href="/grassland"
            className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-xl transition-colors text-center"
          >
            🌿 探索花园
          </Link>
        </div>
      </div>

      {/* 热门植物预览 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          🔥 今日热门植物
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 占位符植物卡片 */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <p className="text-xs text-gray-600">植物 #{i}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            更多精彩植物等你来发现！
          </p>
        </div>
      </div>
    </div>
  );
}

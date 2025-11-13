import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gardenMetadata' })
  const pathname = '/garden'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  }
}

export default async function GardenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gardenPage' })

  return (
    <div className="max-w-4xl mx-auto">
      {/* 欢迎区域 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t('welcome')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('welcomeDescription')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 特色功能卡片 */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {t('featureCreate')}
            </h3>
            <p className="text-green-600 text-sm">
              {t('featureCreateDesc')}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {t('featureGrow')}
            </h3>
            <p className="text-blue-600 text-sm">
              {t('featureGrowDesc')}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              {t('featureCommunity')}
            </h3>
            <p className="text-purple-600 text-sm">
              {t('featureCommunityDesc')}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              {t('featureExplore')}
            </h3>
            <p className="text-orange-600 text-sm">
              {t('featureExploreDesc')}
            </p>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/garden/create"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-center"
          >
            🎨 {t('btnStartCreate')}
          </Link>
          <Link
            href="/garden/feed"
            className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-xl transition-colors text-center"
          >
            🌿 {t('btnExplorePlants')}
          </Link>
        </div>
      </div>

      {/* 热门植物预览 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          🔥 {t('trendingTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 占位符植物卡片 */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <p className="text-xs text-gray-600">{t('plantNumber', { number: i })}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            {t('discoverMore')}
          </p>
        </div>
      </div>
    </div>
  );
}

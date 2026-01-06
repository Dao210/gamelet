import Link from 'next/link';

export const metadata = {
  title: 'Nerdle Answer Today - Expert Strategies & Tips | Nerdle Solver Guide',
  description: 'Discover expert Nerdle strategies and tips for today\'s puzzle. Learn why we can\'t provide direct answers and master the art of solving daily math equations with our comprehensive guide.',
  keywords: 'nerdle answer today, nerdle solver, nerdle tips, nerdle strategies, daily nerdle, math puzzle solver, nerdle game guide, nerdle hints, nerdle tricks',
  openGraph: {
    title: 'Nerdle Answer Today - Expert Strategies & Tips',
    description: 'Master Nerdle with expert strategies, tips, and techniques. Learn why direct answers aren\'t provided and how to solve daily math puzzles like a pro.',
    images: [
      {
        url: 'https://gamelet.app/api/share-image?title=Nerdle%20Answer%20Today&subtitle=Expert%20Strategies%20%26%20Tips',
        width: 1200,
        height: 630,
        alt: 'Nerdle Answer Today - Expert Strategies',
      },
    ],
  },
};

export default function NerdleAnswerTodayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/nerd" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Nerdle
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Nerdle Answer Today
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Expert Strategies & Tips for Today&apos;s Puzzle
              </p>
            </header>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Why We Don&apos;t Provide Direct Answers
              </h2>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                We believe the joy of Nerdle comes from the challenge of solving the puzzle yourself.
                Instead of giving today&apos;s answer, we&apos;ll equip you with the strategies and techniques
                to solve any Nerdle puzzle with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 h-full">
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
                  Expert Strategies
                </h3>
                <ul className="space-y-3 text-green-800 dark:text-green-200">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Start with basic operations like addition and subtraction
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Use common number patterns (like 10, 20, 100)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Eliminate numbers and operators systematically
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Pay attention to yellow feedback for position clues
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Try different equation structures (A+B=C, A-B=C, etc.)
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 h-full">
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                  Pro Tips & Tricks
                </h3>
                <ul className="space-y-3 text-purple-800 dark:text-purple-200">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Use all 8 characters in every attempt when possible
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Test multiplication and division early
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Remember that equations must be mathematically valid
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    The result after = must be a positive integer
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Keep track of tried combinations mentally
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Apply These Strategies?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Use these expert tips to solve today&apos;s Nerdle puzzle without spoilers.
              </p>
              <Link href="/nerd/game" className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg">
                Play Today&apos;s Nerdle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
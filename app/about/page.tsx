import Link from 'next/link';

export const metadata = {
  title: 'About Nerdle - The Math Equation Guessing Game',
  description: 'Learn about Nerdle, the popular math equation guessing game. Discover how to play, game rules, tips and strategies for solving daily math puzzles.',
  openGraph: {
    title: 'About Nerdle - The Math Equation Guessing Game',
    description: 'Learn about Nerdle, the popular math equation guessing game.',
    type: 'website',
  },
};

export default function AboutPage() {
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
                About Nerdle
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                The Daily Math Equation Puzzle Game
              </p>
            </header>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What is Nerdle?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Nerdle is a daily math equation guessing game that challenges players to solve a hidden mathematical
                  equation in six attempts or less. Similar to word puzzle games, but with numbers and operators instead
                  of letters, Nerdle tests your mathematical reasoning and problem-solving skills.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  How to Play
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Basic Rules
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Guess the equation in 6 attempts or less
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Use numbers 0-9 and operators +, -, *, /
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Each guess must be a valid mathematical equation
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Include exactly one equals sign (=)
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        The result must be a positive integer
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Color Feedback
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-green-500 rounded mr-3"></span>
                        <span className="font-medium">Green:</span> Correct number/operator in correct position
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-3"></span>
                        <span className="font-medium">Yellow:</span> Correct number/operator in wrong position
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-gray-400 rounded mr-3"></span>
                        <span className="font-medium">Gray:</span> Number/operator not in the equation
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Play?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Put your math skills to the test with today's Nerdle puzzle!
                </p>
                <Link href="/nerd/game" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors">
                  Play Nerdle Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
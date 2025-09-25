import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    mode = 'classic',
    attempts = '6',
    status = 'won',
    streak = '0'
  } = req.query

  const modeDisplay = {
    classic: 'Classic Nerdle',
    mini: 'Mini Nerdle',
    expert: 'Expert Nerdle'
  }[mode as string] || 'Classic Nerdle'

  const isWon = status === 'won'
  const emoji = isWon ? '🎉' : '😔'
  const title = isWon ? 'Congratulations!' : 'Better luck next time!'
  const subtitle = isWon 
    ? `You solved ${modeDisplay} in ${attempts} attempt${attempts === '1' ? '' : 's'}!`
    : `Challenge yourself with ${modeDisplay}!`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .container {
            background: white;
            border-radius: 24px;
            padding: 60px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 1000px;
            margin: 20px;
          }
          .emoji {
            font-size: 120px;
            margin-bottom: 30px;
            display: block;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .subtitle {
            font-size: 28px;
            color: #6b7280;
            margin-bottom: 40px;
          }
          .stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 36px;
            font-weight: bold;
            color: #3b82f6;
          }
          .stat-label {
            font-size: 18px;
            color: #6b7280;
            margin-top: 8px;
          }
          .url {
            font-size: 24px;
            color: #9ca3af;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="emoji">${emoji}</span>
          <h1 class="title">${title}</h1>
          <p class="subtitle">${subtitle}</p>
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${streak}</div>
              <div class="stat-label">Current Streak</div>
            </div>
            <div class="stat">
              <div class="stat-value">${modeDisplay}</div>
              <div class="stat-label">Game Mode</div>
            </div>
          </div>
          <div class="url">nerdle-math-game.vercel.app</div>
        </div>
      </body>
    </html>
  `

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(html)
}

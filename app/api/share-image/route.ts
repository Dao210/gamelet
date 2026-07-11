import { ImageResponse } from '@vercel/og'
import { createElement } from 'react'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('mode') || 'classic'
  const title = searchParams.get('title') || 'Gamelet'
  const subtitle = searchParams.get('subtitle') || 'Brainy Mini Games'
  const status = searchParams.get('status')
  const attempts = searchParams.get('attempts')

  const resultText = status && attempts
    ? `${status.toUpperCase()} · ${attempts} attempts`
    : mode

  return new ImageResponse(
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f8faf6',
          color: '#171711',
          padding: 72,
          fontFamily: 'Arial, sans-serif',
          border: '18px solid #171711'
        }
      },
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: 'uppercase'
          }
        },
        createElement('span', null, 'Gamelet'),
        createElement('span', { style: { color: '#00a676' } }, resultText)
      ),
      createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 24 } },
        createElement(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 0.95,
              maxWidth: 900
            }
          },
          title
        ),
        createElement(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: 38,
              lineHeight: 1.25,
              color: '#424235',
              maxWidth: 860
            }
          },
          subtitle
        )
      ),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 28,
            fontWeight: 800
          }
        },
        createElement('span', null, 'gamelet.app'),
        createElement(
          'div',
          {
            style: {
              display: 'flex',
              gap: 12
            }
          },
          ['#00a676', '#ffe66d', '#db3f5d', '#f07c2f'].map((color) =>
            createElement('span', {
              key: color,
              style: {
                width: 32,
                height: 32,
                background: color,
                border: '4px solid #171711'
              }
            })
          )
        )
      )
    ),
    {
      width: 1200,
      height: 630
    }
  )
}

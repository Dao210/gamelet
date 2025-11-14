'use client'

import { motion } from 'framer-motion'

// SVG Plant component with 4 growth levels
// Each level has unique visual elements and animations

export interface SVGPlantProps {
  level: 0 | 1 | 2 | 3
  animated?: boolean
  size?: number
}

export default function SVGPlant({ level, animated = true, size = 200 }: SVGPlantProps) {
  const viewBoxHeight = 300
  const viewBoxWidth = 200

  // Animation configurations for each level
  const swayAnimations = {
    0: { rotate: [-2, 2, -2], duration: 3 },       // Seed: slight sway
    1: { rotate: [-4, 4, -4], duration: 2.5 },     // Sprout: moderate sway
    2: { rotate: [-6, 6, -6], duration: 2 },       // Growth: stronger sway
    3: { rotate: [-8, 8, -8], duration: 1.5 }      // Bloom: most dynamic
  }

  const sway = swayAnimations[level]

  return (
    <svg
      width={size}
      height={(size * viewBoxHeight) / viewBoxWidth}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>

        <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Glow filter for higher levels */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Flower Pot (always visible) */}
      <g id="pot">
        <path
          d="M50 250 L150 250 L140 280 L60 280 Z"
          fill="url(#potGradient)"
        />
        <rect
          x="50"
          y="280"
          width="100"
          height="20"
          rx="5"
          fill="#6b7280"
        />
        <ellipse
          cx="100"
          cy="250"
          rx="50"
          ry="8"
          fill="#4b5563"
          opacity="0.5"
        />
      </g>

      {/* Plant body - animated based on level */}
      <motion.g
        id="plant-body"
        style={{ transformOrigin: '100px 250px' }}
        animate={animated ? { rotate: sway.rotate } : {}}
        transition={animated ? {
          duration: sway.duration,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
      >
        {/* Level 0: Seed (tiny sprout) */}
        {level === 0 && (
          <g id="seed">
            <ellipse
              cx="100"
              cy="240"
              rx="8"
              ry="12"
              fill="#84cc16"
              opacity="0.8"
            >
              {animated && (
                <animate
                  attributeName="ry"
                  values="12;14;12"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </ellipse>
            <path
              d="M100 240 L98 230 L102 230 Z"
              fill="#22c55e"
            />
          </g>
        )}

        {/* Level 1+: Stem */}
        {level >= 1 && (
          <g id="stem">
            <motion.path
              d="M100 250 Q95 200, 100 150"
              stroke="url(#stemGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </g>
        )}

        {/* Level 1+: Small leaves */}
        {level >= 1 && (
          <g id="small-leaves">
            <motion.ellipse
              cx="80"
              cy="200"
              rx="12"
              ry="20"
              fill="url(#leafGradient)"
              style={{ transformOrigin: '80px 200px' }}
              animate={animated ? { rotate: [-10, 10, -10] } : {}}
              transition={animated ? { duration: 3, repeat: Infinity } : {}}
            />
            <motion.ellipse
              cx="120"
              cy="190"
              rx="12"
              ry="20"
              fill="url(#leafGradient)"
              style={{ transformOrigin: '120px 190px' }}
              animate={animated ? { rotate: [10, -10, 10] } : {}}
              transition={animated ? { duration: 3, repeat: Infinity, delay: 0.5 } : {}}
            />
          </g>
        )}

        {/* Level 2+: More leaves and glow */}
        {level >= 2 && (
          <g id="medium-leaves" filter="url(#glow)">
            <ellipse
              cx="75"
              cy="170"
              rx="15"
              ry="25"
              fill="url(#leafGradient)"
              style={{ transformOrigin: '75px 170px' }}
            >
              {animated && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-15 75 170; 15 75 170; -15 75 170"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
            </ellipse>
            <ellipse
              cx="125"
              cy="165"
              rx="15"
              ry="25"
              fill="url(#leafGradient)"
              style={{ transformOrigin: '125px 165px' }}
            >
              {animated && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="15 125 165; -15 125 165; 15 125 165"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
            </ellipse>

            {/* Golden glow effect */}
            <circle
              cx="100"
              cy="150"
              r="40"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity="0.3"
            >
              {animated && (
                <>
                  <animate
                    attributeName="r"
                    values="40;45;40"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.6;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
          </g>
        )}

        {/* Level 3: Flower bloom with particles */}
        {level === 3 && (
          <g id="flower" filter="url(#glow)">
            {/* Center of flower */}
            <circle cx="100" cy="140" r="12" fill="#fbbf24" />

            {/* Petals (5 petals in a circle) */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={angle}
                cx="100"
                cy="140"
                rx="10"
                ry="18"
                fill="url(#flowerGradient)"
                style={{ transformOrigin: '100px 140px' }}
                transform={`rotate(${angle} 100 140)`}
                opacity="0.9"
              >
                {animated && (
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2s"
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            ))}

            {/* Sparkle particles around flower */}
            {animated && (
              <>
                {[
                  { cx: 85, cy: 130 },
                  { cx: 115, cy: 130 },
                  { cx: 90, cy: 155 },
                  { cx: 110, cy: 155 }
                ].map((pos, i) => (
                  <circle
                    key={`particle-${i}`}
                    cx={pos.cx}
                    cy={pos.cy}
                    r="2"
                    fill="#fbbf24"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur="1.5s"
                      begin={`${i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="r"
                      values="1;3;1"
                      dur="1.5s"
                      begin={`${i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}

            {/* Rainbow glow aura */}
            <circle
              cx="100"
              cy="140"
              r="50"
              fill="none"
              stroke="url(#flowerGradient)"
              strokeWidth="3"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="50;55;50"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.7;0.4"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </motion.g>
    </svg>
  )
}

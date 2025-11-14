'use client'

import { motion } from 'framer-motion'

// SVG Icon library for Garden gaming UI elements

// Water Drop Icon (for like/water button)
export function SVGWaterDrop({ size = 24, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 12c0 4.4 3.6 8 8 8s8-3.6 8-8L12 2z"
        fill="url(#waterGradient)"
        opacity={animated ? 0.8 : 1}
      >
        {animated && (
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <ellipse
        cx="9"
        cy="14"
        rx="2"
        ry="3"
        fill="white"
        opacity="0.3"
      />
    </svg>
  )
}

// Level Badge (0-3 levels)
export function SVGLevelBadge({ level, size = 32 }: { level: 0 | 1 | 2 | 3; size?: number }) {
  const badgeColors = {
    0: { fill: '#9ca3af', stroke: '#6b7280' }, // Gray
    1: { fill: '#10b981', stroke: '#059669' }, // Green
    2: { fill: '#f59e0b', stroke: '#d97706' }, // Amber
    3: { fill: '#ec4899', stroke: '#db2777' }  // Pink
  }

  const color = badgeColors[level]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`badgeGradient-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.fill} />
          <stop offset="100%" stopColor={color.stroke} />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={`url(#badgeGradient-${level})`}
        stroke={color.stroke}
        strokeWidth="2"
      />
      <text
        x="16"
        y="20"
        fontSize="12"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        Lv{level}
      </text>
      {level >= 2 && (
        <circle cx="16" cy="16" r="16" fill="none" stroke={color.fill} strokeWidth="1" opacity="0.5">
          <animate attributeName="r" values="16;18;16" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

// Progress Bar (XP bar)
export function SVGProgressBar({
  progress,
  width = 200,
  height = 8
}: {
  progress: number
  width?: number
  height?: number
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress))
  const filledWidth = (width * clampedProgress) / 100

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width={width} height={height} rx={height / 2} fill="rgba(255,255,255,0.2)" />
      {/* Progress fill */}
      <rect
        width={filledWidth}
        height={height}
        rx={height / 2}
        fill="url(#xpGradient)"
      >
        <animate attributeName="width" to={filledWidth} dur="0.5s" fill="freeze" />
      </rect>
    </svg>
  )
}

// Comment Icon
export function SVGComment({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Share Icon
export function SVGShare({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M15 7a2 2 0 100-4 2 2 0 000 4zM15 17a2 2 0 100-4 2 2 0 000 4zM5 12a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 11l7-4M6.5 9l7 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// New Tag Badge
export function SVGNewTag({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 36">
      <defs>
        <linearGradient id="newTagGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="60" height="36" rx="18" fill="url(#newTagGradient)" />
      <text
        x="30"
        y="23"
        fontSize="14"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        NEW
      </text>
    </svg>
  )
}

// Fire Tag (Hot/Trending)
export function SVGFireTag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <defs>
        <linearGradient id="fireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d="M10 2C8 6 6 8 6 11c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3-2-5-4-9z"
        fill="url(#fireGradient)"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M10 15c-1.1 0-2-.9-2-2 0-1 .5-1.5 1-2.5.5 1 1 1.5 1 2.5 0 1.1-.9 2-2 2z"
        fill="#fbbf24"
        opacity="0.8"
      />
    </svg>
  )
}

// Sparkle Icon (for special effects)
export function SVGSparkle({ size = 16, color = "#fbbf24" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path
        d="M8 0l1.5 5.5L15 8l-5.5 1.5L8 15l-1.5-5.5L1 8l5.5-1.5L8 0z"
        fill={color}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

// Medal Icon (for leaderboard)
export function SVGMedal({ rank, size = 32 }: { rank: 1 | 2 | 3; size?: number }) {
  const colors = {
    1: { fill: '#fbbf24', stroke: '#f59e0b' }, // Gold
    2: { fill: '#d1d5db', stroke: '#9ca3af' }, // Silver
    3: { fill: '#f97316', stroke: '#ea580c' }  // Bronze
  }

  const color = colors[rank]

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 32 38">
      <defs>
        <linearGradient id={`medalGradient-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.fill} />
          <stop offset="100%" stopColor={color.stroke} />
        </linearGradient>
      </defs>
      {/* Ribbon */}
      <path
        d="M11 0L16 10L21 0L21 18L16 15L11 18Z"
        fill={color.fill}
        opacity="0.6"
      />
      {/* Medal circle */}
      <circle
        cx="16"
        cy="26"
        r="10"
        fill={`url(#medalGradient-${rank})`}
        stroke={color.stroke}
        strokeWidth="2"
      />
      {/* Rank number */}
      <text
        x="16"
        y="31"
        fontSize="12"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        {rank}
      </text>
    </svg>
  )
}

// Plant Pot Icon (for stats)
export function SVGPlantPot({ size = 24, color = "#10b981" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Pot */}
      <path
        d="M6 14L8 22H16L18 14H6Z"
        fill="url(#potGradient)"
      />
      {/* Soil */}
      <ellipse cx="12" cy="14" rx="6" ry="2" fill="#8b4513" opacity="0.6" />
      {/* Plant stem */}
      <path
        d="M12 14Q11 10, 12 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <ellipse cx="10" cy="8" rx="3" ry="5" fill={color} opacity="0.8" />
      <ellipse cx="14" cy="8" rx="3" ry="5" fill={color} opacity="0.8" />
    </svg>
  )
}

// Trophy Icon (for achievements)
export function SVGTrophy({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Cup */}
      <path
        d="M7 4v6c0 2.5 2 4 5 4s5-1.5 5-4V4H7z"
        fill="url(#trophyGradient)"
      />
      {/* Handles */}
      <path d="M6 6H4v2c0 1 .5 2 2 2V6z" fill="#fbbf24" opacity="0.8" />
      <path d="M18 6h2v2c0 1-.5 2-2 2V6z" fill="#fbbf24" opacity="0.8" />
      {/* Base */}
      <rect x="10" y="14" width="4" height="4" fill="#f59e0b" />
      <rect x="8" y="18" width="8" height="2" fill="#f59e0b" />
    </svg>
  )
}

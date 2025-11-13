'use client'

interface ChimiiLogoProps {
  className?: string
  width?: number
  height?: number
}

export default function ChimiiLogo({ className = '', width = 120, height = 40 }: ChimiiLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chimii"
    >
      {/* C */}
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8H16C17.1046 8 18 8.89543 18 10C18 11.1046 17.1046 12 16 12H12V28H16C17.1046 28 18 28.8954 18 30C18 31.1046 17.1046 32 16 32H12C9.79086 32 8 30.2091 8 28V12Z"
        className="fill-blue-600 dark:fill-blue-400"
      />

      {/* H */}
      <path
        d="M24 10C24 8.89543 24.8954 8 26 8C27.1046 8 28 8.89543 28 10V18H34V10C34 8.89543 34.8954 8 36 8C37.1046 8 38 8.89543 38 10V30C38 31.1046 37.1046 32 36 32C34.8954 32 34 31.1046 34 30V22H28V30C28 31.1046 27.1046 32 26 32C24.8954 32 24 31.1046 24 30V10Z"
        className="fill-purple-600 dark:fill-purple-400"
      />

      {/* I */}
      <path
        d="M46 10C46 8.89543 46.8954 8 48 8C49.1046 8 50 8.89543 50 10V30C50 31.1046 49.1046 32 48 32C46.8954 32 46 31.1046 46 30V10Z"
        className="fill-blue-600 dark:fill-blue-400"
      />

      {/* M */}
      <path
        d="M56 10C56 8.89543 56.8954 8 58 8C58.7403 8 59.4063 8.40218 59.7518 9.02104L64 16.382L68.2482 9.02104C68.5937 8.40218 69.2597 8 70 8C71.1046 8 72 8.89543 72 10V30C72 31.1046 71.1046 32 70 32C68.8954 32 68 31.1046 68 30V17.236L65.7518 21.979C65.4063 22.5978 64.7403 23 64 23C63.2597 23 62.5937 22.5978 62.2482 21.979L60 17.236V30C60 31.1046 59.1046 32 58 32C56.8954 32 56 31.1046 56 30V10Z"
        className="fill-purple-600 dark:fill-purple-400"
      />

      {/* I */}
      <path
        d="M78 10C78 8.89543 78.8954 8 80 8C81.1046 8 82 8.89543 82 10V30C82 31.1046 81.1046 32 80 32C78.8954 32 78 31.1046 78 30V10Z"
        className="fill-blue-600 dark:fill-blue-400"
      />

      {/* I */}
      <path
        d="M88 10C88 8.89543 88.8954 8 90 8C91.1046 8 92 8.89543 92 10V30C92 31.1046 91.1046 32 90 32C88.8954 32 88 31.1046 88 30V10Z"
        className="fill-purple-600 dark:fill-purple-400"
      />

      {/* Decorative dot accent */}
      <circle
        cx="98"
        cy="10"
        r="3"
        className="fill-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
      />
      <circle
        cx="106"
        cy="20"
        r="2.5"
        className="fill-blue-500 dark:fill-blue-300 opacity-60"
      />
      <circle
        cx="114"
        cy="14"
        r="2"
        className="fill-purple-500 dark:fill-purple-300 opacity-40"
      />
    </svg>
  )
}

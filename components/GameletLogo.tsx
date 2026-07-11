'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'

interface GameletLogoProps {
  className?: string
  width?: number
  height?: number
  clickable?: boolean
  linkClassName?: string
  showBrandName?: boolean
  brandName?: string
  brandNameClassName?: string
}

export default function GameletLogo({
  className = '',
  width = 48,
  height = 48,
  clickable = true,
  linkClassName = '',
  showBrandName = false,
  brandName = 'gamelet.app',
  brandNameClassName = 'text-xl font-semibold text-gray-900 dark:text-white'
}: GameletLogoProps) {
  const logoContent = (
    <div className="flex items-center gap-2">
      <Image
        src="/gamelet-logo.svg"
        alt="Gamelet"
        width={width}
        height={height}
        className={className}
        priority
      />
      {showBrandName && (
        <span className={brandNameClassName}>
          {brandName}
        </span>
      )}
    </div>
  )

  if (!clickable) {
    return logoContent
  }

  return (
    <Link href="/" className={linkClassName}>
      {logoContent}
    </Link>
  )
}

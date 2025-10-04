import React from 'react'
import Image from 'next/image'

const Logo = ({ className, size }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: { width: 40, height: 12 },
    md: { width: 120, height: 36 },
    lg: { width: 160, height: 48 }
  }

  const dimensions = sizeMap[size || 'md']

  return (
    <div className={className}>
      <Image
        src='/Naviora.png'
        alt='Naviora Logo'
        width={dimensions.width}
        height={dimensions.height}
        priority
        className='object-contain'
      />
    </div>
  )
}

export default Logo

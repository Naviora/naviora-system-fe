import React from 'react'

const Logo = ({ className, size }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  return (
    <div className={`text-lg font-bold text-primary ${className} ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : ''}`}>
      Naviora
    </div>
  )
}

export default Logo

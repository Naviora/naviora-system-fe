'use client'

import { useEffect, useState } from 'react'

export function useLiveTime(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, interval)

    return () => {
      window.clearInterval(timer)
    }
  }, [interval])

  return now
}

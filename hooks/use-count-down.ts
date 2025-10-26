import { useEffect, useRef, useState } from "react"

export function useCountdown(initialSeconds: number, onFinish?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true
        onFinish?.()
      }
      return
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft, onFinish])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`
  }

  return { secondsLeft, formatTime }
}
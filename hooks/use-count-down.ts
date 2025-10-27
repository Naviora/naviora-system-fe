import { useEffect, useRef, useState } from "react"

export function useCountdown(
  initialSeconds: number,
  onFinish?: () => void,
  options?: { enabled?: boolean }
) {
  const { enabled = true } = options ?? {}
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    setSecondsLeft(initialSeconds)
  }, [initialSeconds, enabled])

  useEffect(() => {
    if (!enabled) return
    if (secondsLeft <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true
        onFinish?.()
      }
      return
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft, enabled, onFinish])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`
  }

  return { secondsLeft, formatTime }
}
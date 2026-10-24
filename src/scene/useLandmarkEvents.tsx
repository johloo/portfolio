import { useCallback, useEffect, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'

/**
 * Shared hover / click behaviour for every interactive landmark.
 * Ignores clicks that were really drags (so orbiting never opens panels).
 */
export function useLandmarkEvents(onSelect: () => void) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }, [])
  const onPointerOut = useCallback(() => setHovered(false), [])
  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      if (e.delta > 6) return
      onSelect()
    },
    [onSelect],
  )

  return { hovered, handlers: { onPointerOver, onPointerOut, onClick } }
}

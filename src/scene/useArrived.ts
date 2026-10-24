import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ARRIVAL_AT, cameraState } from './cameraState'

/** true once `active` and the camera has (nearly) arrived — drives the detail-scene reveal. */
export function useArrived(active: boolean) {
  const [arrived, setArrived] = useState(false)
  useFrame(() => {
    const next = active && cameraState.progress >= ARRIVAL_AT
    if (next !== arrived) setArrived(next)
  })
  return arrived
}

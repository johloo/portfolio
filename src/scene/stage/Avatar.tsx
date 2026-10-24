import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Box, Ico } from '../details/parts'
import type { V3 } from '../details/parts'

export type AvatarAnim = 'type' | 'wave' | 'point' | 'think' | 'lever' | 'hold' | 'walk' | 'talk'

const SKIN = '#f2c29b'

/** A tiny low-poly "me" that acts out whatever the scene is about. */
export function Avatar({
  anim,
  shirt,
  p = [0, 0, 0],
  ry = 0,
  scale = 1.25,
  reduced,
  interact = false,
}: {
  interact?: boolean
  anim: AvatarAnim
  shirt: string
  p?: V3
  ry?: number
  scale?: number
  reduced: boolean
}) {
  const root = useRef<Group>(null)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const head = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const l = left.current
    const r = right.current
    const h = head.current
    if (!l || !r || !h || !root.current) return
    root.current.position.y = Math.sin(t * 2.2) * 0.012
    let lx = 0.08, lz = 0.12, rx = 0.08, rz = -0.12, hz = 0, hx = 0, hy = 0
    switch (anim) {
      case 'type':
        lx = -1.15 + Math.sin(t * 15) * 0.09
        rx = -1.15 + Math.sin(t * 15 + 2) * 0.09
        lz = 0.12
        rz = -0.12
        hx = 0.12 + Math.sin(t * 1.3) * 0.04
        hy = Math.sin(t * 0.7) * 0.12
        if (interact && !reduced && t % 9 > 6.6) {
          // every few seconds: look over and tap the second monitor
          const k = Math.sin(((t % 9) - 6.6) / 2.4 * Math.PI)
          rx = -1.15 - 0.35 * k
          rz = -0.12 - 0.5 * k
          hy = 0.35 * k
        }
        break
      case 'wave':
        rx = 0
        rz = -(2.6 + Math.sin(t * 6) * 0.4)
        hz = Math.sin(t * 2) * 0.05
        break
      case 'point':
        rx = -1.4
        rz = -0.1 + Math.sin(t * 1.1) * 0.28
        hz = Math.sin(t * 1.1) * 0.06
        break
      case 'think':
        rx = -2.25
        rz = -0.5
        lx = -0.9
        lz = 0.6
        hz = Math.sin(t * 1.4) * 0.12
        hx = 0.08
        break
      case 'lever':
        rx = -0.9 + Math.sin(t * 2.4) * 0.65
        hx = 0.1
        break
      case 'talk':
        rx = -0.55 + Math.sin(t * 3) * 0.35
        rz = -0.4
        lx = -0.35 + Math.sin(t * 2.3 + 1) * 0.3
        lz = 0.35
        hx = Math.sin(t * 5) * 0.05
        hy = Math.sin(t * 1.1) * 0.1
        break
      case 'hold':
        lx = -1.1
        rx = -1.1
        lz = 0.32
        rz = -0.32
        hx = 0.18 + Math.sin(t * 1.2) * 0.05
        break
    }
    if (legL.current && legR.current) {
      const sw = anim === 'walk' && !reduced ? Math.sin(t * 7) * 0.65 : 0
      legL.current.rotation.x = sw
      legR.current.rotation.x = -sw
      if (anim === 'walk') {
        lx = -sw * 0.8
        rx = sw * 0.8
        root.current.position.y = Math.abs(Math.sin(t * 7)) * 0.03
      }
    }
    l.rotation.set(lx, 0, lz)
    r.rotation.set(rx, 0, rz)
    h.rotation.set(hx, hy, hz)
  })

  return (
    <group position={p} rotation={[0, ry, 0]} scale={scale}>
      <group ref={root}>
        {/* legs + shoes */}
        <group ref={legL} position={[-0.1, 0.5, 0]}>
          <Box p={[0, -0.25, 0]} s={[0.15, 0.5, 0.17]} c="#1e293b" />
          <Box p={[0, -0.47, 0.04]} s={[0.16, 0.06, 0.26]} c="#f8fafc" />
        </group>
        <group ref={legR} position={[0.1, 0.5, 0]}>
          <Box p={[0, -0.25, 0]} s={[0.15, 0.5, 0.17]} c="#1e293b" />
          <Box p={[0, -0.47, 0.04]} s={[0.16, 0.06, 0.26]} c="#f8fafc" />
        </group>
        {/* torso */}
        <Box p={[0, 0.76, 0]} s={[0.46, 0.52, 0.26]} c={shirt} />
        <Box p={[0, 0.88, 0.135]} s={[0.2, 0.05, 0.01]} c="#ffffff" e="#ffffff" ei={0.2} />
        {/* arms */}
        <group ref={left} position={[0.3, 0.98, 0]}>
          <Box p={[0, -0.2, 0]} s={[0.12, 0.4, 0.12]} c={shirt} />
          <Ico p={[0, -0.44, 0]} r0={0.07} c={SKIN} />
        </group>
        <group ref={right} position={[-0.3, 0.98, 0]}>
          <Box p={[0, -0.2, 0]} s={[0.12, 0.4, 0.12]} c={shirt} />
          <Ico p={[0, -0.44, 0]} r0={0.07} c={SKIN} />
          {anim === 'hold' && <Box p={[0.1, -0.5, 0.28]} s={[0.34, 0.24, 0.02]} rx={-0.5} c="#0f172a" e="#22d3ee" ei={0.6} />}
        </group>
        {/* head */}
        <group ref={head} position={[0, 1.24, 0]}>
          <Ico r0={0.2} d={1} c={SKIN} />
          <mesh position={[0, 0.07, -0.01]} scale={[1, 0.62, 1.02]}>
            <icosahedronGeometry args={[0.215, 1]} />
            <meshStandardMaterial color="#1f1b2e" flatShading roughness={0.9} />
          </mesh>
          <Box p={[0, 0.1, 0.17]} s={[0.3, 0.07, 0.07]} c="#1f1b2e" />
          <Box p={[-0.075, 0.02, 0.19]} s={[0.1, 0.07, 0.02]} c="#0b1020" e="#67e8f9" ei={0.25} />
          <Box p={[0.075, 0.02, 0.19]} s={[0.1, 0.07, 0.02]} c="#0b1020" e="#67e8f9" ei={0.25} />
          <Box p={[0, 0.025, 0.19]} s={[0.04, 0.012, 0.012]} c="#0b1020" />
          <Box p={[0, -0.08, 0.19]} s={[0.08, 0.016, 0.01]} c="#9a4b3a" />
        </group>
      </group>
    </group>
  )
}

import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

export type V3 = [number, number, number]
export const PI = Math.PI

/**
 * Pops its children in (and out) with a springy scale. The children never
 * receive pointer events, so detail props can't steal clicks from the landmark.
 */
export function Reveal({ show, reduced, children }: { show: boolean; reduced?: boolean; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      o.raycast = () => {}
    })
  }, [])
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const target = show ? 1 : 0
    const s = g.scale.x
    const next = reduced ? target : s + (target - s) * (1 - Math.exp(-7 * dt))
    const v = Math.abs(next - target) < 0.003 ? target : next
    g.scale.setScalar(Math.max(v, 0.0001))
    g.visible = v > 0.004
  })
  return (
    <group ref={ref} scale={0.0001} visible={false}>
      {children}
    </group>
  )
}

/* ── tiny primitive helpers so the models below stay readable ───────────── */
interface MatProps {
  c: string
  e?: string
  ei?: number
  m?: number
  r?: number
  o?: number
}
function Mat({ c, e, ei = 0.6, m = 0, r = 0.7, o }: MatProps) {
  return (
    <meshStandardMaterial
      color={c}
      emissive={e ?? '#000000'}
      emissiveIntensity={e ? ei : 0}
      flatShading
      roughness={r}
      metalness={m}
      transparent={o !== undefined}
      opacity={o ?? 1}
      depthWrite={o === undefined}
    />
  )
}

type Rot = { rx?: number; ry?: number; rz?: number }

export function Box({ p = [0, 0, 0], s, rx = 0, ry = 0, rz = 0, ...mat }: { p?: V3; s: V3 } & Rot & MatProps) {
  return (
    <mesh position={p} rotation={[rx, ry, rz]}>
      <boxGeometry args={s} />
      <Mat {...mat} />
    </mesh>
  )
}

export function Cyl({
  p = [0, 0, 0],
  r0,
  r1,
  h,
  seg = 6,
  open = false,
  rx = 0,
  ry = 0,
  rz = 0,
  ...mat
}: { p?: V3; r0: number; r1?: number; h: number; seg?: number; open?: boolean } & Rot & MatProps) {
  return (
    <mesh position={p} rotation={[rx, ry, rz]}>
      <cylinderGeometry args={[r1 ?? r0, r0, h, seg, 1, open]} />
      <Mat {...mat} />
    </mesh>
  )
}

export function Cone({
  p = [0, 0, 0],
  r0,
  h,
  seg = 5,
  rx = 0,
  ry = 0,
  rz = 0,
  ...mat
}: { p?: V3; r0: number; h: number; seg?: number } & Rot & MatProps) {
  return (
    <mesh position={p} rotation={[rx, ry, rz]}>
      <coneGeometry args={[r0, h, seg]} />
      <Mat {...mat} />
    </mesh>
  )
}

export function Ico({ p = [0, 0, 0], r0, d = 0, ...mat }: { p?: V3; r0: number; d?: number } & MatProps) {
  return (
    <mesh position={p}>
      <icosahedronGeometry args={[r0, d]} />
      <Mat {...mat} />
    </mesh>
  )
}

/** Unlit, always-bright shape used for lights and glowing details. */
export function Glow({ p = [0, 0, 0], r0, c, d = 0 }: { p?: V3; r0: number; c: string; d?: number }) {
  return (
    <mesh position={p}>
      <icosahedronGeometry args={[r0, d]} />
      <meshBasicMaterial color={c} toneMapped={false} />
    </mesh>
  )
}

export function Torus({
  p = [0, 0, 0],
  r0,
  t,
  c,
  rx = PI / 2,
  opacity = 1,
}: {
  p?: V3
  r0: number
  t: number
  c: string
  rx?: number
  opacity?: number
}) {
  return (
    <mesh position={p} rotation={[rx, 0, 0]}>
      <torusGeometry args={[r0, t, 6, 40]} />
      <meshBasicMaterial color={c} transparent={opacity < 1} opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

/** Flat glowing strip on the ground between two points (x/z only). */
export function Strip({ from, to, y = 0.012, t = 0.012, c }: { from: [number, number]; to: [number, number]; y?: number; t?: number; c: string }) {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const len = Math.hypot(dx, dz)
  return (
    <mesh position={[(from[0] + to[0]) / 2, y, (from[1] + to[1]) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}>
      <boxGeometry args={[len, 0.006, t]} />
      <meshBasicMaterial color={c} toneMapped={false} />
    </mesh>
  )
}

/* ── motion helpers ─────────────────────────────────────────────────────── */
export function Spin({
  speed = 0.8,
  p = [0, 0, 0],
  reduced,
  axis = 'y',
  children,
}: {
  speed?: number
  p?: V3
  reduced: boolean
  axis?: 'x' | 'y' | 'z'
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current && !reduced) ref.current.rotation[axis] += speed * dt
  })
  return (
    <group ref={ref} position={p}>
      {children}
    </group>
  )
}

export function Bob({
  p,
  amp = 0.03,
  speed = 1.6,
  reduced,
  children,
}: {
  p: V3
  amp?: number
  speed?: number
  reduced: boolean
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = p[1] + (reduced ? 0 : Math.sin(clock.elapsedTime * speed) * amp)
  })
  return (
    <group ref={ref} position={p}>
      {children}
    </group>
  )
}

export function Blink({ p, c, r0 = 0.012, phase = 0 }: { p: V3; c: string; r0?: number; phase?: number }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    ref.current?.scale.setScalar(0.55 + 0.7 * Math.max(0, Math.sin(clock.elapsedTime * 3 + phase)))
  })
  return (
    <mesh ref={ref} position={p}>
      <icosahedronGeometry args={[r0, 0]} />
      <meshBasicMaterial color={c} toneMapped={false} />
    </mesh>
  )
}

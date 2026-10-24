import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  SRGBColorSpace,
} from 'three'
import type {
  AmbientLight,
  DirectionalLight,
  Group,
  HemisphereLight,
  MeshBasicMaterial,
  PointLight,
  Points,
  PointsMaterial,
  SpriteMaterial,
} from 'three'
import { mulberry32 } from './noise'
import { ORBIT_TILT } from './layout'
import { mix, themeState } from './themeState'
import type { Theme } from './themeState'
import type { Quality } from './quality'

/** Soft radial glow texture, generated once — no image assets needed. */
function makeGlowTexture(color: string) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, color)
  g.addColorStop(0.35, color.replace(/[\d.]+\)$/, '0.35)'))
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/* ── Night sky: stars (fade out by day) ─────────────────────────────────── */
function StarLayer({
  count,
  size,
  seed,
  reducedMotion,
}: {
  count: number
  size: number
  seed: number
  reducedMotion: boolean
}) {
  const ref = useRef<Points>(null)
  const geometry = useMemo(() => {
    const r = mulberry32(seed)
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1
      const t = r() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const rad = 70 + r() * 35
      a[i * 3] = s * Math.cos(t) * rad
      a[i * 3 + 1] = u * rad
      a[i * 3 + 2] = s * Math.sin(t) * rad
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(a, 3))
    return g
  }, [count, seed])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, dt) => {
    const p = ref.current
    if (!p) return
    const n = themeState.value
    p.visible = n > 0.01
    ;(p.material as PointsMaterial).opacity = n
    if (!reducedMotion) p.rotation.y += dt * 0.003
  })

  return (
    <points ref={ref} geometry={geometry} raycast={() => null}>
      <pointsMaterial color="#ffffff" size={size} sizeAttenuation={false} transparent depthWrite={false} toneMapped={false} />
    </points>
  )
}

/* ── Nebula glows (night only) ──────────────────────────────────────────── */
const NEBULAE: { tex: 'violet' | 'teal' | 'blue'; pos: [number, number, number]; scale: number; op: number }[] = [
  { tex: 'violet', pos: [-16, 7, -26], scale: 34, op: 0.55 },
  { tex: 'teal', pos: [18, -7, -30], scale: 38, op: 0.4 },
  { tex: 'blue', pos: [2, 13, -34], scale: 40, op: 0.35 },
  { tex: 'violet', pos: [20, 9, -24], scale: 22, op: 0.28 },
]

function Nebulae() {
  const textures = useMemo(
    () => ({
      violet: makeGlowTexture('rgba(139,92,246,0.55)'),
      teal: makeGlowTexture('rgba(20,184,166,0.45)'),
      blue: makeGlowTexture('rgba(56,130,246,0.4)'),
    }),
    [],
  )
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures])

  const mats = useRef<(SpriteMaterial | null)[]>([])
  useFrame(() => {
    const n = themeState.value
    NEBULAE.forEach((item, i) => {
      const m = mats.current[i]
      if (m) m.opacity = item.op * n
    })
  })

  return (
    <group>
      {NEBULAE.map((n, i) => (
        <sprite key={i} position={n.pos} scale={[n.scale, n.scale, 1]} raycast={() => null}>
          <spriteMaterial
            ref={(el) => void (mats.current[i] = el)}
            map={textures[n.tex]}
            transparent
            opacity={n.op}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
}

/* ── Orbit rings (cyan/violet by night, white by day) ───────────────────── */
function Ring({ radius, tube, night, opacity }: { radius: number; tube: number; night: string; opacity: number }) {
  const mat = useRef<MeshBasicMaterial>(null)
  const colors = useMemo(() => ({ night: new Color(night), day: new Color('#ffffff') }), [night])
  useFrame(() => {
    const m = mat.current
    if (!m) return
    const n = themeState.value
    m.color.lerpColors(colors.day, colors.night, n)
    m.opacity = opacity * mix(1.25, 1, n)
  })
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
      <torusGeometry args={[radius, tube, 6, 180]} />
      <meshBasicMaterial ref={mat} color={night} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

function OrbitRings({ reducedMotion }: { reducedMotion: boolean }) {
  const outer = useRef<Group>(null)
  useFrame((_, dt) => {
    if (outer.current && !reducedMotion) outer.current.rotation.y += dt * 0.02
  })
  return (
    <group>
      <group rotation={ORBIT_TILT}>
        <Ring radius={3.3} tube={0.006} night="#67e8f9" opacity={0.4} />
      </group>
      <group ref={outer} rotation={[-0.35, 0, 0.5]}>
        <Ring radius={4.5} tube={0.005} night="#a78bfa" opacity={0.28} />
      </group>
      <group rotation={[0.9, 0, -0.7]}>
        <Ring radius={5.4} tube={0.004} night="#2dd4bf" opacity={0.18} />
      </group>
    </group>
  )
}

/* ── Sun by day, moon by night ──────────────────────────────────────────── */
function SunMoon({ reducedMotion }: { reducedMotion: boolean }) {
  const sun = useRef<Group>(null)
  const moon = useRef<Group>(null)
  const spin = useRef<Group>(null)

  useFrame(({ clock }) => {
    const n = themeState.value
    if (sun.current) {
      sun.current.visible = n < 0.995
      sun.current.scale.setScalar(Math.max(0.0001, 1 - n))
    }
    if (moon.current) {
      moon.current.visible = n > 0.005
      moon.current.scale.setScalar(Math.max(0.0001, n))
    }
    if (spin.current && !reducedMotion) spin.current.rotation.y = clock.elapsedTime * 0.15
  })

  return (
    <group position={[-11, 5.5, -7]}>
      <group ref={sun}>
        <group ref={spin}>
          <mesh raycast={() => null}>
            <icosahedronGeometry args={[0.8, 1]} />
            <meshBasicMaterial color="#ffd23f" toneMapped={false} />
          </mesh>
        </group>
        <mesh scale={2.1} raycast={() => null}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshBasicMaterial color="#ffd166" transparent opacity={0.16} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <group ref={moon}>
        <mesh raycast={() => null}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial color="#e6ecff" toneMapped={false} />
        </mesh>
        {(
          [
            [0.2, 0.15, 0.62, 0.17],
            [-0.2, -0.22, 0.63, 0.12],
            [0.34, -0.16, 0.56, 0.1],
          ] as const
        ).map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]} scale={s} raycast={() => null}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#b9c3e6" toneMapped={false} />
          </mesh>
        ))}
        <mesh scale={2.2} raycast={() => null}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial color="#9db8ff" transparent opacity={0.1} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/* ── Lighting rig that crossfades between sun and moonlight ─────────────── */
const DAY = {
  key: new Color('#fff4dc'),
  sky: new Color('#d3ebff'),
  ground: new Color('#86b36a'),
  amb: new Color('#ffffff'),
}
const NIGHT = {
  key: new Color('#b7c9ff'),
  sky: new Color('#6f8bd8'),
  ground: new Color('#2a1a5e'),
  amb: new Color('#9fb4ff'),
}

function Lighting() {
  const key = useRef<DirectionalLight>(null)
  const hemi = useRef<HemisphereLight>(null)
  const amb = useRef<AmbientLight>(null)
  const rimA = useRef<PointLight>(null)
  const rimB = useRef<PointLight>(null)

  useFrame(() => {
    const n = themeState.value
    if (key.current) {
      key.current.intensity = mix(3.2, 2.2, n)
      key.current.color.lerpColors(DAY.key, NIGHT.key, n)
    }
    if (hemi.current) {
      hemi.current.intensity = mix(1.25, 0.9, n)
      hemi.current.color.lerpColors(DAY.sky, NIGHT.sky, n)
      hemi.current.groundColor.lerpColors(DAY.ground, NIGHT.ground, n)
    }
    if (amb.current) {
      amb.current.intensity = mix(0.6, 0.45, n)
      amb.current.color.lerpColors(DAY.amb, NIGHT.amb, n)
    }
    if (rimA.current) rimA.current.intensity = mix(4, 28, n)
    if (rimB.current) rimB.current.intensity = mix(2, 14, n)
  })

  return (
    <>
      <directionalLight ref={key} position={[-6, 7, 9]} intensity={2.2} color="#b7c9ff" />
      <hemisphereLight ref={hemi} args={['#6f8bd8', '#2a1a5e', 0.9]} />
      <ambientLight ref={amb} intensity={0.45} color="#9fb4ff" />
      <pointLight ref={rimA} position={[7, -2, 6]} intensity={28} color="#4fd8ff" distance={0} decay={2} />
      <pointLight ref={rimB} position={[-4, -5, 6]} intensity={14} color="#8b5cf6" distance={0} decay={2} />
    </>
  )
}

export function SpaceEnvironment({
  quality,
  reducedMotion,
  theme,
}: {
  quality: Quality
  reducedMotion: boolean
  theme: Theme
}) {
  const night = theme === 'night'
  return (
    <>
      <StarLayer count={quality.stars} size={1.5} seed={3} reducedMotion={reducedMotion} />
      <StarLayer count={Math.round(quality.stars * 0.08)} size={2.6} seed={9} reducedMotion={reducedMotion} />
      <Nebulae />
      <OrbitRings reducedMotion={reducedMotion} />
      <SunMoon reducedMotion={reducedMotion} />
      <Lighting />
      {!reducedMotion && (
        <Sparkles
          key={theme}
          count={night ? quality.sparkles : Math.round(quality.sparkles * 0.6)}
          scale={[15, 9, 15]}
          size={night ? 2.4 : 3}
          speed={0.25}
          opacity={night ? 0.6 : 0.55}
          color={night ? '#9be7ff' : '#ffffff'}
        />
      )}
    </>
  )
}

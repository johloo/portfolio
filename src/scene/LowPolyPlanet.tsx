import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  Color,
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  ShaderMaterial,
  Vector3,
} from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { PLANET_RADIUS } from './layout'
import { buildTerrainGeometry, scatterOnLand } from './terrain'
import type { Scatter } from './terrain'
import { mulberry32 } from './noise'
import type { Quality } from './quality'
import { mix, themeState } from './themeState'

const UP = new Vector3(0, 1, 0)
const dummy = new Object3D()

/** Stops pointer events from reaching landmarks hidden behind the planet. */
const block = {
  onPointerOver: (e: ThreeEvent<PointerEvent>) => e.stopPropagation(),
  onPointerMove: (e: ThreeEvent<PointerEvent>) => e.stopPropagation(),
  onClick: (e: ThreeEvent<MouseEvent>) => e.stopPropagation(),
}

/* ── Instanced scatter helper ───────────────────────────────────────────── */
function useInstances(
  ref: React.RefObject<InstancedMesh | null>,
  items: Scatter[],
  lift: number,
  scaleMul = 1,
) {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    items.forEach((it, i) => {
      dummy.position.copy(it.position).addScaledVector(it.normal, lift * it.scale * scaleMul)
      dummy.quaternion.setFromUnitVectors(UP, it.normal)
      dummy.rotateY(it.yaw)
      dummy.scale.setScalar(it.scale * scaleMul)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [ref, items, lift, scaleMul])
}

function Forest({ count }: { count: number }) {
  const trees = useMemo(() => scatterOnLand(count, 21, [0.06, 0.42], 0.24), [count])
  const trunks = useRef<InstancedMesh>(null)
  const crowns = useRef<InstancedMesh>(null)
  const tops = useRef<InstancedMesh>(null)
  useInstances(trunks, trees, 0.03)
  useInstances(crowns, trees, 0.1)
  useInstances(tops, trees, 0.17)
  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.008, 0.011, 0.06, 5]} />
        <meshStandardMaterial color="#6b4a2f" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <coneGeometry args={[0.052, 0.13, 5]} />
        <meshStandardMaterial color="#2f9e57" flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={tops} args={[undefined, undefined, trees.length]}>
        <coneGeometry args={[0.038, 0.1, 5]} />
        <meshStandardMaterial color="#3fbf68" flatShading roughness={0.9} />
      </instancedMesh>
    </group>
  )
}

function Village({ count }: { count: number }) {
  const houses = useMemo(() => scatterOnLand(count, 77, [0.05, 0.26], 0.28), [count])
  const walls = useRef<InstancedMesh>(null)
  const roofs = useRef<InstancedMesh>(null)
  useInstances(walls, houses, 0.026, 0.9)
  useInstances(roofs, houses, 0.075, 0.9)
  const wallMat = useRef<MeshStandardMaterial>(null)
  useFrame(() => {
    if (wallMat.current) wallMat.current.emissiveIntensity = themeState.value * 0.95
  })
  return (
    <group>
      <instancedMesh ref={walls} args={[undefined, undefined, houses.length]}>
        <boxGeometry args={[0.07, 0.052, 0.07]} />
        <meshStandardMaterial ref={wallMat} color="#f1f5ff" emissive="#ffc857" emissiveIntensity={0} flatShading roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, houses.length]}>
        <coneGeometry args={[0.058, 0.05, 4]} />
        <meshStandardMaterial color="#ff6b6b" flatShading roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

/* ── Drifting clouds ────────────────────────────────────────────────────── */
function Clouds({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const pivots = useRef<(Group | null)[]>([])
  const data = useMemo(() => {
    const r = mulberry32(99)
    return Array.from({ length: count }, () => ({
      tilt: [(r() - 0.5) * 2.4, r() * Math.PI * 2, (r() - 0.5) * 2.4] as [number, number, number],
      phase: r() * Math.PI * 2,
      speed: (0.02 + r() * 0.035) * (r() < 0.5 ? -1 : 1),
      radius: 2.72 + r() * 0.5,
      scale: 0.75 + r() * 0.65,
    }))
  }, [count])

  const mat = useMemo(
    () => new MeshStandardMaterial({ color: '#ffffff', emissive: '#7f92d6', emissiveIntensity: 0.18, flatShading: true, roughness: 1 }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])
  const dayCol = useMemo(() => new Color('#ffffff'), [])
  const nightCol = useMemo(() => new Color('#b4bfe8'), [])

  useFrame((_, dt) => {
    const n = themeState.value
    mat.color.lerpColors(dayCol, nightCol, n)
    mat.emissiveIntensity = mix(0.04, 0.2, n)
    if (reducedMotion) return
    pivots.current.forEach((g, i) => {
      if (g) g.rotation.y += data[i].speed * dt
    })
  })

  return (
    <group>
      {data.map((c, i) => (
        <group key={i} rotation={c.tilt}>
          <group ref={(el) => void (pivots.current[i] = el)} rotation={[0, c.phase, 0]}>
            <group position={[c.radius, 0, 0]} scale={c.scale}>
              <mesh>
                <icosahedronGeometry args={[0.2, 1]} />
                <primitive object={mat} attach="material" />
              </mesh>
              <mesh position={[0.2, -0.03, 0.05]}>
                <icosahedronGeometry args={[0.14, 1]} />
                <primitive object={mat} attach="material" />
              </mesh>
              <mesh position={[-0.17, -0.02, -0.04]}>
                <icosahedronGeometry args={[0.12, 1]} />
                <primitive object={mat} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  )
}

/* ── Atmosphere glow ────────────────────────────────────────────────────── */
function Atmosphere() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uColor: { value: new Color('#40ccff') }, uStrength: { value: 1.6 } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec3 vNormal;
          void main() {
            float i = pow(max(0.0, 0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.2);
            gl_FragColor = vec4(uColor, 1.0) * i * uStrength;
          }`,
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])
  const dayGlow = useMemo(() => new Color('#9fe0ff'), [])
  const nightGlow = useMemo(() => new Color('#40ccff'), [])
  useFrame(() => {
    const n = themeState.value
    ;(material.uniforms.uColor.value as Color).lerpColors(dayGlow, nightGlow, n)
    material.uniforms.uStrength.value = mix(1.0, 1.6, n)
  })
  return (
    <mesh scale={1.17} raycast={() => null}>
      <sphereGeometry args={[PLANET_RADIUS, 48, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

/* ── The planet ─────────────────────────────────────────────────────────── */
export function LowPolyPlanet({
  quality,
  reducedMotion,
}: {
  quality: Quality
  reducedMotion: boolean
}) {
  const terrain = useMemo(() => buildTerrainGeometry(quality.terrainDetail), [quality.terrainDetail])
  useEffect(() => () => terrain.dispose(), [terrain])

  return (
    <group>
      {/* Land: per-face vertex colours */}
      <mesh geometry={terrain} {...block}>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>

      {/* Sea: translucent faceted shell */}
      <mesh {...block}>
        <icosahedronGeometry args={[PLANET_RADIUS, quality.waterDetail]} />
        <meshStandardMaterial
          color="#52b0f2"
          emissive="#0f4d94"
          emissiveIntensity={0.5}
          flatShading
          transparent
          opacity={0.9}
          roughness={0.32}
          metalness={0.15}
        />
      </mesh>

      <Forest count={quality.trees} />
      <Village count={quality.houses} />
      <Clouds count={quality.clouds} reducedMotion={reducedMotion} />
      <Atmosphere />
    </group>
  )
}

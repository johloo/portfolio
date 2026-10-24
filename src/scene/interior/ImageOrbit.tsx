import { Suspense, useRef } from 'react'
import { galleryBus } from '../sceneBus'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { DoubleSide, SRGBColorSpace } from 'three'
import type { Group } from 'three'
import type { Project } from '../../data/portfolio'
import { imagesFor } from '../../data/projectImages'
import { Box, PI } from '../details/parts'

const H = 1.6
const MIN_FRAMES = 5

function Placeholder({ accent, n }: { accent: string; n: number }) {
  return (
    <group>
      <Box s={[H * 1.5, H, 0.05]} c="#0f1a36" e={accent} ei={0.18} />
      <Box p={[0, 0, 0.03]} s={[H * 1.5 - 0.2, H - 0.2, 0.01]} c="#16224a" />
      {/* tiny "picture" glyph: sun + hills */}
      <mesh position={[-0.35, 0.3, 0.045]}>
        <circleGeometry args={[0.13, 8]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh position={[-0.2, -0.22, 0.045]}>
        <coneGeometry args={[0.45, 0.5, 3]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.3, -0.27, 0.045]}>
        <coneGeometry args={[0.3, 0.38, 3]} />
        <meshBasicMaterial color="#8da2d8" toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <Box p={[0, -H / 2 + 0.11, 0.045]} s={[0.12 * n, 0.04, 0.005]} c={accent} e={accent} ei={0.8} />
    </group>
  )
}

function Picture({ src, accent }: { src: string; accent: string }) {
  const tex = useTexture(src)
  tex.colorSpace = SRGBColorSpace
  const img = tex.image as { width: number; height: number } | undefined
  const aspect = img && img.height ? Math.min(2.2, Math.max(0.6, img.width / img.height)) : 1.5
  const w = H * aspect
  return (
    <group>
      <Box s={[w + 0.14, H + 0.14, 0.05]} c="#0b1220" e={accent} ei={0.25} />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[w, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={DoubleSide} />
      </mesh>
    </group>
  )
}

/**
 * Frames slowly orbiting the project. Real images (src/assets/projects/<id>/) are shown as they are
 * added; the remaining slots stay as clearly-empty placeholder frames.
 */
export function ImageOrbit({ project, reduced, radius = 6.4, y = 4.3 }: { project: Project; reduced: boolean; radius?: number; y?: number }) {
  const images = imagesFor(project)
  const count = Math.max(MIN_FRAMES, images.length)
  const ring = useRef<Group>(null)
  const hover = useRef(false)
  useFrame((_, dt) => {
    if (ring.current && !reduced && !hover.current) ring.current.rotation.y += Math.min(dt, 0.05) * 0.18
  })
  return (
    <group ref={ring} position={[0, y, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * PI * 2
        const img = images[i]
        return (
          <group
            key={i}
            position={[Math.sin(a) * radius, (i % 2) * 0.45, Math.cos(a) * radius]}
            rotation={[0, a, 0]}
            onClick={(e) => {
              if (e.delta > 6) return
              e.stopPropagation()
              galleryBus.open(project.id, img ? i : 0)
            }}
            onPointerOver={() => {
              hover.current = true
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              hover.current = false
              document.body.style.cursor = ''
            }}
          >
            {img ? (
              <Suspense fallback={<Placeholder accent={project.accent} n={i + 1} />}>
                <Picture src={img.src} accent={project.accent} />
              </Suspense>
            ) : (
              <Placeholder accent={project.accent} n={i + 1} />
            )}
          </group>
        )
      })}
    </group>
  )
}

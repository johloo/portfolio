import { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerformanceMonitor, useProgress } from '@react-three/drei'
import type { SectionId } from '../data/portfolio'
import { CameraController } from './CameraController'
import { LowPolyPlanet } from './LowPolyPlanet'
import { OrbitingLandmarks } from './OrbitingLandmarks'
import { SpaceEnvironment } from './SpaceEnvironment'
import { QUALITY } from './quality'
import { InteriorWorld } from './interior/InteriorWorld'
import { interiorFocus } from './interior/focus'
import { themeState } from './themeState'
import type { Theme } from './themeState'
import type { SceneInteraction } from './types'

export interface PlanetSceneProps {
  view: 'hero' | 'explore'
  section: SectionId | null
  projectId: string | null
  skillId: string | null
  experienceId: string | null
  resetNonce: number
  panelOpen: boolean
  isCompact: boolean
  reducedMotion: boolean
  theme: Theme
  onSelectSection: (id: SectionId) => void
  onSelectProject: (id: string) => void
  onSelectSkill: (id: string) => void
  onSelectExperience: (id: string) => void
  onReady: () => void
  onProgress?: (percent: number) => void
}

function ProgressReporter({ onProgress }: { onProgress?: (p: number) => void }) {
  const { progress, active } = useProgress()
  useEffect(() => {
    onProgress?.(active ? progress : 100)
  }, [progress, active, onProgress])
  return null
}

/** Smoothly animates the shared day/night factor toward the chosen theme. */
function ThemeDriver({ theme, reducedMotion }: { theme: Theme; reducedMotion: boolean }) {
  const target = theme === 'night' ? 1 : 0
  // Start in the right state so there is no flash on first render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => void (themeState.value = target), [])
  useFrame((_, dt) => {
    const v = themeState.value
    if (reducedMotion) {
      themeState.value = target
      return
    }
    const next = v + (target - v) * (1 - Math.exp(-3.5 * dt))
    themeState.value = Math.abs(next - target) < 0.002 ? target : next
  })
  return null
}

/** The interactive 3D universe. Lazy-loaded so the first paint stays fast. */
export default function PlanetScene(props: PlanetSceneProps) {
  const quality = props.isCompact ? QUALITY.low : QUALITY.high
  const [dpr, setDpr] = useState<[number, number]>(quality.dpr)
  useEffect(() => setDpr(quality.dpr), [quality])

  const ui: SceneInteraction = {
    section: props.section,
    projectId: props.projectId,
    skillId: props.skillId,
    experienceId: props.experienceId,
    reducedMotion: props.reducedMotion,
    onSelectSection: props.onSelectSection,
    onSelectProject: props.onSelectProject,
    onSelectSkill: props.onSelectSkill,
    onSelectExperience: props.onSelectExperience,
  }

  return (
    <Canvas
      flat
      dpr={dpr}
      camera={{ fov: quality.fov, near: 0.1, far: 220, position: [0, 1.5, 9.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => props.onReady()}
      aria-label="Interactive low-poly planet. Use the navigation menu to reach every section."
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
      <ThemeDriver theme={props.theme} reducedMotion={props.reducedMotion} />
      <ProgressReporter onProgress={props.onProgress} />
      <Suspense fallback={null}>
        <SpaceEnvironment quality={quality} reducedMotion={props.reducedMotion} theme={props.theme} />
        <LowPolyPlanet quality={quality} reducedMotion={props.reducedMotion} />
        <OrbitingLandmarks ui={ui} />
        <InteriorWorld
          focus={props.view === 'hero' ? null : interiorFocus(props.section, props.projectId, props.experienceId)}
          skillId={props.skillId}
          onSelectSkill={props.onSelectSkill}
          reduced={props.reducedMotion}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minDistance={1.2}
        maxDistance={18}
        autoRotate
      />
      <CameraController
        view={props.view}
        section={props.section}
        projectId={props.projectId}
        skillId={props.skillId}
        experienceId={props.experienceId}
        resetNonce={props.resetNonce}
        panelOpen={props.panelOpen}
        isCompact={props.isCompact}
        reducedMotion={props.reducedMotion}
        fov={quality.fov}
      />
    </Canvas>
  )
}

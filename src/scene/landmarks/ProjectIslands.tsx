import { useMemo, useRef } from 'react'
import type { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { portfolio } from '../../data/portfolio'
import { PLATEAU_RADIUS, alignToNormal, facingCameraRy, plotDirs } from '../layout'
import { InteractiveMarker } from '../InteractiveMarker'
import { Tooltip } from '../Tooltip'
import { useLandmarkEvents } from '../useLandmarkEvents'
import { Reveal } from '../details/parts'
import { useArrived } from '../useArrived'
import { ProjectScene } from '../stage/scenes'
import { ProjectDetail } from '../details/ProjectDetails'
import type { SceneInteraction } from '../types'

/* ── Distinct scenery for each island ───────────────────────────────────── */

/** Payroll → office block, coin stack, floating coin. */
function PayrollScenery({ accent, reducedMotion }: { accent: string; reducedMotion: boolean }) {
  const coin = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (coin.current && !reducedMotion) {
      coin.current.rotation.y = clock.elapsedTime * 1.6
      coin.current.position.y = 0.52 + Math.sin(clock.elapsedTime * 2) * 0.03
    }
  })
  return (
    <group>
      <mesh position={[-0.14, 0.2, -0.04]}>
        <boxGeometry args={[0.2, 0.28, 0.2]} />
        <meshStandardMaterial color="#dbe4ff" flatShading roughness={0.6} />
      </mesh>
      <mesh position={[-0.14, 0.36, -0.04]}>
        <boxGeometry args={[0.22, 0.03, 0.22]} />
        <meshStandardMaterial color="#334e8c" flatShading />
      </mesh>
      {[0.14, 0.2, 0.26].map((y, i) => (
        <mesh key={i} position={[-0.14, y, 0.063]}>
          <boxGeometry args={[0.15, 0.025, 0.004]} />
          <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.17, 0.1 + i * 0.045, 0.06]}>
          <cylinderGeometry args={[0.07, 0.07, 0.035, 10]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} flatShading metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      <mesh ref={coin} position={[0.17, 0.52, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.018, 10]} />
        <meshStandardMaterial color="#fde68a" emissive={accent} emissiveIntensity={0.4} flatShading metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

/** Supplements → bottles and greenery. */
function SupplementsScenery({ accent }: { accent: string }) {
  return (
    <group>
      {[
        { x: -0.1, s: 1 },
        { x: 0.12, s: 0.78 },
      ].map(({ x, s }, i) => (
        <group key={i} position={[x, 0.06, 0.02]} scale={s}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.28, 10]} />
            <meshStandardMaterial color="#f4f7ff" flatShading roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.079, 0.079, 0.11, 10]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} flatShading />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.058, 0.058, 0.05, 10]} />
            <meshStandardMaterial color="#1f2a44" flatShading />
          </mesh>
        </group>
      ))}
      {[
        [-0.28, 0.1],
        [0.3, -0.1],
        [0.05, -0.26],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]}>
          <coneGeometry args={[0.07, 0.2, 5]} />
          <meshStandardMaterial color="#2f9e57" flatShading roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/** Sheets → grid of cells rising into a bar chart. */
function SheetsScenery({ accent }: { accent: string }) {
  const heights = [0.12, 0.22, 0.16, 0.3, 0.2, 0.36, 0.14, 0.26, 0.18, 0.32, 0.1, 0.24]
  return (
    <group>
      {heights.map((h, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        return (
          <mesh key={i} position={[(col - 1.5) * 0.115, 0.06 + h / 2, (row - 1) * 0.115]}>
            <boxGeometry args={[0.095, h, 0.095]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? accent : '#e8fff1'}
              emissive={i % 3 === 0 ? accent : '#000000'}
              emissiveIntensity={0.25}
              flatShading
              roughness={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/** UGC → fanned content cards and a play button. */
function UgcScenery({ accent, reducedMotion }: { accent: string; reducedMotion: boolean }) {
  const play = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (play.current && !reducedMotion) play.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.12 - Math.PI / 2
  })
  const cards = [
    { x: -0.2, r: 0.35, c: '#c4b5fd' },
    { x: 0, r: 0, c: accent },
    { x: 0.2, r: -0.35, c: '#7dd3fc' },
  ]
  return (
    <group>
      {cards.map((c, i) => (
        <group key={i} position={[c.x, 0.22, 0]} rotation={[0, 0, c.r]}>
          <mesh>
            <boxGeometry args={[0.15, 0.26, 0.018]} />
            <meshStandardMaterial color="#f4f1ff" flatShading roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.045, 0.011]}>
            <boxGeometry args={[0.12, 0.13, 0.004]} />
            <meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={0.3} flatShading />
          </mesh>
        </group>
      ))}
      <mesh ref={play} position={[0, 0.2, 0.07]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.07, 3]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Warehouse / factory / workshop islands reuse the detailed miniatures, scaled to the plateau. */
const miniature = (variant: number) =>
  function Miniature({ accent, reducedMotion }: { accent: string; reducedMotion: boolean }) {
    return (
      <group scale={0.66} position={[0.02, 0, 0]}>
        <ProjectDetail index={variant} accent={accent} reduced={reducedMotion} />
      </group>
    )
  }
const SCENERY = [PayrollScenery, SupplementsScenery, SheetsScenery, UgcScenery, miniature(4), miniature(5), miniature(6)]
const GROUND_TINT = ['#69c872', '#7ad06a', '#5fc782', '#7bbf7b', '#7fb9b4', '#b9a47c', '#6cc08f']

/* ── A single island, sitting on the planet's surface ───────────────────── */
function Island({
  index,
  dir,
  title,
  accent,
  active,
  onSelect,
  reducedMotion,
}: {
  index: number
  dir: Vector3
  title: string
  accent: string
  active: boolean
  onSelect: () => void
  reducedMotion: boolean
}) {
  const { hovered, handlers } = useLandmarkEvents(onSelect)
  const Scenery = SCENERY[index % SCENERY.length]
  const position = useMemo(() => dir.clone().multiplyScalar(PLATEAU_RADIUS - 0.012), [dir])
  const quaternion = useMemo(() => alignToNormal(dir), [dir])
  const arrived = useArrived(active)
  const ry = useMemo(() => facingCameraRy(dir), [dir])

  return (
    <group position={position} quaternion={quaternion} scale={0.88} {...handlers}>
      {/* Grass cap that sits on the island plateau */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.46, 0.5, 0.1, 7]} />
        <meshStandardMaterial color={GROUND_TINT[index % GROUND_TINT.length]} flatShading roughness={0.9} />
      </mesh>
      {/* Accent rim */}
      <mesh position={[0, 0.082, 0]} rotation={[Math.PI / 2, 0, Math.PI / 7]}>
        <torusGeometry args={[0.47, 0.007, 5, 7]} />
        <meshBasicMaterial color={active || hovered ? '#ffffff' : accent} toneMapped={false} />
      </mesh>

      <group position={[0, 0.08, 0]}>
        <group visible={!arrived}>
          <Scenery accent={accent} reducedMotion={reducedMotion} />
        </group>
        <Reveal show={arrived} reduced={reducedMotion}>
          <group rotation={[0, ry, 0]} scale={0.27}>
            <ProjectScene index={index} accent={accent} reduced={reducedMotion} />
          </group>
        </Reveal>
      </group>

      {active && (
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.66, 0.012, 6, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      )}

      {!active && <InteractiveMarker
        position={[0, active ? 1.2 : 0.78, 0]}
        size={0.75}
        color={accent}
        active={active}
        hovered={hovered}
        reducedMotion={reducedMotion}
      />}
      {(hovered || active) && <Tooltip title={title} subtitle="Project island" position={[0, active ? 1.5 : 1.08, 0]} />}
    </group>
  )
}

/** Projects → one island per project, each on its own patch of the planet. */
export function ProjectIslands({ ui }: { ui: SceneInteraction }) {
  const projects = portfolio.projects
  const dirs = useMemo(() => plotDirs(projects.length), [projects.length])
  return (
    <group>
      {projects.map((p, i) => (
        <Island
          key={p.id}
          index={i}
          dir={dirs[i]}
          title={p.title}
          accent={p.accent}
          active={ui.section === 'projects' && ui.projectId === p.id}
          onSelect={() => ui.onSelectProject(p.id)}
          reducedMotion={ui.reducedMotion}
        />
      ))}
    </group>
  )
}

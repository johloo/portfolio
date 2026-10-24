import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Blink, Bob, Box, Cone, Cyl, Glow, Ico, PI, Spin, Torus } from '../details/parts'
import type { V3 } from '../details/parts'
import { ProjectDetail } from '../details/ProjectDetails'
import { Avatar } from './Avatar'

interface SceneProps {
  reduced: boolean
}

/* ── shared bits ───────────────────────────────────────────────────────── */
export function Monitor({ p, ry = 0, c = '#22d3ee', w = 0.7 }: { p: V3; ry?: number; c?: string; w?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box p={[0, 0.05, 0]} s={[0.3, 0.04, 0.18]} c="#334155" />
      <Box p={[0, 0.2, 0]} s={[0.05, 0.3, 0.05]} c="#334155" />
      <Box p={[0, 0.5, 0]} s={[w, w * 0.6, 0.05]} c="#0f172a" />
      <Box p={[0, 0.5, 0.03]} s={[w - 0.08, w * 0.6 - 0.08, 0.01]} c="#0b1220" e={c} ei={0.7} />
      <Box p={[-w * 0.18, 0.56, 0.04]} s={[w * 0.4, 0.04, 0.01]} c="#ffffff" e="#ffffff" ei={0.6} />
      <Box p={[-w * 0.1, 0.48, 0.04]} s={[w * 0.55, 0.03, 0.01]} c="#ffffff" e="#ffffff" ei={0.4} />
      <Box p={[-w * 0.05, 0.41, 0.04]} s={[w * 0.3, 0.03, 0.01]} c="#ffffff" e="#ffffff" ei={0.4} />
    </group>
  )
}

export function Desk({ p = [0, 0, 0], ry = 0, len = 1.5, c = '#e2e8f0' }: { p?: V3; ry?: number; len?: number; c?: string }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box p={[0, 0.82, 0]} s={[len, 0.07, 0.62]} c={c} />
      <Box p={[-len / 2 + 0.07, 0.4, 0]} s={[0.08, 0.8, 0.5]} c="#64748b" />
      <Box p={[len / 2 - 0.07, 0.4, 0]} s={[0.08, 0.8, 0.5]} c="#64748b" />
    </group>
  )
}

/** Solid landing pad that carries a close-up scene and hides the planet's curvature under it. */
export function Pad({ r = 3.1, accent = '#22d3ee' }: { r?: number; accent?: string }) {
  return (
    <>
      <Cyl p={[0, -0.32, 0]} r0={r} r1={r - 0.05} h={0.7} seg={10} c="#2f4a7d" e="#22346a" ei={0.35} />
      <Cyl p={[0, 0.005, 0]} r0={r - 0.12} h={0.04} seg={10} c="#4a669f" />
      <Torus p={[0, 0.04, 0]} r0={r - 0.06} t={0.03} c={accent} rx={PI / 2} />
    </>
  )
}

/* ═══ About — research station with the avatar working at a desk ═════════ */
export function AboutScene({ reduced }: SceneProps) {
  return (
    <>
      <Pad accent="#22d3ee" />
      {/* lab building */}
      <group position={[0.2, 0, -1.7]}>
        <Box p={[0, 0.65, 0]} s={[3.0, 1.3, 1.2]} c="#e9edff" m={0.2} />
        <Box p={[0, 1.34, 0]} s={[3.1, 0.1, 1.3]} c="#818cf8" />
        <Ico p={[1.0, 1.6, 0]} r0={0.45} d={1} c="#a5b4fc" />
        <Cyl p={[-1.1, 1.7, 0]} r0={0.03} h={0.8} c="#cbd5ff" />
        <Blink p={[-1.1, 2.15, 0]} c="#f87171" r0={0.06} />
        {[-1.0, -0.2, 0.6].map((x, i) => (
          <Box key={i} p={[x, 0.75, 0.62]} s={[0.55, 0.45, 0.02]} c="#0b1220" e={i === 1 ? "#ffcf8a" : "#67e8f9"} ei={0.7} />
        ))}
        <Box p={[1.15, 0.4, 0.62]} s={[0.4, 0.8, 0.02]} c="#334155" />
      </group>

      {/* working desk + avatar */}
      <group position={[-0.9, 0, 0.5]} rotation={[0, 0.55, 0]}>
        <Avatar anim="type" interact shirt="#22d3ee" p={[0, 0, -0.1]} reduced={reduced} />
        <Desk p={[0, 0, 0.62]} len={1.9} />
        <Monitor p={[-0.45, 0.85, 0.7]} ry={PI} />
        <Monitor p={[0.45, 0.85, 0.7]} ry={PI} c="#a78bfa" />
        <Box p={[0, 0.87, 0.45]} s={[0.55, 0.02, 0.18]} c="#1e293b" />
        <Cyl p={[0.8, 0.9, 0.5]} r0={0.07} h={0.12} c="#f8fafc" seg={8} />
      </group>

      {/* hologram globe */}
      <group position={[1.9, 0, 0.6]}>
        <Cyl p={[0, 0.15, 0]} r0={0.5} r1={0.38} h={0.3} seg={8} c="#334155" />
        <Torus p={[0, 0.32, 0]} r0={0.4} t={0.012} c="#22d3ee" />
        <Spin speed={0.9} p={[0, 1.15, 0]} reduced={reduced}>
          <Ico r0={0.45} d={1} c="#22d3ee" o={0.35} e="#22d3ee" ei={0.5} />
          <Torus r0={0.62} t={0.01} c="#a78bfa" rx={PI / 2.4} />
          <Torus r0={0.55} t={0.01} c="#67e8f9" rx={0.3} />
        </Spin>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.38, 0.12, 0.8, 6, 1, true]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* warm light inside the lab + plants + floating info display */}
      <pointLight position={[0.2, 0.9, -1.2]} intensity={5} color="#ffcf8a" distance={4} decay={2} />
      {[[-2.6, 0.9], [2.4, -1.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cyl p={[0, 0.14, 0]} r0={0.2} r1={0.15} h={0.28} seg={6} c="#e2e8f0" />
          <Cone p={[0, 0.5, 0]} r0={0.22} h={0.5} seg={5} c="#34d399" />
          <Cone p={[0.12, 0.42, 0.05]} r0={0.14} h={0.4} seg={5} rz={-0.4} c="#4ade80" />
          <Cone p={[-0.12, 0.42, -0.05]} r0={0.14} h={0.4} seg={5} rz={0.4} c="#22c55e" />
        </group>
      ))}
      <Bob p={[-1.9, 1.9, -0.4]} amp={0.05} reduced={reduced}>
        <group rotation={[0, 0.5, 0]}>
          <Box s={[1.1, 0.7, 0.04]} c="#0b1220" e="#22d3ee" ei={0.35} o={0.8} />
          <Box p={[-0.2, 0.18, 0.03]} s={[0.5, 0.05, 0.01]} c="#ffffff" e="#ffffff" ei={0.6} />
          <Box p={[-0.1, 0.05, 0.03]} s={[0.7, 0.04, 0.01]} c="#67e8f9" e="#67e8f9" ei={0.6} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} p={[-0.38 + i * 0.19, -0.2 + i * 0.03, 0.03]} s={[0.1, 0.14 + i * 0.06, 0.01]} c="#a78bfa" e="#a78bfa" ei={0.6} />
          ))}
        </group>
      </Bob>

      {/* telescope + crates + flag */}
      <group position={[-2.3, 0, -0.1]} rotation={[0, 0.6, 0]}>
        <Cyl p={[0, 0.4, 0]} r0={0.04} h={0.8} c="#94a3b8" />
        <Cyl p={[0, 0.95, 0.15]} r0={0.1} r1={0.07} h={0.7} c="#e9edff" rx={-0.9} />
        <Box p={[0, 0.02, 0]} s={[0.5, 0.04, 0.5]} c="#475569" />
      </group>
      <Box p={[1.5, 0.2, -0.3]} s={[0.4, 0.4, 0.4]} c="#d6a35c" ry={0.3} />
      <Box p={[1.62, 0.55, -0.25]} s={[0.32, 0.3, 0.32]} c="#e1b46d" ry={-0.2} />
      <Cyl p={[2.5, 0.8, -0.9]} r0={0.025} h={1.6} c="#cbd5ff" />
      <Box p={[2.75, 1.45, -0.9]} s={[0.5, 0.3, 0.02]} c="#a78bfa" e="#a78bfa" ei={0.3} />
    </>
  )
}

/* ═══ Contact — comms beacon, the avatar waving hello ════════════════════ */
export function ContactScene({ reduced }: SceneProps) {
  return (
    <>
      <Pad accent="#a78bfa" />
      {/* big beacon tower */}
      <group position={[0, 0, -1.5]}>
        <Cyl p={[0, 0.2, 0]} r0={0.9} r1={0.6} h={0.4} seg={6} c="#4c3f91" />
        <Cone p={[0, 1.6, 0]} r0={0.34} h={2.6} seg={6} c="#6b5bd2" />
        <Spin speed={1.2} p={[0, 2.5, 0]} reduced={reduced}>
          <Torus r0={0.55} t={0.02} c="#a78bfa" rx={PI / 2} />
          <Torus r0={0.4} t={0.02} c="#67e8f9" rx={PI / 2.8} />
        </Spin>
        <Glow p={[0, 3.0, 0]} r0={0.2} c="#e9d5ff" d={1} />
        {[0.9, 1.4, 1.9].map((y, i) => (
          <Torus key={i} p={[0, y, 0]} r0={0.24 + (2.2 - y) * 0.06} t={0.012} c="#67e8f9" />
        ))}
      </group>

      {/* receiving dishes */}
      {([
        [-2.1, -0.6, 0.7],
        [2.2, -0.9, -0.6],
      ] as const).map(([x, z, ry], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <Cyl p={[0, 0.5, 0]} r0={0.07} h={1} c="#94a3b8" />
          <Cyl p={[0, 1.15, 0.25]} r0={0.05} r1={0.62} h={0.34} seg={10} c="#e9edff" rx={-1.1} open />
          <Cyl p={[0, 1.4, 0.55]} r0={0.015} h={0.5} c="#cbd5ff" rx={-1.1} />
          <Blink p={[0, 1.55, 0.8]} c="#f87171" r0={0.05} phase={i} />
        </group>
      ))}

      {/* avatar waving + mini console */}
      <Avatar anim="wave" shirt="#a78bfa" p={[-0.5, 0, 1.2]} ry={0.35} reduced={reduced} />
      <group position={[1.2, 0, 1.2]} rotation={[0, -0.4, 0]}>
        <Box p={[0, 0.35, 0]} s={[1.0, 0.7, 0.55]} c="#312e81" />
        <Box p={[0, 0.74, 0.05]} s={[0.9, 0.04, 0.4]} c="#1e1b4b" rx={-0.15} />
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <Glow key={i} p={[x, 0.78, 0.1]} r0={0.04} c={i % 2 ? '#67e8f9' : '#f0abfc'} />
        ))}
      </group>

      {/* floating message icons orbiting the beacon */}
      <Spin speed={0.7} p={[0, 0, -1.5]} reduced={reduced}>
        <Bob p={[1.6, 2.0, 0]} reduced={reduced}>
          <Box s={[0.4, 0.28, 0.04]} c="#f8fafc" e="#67e8f9" ei={0.3} />
          <Cone p={[0, 0.04, 0.03]} r0={0.2} h={0.13} seg={3} rx={PI} c="#cbd5ff" />
        </Bob>
        <Bob p={[-1.5, 2.4, 0.6]} speed={2} reduced={reduced}>
          <Box s={[0.34, 0.22, 0.04]} c="#a78bfa" e="#a78bfa" ei={0.5} />
          <Ico p={[-0.1, -0.16, 0]} r0={0.05} c="#a78bfa" />
        </Bob>
        <Bob p={[0.2, 3.0, -1.5]} speed={1.3} reduced={reduced}>
          <Box s={[0.18, 0.34, 0.04]} c="#0f172a" e="#22d3ee" ei={0.5} />
        </Bob>
      </Spin>
    </>
  )
}

/* ═══ Skills — the avatar presents the real towers on the planet ═══════ */
export function SkillsScene({ reduced }: SceneProps) {
  return (
    <>
      <Avatar anim="point" shirt="#2dd4bf" p={[-1.0, 0, 2.3]} ry={0.35} reduced={reduced} />
      <Bob p={[0.8, 1.5, 2.4]} reduced={reduced}>
        <Box s={[0.9, 0.62, 0.05]} c="#0f172a" e="#22d3ee" ei={0.5} />
        <Box p={[-0.15, 0.1, 0.04]} s={[0.4, 0.06, 0.01]} c="#fff" />
        <Box p={[-0.05, -0.05, 0.04]} s={[0.55, 0.06, 0.01]} c="#fff" />
        <Box p={[0.25, -0.18, 0.04]} s={[0.25, 0.06, 0.01]} c="#2dd4bf" />
      </Bob>
    </>
  )
}

/* ═══ Projects — each island's own little world ══════════════════════════ */
const PROJECT_AVATAR: { anim: 'type' | 'point' | 'hold' | 'wave' | 'lever'; at: V3; ry: number }[] = [
  { anim: 'type', at: [1.1, 0, 1.2], ry: -0.5 },
  { anim: 'point', at: [1.1, 0, 1.3], ry: -0.45 },
  { anim: 'type', at: [1.1, 0, 1.2], ry: -0.5 },
  { anim: 'hold', at: [1.1, 0, 1.3], ry: -0.4 },
  { anim: 'point', at: [1.1, 0, 1.3], ry: -0.45 }, // inventory: checking stock
  { anim: 'lever', at: [1.1, 0, 1.3], ry: -0.4 }, // MRP: running the line
  { anim: 'hold', at: [1.1, 0, 1.3], ry: -0.4 }, // maintenance: service tablet
]
export function ProjectScene({ index, accent, reduced }: SceneProps & { index: number; accent: string }) {
  const a = PROJECT_AVATAR[index % PROJECT_AVATAR.length]
  return (
    <>
      <Pad r={2.7} accent={accent} />
      <group position={[-0.5, 0.02, -0.4]} scale={4.2}>
        <ProjectDetail index={index} accent={accent} reduced={reduced} />
      </group>
      <Avatar anim={a.anim} shirt={accent} p={a.at} ry={a.ry} reduced={reduced} />
      {index % PROJECT_AVATAR.length === 0 && <Desk p={[2.5, 0, 0.8]} ry={0.9} len={1.2} />}
    </>
  )
}

/* ═══ Experience — five different workshops ══════════════════════════════ */
function BrowserWindow({ p, ry, c }: { p: V3; ry: number; c: string }) {
  return (
    <Bob p={p} amp={0.06} speed={1.2 + p[0] * 0.2} reduced={false}>
      <group rotation={[0, ry, 0]}>
        <Box s={[1.0, 0.7, 0.04]} c="#f1f5f9" />
        <Box p={[0, 0.3, 0.025]} s={[1.0, 0.1, 0.01]} c={c} />
        <Box p={[-0.15, 0.08, 0.025]} s={[0.55, 0.08, 0.01]} c="#94a3b8" />
        <Box p={[-0.2, -0.08, 0.025]} s={[0.45, 0.08, 0.01]} c="#cbd5e1" />
        <Box p={[0.3, -0.16, 0.03]} s={[0.25, 0.18, 0.01]} c={c} />
      </group>
    </Bob>
  )
}

function Conveyor({ reduced }: SceneProps) {
  const boxes = useRef<Group[]>([])
  useFrame(({ clock }) => {
    boxes.current.forEach((g, i) => {
      if (!g) return
      const t = reduced ? i * 0.3 : clock.elapsedTime * 0.35 + i * 0.25
      g.position.x = -1.3 + ((t % 1) * 2.6)
    })
  })
  return (
    <group position={[0, 0, -0.2]}>
      <Box p={[0, 0.45, 0]} s={[3.0, 0.14, 0.7]} c="#334155" />
      <Box p={[0, 0.53, 0.36]} s={[3.0, 0.04, 0.04]} c="#f59e0b" />
      <Box p={[0, 0.53, -0.36]} s={[3.0, 0.04, 0.04]} c="#f59e0b" />
      {[-1.3, 0, 1.3].map((x) => (
        <Box key={x} p={[x, 0.2, 0]} s={[0.1, 0.4, 0.6]} c="#475569" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} ref={(g) => void (g && (boxes.current[i] = g))} position={[0, 0.78, 0]}>
          <Box s={[0.32, 0.32, 0.32]} c={['#fbbf24', '#34d399', '#60a5fa', '#f0abfc'][i]} />
        </group>
      ))}
      <Spin speed={1.4} p={[0, 1.7, -0.9]} reduced={reduced}>
        <Cyl r0={0.55} h={0.14} seg={8} c="#94a3b8" rx={PI / 2} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} p={[Math.cos((i * PI) / 3) * 0.6, Math.sin((i * PI) / 3) * 0.6, 0]} s={[0.2, 0.2, 0.14]} c="#94a3b8" rz={(i * PI) / 3} />
        ))}
      </Spin>
      <Box p={[2.0, 0.5, 1.0]} s={[0.12, 1.0, 0.12]} c="#475569" />
      <Ico p={[2.0, 1.1, 1.0]} r0={0.14} c="#ef4444" e="#ef4444" ei={0.4} />
    </group>
  )
}

export function ExperienceScene({ index, reduced }: SceneProps & { index: number }) {
  switch (index % 5) {
    case 0: // creative development — easel + palette
      return (
        <>
          <group position={[-0.2, 0, -1.2]}>
            <Box p={[-0.5, 0.9, 0]} s={[0.07, 1.8, 0.07]} c="#a16207" rz={0.12} />
            <Box p={[0.5, 0.9, 0]} s={[0.07, 1.8, 0.07]} c="#a16207" rz={-0.12} />
            <Box p={[0, 1.25, 0.06]} s={[1.8, 1.25, 0.06]} c="#f8fafc" />
            <Cone p={[-0.4, 1.0, 0.1]} r0={0.45} h={0.7} seg={3} c="#a78bfa" />
            <Ico p={[0.35, 1.5, 0.1]} r0={0.28} d={0} c="#fbbf24" />
            <Box p={[0.2, 0.95, 0.1]} s={[0.7, 0.14, 0.02]} c="#22d3ee" />
          </group>
          {(['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc'] as const).map((c, i) => (
            <Bob key={c} p={[-2 + i * 1.0, 2.3 + (i % 2) * 0.3, -0.4]} speed={1.2 + i * 0.3} reduced={reduced}>
              <Ico r0={0.14} d={0} c={c} e={c} ei={0.4} />
            </Bob>
          ))}
          <Avatar anim="point" shirt="#f472b6" p={[0.6, 0, 0.7]} ry={0.3} reduced={reduced} />
        </>
      )
    case 1: // web applications — floating browser windows + laptop
      return (
        <>
          <BrowserWindow p={[-1.7, 1.6, -0.9]} ry={0.5} c="#22d3ee" />
          <BrowserWindow p={[0, 2.1, -1.5]} ry={0} c="#a78bfa" />
          <BrowserWindow p={[1.7, 1.6, -0.9]} ry={-0.5} c="#34d399" />
          <group position={[-0.5, 0, 0.5]} rotation={[0, 0.5, 0]}>
            <Avatar anim="type" shirt="#38bdf8" p={[0, 0, -0.1]} reduced={reduced} />
            <Desk p={[0, 0, 0.62]} len={1.4} />
            <Box p={[0, 0.88, 0.62]} s={[0.6, 0.03, 0.42]} c="#475569" />
            <Box p={[0, 1.07, 0.84]} s={[0.6, 0.38, 0.03]} c="#0f172a" rx={-0.25} />
            <Box p={[0, 1.07, 0.82]} s={[0.54, 0.32, 0.01]} c="#0b1220" e="#38bdf8" ei={0.7} rx={-0.25} />
          </group>
        </>
      )
    case 2: // database systems — server racks + disc stack
      return (
        <>
          {[-1.8, -0.9, 0.0].map((x, i) => (
            <group key={x} position={[x, 0, -1.3]}>
              <Box p={[0, 0.95, 0]} s={[0.75, 1.9, 0.7]} c="#1e293b" />
              {[0.4, 0.75, 1.1, 1.45, 1.75].map((y, j) => (
                <group key={y}>
                  <Box p={[0, y, 0.36]} s={[0.62, 0.22, 0.02]} c="#334155" />
                  <Blink p={[0.22, y, 0.38]} c={(i + j) % 3 ? '#34d399' : '#fbbf24'} r0={0.04} phase={i + j} />
                </group>
              ))}
            </group>
          ))}
          <group position={[1.7, 0, -0.5]}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Cyl key={i} p={[0, 0.16 + i * 0.36, 0]} r0={0.7} h={0.3} seg={10} c="#2dd4bf" e="#2dd4bf" ei={0.15} />
            ))}
            <Spin speed={0.8} p={[0, 2.35, 0]} reduced={reduced}>
              <Ico r0={0.22} d={0} c="#99f6e4" e="#2dd4bf" ei={0.6} />
            </Spin>
          </group>
          <Avatar anim="hold" shirt="#2dd4bf" p={[0.3, 0, 0.9]} ry={0.2} reduced={reduced} />
        </>
      )
    case 3: // workflow automation — conveyor + lever
      return (
        <>
          <Conveyor reduced={reduced} />
          <Avatar anim="lever" shirt="#fbbf24" p={[1.4, 0, 1.2]} ry={-0.5} reduced={reduced} />
        </>
      )
    default: // problem solving — whiteboard + lightbulb
      return (
        <>
          <group position={[0, 0, -1.5]}>
            <Box p={[0, 1.35, 0]} s={[2.8, 1.5, 0.08]} c="#f8fafc" />
            <Box p={[0, 1.35, -0.02]} s={[2.9, 1.6, 0.04]} c="#64748b" />
            <Box p={[-0.7, 1.55, 0.06]} s={[0.9, 0.05, 0.01]} c="#3b82f6" rz={0.2} />
            <Box p={[0.1, 1.2, 0.06]} s={[1.2, 0.05, 0.01]} c="#ef4444" rz={-0.15} />
            <Box p={[0.8, 1.6, 0.06]} s={[0.7, 0.05, 0.01]} c="#10b981" rz={0.4} />
            <Ico p={[-1.0, 1.0, 0.07]} r0={0.1} c="#fbbf24" />
            <Ico p={[0.95, 0.95, 0.07]} r0={0.1} c="#34d399" />
          </group>
          {[
            [-1.9, 0.2, 0.2, '#f87171'],
            [-1.5, 0.2, 0.7, '#60a5fa'],
            [2.0, 0.2, 0.4, '#a78bfa'],
          ].map(([x, y, z, c], i) => (
            <Box key={i} p={[x as number, y as number, z as number]} s={[0.4, 0.4, 0.4]} c={c as string} ry={0.4 + i} />
          ))}
          <Avatar anim="think" shirt="#a78bfa" p={[0.2, 0, 0.9]} ry={0.1} reduced={reduced} />
          <Bob p={[0.2, 2.5, 0.9]} amp={0.08} reduced={reduced}>
            <Glow r0={0.2} c="#fde68a" d={1} />
            <Cyl p={[0, -0.25, 0]} r0={0.09} h={0.12} c="#94a3b8" />
            <Torus r0={0.36} t={0.01} c="#fde68a" opacity={0.6} />
          </Bob>
        </>
      )
  }
}

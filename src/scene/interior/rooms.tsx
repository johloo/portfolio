import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Group } from 'three'
import { portfolio } from '../../data/portfolio'
import { Blink, Bob, Box, Cone, Cyl, Glow, Ico, PI, Spin, Torus } from '../details/parts'
import type { V3 } from '../details/parts'
import { mulberry32 } from '../noise'
import { Avatar } from '../stage/Avatar'
import type { AvatarAnim } from '../stage/Avatar'
import { Desk, Monitor } from '../stage/scenes'
import { INTERIOR_POS } from './focus'

interface RoomProps {
  reduced: boolean
}

/* ── shared scenery ────────────────────────────────────────────────────── */
/** Ring of low-poly mountains + trees that forms the horizon of an outdoor place. */
export function Horizon({ r = 16, seed = 3, tint = '#3b4b86' }: { r?: number; seed?: number; tint?: string }) {
  const items = useMemo(() => {
    const rnd = mulberry32(seed)
    return Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * PI * 2 + rnd() * 0.15
      const d = r + rnd() * 4
      return { x: Math.sin(a) * d, z: Math.cos(a) * d, h: 3 + rnd() * 5, w: 2 + rnd() * 2.2, seed: rnd() }
    })
  }, [r, seed])
  return (
    <>
      {items.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]}>
          <Cone p={[0, m.h / 2 - 0.3, 0]} r0={m.w} h={m.h} seg={5} c={tint} />
          {m.seed > 0.45 && <Cone p={[0, m.h - 0.7, 0]} r0={m.w * 0.38} h={m.h * 0.28} seg={5} c="#e7ecff" />}
        </group>
      ))}
    </>
  )
}

function Pines({ r = 8.2, n = 16, seed = 8 }: { r?: number; n?: number; seed?: number }) {
  const items = useMemo(() => {
    const rnd = mulberry32(seed)
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * PI * 2 + rnd() * 0.3
      return { x: Math.sin(a) * (r + rnd() * 1.6), z: Math.cos(a) * (r + rnd() * 1.6), s: 0.9 + rnd() * 0.7 }
    })
  }, [r, n, seed])
  return (
    <>
      {items.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s * 1.4}>
          <Cyl p={[0, 0.2, 0]} r0={0.07} h={0.4} c="#6b4a2f" />
          <Cone p={[0, 0.7, 0]} r0={0.38} h={0.8} c="#2f9e57" seg={6} />
          <Cone p={[0, 1.15, 0]} r0={0.27} h={0.65} c="#3fbf68" seg={6} />
        </group>
      ))}
    </>
  )
}

/** Open-air ground used by every outdoor place. */
export function Ground({ accent, r = 8, grass = '#3f9d5a' }: { accent: string; r?: number; grass?: string }) {
  return (
    <>
      <Cyl p={[0, -0.6, 0]} r0={r + 14} r1={r + 14} h={1.2} seg={24} c="#2a3f73" />
      <Cyl p={[0, -0.08, 0]} r0={r} h={0.16} seg={18} c={grass} />
      <Torus p={[0, 0.02, 0]} r0={r - 0.15} t={0.05} c={accent} rx={PI / 2} opacity={0.9} />
      <Pines r={r - 1.2} />
      <Horizon r={r + 6} />
    </>
  )
}


/* ── shared avatar behaviour ───────────────────────────────────────────── */
const angDiff = (a: number, b: number) => {
  let d = (b - a) % (PI * 2)
  if (d > PI) d -= PI * 2
  if (d < -PI) d += PI * 2
  return d
}

interface Stop {
  p: V3
  ry: number
  anim: AvatarAnim
  dur: number
}

/** "Me" going about my day: walks between stops, then types / waves / thinks at each one. */
function RoamAvatar({ stops, shirt, reduced }: { stops: Stop[]; shirt: string; reduced: boolean }) {
  const g = useRef<Group>(null)
  const [anim, setAnim] = useState<AvatarAnim>(stops[0].anim)
  const st = useRef({ i: 0, walking: false, t: 0 })
  const start = useMemo(() => stops[0].p, [stops])

  useFrame((_, rawDt) => {
    const grp = g.current
    if (!grp || reduced) return
    const dt = Math.min(rawDt, 0.05)
    const s = st.current
    const cur = stops[s.i]
    if (!s.walking) {
      s.t += dt
      grp.rotation.y += angDiff(grp.rotation.y, cur.ry) * Math.min(1, dt * 5)
      if (s.t > cur.dur) {
        s.i = (s.i + 1) % stops.length
        s.walking = true
        s.t = 0
        setAnim('walk')
      }
    } else {
      const tgt = stops[s.i].p
      const dx = tgt[0] - grp.position.x
      const dz = tgt[2] - grp.position.z
      const dist = Math.hypot(dx, dz)
      if (dist < 0.06) {
        s.walking = false
        s.t = 0
        setAnim(stops[s.i].anim)
      } else {
        const step = Math.min(dist, dt * 1.5)
        grp.position.x += (dx / dist) * step
        grp.position.z += (dz / dist) * step
        grp.rotation.y += angDiff(grp.rotation.y, Math.atan2(dx, dz)) * Math.min(1, dt * 8)
      }
    }
  })

  return (
    <group ref={g} position={start} rotation={[0, stops[0].ry, 0]}>
      <Avatar anim={anim} shirt={shirt} scale={1.25} reduced={reduced} />
    </group>
  )
}

/* ═══ About → inside the research lab ════════════════════════════════════ */
function Rack({ p, ry = 0, seed = 0 }: { p: V3; ry?: number; seed?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box p={[0, 1.3, 0]} s={[0.9, 2.6, 0.9]} c="#1b2440" />
      {[0.5, 0.95, 1.4, 1.85, 2.3].map((y, j) => (
        <group key={y}>
          <Box p={[0, y, 0.46]} s={[0.78, 0.3, 0.02]} c="#2f3f6e" />
          <Blink p={[0.28, y, 0.49]} c={(seed + j) % 3 ? '#34d399' : '#fbbf24'} r0={0.04} phase={seed + j} />
          <Blink p={[0.16, y, 0.49]} c="#67e8f9" r0={0.03} phase={j * 2} />
        </group>
      ))}
    </group>
  )
}

function Plant({ p, s = 1 }: { p: V3; s?: number }) {
  return (
    <group position={p} scale={s}>
      <Cyl p={[0, 0.25, 0]} r0={0.32} r1={0.24} h={0.5} seg={6} c="#e2e8f0" />
      <Cone p={[0, 0.95, 0]} r0={0.34} h={0.9} seg={5} c="#34d399" />
      <Cone p={[0.22, 0.8, 0.08]} r0={0.22} h={0.7} seg={5} rz={-0.5} c="#4ade80" />
      <Cone p={[-0.22, 0.8, -0.08]} r0={0.22} h={0.7} seg={5} rz={0.5} c="#22c55e" />
    </group>
  )
}


/** Me at the desk. Click me and I turn around, say hi and tell you about myself. */
function LabAvatar({ reduced, wsRy }: { reduced: boolean; wsRy: number }) {
  const lines = portfolio.about.chat
  const [line, setLine] = useState(-1)
  const lineRef = useRef(-1)
  const timer = useRef(0)
  const wrap = useRef<Group>(null)
  const tmp = useMemo(() => new Vector3(), [])

  const set = (v: number) => {
    lineRef.current = v
    timer.current = 0
    setLine(v)
  }
  const advance = () => set(lineRef.current + 1 >= lines.length ? -1 : lineRef.current + 1)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const w = wrap.current
    if (!w) return
    if (lineRef.current >= 0) {
      timer.current += dt
      if (timer.current > 4.6) advance()
    }
    let target = 0
    if (lineRef.current >= 0) {
      w.getWorldPosition(tmp)
      const cam = state.camera.position
      target = angDiff(0, Math.atan2(cam.x - tmp.x, cam.z - tmp.z) - wsRy)
    }
    w.rotation.y = reduced ? target : w.rotation.y + angDiff(w.rotation.y, target) * Math.min(1, dt * 5)
  })

  const talking = line >= 0
  return (
    <group ref={wrap} position={[0, 0, -0.1]}>
      <Avatar anim={!talking ? 'type' : line === 0 ? 'wave' : 'talk'} interact={!talking} shirt="#22d3ee" reduced={reduced} />
      <mesh
        position={[0, 1.0, 0]}
        onClick={(e) => {
          if (e.delta > 6) return
          e.stopPropagation()
          if (lineRef.current < 0) set(0)
          else advance()
        }}
        onPointerOver={() => void (document.body.style.cursor = 'pointer')}
        onPointerOut={() => void (document.body.style.cursor = '')}
      >
        <boxGeometry args={[1.0, 2.1, 1.0]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html center position={[0, 2.35, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
        {talking ? (
          <div
            style={{
              width: 250,
              font: '500 14px/1.45 Inter, system-ui, sans-serif',
              color: '#0f172a',
              background: 'rgba(248,250,252,.96)',
              border: '2px solid #22d3ee',
              padding: '9px 12px',
              borderRadius: 14,
              boxShadow: '0 6px 24px rgba(0,0,0,.4)',
            }}
          >
            <div style={{ font: '700 10px Inter, system-ui', letterSpacing: '.12em', color: '#0891b2', marginBottom: 3 }}>
              JOHN CARLO SALVA · {line + 1}/{lines.length}
            </div>
            {lines[line]}
            <div style={{ font: '500 10px Inter, system-ui', color: '#64748b', marginTop: 4 }}>click me for the next line</div>
          </div>
        ) : (
          <div
            style={{
              font: '600 12px Inter, system-ui, sans-serif',
              color: '#fff',
              background: 'rgba(15,23,42,.75)',
              border: '1px solid #22d3ee',
              padding: '3px 9px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
            }}
          >
            👋 Click me to say hi
          </div>
        )}
      </Html>
    </group>
  )
}

export function LabRoom({ reduced }: RoomProps) {
  const WALL = '#2c3b69'
  // Cut-away walls: a wall disappears while the camera is outside it, so zooming out shows the whole lab.
  const back = useRef<Group>(null)
  const front = useRef<Group>(null)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const ceiling = useRef<Group>(null)
  useFrame(({ camera }) => {
    const x = camera.position.x - INTERIOR_POS.x
    const y = camera.position.y - INTERIOR_POS.y
    const z = camera.position.z - INTERIOR_POS.z
    if (back.current) back.current.visible = z > -5.3
    if (front.current) front.current.visible = z < 5.3
    if (left.current) left.current.visible = x > -5.8
    if (right.current) right.current.visible = x < 5.8
    if (ceiling.current) ceiling.current.visible = y < 3.9
  })
  return (
    <>
      {/* shell */}
      <Box p={[0, -0.1, 0]} s={[12, 0.2, 11]} c="#1a2547" />
      <Cyl p={[0, 0.01, -0.6]} r0={3.4} h={0.03} seg={14} c="#2f4a7d" />
      <Torus p={[0, 0.04, -0.6]} r0={3.3} t={0.04} c="#22d3ee" />
      <Torus p={[0, 0.04, -0.6]} r0={2.2} t={0.025} c="#a78bfa" />
      {/* back wall with a big window onto space */}
      <group ref={back}>
      <Box p={[-4.6, 2, -5.5]} s={[2.8, 4, 0.3]} c={WALL} />
      <Box p={[4.6, 2, -5.5]} s={[2.8, 4, 0.3]} c={WALL} />
      <Box p={[0, 0.5, -5.5]} s={[6.4, 1, 0.3]} c={WALL} />
      <Box p={[0, 3.7, -5.5]} s={[6.4, 0.6, 0.3]} c={WALL} />
      <Box p={[0, 1.02, -5.45]} s={[6.5, 0.06, 0.34]} c="#22d3ee" e="#22d3ee" ei={0.9} />
      <Box p={[0, 3.38, -5.45]} s={[6.5, 0.06, 0.34]} c="#22d3ee" e="#22d3ee" ei={0.9} />
      {[-4.6, 4.6].map((x) => (
        <Box key={x} p={[x, 2.0, -5.32]} s={[1.8, 1.2, 0.05]} c="#0b1220" e="#22d3ee" ei={0.5} />
      ))}
      </group>
      {/* side + front walls */}
      <group ref={left}>
        <Box p={[-6, 2, 0]} s={[0.3, 4, 11]} c={WALL} />
      </group>
      <group ref={right}>
        <Box p={[6, 2, 0]} s={[0.3, 4, 11]} c={WALL} />
        {[-2.2, 2.4].map((z) => (
          <Box key={z} p={[5.82, 2.1, z]} s={[0.05, 1.5, 2.2]} c="#1d4ed8" e="#38bdf8" ei={0.55} o={0.85} />
        ))}
      </group>
      <group ref={front}>
        <Box p={[0, 2, 5.5]} s={[12, 4, 0.3]} c={WALL} />
        <Box p={[0, 1.3, 5.3]} s={[1.7, 2.6, 0.1]} c="#0f172a" />
        <Box p={[0, 1.3, 5.25]} s={[1.9, 2.8, 0.05]} c="#22d3ee" e="#22d3ee" ei={0.5} />
      </group>
      {/* ceiling + lights */}
      <group ref={ceiling}>
        <Box p={[0, 4.1, 0]} s={[12.3, 0.2, 11.3]} c="#232f58" />
        {[[-3, -2.5], [3, -2.5], [-3, 2.5], [3, 2.5], [0, 0], [0, -4]].map(([x, z], i) => (
          <Box key={i} p={[x, 3.96, z]} s={[1.8, 0.05, 0.7]} c="#ffffff" e="#e0f2fe" ei={0.9} />
        ))}
      </group>
      <pointLight position={[-1, 3.4, -1]} intensity={22} color="#ffe2b0" distance={0} decay={2} />
      <pointLight position={[3, 2.4, -3]} intensity={16} color="#67e8f9" distance={0} decay={2} />
      <pointLight position={[-3.5, 2.4, 3]} intensity={10} color="#a78bfa" distance={0} decay={2} />

      {/* the planet outside the window */}
      <Ico p={[-2, 3.4, -26]} r0={7} d={2} c="#2f7fd6" />
      <Ico p={[-4.5, 6, -19.6]} r0={1.7} d={0} c="#3fbf68" />
      <Ico p={[0.4, 3, -19.4]} r0={2.1} d={0} c="#4ade80" />
      <Ico p={[-2.8, 0.2, -19.2]} r0={1.5} d={0} c="#3fbf68" />
      <Ico p={[10, 7, -24]} r0={1.1} d={1} c="#cbd5ff" />

      {/* workstation with me at the desk */}
      <group position={[-1.6, 0, -1.6]} rotation={[0, 0.5, 0]} scale={1.15}>
        <Cyl p={[0, 0.012, 0.3]} r0={1.7} h={0.02} seg={12} c="#35508a" />
        <LabAvatar reduced={reduced} wsRy={0.5} />
        <Desk p={[0, 0, 0.62]} len={1.9} />
        <Monitor p={[-0.45, 0.85, 0.7]} ry={PI} />
        <Monitor p={[0.45, 0.85, 0.7]} ry={PI} c="#a78bfa" />
        <Box p={[0, 0.87, 0.45]} s={[0.55, 0.02, 0.18]} c="#1e293b" />
        <Cyl p={[0.8, 0.9, 0.5]} r0={0.07} h={0.12} c="#f8fafc" seg={8} />
        <Box p={[-0.8, 0.9, 0.5]} s={[0.22, 0.12, 0.16]} c="#fbbf24" />
      </group>

      {/* holographic globe table */}
      <group position={[2.6, 0, -1.2]}>
        <Cyl p={[0, 0.4, 0]} r0={0.8} r1={0.6} h={0.8} seg={8} c="#334155" />
        <Torus p={[0, 0.82, 0]} r0={0.62} t={0.02} c="#22d3ee" />
        <Spin speed={0.7} p={[0, 1.85, 0]} reduced={reduced}>
          <Ico r0={0.75} d={1} c="#22d3ee" o={0.35} e="#22d3ee" ei={0.5} />
          <Torus r0={1.0} t={0.015} c="#a78bfa" rx={PI / 2.4} />
          <Torus r0={0.9} t={0.015} c="#67e8f9" rx={0.3} />
        </Spin>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.62, 0.18, 1.2, 6, 1, true]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.1} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* servers along the left wall */}
      {[-3.4, -1.9, -0.4, 1.1].map((z, i) => (
        <Rack key={z} p={[-5.35, 0, z]} ry={PI / 2} seed={i} />
      ))}

      {/* whiteboard + info display on the right wall */}
      <group position={[5.78, 2.0, 0.8]} rotation={[0, -PI / 2, 0]}>
        <Box s={[3.4, 1.7, 0.08]} c="#f8fafc" />
        <Box p={[-0.6, 0.35, 0.06]} s={[1.2, 0.06, 0.01]} c="#3b82f6" rz={0.15} />
        <Box p={[0.5, 0, 0.06]} s={[1.5, 0.06, 0.01]} c="#ef4444" rz={-0.1} />
        <Box p={[-0.3, -0.4, 0.06]} s={[1.0, 0.06, 0.01]} c="#10b981" rz={0.25} />
        <Ico p={[1.1, 0.45, 0.07]} r0={0.14} c="#fbbf24" />
      </group>
      <Bob p={[3.7, 2.2, 3.4]} amp={0.06} reduced={reduced}>
        <group rotation={[0, -0.6, 0]}>
          <Box s={[1.7, 1.05, 0.05]} c="#0b1220" e="#22d3ee" ei={0.35} o={0.82} />
          <Box p={[-0.3, 0.28, 0.04]} s={[0.8, 0.07, 0.01]} c="#ffffff" e="#ffffff" ei={0.6} />
          <Box p={[-0.15, 0.1, 0.04]} s={[1.1, 0.05, 0.01]} c="#67e8f9" e="#67e8f9" ei={0.6} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Box key={i} p={[-0.65 + i * 0.26, -0.32 + i * 0.03, 0.04]} s={[0.15, 0.2 + i * 0.07, 0.01]} c="#a78bfa" e="#a78bfa" ei={0.6} />
          ))}
        </group>
      </Bob>

      {/* telescope at the window, satellite dish console */}
      <group position={[3.8, 0, -4.2]} rotation={[0, -0.4, 0]}>
        <Cyl p={[0, 0.7, 0]} r0={0.05} h={1.4} c="#94a3b8" />
        <Cyl p={[0, 1.55, 0.25]} r0={0.16} r1={0.11} h={1.2} c="#e9edff" rx={-0.8} />
        <Box p={[0, 0.03, 0]} s={[1.0, 0.06, 1.0]} c="#475569" />
      </group>
      <group position={[-3.8, 0, -4.4]}>
        <Box p={[0, 0.45, 0]} s={[1.6, 0.9, 0.8]} c="#334155" />
        <Cyl p={[0, 1.35, 0]} r0={0.06} h={0.9} c="#94a3b8" />
        <Cyl p={[0, 1.95, 0.2]} r0={0.05} r1={0.6} h={0.4} seg={10} c="#e9edff" rx={-1.0} open />
        <Glow p={[0.5, 0.95, 0.36]} r0={0.05} c="#67e8f9" />
        <Glow p={[0.3, 0.95, 0.36]} r0={0.05} c="#f0abfc" />
      </group>

      {/* crates, plants */}
      <Box p={[-4.4, 0.35, 3.9]} s={[0.7, 0.7, 0.7]} c="#d6a35c" ry={0.3} />
      <Box p={[-3.6, 0.3, 4.2]} s={[0.6, 0.6, 0.6]} c="#e1b46d" ry={-0.2} />
      <Box p={[-4.2, 1.0, 3.9]} s={[0.55, 0.5, 0.55]} c="#c9923f" ry={0.6} />
      <Plant p={[-5.2, 0, 4.4]} s={1.4} />
      <Plant p={[5.1, 0, 4.4]} s={1.3} />
      <Plant p={[5.2, 0, -4.6]} s={1.2} />
      <Plant p={[-2.4, 0, 4.7]} s={1.0} />
      {/* shelf with equipment on the front wall */}
      <Box p={[3.2, 1.2, 5.25]} s={[2.6, 0.08, 0.5]} c="#475569" />
      <Box p={[3.2, 1.9, 5.25]} s={[2.6, 0.08, 0.5]} c="#475569" />
      {[2.4, 3.0, 3.8].map((x, i) => (
        <Box key={x} p={[x, 1.45, 5.2]} s={[0.4, 0.42, 0.35]} c={['#22d3ee', '#a78bfa', '#fbbf24'][i]} e={['#22d3ee', '#a78bfa', '#fbbf24'][i]} ei={0.25} />
      ))}
      <Ico p={[2.7, 2.15, 5.2]} r0={0.2} d={1} c="#99f6e4" e="#2dd4bf" ei={0.4} />
    </>
  )
}

/* ═══ Skills → the energy-tower plaza: towers all around, I walk the ring ═ */
const WALK_R = 3.3
const TOWER_R = 6.4

export function SkillsPlaza({ reduced, skillId, onSelectSkill }: RoomProps & { skillId: string | null; onSelectSkill: (id: string) => void }) {
  const skills = portfolio.skills
  const colorOf = (c: string) => portfolio.skillCategories.find((x) => x.id === c)?.color ?? '#22d3ee'
  const angles = useMemo(() => skills.map((_, i) => (i / skills.length) * PI * 2), [skills])

  const walker = useRef<Group>(null)
  const ang = useRef(0)
  const cyc = useRef({ t: 0, pausing: false, kind: 0 })
  const [anim, setAnim] = useState<AvatarAnim>('walk')
  const animRef = useRef<AvatarAnim>('walk')
  const selected = skillId ? skills.findIndex((s) => s.id === skillId) : -1

  useFrame((_, rawDt) => {
    const g = walker.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    let a = ang.current
    let next: AvatarAnim = 'walk'
    let yaw = g.rotation.y
    const c = cyc.current
    if (selected >= 0 && !reduced) {
      // walk to the chosen tower (shortest way round), then stop and point at it
      const t = angles[selected] - 0.22
      const d = angDiff(a, t)
      if (Math.abs(d) > 0.03) {
        a += Math.sign(d) * Math.min(Math.abs(d), dt * 0.9)
        yaw = Math.atan2(Math.cos(a) * Math.sign(d), -Math.sin(a) * Math.sign(d))
      } else {
        next = 'point'
        yaw = Math.atan2(Math.sin(angles[selected]), Math.cos(angles[selected]))
      }
      c.t = 0
      c.pausing = false
    } else if (reduced) {
      next = 'hold'
    } else {
      c.t += dt
      if (c.pausing) {
        // every so often: stop, face the viewer, check my tablet or wave
        next = c.kind % 2 ? 'wave' : 'hold'
        yaw = Math.atan2(-Math.sin(a), -Math.cos(a))
        if (c.t > 3.8) {
          c.pausing = false
          c.t = 0
          c.kind++
        }
      } else {
        a += dt * 0.32
        yaw = Math.atan2(Math.cos(a), -Math.sin(a))
        if (c.t > 8.5) {
          c.pausing = true
          c.t = 0
        }
      }
    }
    ang.current = a
    g.position.set(Math.sin(a) * WALK_R, 0, Math.cos(a) * WALK_R)
    g.rotation.y = reduced ? yaw : g.rotation.y + angDiff(g.rotation.y, yaw) * Math.min(1, dt * 6)
    if (animRef.current !== next) {
      animRef.current = next
      setAnim(next)
    }
  })

  return (
    <>
      <Ground accent="#2dd4bf" r={11} grass="#25396b" />
      {/* tiled plaza floor */}
      {[2.0, 3.3, 4.6, 6.0].map((r, i) => (
        <Torus key={r} p={[0, 0.03, 0]} r0={r} t={i === 1 ? 0.06 : 0.025} c={i === 1 ? '#22d3ee' : '#4a669f'} rx={PI / 2} opacity={0.85} />
      ))}
      <Cyl p={[0, 0.02, 0]} r0={1.6} h={0.05} seg={8} c="#34497e" />
      <Spin speed={0.6} p={[0, 0.9, 0]} reduced={reduced}>
        <Ico r0={0.42} d={0} c="#99f6e4" e="#2dd4bf" ei={0.8} />
      </Spin>
      <pointLight position={[0, 4, 0]} intensity={30} color="#c9d7ff" distance={0} decay={2} />

      {skills.map((s, i) => {
        const a = angles[i]
        const h = 1.6 + (s.level / 100) * 4.6
        const col = colorOf(s.category)
        const on = i === selected
        return (
          <group key={s.id} position={[Math.sin(a) * TOWER_R, 0, Math.cos(a) * TOWER_R]} rotation={[0, a, 0]}>
            <Cyl p={[0, 0.15, 0]} r0={0.95} r1={0.8} h={0.3} seg={8} c="#1e293b" />
            <Cyl p={[0, h / 2 + 0.3, 0]} r0={0.58} r1={0.4} h={h} seg={6} c={col} e={col} ei={on ? 0.95 : 0.4} />
            {[0.3, 0.55, 0.8].map((k) => (
              <Torus key={k} p={[0, 0.3 + h * k, 0]} r0={0.62 - k * 0.16} t={0.03} c="#ffffff" rx={PI / 2} opacity={0.8} />
            ))}
            <Spin speed={1.1} p={[0, h + 0.85, 0]} reduced={reduced}>
              <Ico r0={on ? 0.5 : 0.36} d={0} c={on ? '#ffffff' : col} e={col} ei={0.9} />
            </Spin>
            {on && (
              <mesh position={[0, h / 2 + 3, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 6, 8, 1, true]} />
                <meshBasicMaterial color={col} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
              </mesh>
            )}
            {/* click target: tap a tower to see its level */}
            <mesh
              position={[0, h / 2 + 0.6, 0]}
              onClick={(e) => {
                if (e.delta > 6) return
                e.stopPropagation()
                onSelectSkill(s.id)
              }}
              onPointerOver={() => void (document.body.style.cursor = 'pointer')}
              onPointerOut={() => void (document.body.style.cursor = '')}
            >
              <cylinderGeometry args={[1.0, 1.0, h + 1.8, 8]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <Html center position={[0, h + 1.75, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
              <div
                style={{
                  font: '600 13px Inter, system-ui, sans-serif',
                  color: '#fff',
                  background: on ? 'rgba(15,23,42,.92)' : 'rgba(15,23,42,.6)',
                  border: `1px solid ${col}`,
                  padding: '4px 9px',
                  borderRadius: 9,
                  whiteSpace: 'nowrap',
                  transform: on ? 'scale(1.25)' : 'none',
                }}
              >
                {s.name} <span style={{ color: col }}>{s.level}%</span>
              </div>
            </Html>
          </group>
        )
      })}

      {/* me, walking around the inner ring (and pausing to wave / check my tablet) */}
      <group ref={walker}>
        <Avatar anim={anim} shirt="#2dd4bf" scale={1.25} reduced={reduced} />
      </group>
    </>
  )
}

/* ═══ Contact → the signal hub ═══════════════════════════════════════════ */
const HUB_STOPS: Stop[] = [
  { p: [1.7, 0, 2.3], ry: 2.64, anim: 'type', dur: 6 }, // at the control console
  { p: [0, 0, 1.5], ry: 0, anim: 'wave', dur: 4 }, // greeting the visitor
  { p: [-3.4, 0, 1.0], ry: 0.6, anim: 'think', dur: 3.5 },
  { p: [-3.2, 0, -2.3], ry: 0.9, anim: 'point', dur: 3 }, // pointing up at the beacon
  { p: [-1.8, 0, 1.8], ry: 0, anim: 'wave', dur: 3.5 },
]

export function SignalHub({ reduced }: RoomProps) {
  const rings = useRef<(Group | null)[]>([])
  useFrame(({ clock }) => {
    rings.current.forEach((g, i) => {
      if (!g) return
      const p = reduced ? 0.3 + i * 0.3 : (clock.elapsedTime * 0.3 + i / 3) % 1
      g.scale.setScalar(0.4 + p * 5.5)
      const m = (g.children[0] as unknown as { material: { opacity: number } }).material
      m.opacity = (1 - p) * 0.55
    })
  })
  return (
    <>
      <Ground accent="#a78bfa" r={11} grass="#2a3b78" />
      <pointLight position={[0, 6, 2]} intensity={40} color="#d6ccff" distance={0} decay={2} />
      {/* central beacon */}
      <group position={[0, 0, -1.4]}>
        <Cyl p={[0, 0.3, 0]} r0={1.5} r1={1.1} h={0.6} seg={6} c="#4c3f91" />
        <Cone p={[0, 3.6, 0]} r0={0.7} h={6.6} seg={6} c="#6b5bd2" />
        {[1.2, 2.2, 3.2, 4.2].map((y, i) => (
          <Torus key={y} p={[0, y, 0]} r0={0.62 - i * 0.1} t={0.03} c="#67e8f9" rx={PI / 2} />
        ))}
        <Spin speed={1.2} p={[0, 6.4, 0]} reduced={reduced}>
          <Torus r0={1.0} t={0.04} c="#a78bfa" rx={PI / 2} />
          <Torus r0={0.75} t={0.04} c="#67e8f9" rx={PI / 2.8} />
        </Spin>
        <Glow p={[0, 7.2, 0]} r0={0.38} c="#e9d5ff" d={1} />
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 7.2, 0]} rotation={[PI / 2, 0, 0]} ref={(g) => void (rings.current[i] = g)}>
            <mesh>
              <torusGeometry args={[1, 0.02, 6, 48]} />
              <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      {/* dishes around the hub */}
      {[0.9, 2.1, 3.7, 5.2].map((a, i) => (
        <group key={a} position={[Math.sin(a) * 6.2, 0, Math.cos(a) * 6.2 - 1]} rotation={[0, a + PI, 0]}>
          <Cyl p={[0, 0.9, 0]} r0={0.14} h={1.8} c="#94a3b8" />
          <Cyl p={[0, 2.1, 0.5]} r0={0.1} r1={1.15} h={0.7} seg={10} c="#e9edff" rx={-1.1} open />
          <Cyl p={[0, 2.6, 1.1]} r0={0.03} h={1.0} c="#cbd5ff" rx={-1.1} />
          <Blink p={[0, 2.95, 1.55]} c="#f87171" r0={0.1} phase={i} />
        </group>
      ))}
      {/* antennas */}
      {[-7.5, -5.4, 5.4, 7.5].map((x, i) => (
        <group key={x} position={[x, 0, -5 + (i % 2) * 2.4]}>
          <Cone p={[0, 2, 0]} r0={0.18} h={4} seg={4} c="#cbd5ff" />
          <Torus p={[0, 3.2, 0]} r0={0.4} t={0.02} c="#67e8f9" rx={PI / 2} />
          <Blink p={[0, 4.1, 0]} c="#f0abfc" r0={0.1} phase={i} />
        </group>
      ))}
      {/* control console + me */}
      <group position={[2.2, 0, 1.4]} rotation={[0, -0.5, 0]}>
        <Box p={[0, 0.5, 0]} s={[2.2, 1.0, 0.9]} c="#312e81" />
        <Box p={[0, 1.04, 0.1]} s={[2.0, 0.06, 0.65]} c="#1e1b4b" rx={-0.2} />
        {[-0.7, -0.35, 0, 0.35, 0.7].map((x, i) => (
          <Glow key={x} p={[x, 1.1, 0.15]} r0={0.06} c={i % 2 ? '#67e8f9' : '#f0abfc'} />
        ))}
        <Box p={[0, 1.9, -0.2]} s={[1.5, 0.9, 0.06]} c="#0b1220" e="#a78bfa" ei={0.7} />
      </group>
      <RoamAvatar stops={HUB_STOPS} shirt="#a78bfa" reduced={reduced} />
      {/* messages orbiting */}
      <Spin speed={0.5} p={[0, 0, -1.4]} reduced={reduced}>
        <Bob p={[3.4, 3.4, 0]} reduced={reduced}>
          <Box s={[0.8, 0.55, 0.06]} c="#f8fafc" e="#67e8f9" ei={0.3} />
          <Cone p={[0, 0.08, 0.05]} r0={0.4} h={0.26} seg={3} rx={PI} c="#cbd5ff" />
        </Bob>
        <Bob p={[-3.2, 4, 1.4]} speed={2} reduced={reduced}>
          <Box s={[0.7, 0.45, 0.06]} c="#a78bfa" e="#a78bfa" ei={0.5} />
          <Ico p={[-0.2, -0.32, 0]} r0={0.1} c="#a78bfa" />
        </Bob>
        <Bob p={[0.4, 5, -3.2]} speed={1.3} reduced={reduced}>
          <Box s={[0.4, 0.7, 0.06]} c="#0f172a" e="#22d3ee" ei={0.5} />
        </Bob>
      </Spin>
    </>
  )
}

/* ═══ Experience → inside an orbital satellite module ═════════════════════ */
const SAT_R = 15
const SAT_H = 7.5

export function SatelliteInterior({ accent, reduced }: { accent: string; reduced: boolean }) {
  const AP = SAT_R * Math.cos(PI / 12) // wall apothem
  const W = 2 * SAT_R * Math.sin(PI / 12) + 0.12
  const HULL = '#27345f'
  const stars = useMemo(() => {
    const rnd = mulberry32(21)
    return Array.from({ length: 46 }, () => {
      const a = rnd() * PI * 2
      const d = 36 + rnd() * 14
      return { p: [Math.sin(a) * d, 0.5 + rnd() * 24, Math.cos(a) * d] as V3, r: 0.1 + rnd() * 0.14 }
    })
  }, [])

  return (
    <>
      {/* floor + ceiling */}
      <Cyl p={[0, -0.15, 0]} r0={SAT_R + 0.3} h={0.3} seg={12} c="#1a2547" />
      <Torus p={[0, 0.02, 0]} r0={SAT_R - 0.6} t={0.05} c={accent} />
      <Torus p={[0, 0.02, 0]} r0={4.4} t={0.03} c="#4a669f" />
      <Cyl p={[0, 0.012, 0]} r0={4.2} h={0.02} seg={12} c="#2a3a6e" />
      {Array.from({ length: 12 }, (_, i) => (
        <Box key={i} p={[Math.sin(i * PI / 6 + PI / 12) * 9.4, 0.015, Math.cos(i * PI / 6 + PI / 12) * 9.4]} s={[0.12, 0.02, 9]} c="#334a85" ry={i * PI / 6 + PI / 12} />
      ))}
      <mesh position={[0, SAT_H, 0]} rotation={[PI / 2, 0, 0]}>
        <circleGeometry args={[SAT_R + 0.3, 12]} />
        <meshStandardMaterial color="#1e2a52" flatShading roughness={0.9} />
      </mesh>
      <Torus p={[0, SAT_H - 0.05, 0]} r0={12} t={0.08} c={accent} />
      <Torus p={[0, SAT_H - 0.05, 0]} r0={5.5} t={0.06} c="#ffffff" />
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} p={[Math.sin(i * PI / 3) * 8.6, SAT_H - 0.04, Math.cos(i * PI / 3) * 8.6]} s={[0.8, 0.05, 5]} c="#ffffff" e="#e0f2fe" ei={0.9} ry={i * PI / 3} />
      ))}
      <pointLight position={[0, 6, 0]} intensity={70} color="#e6efff" distance={0} decay={2} />
      <pointLight position={[0, 2.4, -9]} intensity={30} color={accent} distance={0} decay={2} />

      {/* hull wall: windows (every 3rd bay) alternate with solid equipment bays */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * PI) / 6
        const win = i % 3 === 0
        return (
          <group key={i} rotation={[0, a, 0]}>
            <group position={[0, 0, -AP]}>
              <Box p={[0, 0.55, 0]} s={[W, 1.1, 0.35]} c={HULL} />
              <Box p={[0, SAT_H - 0.55, 0]} s={[W, 1.1, 0.35]} c={HULL} />
              <Box p={[0, 1.12, 0.19]} s={[W - 0.3, 0.07, 0.04]} c={accent} e={accent} ei={0.9} />
              {win ? (
                <>
                  {/* window frame — open onto space */}
                  <Box p={[-W / 2 + 0.25, SAT_H / 2, 0]} s={[0.5, SAT_H - 2.2, 0.35]} c={HULL} />
                  <Box p={[W / 2 - 0.25, SAT_H / 2, 0]} s={[0.5, SAT_H - 2.2, 0.35]} c={HULL} />
                  <Box p={[0, SAT_H / 2, 0]} s={[0.12, SAT_H - 2.2, 0.12]} c="#8aa0d6" />
                  <Box p={[0, SAT_H - 1.2, 0.19]} s={[W - 0.9, 0.06, 0.04]} c="#67e8f9" e="#67e8f9" ei={0.8} />
                </>
              ) : (
                <>
                  <Box p={[0, SAT_H / 2, 0]} s={[W, SAT_H - 2.2, 0.35]} c={HULL} />
                  <Box p={[0, SAT_H / 2 + 0.2, 0.19]} s={[W - 1.2, SAT_H - 3.2, 0.04]} c="#1b2750" />
                  {[-1, 0, 1].map((k) => (
                    <Box key={k} p={[k * 1.1, 1.8, 0.23]} s={[0.7, 0.35, 0.03]} c="#0b1220" e={i % 2 ? '#22d3ee' : '#a78bfa'} ei={0.6} />
                  ))}
                  {[0, 1, 2, 3].map((k) => (
                    <Box key={k} p={[0, 2.6 + k * 0.22, 0.22]} s={[W - 1.6, 0.06, 0.03]} c="#3b4f8a" />
                  ))}
                  <Blink p={[W / 2 - 0.7, 3.9, 0.22]} c={i % 2 ? '#34d399' : '#fbbf24'} r0={0.06} phase={i} />
                </>
              )}
            </group>
            {/* corner pillar */}
            <Box p={[Math.sin(PI / 12) * SAT_R, SAT_H / 2, -Math.cos(PI / 12) * SAT_R]} s={[0.5, SAT_H, 0.5]} c="#1b2750" ry={-PI / 12} />
          </group>
        )
      })}


      {/* extra life in the big hall: consoles, pods, cargo and plants around the rim */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * PI) / 6
        const r = SAT_R - 1.6
        return (
          <group key={i} position={[Math.sin(a) * r, 0, Math.cos(a) * r]} rotation={[0, a + PI, 0]}>
            {i % 3 === 0 ? (
              <>
                <Box p={[-2.3, 0.4, 0]} s={[0.9, 0.8, 0.9]} c="#d6a35c" />
                <Box p={[-1.6, 0.3, 0.2]} s={[0.6, 0.6, 0.6]} c="#e1b46d" ry={0.3} />
                <Box p={[2.2, 0.3, 0]} s={[0.7, 0.6, 0.7]} c="#c9923f" ry={-0.3} />
                <Plant p={[0, 0, 0.2]} s={1.5} />
              </>
            ) : (
              <>
                <Box p={[0, 0.55, 0]} s={[3.2, 1.1, 1]} c="#2d3a6a" />
                <Box p={[0, 1.18, 0.1]} s={[3.0, 0.06, 0.8]} c="#1b2750" rx={-0.25} />
                {[-1, -0.5, 0, 0.5, 1].map((x, k) => (
                  <Glow key={k} p={[x, 1.22, 0.2]} r0={0.06} c={k % 2 ? '#67e8f9' : '#f0abfc'} />
                ))}
                <Box p={[0, 2.1, -0.3]} s={[2.4, 1.1, 0.06]} c="#0b1220" e={accent} ei={0.6} />
              </>
            )}
          </group>
        )
      })}
      {/* hanging pipes and cables */}
      {Array.from({ length: 6 }, (_, i) => (
        <Cyl key={i} p={[Math.sin(i * PI / 3 + 0.5) * 11, SAT_H - 1.2, Math.cos(i * PI / 3 + 0.5) * 11]} r0={0.14} h={2.4} seg={6} c="#64748b" />
      ))}

      {/* what is outside: planet, solar wings, a dish, a moon, stars */}
      <group rotation={[0, 0, 0]}>
        <Ico p={[-5, 8, -50]} r0={15} d={2} c="#2f7fd6" />
        <Ico p={[-11, 18, -36]} r0={3} d={0} c="#3fbf68" />
        <Ico p={[-1, 13, -36.5]} r0={3.4} d={0} c="#4ade80" />
      </group>
      <group rotation={[0, (PI * 3) / 6, 0]} position={[0, 0, 0]}>
        <group position={[0, 2.9, -(AP + 4.5)]}>
          <Cyl p={[0, 0, 2.5]} r0={0.14} h={5} c="#94a3b8" rx={PI / 2} />
          {[-1, 1].map((sx) => (
            <group key={sx} position={[sx * 2.6, 0, 0]}>
              <Box s={[4.2, 0.06, 2.1]} c="#1d4ed8" e="#38bdf8" ei={0.3} />
              {[-1, 0, 1].map((k) => (
                <Box key={k} p={[k * 1.4, 0.05, 0]} s={[0.04, 0.02, 2.1]} c="#e0f2fe" />
              ))}
            </group>
          ))}
        </group>
      </group>
      <group rotation={[0, PI, 0]}>
        <group position={[2.5, 3.2, -(AP + 4)]}>
          <Cyl p={[0, -1.1, 0]} r0={0.1} h={2.2} c="#94a3b8" />
          <Cyl p={[0, 0.3, 0.3]} r0={0.06} r1={1.7} h={0.9} seg={10} c="#e9edff" rx={-0.9} open />
          <Blink p={[0, 1.0, 0.9]} c="#f87171" r0={0.14} phase={2} />
        </group>
        <Ico p={[-14, 8, -(AP + 14)]} r0={3} d={1} c="#cbd5ff" />
      </group>
      <group rotation={[0, -PI / 2, 0]}>
        <group position={[-1, 3.0, -(AP + 5)]}>
          <Spin speed={0.2} p={[0, 0, 0]} reduced={reduced}>
            <Torus r0={2.4} t={0.07} c="#a78bfa" rx={PI / 2} />
          </Spin>
          <Glow r0={0.5} c="#e9d5ff" d={1} />
        </group>
      </group>
      {stars.map((s, i) => (
        <Glow key={i} p={s.p} r0={s.r} c="#ffffff" />
      ))}
    </>
  )
}

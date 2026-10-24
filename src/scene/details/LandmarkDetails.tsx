import { portfolio } from '../../data/portfolio'
import { Blink, Bob, Box, Cone, Cyl, Glow, Ico, PI, Spin, Strip, Torus } from './parts'
import type { V3 } from './parts'

/* ═══ About → research station: a small working base with a hologram ═════ */
export function AboutDetail({ reduced }: { reduced: boolean }) {
  const crates: [V3, number][] = [
    [[-0.38, 0.03, -0.3], 0.3],
    [[-0.3, 0.03, -0.36], -0.2],
    [[-0.34, 0.085, -0.32], 0.5],
  ]
  return (
    <>
      {/* rover */}
      <group position={[-0.47, 0, 0.2]} rotation={[0, 0.6, 0]}>
        <Box p={[0, 0.05, 0]} s={[0.13, 0.04, 0.08]} c="#e9edff" m={0.3} />
        <Box p={[0.01, 0.082, 0]} s={[0.06, 0.03, 0.06]} c="#22d3ee" e="#22d3ee" ei={0.5} />
        {(
          [
            [-0.045, -0.047],
            [0.045, -0.047],
            [-0.045, 0.047],
            [0.045, 0.047],
          ] as const
        ).map(([x, z], i) => (
          <Cyl key={i} p={[x, 0.026, z]} r0={0.026} h={0.022} c="#1e293b" seg={8} rx={PI / 2} />
        ))}
        <Cyl p={[0.045, 0.13, 0]} r0={0.004} h={0.1} c="#cbd5ff" />
        <Glow p={[0.045, 0.185, 0]} r0={0.011} c="#a78bfa" />
      </group>

      {/* flag */}
      <Cyl p={[0.44, 0.15, 0.3]} r0={0.007} h={0.3} c="#cbd5ff" m={0.5} />
      <Box p={[0.485, 0.265, 0.3]} s={[0.09, 0.055, 0.004]} c="#8b5cf6" e="#8b5cf6" ei={0.6} />

      {/* supply crates */}
      {crates.map(([p, ry], i) => (
        <Box key={i} p={p} s={[0.06, 0.06, 0.06]} ry={ry} c={i === 2 ? '#fcd34d' : '#94a3b8'} />
      ))}

      {/* solar stands */}
      {[-0.16, 0.12].map((x, i) => (
        <group key={i} position={[x, 0, -0.46]}>
          <Cyl p={[0, 0.04, 0]} r0={0.01} h={0.08} c="#94a3b8" />
          <Box p={[0, 0.1, 0]} s={[0.2, 0.012, 0.11]} rx={-0.7} c="#1e3a8a" e="#22d3ee" ei={0.35} m={0.3} />
        </group>
      ))}

      {/* beam + hologram: the "who is behind this portfolio" avatar */}
      <Cyl p={[0, 0.52, 0]} r0={0.17} r1={0.05} h={0.9} seg={10} c="#22d3ee" e="#22d3ee" ei={1} o={0.09} open />
      <Bob p={[0, 1.02, 0]} reduced={reduced}>
        <Spin speed={0.9} reduced={reduced}>
          <Ico p={[0, 0.07, 0]} r0={0.06} d={1} c="#9be7ff" e="#22d3ee" ei={0.9} o={0.9} />
          <Cone p={[0, -0.04, 0]} r0={0.09} h={0.17} seg={6} rx={PI} c="#9be7ff" e="#22d3ee" ei={0.7} o={0.85} />
        </Spin>
        <Torus p={[0, -0.16, 0]} r0={0.14} t={0.006} c="#67e8f9" />
        <Spin speed={-1.4} reduced={reduced}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * PI * 2
            return (
              <Box
                key={i}
                p={[Math.cos(a) * 0.23, 0.02 + i * 0.03, Math.sin(a) * 0.23]}
                s={[0.04, 0.04, 0.04]}
                ry={a}
                c={['#67e8f9', '#a78bfa', '#2dd4bf'][i]}
                e={['#22d3ee', '#8b5cf6', '#14b8a6'][i]}
                ei={0.9}
              />
            )
          })}
        </Spin>
      </Bob>
      <Blink p={[0.17, 0.62, -0.05]} c="#ff6b6b" r0={0.014} />
    </>
  )
}

/* ═══ Contact → beacon compound: dishes, control hut, orbiting message icons ═ */
function Dish({ p, ry }: { p: V3; ry: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Cyl p={[0, 0.07, 0]} r0={0.03} r1={0.018} h={0.14} c="#94a3b8" m={0.4} />
      <group position={[0, 0.17, 0]} rotation={[-0.95, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.1, 9, 5, 0, PI * 2, PI / 2, PI / 2]} />
          <meshStandardMaterial color="#eef2ff" flatShading side={2} metalness={0.3} roughness={0.5} />
        </mesh>
        <Cyl p={[0, 0.07, 0]} r0={0.004} h={0.14} c="#cbd5ff" />
        <Glow p={[0, 0.145, 0]} r0={0.014} c="#67e8f9" />
      </group>
    </group>
  )
}

export function ContactDetail({ reduced }: { reduced: boolean }) {
  const hut: [number, number] = [0.4, 0.14]
  const dishes: { p: V3; ry: number }[] = [
    { p: [-0.36, 0, 0.14], ry: 2.4 },
    { p: [-0.18, 0, -0.38], ry: 1.2 },
    { p: [0.08, 0, 0.44], ry: -2.6 },
  ]
  return (
    <>
      {/* control hut */}
      <group position={[hut[0], 0, hut[1]]} rotation={[0, -0.35, 0]}>
        <Box p={[0, 0.07, 0]} s={[0.24, 0.14, 0.17]} c="#dfe6ff" />
        <Cone p={[0, 0.17, 0]} r0={0.17} h={0.08} seg={4} ry={PI / 4} c="#ff6b6b" />
        <Box p={[0, 0.085, 0.087]} s={[0.1, 0.05, 0.004]} c="#fde68a" e="#fbbf24" ei={0.9} />
        <Box p={[-0.085, 0.045, 0.087]} s={[0.04, 0.09, 0.004]} c="#334e8c" />
        <Cyl p={[0.07, 0.24, -0.03]} r0={0.006} h={0.14} c="#cbd5ff" />
        <Blink p={[0.07, 0.315, -0.03]} c="#ff6b6b" r0={0.013} phase={1} />
      </group>

      {dishes.map((d, i) => (
        <Dish key={i} {...d} />
      ))}

      {/* glowing cables */}
      <Strip from={[0.12, 0.02]} to={hut} c="#67e8f9" />
      {dishes.map((d, i) => (
        <Strip key={i} from={[d.p[0] * 0.5, d.p[2] * 0.5]} to={[d.p[0], d.p[2]]} c="#a78bfa" />
      ))}

      {/* pylons */}
      {(
        [
          [0.3, -0.34],
          [-0.42, -0.1],
          [-0.05, 0.3],
        ] as const
      ).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cyl p={[0, 0.11, 0]} r0={0.014} r1={0.008} h={0.22} c="#cbd5ff" m={0.4} />
          <Blink p={[0, 0.235, 0]} c={i % 2 ? '#67e8f9' : '#c4b5fd'} phase={i * 2} />
        </group>
      ))}

      {/* message icons orbiting the beacon's signal orb */}
      <group position={[0, 0.94, 0]}>
        <Spin speed={0.7} reduced={reduced}>
          {/* envelope */}
          <group position={[0.34, 0.02, 0]} rotation={[0, PI / 2, 0]}>
            <Box s={[0.11, 0.07, 0.012]} c="#ffffff" e="#c4b5fd" ei={0.35} />
            <Cone p={[0, 0.0175, 0.008]} r0={0.058} h={0.035} seg={3} rz={PI} rx={PI / 2} c="#ddd6fe" />
          </group>
          {/* phone */}
          <group position={[-0.17, -0.02, 0.295]} rotation={[0, -PI / 6, 0]}>
            <Box s={[0.055, 0.1, 0.012]} c="#1e293b" />
            <Box p={[0, 0, 0.007]} s={[0.044, 0.084, 0.004]} c="#a78bfa" e="#8b5cf6" ei={0.9} />
          </group>
          {/* chat bubble */}
          <group position={[-0.17, 0.04, -0.295]}>
            <Ico r0={0.05} d={1} c="#67e8f9" e="#22d3ee" ei={0.8} />
            <Cone p={[0.03, -0.05, 0]} r0={0.02} h={0.04} seg={3} rz={0.6} c="#67e8f9" e="#22d3ee" ei={0.8} />
          </group>
        </Spin>
      </group>
    </>
  )
}

/* ═══ Skills → energy tower plaza: conduits, pylons and orbiting energy orbs ═ */
export function SkillsDetail({ reduced }: { reduced: boolean }) {
  const cats = portfolio.skillCategories
  return (
    <>
      <Torus p={[0, 0.07, 0]} r0={0.5} t={0.007} c="#22d3ee" />
      {[-0.14, 0.14].map((v) => (
        <group key={v}>
          <Strip from={[-0.5, v]} to={[0.5, v]} y={0.07} t={0.01} c="#22d3ee" />
          <Strip from={[v, -0.5]} to={[v, 0.5]} y={0.07} t={0.01} c="#a78bfa" />
        </group>
      ))}

      {/* corner crystals */}
      {(
        [
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
        ] as const
      ).map(([x, z], i) => (
        <group key={i} position={[x * 0.92, 0, z * 0.92]}>
          <Cone p={[0, 0.14, 0]} r0={0.05} h={0.28} seg={4} c={cats[i % cats.length].color} e={cats[i % cats.length].color} ei={0.7} o={0.9} />
          <Cone p={[0, 0.03, 0]} r0={0.07} h={0.06} seg={4} rx={PI} c="#1e293b" />
        </group>
      ))}

      {/* orbiting orbs, one per skill category */}
      <group position={[0, 1.2, 0]}>
        <Torus r0={0.66} t={0.004} c="#67e8f9" opacity={0.6} />
        <Spin speed={0.55} reduced={reduced}>
          {cats.map((c, i) => {
            const a = (i / cats.length) * PI * 2
            return <Glow key={c.id} p={[Math.cos(a) * 0.66, Math.sin(a * 2) * 0.05, Math.sin(a) * 0.66]} r0={0.045} c={c.color} d={1} />
          })}
        </Spin>
      </group>
    </>
  )
}

/* ═══ Experience → a fully-fitted orbital station ═════════════════════════ */
export function StationDetail({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <>
      <Torus r0={0.115} t={0.013} c="#cfe0ff" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * PI * 2
        return <Glow key={i} p={[Math.cos(a) * 0.115, 0, Math.sin(a) * 0.115]} r0={0.011} c={i % 2 ? '#fde68a' : accent} />
      })}

      {/* docking port */}
      <Cyl p={[0, 0, 0.1]} r0={0.02} h={0.1} seg={8} rx={PI / 2} c="#9fb0e8" m={0.4} />
      <Cone p={[0, 0, 0.17]} r0={0.03} h={0.05} seg={8} rx={PI / 2} c="#dfe6ff" />

      {/* cargo pods */}
      {[-0.045, 0, 0.045].map((x, i) => (
        <Cyl key={i} p={[x, -0.075, 0]} r0={0.02} h={0.06} seg={7} c={i === 1 ? accent : '#dfe6ff'} e={i === 1 ? accent : undefined} ei={0.5} />
      ))}

      {/* comms mast */}
      <Cyl p={[0, 0.155, 0]} r0={0.004} h={0.09} c="#cbd5ff" />
      <Cone p={[0, 0.215, 0]} r0={0.025} h={0.02} seg={7} c="#e9edff" />

      {/* patrol drone */}
      <Spin speed={1.7} reduced={reduced}>
        <group position={[0.24, 0.05, 0]}>
          <Box s={[0.028, 0.012, 0.028]} c="#e9edff" />
          <Box p={[0, 0.011, 0]} s={[0.05, 0.003, 0.006]} c="#64748b" />
          <Glow p={[0, -0.012, 0]} r0={0.007} c={accent} />
        </group>
      </Spin>
    </>
  )
}

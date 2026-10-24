import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { PROJECT_VARIANTS } from '../../data/projectVariants'
import { Blink, Bob, Box, Cone, Cyl, Glow, Ico, PI, Spin, Torus } from './parts'

interface P {
  accent: string
  reduced: boolean
}

/* ═══ 1 · Payroll System → office tower, coin stacks, payslip, big coin ═══ */
function Payroll({ accent, reduced }: P) {
  const rows = [0, 1, 2, 3, 4, 5]
  const cols = [-1, 0, 1]
  return (
    <>
      <Box p={[-0.15, 0.31, -0.06]} s={[0.23, 0.62, 0.23]} c="#dbe4ff" />
      <Box p={[-0.15, 0.635, -0.06]} s={[0.26, 0.026, 0.26]} c="#334e8c" />
      {rows.map((r) =>
        cols.map((c) => {
          const lit = (r + c + 3) % 3 === 0
          return (
            <Box
              key={`${r}${c}`}
              p={[-0.15 + c * 0.066, 0.08 + r * 0.09, 0.0585]}
              s={[0.04, 0.046, 0.006]}
              c={lit ? '#fde68a' : '#7dd3fc'}
              e={lit ? '#fbbf24' : '#38bdf8'}
              ei={0.75}
            />
          )
        }),
      )}
      <Box p={[-0.15, 0.7, -0.06]} s={[0.09, 0.06, 0.09]} c="#94a3b8" />
      <Cyl p={[-0.15, 0.78, -0.06]} r0={0.006} h={0.1} c="#cbd5ff" />
      <Glow p={[-0.15, 0.835, -0.06]} r0={0.016} c="#ff6b6b" />

      {/* coin stacks */}
      {[
        { x: 0.2, z: 0.12, n: 6 },
        { x: 0.3, z: -0.08, n: 3 },
        { x: 0.14, z: -0.14, n: 4 },
      ].map((s, k) =>
        Array.from({ length: s.n }, (_, i) => (
          <Cyl key={`${k}${i}`} p={[s.x, 0.016 + i * 0.031, s.z]} r0={0.058} h={0.028} seg={10} c={accent} e={accent} ei={0.25} m={0.5} r={0.35} />
        )),
      )}

      {/* calculator */}
      <group position={[0.02, 0.012, 0.27]} rotation={[0, 0.25, 0]}>
        <Box p={[0, 0.0, 0]} s={[0.12, 0.024, 0.16]} c="#1e293b" />
        <Box p={[0, 0.015, -0.05]} s={[0.09, 0.006, 0.04]} c="#86efac" e="#22c55e" ei={0.5} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <Box key={`${r}${c}`} p={[(c - 1) * 0.032, 0.015, 0.0 + r * 0.032]} s={[0.022, 0.006, 0.022]} c="#e2e8f0" />
          )),
        )}
      </group>

      {/* floating payslip + spinning coin */}
      <Bob p={[0.26, 0.62, 0.14]} reduced={reduced} amp={0.025}>
        <group rotation={[0, -0.5, 0.08]}>
          <Box s={[0.14, 0.18, 0.006]} c="#ffffff" />
          {[0.05, 0.02, -0.01].map((y) => (
            <Box key={y} p={[-0.01, y, 0.004]} s={[0.09, 0.008, 0.002]} c="#94a3b8" />
          ))}
          <Box p={[0, -0.06, 0.004]} s={[0.1, 0.02, 0.002]} c={accent} e={accent} ei={0.4} />
        </group>
      </Bob>
      <Bob p={[0.0, 0.95, 0.05]} reduced={reduced} amp={0.035} speed={1.3}>
        <Spin speed={1.6} reduced={reduced}>
          <Cyl r0={0.1} h={0.022} seg={12} rx={PI / 2} c="#fde68a" e={accent} ei={0.5} m={0.6} r={0.3} />
          <Cyl r0={0.065} h={0.026} seg={12} rx={PI / 2} c={accent} />
        </Spin>
      </Bob>
    </>
  )
}

/* ═══ 2 · Supplements Landing Page → hero jar on a display + products ═════ */
function Supplements({ accent, reduced }: P) {
  const bottles = [
    { a: 0.2, h: 0.17, c: '#fb923c' },
    { a: 1.45, h: 0.13, c: '#a78bfa' },
    { a: 2.7, h: 0.19, c: '#38bdf8' },
    { a: 3.95, h: 0.14, c: '#f472b6' },
    { a: 5.2, h: 0.16, c: accent },
  ]
  return (
    <>
      {/* display pedestal */}
      <Cyl p={[0, 0.03, 0]} r0={0.27} r1={0.25} h={0.06} seg={10} c="#f4f7ff" />
      <Cyl p={[0, 0.066, 0]} r0={0.2} h={0.012} seg={10} c={accent} e={accent} ei={0.5} />

      {/* ring of products */}
      {bottles.map((b, i) => (
        <group key={i} position={[Math.cos(b.a) * 0.15, 0.072, Math.sin(b.a) * 0.15]}>
          <Cyl p={[0, b.h / 2, 0]} r0={0.04} h={b.h} seg={8} c="#ffffff" />
          <Cyl p={[0, b.h * 0.5, 0]} r0={0.043} h={b.h * 0.42} seg={8} c={b.c} e={b.c} ei={0.2} />
          <Cyl p={[0, b.h + 0.012, 0]} r0={0.03} h={0.024} seg={8} c="#1f2a44" />
        </group>
      ))}

      {/* hero jar */}
      <Spin speed={0.7} reduced={reduced}>
        <group position={[0, 0.07, 0]}>
          <Cyl p={[0, 0.13, 0]} r0={0.085} h={0.26} seg={10} c="#ffffff" r={0.4} />
          <Cyl p={[0, 0.13, 0]} r0={0.089} h={0.12} seg={10} c={accent} e={accent} ei={0.3} />
          <Cyl p={[0, 0.275, 0]} r0={0.066} h={0.035} seg={10} c="#1f2a44" />
          <Box p={[0, 0.13, 0.09]} s={[0.07, 0.05, 0.004]} c="#ffffff" />
        </group>
      </Spin>

      {/* orbiting capsules */}
      <group position={[0, 0.55, 0]}>
        <Spin speed={0.9} reduced={reduced}>
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.3, Math.sin(a * 1.5) * 0.06, Math.sin(a) * 0.3]} rotation={[0.6, a, 0.4]}>
                <capsuleGeometry args={[0.024, 0.05, 3, 6]} />
                <meshStandardMaterial color={i % 2 ? '#ffffff' : accent} emissive={i % 2 ? '#000000' : accent} emissiveIntensity={0.4} flatShading />
              </mesh>
            )
          })}
        </Spin>
      </group>

      {/* greenery + banner */}
      {(
        [
          [-0.34, 0.1],
          [0.34, -0.12],
          [0.0, -0.36],
          [-0.2, 0.33],
        ] as const
      ).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cone p={[0, 0.09, 0]} r0={0.075} h={0.18} seg={5} c="#2f9e57" />
          <Cone p={[0, 0.19, 0]} r0={0.05} h={0.14} seg={5} c="#3fbf68" />
        </group>
      ))}
      <Cyl p={[0.32, 0.22, 0.26]} r0={0.008} h={0.44} c="#cbd5ff" />
      <Box p={[0.37, 0.4, 0.26]} s={[0.1, 0.06, 0.004]} c={accent} e={accent} ei={0.5} />
    </>
  )
}

/* ═══ 3 · Google Sheets monitoring → live board, bars and a pie chart ═════ */
function Sheets({ accent, reduced }: P) {
  const slices = [
    { a: 0, l: 2.3, c: accent },
    { a: 2.3, l: 1.5, c: '#e8fff1' },
    { a: 3.8, l: 1.2, c: '#86efac' },
    { a: 5.0, l: 1.283, c: '#16a34a' },
  ]
  const bars = [0.12, 0.2, 0.15, 0.3, 0.22, 0.36]
  return (
    <>
      {/* monitor board */}
      <Box p={[0, 0.3, -0.22]} s={[0.54, 0.34, 0.022]} c="#0f172a" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <Box
            key={`${r}${c}`}
            p={[(c - 2) * 0.1, 0.4 - r * 0.085, -0.208]}
            s={[0.088, 0.07, 0.004]}
            c={r === 0 ? accent : (r + c) % 2 ? '#e8fff1' : '#bbf7d0'}
            e={r === 0 ? accent : undefined}
            ei={0.4}
          />
        )),
      )}
      <Cyl p={[0, 0.07, -0.22]} r0={0.03} h={0.14} c="#94a3b8" />
      <Box p={[0, 0.012, -0.22]} s={[0.2, 0.024, 0.1]} c="#334155" />

      {/* rising bar chart */}
      {bars.map((h, i) => (
        <Box key={i} p={[(i - 2.5) * 0.095, h / 2 + 0.01, 0.06]} s={[0.07, h, 0.07]} c={i % 3 === 0 ? accent : '#e8fff1'} e={i % 3 === 0 ? accent : undefined} ei={0.3} />
      ))}
      <Box p={[0, 0.006, 0.06]} s={[0.62, 0.012, 0.14]} c="#14532d" />

      {/* floating pie */}
      <Bob p={[0.0, 0.78, 0.04]} reduced={reduced} amp={0.03}>
        <group rotation={[-0.95, 0, 0]}>
          <Spin speed={0.6} reduced={reduced}>
            {slices.map((s, i) => (
              <mesh key={i}>
                <cylinderGeometry args={[0.14, 0.14, 0.035, 14, 1, false, s.a, s.l]} />
                <meshStandardMaterial color={s.c} emissive={i === 0 ? s.c : '#000000'} emissiveIntensity={i === 0 ? 0.45 : 0} flatShading roughness={0.5} />
              </mesh>
            ))}
          </Spin>
        </group>
      </Bob>
      <Glow p={[0.4, 0.5, 0.2]} r0={0.025} c="#86efac" d={1} />
      <Glow p={[-0.4, 0.62, 0.1]} r0={0.02} c="#e8fff1" d={1} />
    </>
  )
}

/* ═══ 4 · UGC Management System → phone feed, ring light, camera, hearts ═ */
function Heart({ phase, reduced, color }: { phase: number; reduced: boolean; color: string }) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = reduced ? 0.4 : (clock.elapsedTime * 0.3 + phase) % 1
    g.position.y = 0.36 + t * 0.55
    g.position.x = 0.2 + Math.sin(t * 6 + phase * 9) * 0.04
    g.scale.setScalar(Math.max(0.0001, Math.sin(t * PI)))
  })
  return (
    <group ref={ref} position={[0.2, 0.4, 0.06]}>
      <Ico p={[-0.016, 0.01, 0]} r0={0.022} c={color} e={color} ei={0.8} />
      <Ico p={[0.016, 0.01, 0]} r0={0.022} c={color} e={color} ei={0.8} />
      <Cone p={[0, -0.014, 0]} r0={0.036} h={0.05} seg={4} rx={PI} ry={PI / 4} c={color} e={color} ei={0.8} />
    </group>
  )
}

function Ugc({ accent, reduced }: P) {
  return (
    <>
      {/* phone */}
      <Bob p={[-0.02, 0.32, 0]} reduced={reduced} amp={0.015}>
        <group rotation={[0, 0.25, 0]}>
          <Box s={[0.17, 0.3, 0.018]} c="#1e293b" />
          <Box p={[0, 0, 0.0105]} s={[0.145, 0.265, 0.004]} c="#6d28d9" e={accent} ei={0.55} />
          <Box p={[0, 0.07, 0.0135]} s={[0.12, 0.09, 0.003]} c="#ddd6fe" />
          <Cone p={[0.004, 0.07, 0.018]} r0={0.025} h={0.035} seg={3} rz={-PI / 2} c="#ffffff" />
          {[-0.015, -0.05, -0.085].map((y) => (
            <Box key={y} p={[0, y, 0.0135]} s={[0.12, 0.022, 0.003]} c="#a78bfa" />
          ))}
        </group>
      </Bob>

      {/* hearts floating up from the feed */}
      {[0, 0.34, 0.68].map((p, i) => (
        <Heart key={i} phase={p} reduced={reduced} color={['#fb7185', '#f472b6', '#fb923c'][i]} />
      ))}

      {/* ring light on a stand */}
      <group position={[-0.3, 0, -0.12]}>
        <Cyl p={[0, 0.17, 0]} r0={0.008} h={0.34} c="#94a3b8" />
        <Torus p={[0, 0.4, 0]} r0={0.1} t={0.013} c="#fffbeb" rx={0.1} />
        {[-1, 0, 1].map((i) => (
          <Cone key={i} p={[i * 0.04, 0.012, 0.02 * Math.abs(i)]} r0={0.012} h={0.03} seg={4} ry={i} c="#64748b" />
        ))}
      </group>

      {/* camera on tripod */}
      <group position={[0.3, 0, 0.14]} rotation={[0, -0.5, 0]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * PI * 2
          return (
            <Cyl
              key={i}
              p={[Math.cos(a) * 0.05, 0.1, Math.sin(a) * 0.05]}
              r0={0.007}
              h={0.22}
              c="#475569"
              rx={Math.sin(a) * 0.3}
              rz={-Math.cos(a) * 0.3}
            />
          )
        })}
        <Box p={[0, 0.25, 0]} s={[0.1, 0.07, 0.06]} c="#1e293b" />
        <Cyl p={[0, 0.25, 0.062]} r0={0.026} h={0.06} seg={8} rx={PI / 2} c="#334155" />
        <Glow p={[0, 0.25, 0.095]} r0={0.014} c={accent} />
        <Blink p={[0.038, 0.292, 0]} c="#ff3b3b" r0={0.009} />
      </group>

      {/* content cards stacked behind */}
      {[-0.28, 0, 0.28].map((r, i) => (
        <group key={i} position={[0.0 + r * 0.45, 0.16, -0.3]} rotation={[0, 0, -r * 0.5]}>
          <Box s={[0.12, 0.2, 0.014]} c="#f4f1ff" />
          <Box p={[0, 0.03, 0.009]} s={[0.1, 0.1, 0.004]} c={['#c4b5fd', accent, '#7dd3fc'][i]} e={accent} ei={i === 1 ? 0.4 : 0} />
        </group>
      ))}
    </>
  )
}

/* ═══ 5 · Inventory → warehouse, racks, stacked boxes, stock terminal ═════ */
function Warehouse({ accent, reduced }: P) {
  const carton = ['#d6a35c', '#e1b46d', '#c9923f']
  return (
    <>
      {/* shed with roller door */}
      <Box p={[-0.17, 0.1, -0.1]} s={[0.36, 0.2, 0.28]} c="#d3e6ee" />
      <Box p={[-0.17, 0.215, -0.1]} s={[0.4, 0.03, 0.32]} c={accent} />
      <Box p={[-0.17, 0.235, -0.1]} s={[0.34, 0.02, 0.1]} c="#e9fbff" />
      <Box p={[-0.17, 0.075, 0.042]} s={[0.15, 0.14, 0.006]} c="#475569" />
      {[0.03, 0.06, 0.09, 0.12].map((y) => (
        <Box key={y} p={[-0.17, y + 0.01, 0.047]} s={[0.15, 0.006, 0.004]} c="#94a3b8" />
      ))}
      <Blink p={[-0.05, 0.17, 0.042]} c="#34d399" r0={0.009} />
      {/* shelving unit with stock */}
      <group position={[0.24, 0, -0.14]}>
        {[-0.095, 0.095].map((x) => (
          <Box key={x} p={[x, 0.15, 0]} s={[0.012, 0.3, 0.08]} c="#2563eb" />
        ))}
        {[0.05, 0.15, 0.25].map((y, j) => (
          <group key={y}>
            <Box p={[0, y, 0]} s={[0.2, 0.012, 0.08]} c="#f59e0b" />
            {[-0.06, 0, 0.06].map((x, k) => (
              <Box key={x} p={[x, y + 0.03, 0]} s={[0.05, 0.045, 0.06]} c={carton[(j + k) % 3]} />
            ))}
          </group>
        ))}
      </group>
      {/* pyramid of boxes + a pallet */}
      <Box p={[0.16, 0.012, 0.14]} s={[0.17, 0.024, 0.14]} c="#a16207" />
      {[0, 1, 2].map((i) => (
        <Box key={i} p={[0.1 + i * 0.06, 0.05, 0.14]} s={[0.055, 0.05, 0.055]} c={carton[i]} />
      ))}
      <Box p={[0.13, 0.1, 0.14]} s={[0.055, 0.05, 0.055]} c={carton[1]} />
      <Box p={[0.19, 0.1, 0.14]} s={[0.055, 0.05, 0.055]} c={carton[0]} />
      <Box p={[0.16, 0.15, 0.14]} s={[0.055, 0.05, 0.055]} c={carton[2]} />
      {/* wooden crates */}
      <Box p={[-0.38, 0.03, 0.1]} s={[0.07, 0.06, 0.07]} c="#c9923f" ry={0.3} />
      <Box p={[-0.33, 0.085, 0.1]} s={[0.055, 0.05, 0.055]} c="#e1b46d" ry={-0.2} />
      {/* stock-monitoring terminal */}
      <group position={[-0.02, 0, 0.2]} rotation={[0, 0.2, 0]}>
        <Box p={[0, 0.05, 0]} s={[0.1, 0.1, 0.05]} c="#1e293b" />
        <Box p={[0, 0.14, 0.005]} s={[0.14, 0.09, 0.012]} c="#0b1220" rx={-0.15} />
        <Box p={[0, 0.14, 0.013]} s={[0.12, 0.07, 0.004]} c="#0b1220" e={accent} ei={0.6} rx={-0.15} />
        {[0.012, 0.03, 0.02, 0.04].map((h, i) => (
          <Box key={i} p={[-0.036 + i * 0.024, 0.115 + h / 2, 0.017]} s={[0.014, h, 0.003]} c="#ffffff" e={accent} ei={0.9} rx={-0.15} />
        ))}
      </group>
      <Bob p={[0.0, 0.45, -0.1]} amp={0.025} reduced={reduced}>
        <Spin speed={0.9} reduced={reduced}>
          <Box s={[0.07, 0.07, 0.07]} c="#e9fbff" e={accent} ei={0.5} />
        </Spin>
      </Bob>
    </>
  )
}

/* ═══ 6 · MRP → little factory: tanks, conveyor, chimney, glowing screens ═ */
function Factory({ accent, reduced }: P) {
  return (
    <>
      {/* main building with sawtooth roof + chimney */}
      <Box p={[-0.2, 0.1, -0.1]} s={[0.34, 0.2, 0.24]} c="#d9dde8" />
      {[-0.29, -0.2, -0.11].map((x) => (
        <Cone key={x} p={[x, 0.235, -0.1]} r0={0.085} h={0.07} seg={3} ry={PI / 2} rz={0} c="#8b95b0" />
      ))}
      <Cyl p={[-0.33, 0.33, -0.18]} r0={0.028} r1={0.022} h={0.26} seg={8} c="#94a3b8" />
      <Box p={[-0.33, 0.465, -0.18]} s={[0.07, 0.016, 0.07]} c={accent} />
      <Bob p={[-0.33, 0.55, -0.18]} amp={0.03} speed={1.2} reduced={reduced}>
        <Ico r0={0.032} d={0} c="#cbd5e1" o={0.7} />
      </Bob>
      <Box p={[-0.2, 0.1, 0.022]} s={[0.26, 0.08, 0.004]} c="#0b1220" e={accent} ei={0.8} />
      {[-0.08, 0, 0.08].map((x) => (
        <Box key={x} p={[-0.2 + x, 0.1, 0.026]} s={[0.05, 0.05, 0.003]} c="#fde68a" e="#fbbf24" ei={0.9} />
      ))}
      {/* mixing tanks with pipe */}
      {[0.17, 0.32].map((x, i) => (
        <group key={x} position={[x, 0, -0.14]}>
          <Cyl p={[0, 0.17, 0]} r0={0.065} h={0.22} seg={8} c="#cbd5e1" m={0.4} />
          <Cone p={[0, 0.34, 0]} r0={0.065} h={0.06} seg={8} c="#94a3b8" />
          <Torus p={[0, 0.17, 0]} r0={0.068} t={0.007} c={accent} rx={PI / 2} />
          <Cyl p={[0, 0.04, 0]} r0={0.04} r1={0.065} h={0.08} seg={8} c="#64748b" rx={0} />
          <Spin speed={2 + i} p={[0, 0.375, 0]} reduced={reduced}>
            <Box s={[0.07, 0.008, 0.012]} c="#f8fafc" />
          </Spin>
        </group>
      ))}
      <Cyl p={[0.245, 0.27, -0.14]} r0={0.01} h={0.1} seg={5} c="#64748b" rz={PI / 2} />
      {/* conveyor belt with cartons */}
      <group position={[0.05, 0, 0.18]}>
        <Box p={[0, 0.04, 0]} s={[0.5, 0.045, 0.09]} c="#1e293b" />
        <Box p={[0, 0.067, 0.047]} s={[0.5, 0.012, 0.008]} c={accent} e={accent} ei={0.8} />
        <Box p={[0, 0.067, -0.047]} s={[0.5, 0.012, 0.008]} c={accent} e={accent} ei={0.8} />
        {[-0.18, -0.04, 0.1, 0.22].map((x, i) => (
          <Bob key={x} p={[x, 0.1, 0]} amp={0.004} speed={2 + i * 0.3} reduced={reduced}>
            <Box s={[0.06, 0.05, 0.06]} c="#e1b46d" />
          </Bob>
        ))}
        {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
          <Cyl key={x} p={[x, 0.02, 0]} r0={0.014} h={0.1} seg={6} c="#475569" rx={PI / 2} />
        ))}
      </group>
      {/* material bags */}
      {[0, 1, 2].map((i) => (
        <Box key={i} p={[-0.4, 0.025 + (i % 2) * 0.045, 0.14 - i * 0.05]} s={[0.07, 0.04, 0.045]} c="#f1ede4" ry={0.15 * i} />
      ))}
      {/* glowing monitoring screen */}
      <group position={[0.42, 0, 0.08]} rotation={[0, -0.6, 0]}>
        <Cyl p={[0, 0.07, 0]} r0={0.008} h={0.14} seg={5} c="#64748b" />
        <Box p={[0, 0.17, 0]} s={[0.12, 0.08, 0.01]} c="#0b1220" e={accent} ei={0.7} />
        {[0, 1, 2].map((i) => (
          <Blink key={i} p={[-0.035 + i * 0.035, 0.17, 0.008]} c={i === 2 ? '#fbbf24' : '#34d399'} r0={0.008} phase={i} />
        ))}
      </group>
    </>
  )
}

/* ═══ 7 · Maintenance → workshop, tool rack, AC unit, wrench + gear ═══════ */
function Workshop({ accent, reduced }: P) {
  return (
    <>
      {/* workshop with pitched roof */}
      <Box p={[-0.17, 0.095, -0.1]} s={[0.32, 0.19, 0.26]} c="#e1efe7" />
      <Cone p={[-0.17, 0.235, -0.1]} r0={0.24} h={0.1} seg={4} ry={PI / 4} c={accent} />
      <Box p={[-0.17, 0.07, 0.032]} s={[0.1, 0.13, 0.006]} c="#475569" />
      <Box p={[-0.3, 0.12, 0.032]} s={[0.06, 0.06, 0.006]} c="#0b1220" e="#a7f3d0" ei={0.5} />
      {/* wall AC unit on the side */}
      <group position={[0.0, 0.14, -0.1]}>
        <Box s={[0.012, 0.055, 0.14]} c="#f8fafc" />
        <Box p={[0.007, -0.015, 0]} s={[0.006, 0.006, 0.12]} c={accent} />
        <Bob p={[0.03, -0.045, 0]} amp={0.008} speed={2} reduced={reduced}>
          <Glow r0={0.008} c="#bae6fd" />
        </Bob>
      </group>
      {/* floor AC condenser with spinning fan */}
      <group position={[0.2, 0, 0.0]}>
        <Box p={[0, 0.045, 0]} s={[0.12, 0.09, 0.1]} c="#e2e8f0" />
        <Cyl p={[0, 0.05, 0.052]} r0={0.036} h={0.006} seg={10} rx={PI / 2} c="#475569" />
        <Spin speed={5} p={[0, 0.05, 0.058]} reduced={reduced} axis="z">
          <Box s={[0.07, 0.01, 0.003]} c="#cbd5e1" />
          <Box s={[0.01, 0.07, 0.003]} c="#cbd5e1" />
        </Spin>
      </group>
      {/* tool rack */}
      <group position={[0.28, 0, -0.2]}>
        <Box p={[0, 0.12, 0]} s={[0.2, 0.2, 0.012]} c="#92400e" />
        <Box p={[-0.05, 0.13, 0.012]} s={[0.012, 0.13, 0.008]} c="#cbd5e1" rz={0.15} />
        <Torus p={[-0.058, 0.2, 0.012]} r0={0.013} t={0.005} c="#cbd5e1" rx={0} />
        <Box p={[0.01, 0.12, 0.012]} s={[0.012, 0.12, 0.008]} c="#f87171" />
        <Box p={[0.01, 0.185, 0.012]} s={[0.05, 0.022, 0.01]} c="#64748b" />
        <Box p={[0.06, 0.12, 0.012]} s={[0.012, 0.11, 0.008]} c="#fbbf24" rz={-0.12} />
        <Box p={[-0.02, 0.025, 0.04]} s={[0.07, 0.05, 0.05]} c="#dc2626" />
      </group>
      {/* gear + wrench decorations */}
      <Spin speed={0.8} p={[-0.34, 0.1, 0.18]} reduced={reduced} axis="z">
        <Cyl r0={0.06} h={0.02} seg={8} rx={PI / 2} c="#94a3b8" m={0.5} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} s={[0.03, 0.03, 0.02]} p={[Math.cos((i * PI) / 3) * 0.075, Math.sin((i * PI) / 3) * 0.075, 0]} c="#94a3b8" rz={(i * PI) / 3} />
        ))}
        <Cyl r0={0.022} h={0.024} seg={6} rx={PI / 2} c="#0f172a" />
      </Spin>
      <group position={[0.1, 0.02, 0.2]} rotation={[0, 0.5, 0]}>
        <Box p={[0, 0.01, 0]} s={[0.15, 0.014, 0.025]} c="#cbd5e1" />
        <Torus p={[0.08, 0.012, 0]} r0={0.025} t={0.012} c="#cbd5e1" rx={PI / 2} />
        <Torus p={[-0.08, 0.012, 0]} r0={0.02} t={0.01} c="#cbd5e1" rx={PI / 2} />
      </group>
      {/* service terminal */}
      <group position={[-0.02, 0, 0.19]} rotation={[0, 0.25, 0]}>
        <Box p={[0, 0.05, 0]} s={[0.09, 0.1, 0.05]} c="#1e293b" />
        <Box p={[0, 0.14, 0.004]} s={[0.13, 0.085, 0.012]} c="#0b1220" rx={-0.15} />
        <Box p={[0, 0.14, 0.012]} s={[0.115, 0.07, 0.004]} c="#0b1220" e={accent} ei={0.6} rx={-0.15} />
        <Blink p={[-0.04, 0.155, 0.016]} c="#34d399" r0={0.008} />
        <Blink p={[0, 0.155, 0.016]} c="#fbbf24" r0={0.008} phase={1} />
        <Blink p={[0.04, 0.155, 0.016]} c="#f87171" r0={0.008} phase={2} />
      </group>
    </>
  )
}

export function ProjectDetail({ index, accent, reduced }: { index: number; accent: string; reduced: boolean }) {
  switch (index % PROJECT_VARIANTS) {
    case 0:
      return <Payroll accent={accent} reduced={reduced} />
    case 1:
      return <Supplements accent={accent} reduced={reduced} />
    case 2:
      return <Sheets accent={accent} reduced={reduced} />
    case 3:
      return <Ugc accent={accent} reduced={reduced} />
    case 4:
      return <Warehouse accent={accent} reduced={reduced} />
    case 5:
      return <Factory accent={accent} reduced={reduced} />
    default:
      return <Workshop accent={accent} reduced={reduced} />
  }
}

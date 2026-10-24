import type { ReactNode } from 'react'
import { PROJECT_VARIANTS } from '../../data/projectVariants'
import { Blink, Bob, Box, Cone, Cyl, Glow, Ico, PI, Spin, Torus } from '../details/parts'
import { Desk, Monitor } from '../stage/scenes'

/** Place a prop on a ring around the centre, with its local +z facing the middle. */
function At({ a, r, s = 1, children }: { a: number; r: number; s?: number; children: ReactNode }) {
  return (
    <group position={[Math.sin(a) * r, 0, Math.cos(a) * r]} rotation={[0, a + PI, 0]} scale={s}>
      {children}
    </group>
  )
}
const ring = (n: number, off = 0) => Array.from({ length: n }, (_, i) => off + (i * PI * 2) / n)
/** Angles spread across the far side only, so nothing blocks the first camera view. */
const arc = (n: number, margin = 1.15) => Array.from({ length: n }, (_, i) => margin + (i * (PI * 2 - margin * 2)) / Math.max(1, n - 1))
const BACK = PI // the side the camera looks at first

function Floor({ c, accent, stripe }: { c: string; accent: string; stripe?: string }) {
  return (
    <>
      <Cyl p={[0, -0.9, 0]} r0={22} h={1.8} seg={24} c="#1c2750" />
      <Cyl p={[0, -0.15, 0]} r0={13.5} h={0.3} seg={24} c={c} />
      <Torus p={[0, 0.02, 0]} r0={13} t={0.08} c={accent} />
      <Torus p={[0, 0.02, 0]} r0={4.2} t={0.05} c={stripe ?? '#4a669f'} />
      <Torus p={[0, 0.02, 0]} r0={9.6} t={0.03} c={stripe ?? '#4a669f'} />
    </>
  )
}

/* ═══ 0 · Payroll System → an accounts & payroll hall with a vault ════════ */
function PayrollPlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <>
      <Floor c="#2d3b6b" accent={accent} stripe="#fbbf24" />
      {/* columns */}
      {ring(10).map((a, i) => (
        <At key={i} a={a} r={12.2}>
          <Box p={[0, 0.2, 0]} s={[1.3, 0.4, 1.3]} c="#aab6e8" />
          <Cyl p={[0, 3.3, 0]} r0={0.5} h={6} seg={8} c="#dbe3ff" />
          <Box p={[0, 6.4, 0]} s={[1.3, 0.4, 1.3]} c="#aab6e8" />
        </At>
      ))}
      {/* the vault */}
      <At a={BACK} r={10.4}>
        <Box p={[0, 3.6, -0.9]} s={[9, 7.2, 0.8]} c="#334155" />
        <Cyl p={[0, 3.4, 0]} r0={3} h={0.7} seg={16} rx={PI / 2} c="#64748b" />
        <Torus p={[0, 3.4, 0.4]} r0={2.4} t={0.14} c="#fbbf24" rx={0} />
        {[0, 1, 2].map((k) => (
          <Box key={k} p={[0, 3.4, 0.5]} s={[4.4, 0.16, 0.12]} c="#fbbf24" rz={(k * PI) / 3} />
        ))}
        <Ico p={[0, 3.4, 0.7]} r0={0.45} d={0} c="#fde68a" e="#fbbf24" ei={0.5} />
        <Cyl p={[0, 6.4, 0.1]} r0={0.9} h={0.12} seg={12} rx={PI / 2} c="#f8fafc" />
        <Box p={[0, 6.55, 0.2]} s={[0.06, 0.4, 0.02]} c="#0f172a" />
        <Box p={[0.15, 6.4, 0.2]} s={[0.3, 0.06, 0.02]} c="#0f172a" />
      </At>
      {/* workstations */}
      {ring(4, 0.55).map((a, i) => (
        <At key={i} a={a} r={7.4}>
          <Desk len={2.4} />
          <Monitor p={[-0.6, 0.85, 0]} ry={0} c="#38bdf8" />
          <Monitor p={[0.6, 0.85, 0]} ry={0} c={accent} />
          <Box p={[0, 0.35, 1.0]} s={[0.6, 0.1, 0.6]} c="#334155" />
          <Box p={[0, 0.8, 1.25]} s={[0.55, 0.7, 0.08]} c="#475569" />
        </At>
      ))}
      {/* filing cabinets */}
      {ring(5, 2.2).map((a, i) => (
        <At key={i} a={a} r={10.2}>
          <Box p={[0, 0.9, 0]} s={[1.2, 1.8, 0.8]} c="#94a3b8" />
          {[0.35, 0.9, 1.45].map((y) => (
            <Box key={y} p={[0, y, 0.42]} s={[0.9, 0.04, 0.02]} c="#334155" />
          ))}
        </At>
      ))}
      {/* coins and payslips */}
      {ring(6, 0.4).map((a, i) => (
        <At key={i} a={a} r={5.4}>
          {Array.from({ length: 2 + (i % 4) }, (_, k) => (
            <Cyl key={k} p={[0, 0.07 + k * 0.14, 0]} r0={0.45} h={0.12} seg={10} c="#fbbf24" e="#f59e0b" ei={0.25} />
          ))}
        </At>
      ))}
      {ring(7, 0.2).map((a, i) => (
        <Bob key={i} p={[Math.sin(a) * 6.6, 2.6 + (i % 3) * 0.7, Math.cos(a) * 6.6]} speed={1 + (i % 3) * 0.3} reduced={reduced}>
          <group rotation={[0, a + PI, 0]}>
            <Box s={[0.8, 1.0, 0.03]} c="#f8fafc" />
            <Box p={[0, 0.3, 0.02]} s={[0.5, 0.05, 0.01]} c={accent} />
            <Box p={[0, 0.1, 0.02]} s={[0.6, 0.04, 0.01]} c="#94a3b8" />
            <Box p={[0, -0.05, 0.02]} s={[0.6, 0.04, 0.01]} c="#94a3b8" />
          </group>
        </Bob>
      ))}
      <Spin speed={0.7} p={[0, 5.4, 0]} reduced={reduced}>
        <Cyl r0={0.7} h={0.14} seg={12} c="#fbbf24" e="#f59e0b" ei={0.5} />
      </Spin>
      <pointLight position={[0, 6, 0]} intensity={40} color="#fff3d6" distance={0} decay={2} />
    </>
  )
}

/* ═══ 1 · Supplements Landing Page → a product showroom ═══════════════════ */
function Bottle({ c, s = 1 }: { c: string; s?: number }) {
  return (
    <group scale={s}>
      <Cyl p={[0, 0.3, 0]} r0={0.2} h={0.6} seg={8} c={c} />
      <Cyl p={[0, 0.66, 0]} r0={0.13} h={0.14} seg={8} c="#f8fafc" />
      <Box p={[0, 0.3, 0.19]} s={[0.26, 0.28, 0.01]} c="#ffffff" />
    </group>
  )
}
function SupplementsPlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  const cols = ['#34d399', '#fb923c', '#a78bfa', '#38bdf8', '#f472b6']
  return (
    <>
      <Floor c="#2c5a58" accent={accent} stripe="#86efac" />
      {/* hero bottle on a podium */}
      <At a={BACK} r={9.4}>
        <Cyl p={[0, 0.4, 0]} r0={3} h={0.8} seg={12} c="#e2e8f0" />
        <Torus p={[0, 0.82, 0]} r0={2.8} t={0.06} c={accent} />
        <Cyl p={[0, 3.3, 0]} r0={1.9} h={4.8} seg={8} c={accent} e={accent} ei={0.2} />
        <Cyl p={[0, 6.0, 0]} r0={1.3} h={0.9} seg={8} c="#f8fafc" />
        <Box p={[0, 3.3, 1.78]} s={[2.8, 2.2, 0.1]} c="#ffffff" />
        <Cone p={[-0.5, 3.3, 1.86]} r0={0.45} h={1.2} seg={5} c="#22c55e" />
        <Cone p={[0.45, 3.2, 1.86]} r0={0.35} h={0.9} seg={5} c="#16a34a" rz={-0.3} />
        <Box p={[0.1, 2.5, 1.86]} s={[2, 0.16, 0.02]} c="#0f172a" />
      </At>
      {/* shelves of product */}
      {ring(5, 0.7).map((a, i) => (
        <At key={i} a={a} r={8.4}>
          <Box p={[-1.4, 1.2, -0.2]} s={[0.1, 2.4, 0.5]} c="#e2e8f0" />
          <Box p={[1.4, 1.2, -0.2]} s={[0.1, 2.4, 0.5]} c="#e2e8f0" />
          {[0.5, 1.3, 2.1].map((y, j) => (
            <group key={y}>
              <Box p={[0, y, -0.2]} s={[2.9, 0.08, 0.55]} c="#f1f5f9" />
              {[-1, -0.5, 0, 0.5, 1].map((x, k) => (
                <group key={x} position={[x, y + 0.04, -0.2]}>
                  <Bottle c={cols[(i + j + k) % 5]} s={0.85} />
                </group>
              ))}
            </group>
          ))}
        </At>
      ))}
      {/* podiums with floating ingredients */}
      {ring(6, 0.2).map((a, i) => (
        <At key={i} a={a} r={5.4}>
          <Cyl p={[0, 0.3, 0]} r0={0.6} r1={0.5} h={0.6} seg={8} c="#e2e8f0" />
          <Bob p={[0, 1.3, 0]} amp={0.1} speed={1.2 + i * 0.2} reduced={reduced}>
            {i % 3 === 0 ? (
              <Ico r0={0.3} d={1} c="#fb923c" e="#f97316" ei={0.25} />
            ) : i % 3 === 1 ? (
              <Cone r0={0.25} h={0.7} seg={5} c="#22c55e" rz={0.4} />
            ) : (
              <Cyl r0={0.12} h={0.4} seg={8} c="#fde68a" rz={PI / 2} e="#fbbf24" ei={0.3} />
            )}
          </Bob>
        </At>
      ))}
      {/* herbs and trees around the rim */}
      {ring(14, 0.1).map((a, i) => (
        <At key={i} a={a} r={12.2 + (i % 2) * 0.4} s={1.2 + (i % 3) * 0.3}>
          <Cyl p={[0, 0.2, 0]} r0={0.07} h={0.4} c="#6b4a2f" />
          <Cone p={[0, 0.8, 0]} r0={0.4} h={0.9} seg={6} c="#2f9e57" />
          <Cone p={[0, 1.3, 0]} r0={0.28} h={0.7} seg={6} c="#4ade80" />
        </At>
      ))}
      {/* dumbbells */}
      {ring(3, 3.6).map((a, i) => (
        <At key={i} a={a} r={6.9}>
          <Cyl p={[0, 0.3, 0]} r0={0.06} h={1.4} seg={6} c="#94a3b8" rz={PI / 2} />
          {[-0.65, 0.65].map((x) => (
            <Cyl key={x} p={[x, 0.3, 0]} r0={0.3} h={0.14} seg={8} c="#1e293b" rz={PI / 2} />
          ))}
        </At>
      ))}
      {/* banners */}
      {ring(3, 1.6).map((a, i) => (
        <At key={i} a={a} r={10.8}>
          <Cyl p={[0, 2.5, 0]} r0={0.05} h={5} c="#cbd5ff" />
          <Box p={[0, 4.0, 0.06]} s={[1.0, 2.2, 0.03]} c={cols[i]} e={cols[i]} ei={0.25} />
        </At>
      ))}
      <pointLight position={[0, 6, 1]} intensity={42} color="#f0fff4" distance={0} decay={2} />
    </>
  )
}

/* ═══ 2 · Google Sheets Free Sample Monitoring → warehouse + giant sheet ═══ */
function Cartons({ n = 3, tint = '#d6a35c' }: { n?: number; tint?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} position={[(i - (n - 1) / 2) * 0.55, 0.22, 0]} rotation={[0, (i % 2) * 0.12, 0]}>
          <Box s={[0.48, 0.44, 0.48]} c={i % 2 ? tint : '#e1b46d'} />
          <Box p={[0, 0.221, 0]} s={[0.1, 0.01, 0.49]} c="#fde68a" />
        </group>
      ))}
    </>
  )
}
function SamplePlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  const hot = new Set([4, 9, 13, 17, 22, 26])
  return (
    <>
      <Floor c="#2a3a66" accent={accent} stripe="#fbbf24" />
      {/* the giant spreadsheet */}
      <At a={BACK} r={10.5}>
        <Box p={[0, 4.2, -0.4]} s={[11, 6.2, 0.3]} c="#0f172a" />
        <Box p={[0, 6.7, -0.2]} s={[10.6, 0.6, 0.05]} c={accent} e={accent} ei={0.7} />
        {Array.from({ length: 7 }, (_, i) => (
          <Box key={i} p={[-4.5 + i * 1.5, 4.0, -0.2]} s={[0.04, 5.2, 0.03]} c="#34d399" e="#34d399" ei={0.5} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <Box key={i} p={[0, 1.8 + i * 0.85, -0.2]} s={[10.6, 0.04, 0.03]} c="#34d399" e="#34d399" ei={0.5} />
        ))}
        {Array.from({ length: 30 }, (_, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          return hot.has(i) ? (
            <Box key={i} p={[-3.75 + col * 1.5, 2.2 + row * 0.85, -0.15]} s={[1.3, 0.65, 0.04]} c="#34d399" e="#34d399" ei={0.8} o={0.85} />
          ) : null
        })}
        <Cyl p={[0, 0.5, 0.4]} r0={0.2} h={1} c="#94a3b8" />
      </At>
      {/* racks */}
      {ring(5, 0.5).map((a, i) => (
        <At key={i} a={a} r={8.6}>
          {[-1.5, 1.5].map((x) => (
            <Box key={x} p={[x, 1.5, 0]} s={[0.1, 3.0, 0.7]} c="#2563eb" />
          ))}
          {[0.1, 1.1, 2.1].map((y, j) => (
            <group key={y}>
              <Box p={[0, y, 0]} s={[3.1, 0.08, 0.7]} c="#f59e0b" />
              <group position={[0, y + 0.04, 0]}>
                <Cartons n={4} tint={j % 2 ? '#c9923f' : '#d6a35c'} />
              </group>
              <Blink p={[1.35, y + 0.4, 0.36]} c={(i + j) % 2 ? '#34d399' : '#fbbf24'} r0={0.05} phase={i + j} />
            </group>
          ))}
        </At>
      ))}
      {/* pallets */}
      {ring(4, 1.0).map((a, i) => (
        <At key={i} a={a} r={5.9}>
          <Box p={[0, 0.1, 0]} s={[1.5, 0.2, 1.5]} c="#a16207" />
          <group position={[0, 0.2, 0]}>
            <Cartons n={2} />
          </group>
          <group position={[0, 0.65, 0]}>
            <Cartons n={2} tint="#e1b46d" />
          </group>
        </At>
      ))}
      {/* scanner arch + conveyor */}
      <group position={[0, 0, -5.4]}>
        <Box p={[0, 0.3, 0]} s={[8, 0.5, 1.3]} c="#1e293b" />
        <Box p={[0, 0.58, 0.62]} s={[8, 0.06, 0.06]} c={accent} e={accent} ei={0.8} />
        <Box p={[0, 0.58, -0.62]} s={[8, 0.06, 0.06]} c={accent} e={accent} ei={0.8} />
        {[-2.8, -1.4, 0.6, 2.4].map((x) => (
          <group key={x} position={[x, 0.55, 0]}>
            <Cartons n={1} />
          </group>
        ))}
        {[-0.9, 0.9].map((x) => (
          <Box key={x} p={[x + 0.2, 1.4, 0]} s={[0.18, 2.2, 0.18]} c="#64748b" />
        ))}
        <Box p={[0.2, 2.55, 0]} s={[2.1, 0.22, 0.3]} c="#334155" />
        <Box p={[0.2, 2.42, 0.1]} s={[1.7, 0.03, 0.02]} c="#f87171" e="#f87171" ei={1} />
      </group>
      {/* floating sample tags */}
      {ring(6, 0.3).map((a, i) => (
        <Bob key={i} p={[Math.sin(a) * 4.6, 2.8 + (i % 2) * 0.8, Math.cos(a) * 4.6]} speed={1.1 + i * 0.15} reduced={reduced}>
          <Box s={[0.6, 0.4, 0.04]} c="#f8fafc" e="#34d399" ei={0.15} />
          <Glow p={[-0.18, 0, 0.04]} r0={0.05} c="#34d399" />
        </Bob>
      ))}
      <pointLight position={[0, 6, 1]} intensity={42} color="#eaf3ff" distance={0} decay={2} />
    </>
  )
}

/* ═══ 3 · UGC Management System → content studio + moderation wall ════════ */
function UGCPlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  const pal = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa', '#f472b6', '#fb923c']
  return (
    <>
      <Floor c="#35306a" accent={accent} stripe="#f0abfc" />
      {/* moderation wall */}
      <At a={BACK} r={10.5}>
        <Box p={[0, 4.0, -0.5]} s={[11.5, 6.4, 0.3]} c="#0b1220" />
        {Array.from({ length: 24 }, (_, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          const c = pal[(i * 3 + row) % pal.length]
          return (
            <group key={i} position={[-4.2 + col * 1.68, 6.0 - row * 1.5, -0.3]}>
              <Box s={[1.45, 1.25, 0.05]} c="#111c36" e={c} ei={0.5} />
              <Glow p={[-0.5, -0.45, 0.04]} r0={0.07} c={i % 4 === 0 ? '#f87171' : '#34d399'} />
            </group>
          )
        })}
        <Box p={[0, 0.6, 0.4]} s={[8, 1.2, 1.2]} c="#312e81" />
        {Array.from({ length: 8 }, (_, i) => (
          <Glow key={i} p={[-3.2 + i * 0.9, 1.25, 0.5]} r0={0.07} c={pal[i % pal.length]} />
        ))}
      </At>
      {/* ring lights */}
      {ring(3, 0.8).map((a, i) => (
        <At key={i} a={a} r={7}>
          {[-0.4, 0, 0.4].map((x, k) => (
            <Cyl key={k} p={[x * 0.9, 0.9, k === 1 ? -0.2 : 0.15]} r0={0.04} h={1.9} seg={5} c="#94a3b8" rz={x * 0.4} />
          ))}
          <Cyl p={[0, 2.0, 0]} r0={0.04} h={0.4} c="#94a3b8" />
          <Torus p={[0, 2.5, 0.1]} r0={0.75} t={0.09} c="#ffffff" rx={0} />
          <Box p={[0, 2.5, 0.04]} s={[0.3, 0.55, 0.04]} c="#0f172a" e={pal[i]} ei={0.5} />
        </At>
      ))}
      {/* cameras on tripods */}
      {ring(3, 2.4).map((a, i) => (
        <At key={i} a={a} r={6.4}>
          {[-0.35, 0.35].map((x) => (
            <Cyl key={x} p={[x, 0.75, 0]} r0={0.04} h={1.5} seg={5} c="#64748b" rz={-x * 0.5} />
          ))}
          <Box p={[0, 1.65, 0]} s={[0.7, 0.45, 0.5]} c="#1e293b" />
          <Cyl p={[0, 1.65, 0.45]} r0={0.2} h={0.4} seg={8} rx={PI / 2} c="#0b1220" e="#f0abfc" ei={0.2} />
          <Blink p={[0.28, 1.82, 0.26]} c="#ef4444" r0={0.06} phase={i} />
        </At>
      ))}
      {/* admin records */}
      {ring(5, 1.9).map((a, i) => (
        <At key={i} a={a} r={9.6}>
          <Box p={[0, 0.9, 0]} s={[1.2, 1.8, 0.8]} c="#7c6fd1" />
          {[0.35, 0.9, 1.45].map((y) => (
            <Box key={y} p={[0, y, 0.42]} s={[0.9, 0.04, 0.02]} c="#312e81" />
          ))}
        </At>
      ))}
      {/* floating posts */}
      {ring(8, 0.1).map((a, i) => {
        const R = 5.2 + (i % 2) * 1.8
        return (
          <Bob key={i} p={[Math.sin(a) * R, 2.5 + (i % 3) * 0.8, Math.cos(a) * R]} speed={1 + (i % 4) * 0.2} reduced={reduced}>
            <group rotation={[0, a + PI, 0]}>
              {i % 3 === 0 ? (
                <Ico r0={0.3} d={0} c="#f43f5e" e="#f43f5e" ei={0.6} />
              ) : i % 3 === 1 ? (
                <>
                  <Box s={[0.5, 0.9, 0.05]} c="#0f172a" e={pal[i % 7]} ei={0.35} />
                  <Box p={[0, 0.1, 0.04]} s={[0.4, 0.4, 0.01]} c={pal[(i + 2) % 7]} e={pal[(i + 2) % 7]} ei={0.6} />
                </>
              ) : (
                <>
                  <Box s={[0.9, 0.55, 0.05]} c="#f8fafc" />
                  <Cone p={[-0.2, -0.38, 0]} r0={0.14} h={0.22} seg={3} rx={PI} c="#f8fafc" />
                </>
              )}
            </group>
          </Bob>
        )
      })}
      <pointLight position={[0, 6, 1]} intensity={38} color="#f5eaff" distance={0} decay={2} />
      <pointLight position={[0, 3, -7]} intensity={16} color={accent} distance={0} decay={2} />
    </>
  )
}


/* ═══ 4 · Inventory Management System → high-bay warehouse + stock dashboard ═ */
function Forklift({ accent }: { accent: string }) {
  return (
    <>
      <Box p={[0, 0.7, 0]} s={[1.3, 0.7, 2.0]} c="#fbbf24" />
      <Box p={[0, 1.5, -0.3]} s={[1.1, 0.08, 1.0]} c="#334155" />
      {[-0.5, 0.5].map((x) => (
        <Box key={x} p={[x, 1.1, -0.3]} s={[0.06, 0.8, 0.06]} c="#334155" />
      ))}
      <Box p={[0, 0.3, 0.8]} s={[1.4, 0.3, 0.5]} c="#1e293b" />
      {[-0.55, 0.55].map((x) => (
        <Cyl key={x} p={[x, 0.3, -0.7]} r0={0.32} h={0.25} seg={8} rz={PI / 2} c="#0f172a" />
      ))}
      {/* mast + forks */}
      {[-0.35, 0.35].map((x) => (
        <Box key={x} p={[x, 1.6, 1.15]} s={[0.1, 3.0, 0.1]} c="#64748b" />
      ))}
      {[-0.35, 0.35].map((x) => (
        <Box key={x} p={[x, 0.35, 1.9]} s={[0.12, 0.06, 1.4]} c="#94a3b8" />
      ))}
      <Blink p={[0, 1.62, -0.3]} c={accent} r0={0.1} />
    </>
  )
}
function InventoryPlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  const carton = ['#d6a35c', '#e1b46d', '#c9923f']
  const bars = [0.5, 0.8, 0.62, 0.95, 0.4, 0.72, 0.55]
  return (
    <>
      <Floor c="#2c4060" accent={accent} stripe="#fbbf24" />
      {/* the stock dashboard */}
      <At a={BACK} r={10.6}>
        <Box p={[0, 4.4, -0.5]} s={[12, 6.6, 0.3]} c="#0b1220" />
        <Box p={[0, 7.4, -0.3]} s={[11.6, 0.55, 0.05]} c={accent} e={accent} ei={0.7} />
        {bars.map((h, i) => (
          <Box key={i} p={[-4.8 + i * 1.0, 1.6 + h * 1.6, -0.3]} s={[0.7, h * 3.2, 0.06]} c={accent} e={accent} ei={0.55} />
        ))}
        <Cyl p={[3.9, 5.0, -0.25]} r0={1.4} h={0.1} seg={10} rx={PI / 2} c="#0e7490" e="#22d3ee" ei={0.4} />
        <Cyl p={[3.9, 5.0, -0.15]} r0={0.7} h={0.12} seg={10} rx={PI / 2} c="#0b1220" />
        {[0, 1, 2].map((i) => (
          <Box key={i} p={[3.9 - 1.0 + i * 1.0, 3.0, -0.25]} s={[0.8, 0.35, 0.05]} c="#111c36" e={i === 2 ? '#f87171' : '#34d399'} ei={0.7} />
        ))}
      </At>
      {/* tall storage racks */}
      {arc(6).map((a, i) => (
        <At key={i} a={a} r={8.8}>
          {[-1.8, 1.8].map((x) => (
            <Box key={x} p={[x, 2.4, 0]} s={[0.14, 4.8, 0.9]} c="#2563eb" />
          ))}
          {[0.15, 1.3, 2.5, 3.7].map((y, j) => (
            <group key={y}>
              <Box p={[0, y, 0]} s={[3.8, 0.1, 0.9]} c="#f59e0b" />
              {[-1.2, -0.4, 0.4, 1.2].map((x, k) => (
                <Box key={x} p={[x, y + 0.45, 0]} s={[0.7, 0.8 - ((i + j + k) % 3) * 0.15, 0.7]} c={carton[(i + j + k) % 3]} />
              ))}
            </group>
          ))}
        </At>
      ))}
      {/* forklifts */}
      {ring(2, 0.9).map((a, i) => (
        <At key={i} a={a} r={6.6} s={1.0}>
          <Forklift accent={accent} />
        </At>
      ))}
      {/* stacked boxes */}
      {arc(5, 1.0).map((a, i) => (
        <At key={i} a={a} r={5.2 + (i % 2) * 0.6}>
          <Box p={[0, 0.1, 0]} s={[1.6, 0.2, 1.6]} c="#a16207" />
          {[0, 1, 2].map((r) => (
            <group key={r}>
              {Array.from({ length: 3 - r }, (_, k) => (
                <Box key={k} p={[(k - (2 - r) / 2) * 0.6, 0.45 + r * 0.55, 0]} s={[0.55, 0.5, 0.55]} c={carton[(i + r + k) % 3]} />
              ))}
            </group>
          ))}
        </At>
      ))}
      {/* shipping containers at the rim */}
      {ring(3, 2.1).map((a, i) => (
        <At key={i} a={a} r={11.4}>
          <Box p={[0, 1.3, 0]} s={[4, 2.6, 1.8]} c={['#0e7490', '#b45309', '#1d4ed8'][i]} />
          {Array.from({ length: 8 }, (_, k) => (
            <Box key={k} p={[-1.75 + k * 0.5, 1.3, 0.92]} s={[0.05, 2.4, 0.02]} c="#0b1220" />
          ))}
        </At>
      ))}
      {/* floating scanned packages */}
      {ring(6, 0.2).map((a, i) => (
        <Bob key={i} p={[Math.sin(a) * 3.4, 3 + (i % 2) * 0.8, Math.cos(a) * 3.4]} speed={1 + i * 0.15} reduced={reduced}>
          <Box s={[0.6, 0.5, 0.6]} c={carton[i % 3]} />
          <Box p={[0, 0.26, 0]} s={[0.12, 0.01, 0.62]} c="#fde68a" />
          <Glow p={[0, 0.5, 0]} r0={0.07} c={accent} />
        </Bob>
      ))}
      <pointLight position={[0, 6.5, 1]} intensity={44} color="#ecfeff" distance={0} decay={2} />
    </>
  )
}

/* ═══ 5 · Production MRP System → manufacturing facility ═════════════════ */
function ProductionPlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <>
      <Floor c="#33324f" accent={accent} stripe="#fbbf24" />
      {/* factory frontage at the back */}
      <At a={BACK} r={11}>
        <Box p={[0, 3.2, -0.8]} s={[14, 6.4, 1]} c="#4b5675" />
        {[-4.5, -1.5, 1.5, 4.5].map((x) => (
          <Cone key={x} p={[x, 7.2, -0.8]} r0={2.1} h={1.6} seg={3} ry={PI / 2} c="#6b7699" />
        ))}
        {[-5.6, 5.6].map((x) => (
          <group key={x}>
            <Cyl p={[x, 5.6, -0.4]} r0={0.7} r1={0.55} h={8} seg={8} c="#8a94b4" />
            <Box p={[x, 9.7, -0.4]} s={[1.5, 0.3, 1.5]} c={accent} e={accent} ei={0.4} />
            <Bob p={[x, 10.7, -0.4]} amp={0.3} speed={1} reduced={reduced}>
              <Ico r0={0.8} d={0} c="#cbd5e1" o={0.6} />
            </Bob>
          </group>
        ))}
        <Box p={[0, 3.4, -0.25]} s={[9, 2.4, 0.08]} c="#0b1220" e={accent} ei={0.55} />
        {Array.from({ length: 7 }, (_, i) => (
          <Box key={i} p={[-3.6 + i * 1.2, 3.4, -0.2]} s={[0.8, 1.5, 0.05]} c="#fde68a" e="#fbbf24" ei={0.8} o={0.35 + (i % 3) * 0.2} />
        ))}
        <Box p={[0, 1.3, -0.25]} s={[3.2, 2.6, 0.12]} c="#334155" />
      </At>
      {/* mixing tanks */}
      {arc(5, 1.3).map((a, i) => (
        <At key={i} a={a} r={8.6}>
          <Cyl p={[0, 2.2, 0]} r0={1.5} h={3.6} seg={8} c="#cbd5e1" m={0.4} />
          <Cone p={[0, 4.4, 0]} r0={1.5} h={1.1} seg={8} c="#94a3b8" />
          <Torus p={[0, 1.6, 0]} r0={1.52} t={0.07} c={accent} />
          <Torus p={[0, 3.1, 0]} r0={1.52} t={0.07} c={accent} />
          {[-0.9, 0.9].map((x) => (
            <Cyl key={x} p={[x, 0.25, 0]} r0={0.14} h={0.5} seg={5} c="#475569" />
          ))}
          <Spin speed={2.2} p={[0, 5.2, 0]} reduced={reduced}>
            <Box s={[1.6, 0.1, 0.18]} c="#f8fafc" />
          </Spin>
          <Cyl p={[0, 0.7, 1.6]} r0={0.12} h={1.4} seg={5} c="#64748b" />
          <Box p={[0, 1.6, 1.65]} s={[0.9, 0.55, 0.06]} c="#0b1220" e={accent} ei={0.7} />
          <Blink p={[0.3, 1.8, 1.7]} c="#34d399" r0={0.07} phase={i} />
        </At>
      ))}
      {/* conveyor belts */}
      {[-1, 1].map((k) => (
        <group key={k} position={[k * 6.2, 0, -1]} rotation={[0, k * 0.5, 0]}>
          <Box p={[0, 0.45, 0]} s={[1.3, 0.35, 8]} c="#1e293b" />
          <Box p={[0.66, 0.66, 0]} s={[0.08, 0.08, 8]} c={accent} e={accent} ei={0.8} />
          <Box p={[-0.66, 0.66, 0]} s={[0.08, 0.08, 8]} c={accent} e={accent} ei={0.8} />
          {[-3, -1.2, 0.8, 2.6].map((z, i) => (
            <Bob key={z} p={[0, 0.95, z]} amp={0.02} speed={2 + i * 0.3} reduced={reduced}>
              <Box s={[0.7, 0.5, 0.7]} c="#e1b46d" />
            </Bob>
          ))}
        </group>
      ))}
      {/* robot arms */}
      {[PI - 0.9, PI + 0.9, PI + 2.2].map((a, i) => (
        <At key={i} a={a} r={5.6}>
          <Cyl p={[0, 0.3, 0]} r0={0.6} h={0.6} seg={8} c="#334155" />
          <Spin speed={0.6} p={[0, 0.8, 0]} reduced={reduced}>
            <Box p={[0, 0.7, 0]} s={[0.3, 1.4, 0.3]} c="#fb923c" />
            <Box p={[0, 1.4, 0.8]} s={[0.25, 0.25, 1.6]} c="#f97316" />
            <Box p={[0, 1.25, 1.6]} s={[0.4, 0.18, 0.2]} c="#334155" />
          </Spin>
        </At>
      ))}
      {/* material bags */}
      {ring(4, 1.2).map((a, i) => (
        <At key={i} a={a} r={10.2}>
          {[0, 1, 2].map((r) => (
            <Box key={r} p={[0, 0.2 + r * 0.38, 0]} s={[1.3, 0.34, 0.8]} c="#f1ede4" ry={r * 0.12} />
          ))}
          <Box p={[0, 0.6, 0.42]} s={[0.8, 0.12, 0.02]} c={accent} />
        </At>
      ))}
      {/* production stage lights */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Glow key={i} p={[-2 + i, 6.8, -2.5]} r0={0.2} c={i < 3 ? '#34d399' : '#fbbf24'} />
      ))}
      <pointLight position={[0, 6.5, 1]} intensity={44} color="#fff1e0" distance={0} decay={2} />
      <pointLight position={[0, 3, -7]} intensity={18} color={accent} distance={0} decay={2} />
    </>
  )
}

/* ═══ 6 · Maintenance Management System → facility workshop ══════════════ */
function MaintenancePlace({ accent, reduced }: { accent: string; reduced: boolean }) {
  const states = ['#34d399', '#fbbf24', '#f87171', '#34d399', '#34d399', '#fbbf24', '#34d399', '#f87171']
  return (
    <>
      <Floor c="#2b4a52" accent={accent} stripe="#a7f3d0" />
      {/* workshop frontage + pegboard of tools */}
      <At a={BACK} r={10.6}>
        <Box p={[0, 3.3, -0.8]} s={[14, 6.6, 1]} c="#d9eee3" />
        <Cone p={[0, 8.2, -0.8]} r0={9.8} h={3.2} seg={4} ry={PI / 4} c={accent} />
        <Box p={[0, 3.2, -0.25]} s={[9, 3.6, 0.1]} c="#92400e" />
        {[-3.6, -2.2, -0.8, 0.8, 2.2, 3.6].map((x, i) => (
          <group key={x} position={[x, 3.2, -0.15]}>
            <Box s={[0.16, 1.9 - (i % 3) * 0.3, 0.06]} c="#cbd5e1" rz={(i - 2.5) * 0.04} />
            <Torus p={[0, 1.0 - (i % 3) * 0.15, 0]} r0={0.2} t={0.07} c="#cbd5e1" rx={0} />
          </group>
        ))}
        <Box p={[0, 0.7, 0.4]} s={[11, 0.18, 1.4]} c="#a16207" />
        {[-5, 5].map((x) => (
          <Box key={x} p={[x, 0.35, 0.4]} s={[0.2, 0.7, 1.2]} c="#78350f" />
        ))}
      </At>
      {/* wall-mounted AC units with spinning fans, cool air */}
      {arc(6).map((a, i) => (
        <At key={i} a={a} r={9.4}>
          <Box p={[0, 3.2, 0]} s={[3.0, 1.1, 0.9]} c="#f1f5f9" />
          <Box p={[0, 3.0, 0.46]} s={[2.6, 0.12, 0.02]} c={accent} />
          <Spin speed={5} p={[0, 1.6, 0.0]} reduced={reduced} axis="z">
            <Box s={[0.1, 0.9, 0.05]} c="#cbd5e1" />
            <Box s={[0.9, 0.1, 0.05]} c="#cbd5e1" />
          </Spin>
          <Cyl p={[0, 1.6, -0.05]} r0={0.55} h={0.08} seg={10} rx={PI / 2} c="#64748b" />
          <Bob p={[0.6, 2.4, 0.8]} amp={0.15} speed={1.5} reduced={reduced}>
            <Glow r0={0.1} c="#bae6fd" />
          </Bob>
        </At>
      ))}
      {/* room monitoring tiles */}
      <At a={BACK + 0.9} r={9.0}>
        <Box p={[0, 3.0, 0]} s={[5.4, 3.8, 0.2]} c="#0b1220" />
        {states.map((c, i) => (
          <Box key={i} p={[-1.9 + (i % 4) * 1.27, 4.0 - Math.floor(i / 4) * 1.5, 0.12]} s={[1.05, 1.15, 0.05]} c="#111c36" e={c} ei={0.55} />
        ))}
      </At>
      {/* issue board: pending / in progress / done */}
      <At a={BACK - 0.9} r={9.0}>
        <Box p={[0, 3.0, 0]} s={[5.4, 3.8, 0.2]} c="#f8fafc" />
        {['#f87171', '#fbbf24', '#34d399'].map((c, col) => (
          <group key={c} position={[-1.7 + col * 1.7, 3.0, 0.12]}>
            <Box p={[0, 1.55, 0]} s={[1.4, 0.3, 0.04]} c={c} />
            {Array.from({ length: 3 - (col === 1 ? 1 : 0) }, (_, k) => (
              <Box key={k} p={[0, 0.7 - k * 0.8, 0]} s={[1.2, 0.6, 0.04]} c="#e2e8f0" />
            ))}
          </group>
        ))}
      </At>
      {/* tool racks + workbenches */}
      {arc(4, 1.4).map((a, i) => (
        <At key={i} a={a} r={6.8}>
          <Box p={[0, 0.85, 0]} s={[2.6, 0.12, 1.0]} c="#a16207" />
          {[-1.1, 1.1].map((x) => (
            <Box key={x} p={[x, 0.4, 0]} s={[0.12, 0.8, 0.9]} c="#64748b" />
          ))}
          <Box p={[-0.7, 1.05, 0]} s={[0.5, 0.3, 0.4]} c="#dc2626" />
          <Box p={[0.5, 0.95, 0]} s={[0.9, 0.06, 0.12]} c="#cbd5e1" ry={0.5} />
          <Torus p={[0.9, 0.96, 0.05]} r0={0.14} t={0.05} c="#cbd5e1" rx={PI / 2} />
        </At>
      ))}
      {/* giant gears */}
      {[PI - 1.5, PI + 1.5, PI + 0.1].map((a, i) => (
        <group key={i} position={[Math.sin(a) * 7.4, 2.4 + i * 0.5, Math.cos(a) * 7.4]} scale={0.8}>
          <Spin speed={i % 2 ? -0.5 : 0.5} reduced={reduced} axis="z">
            <group rotation={[0, a + PI, 0]}>
              <Cyl r0={0.9} h={0.2} seg={8} rx={PI / 2} c="#94a3b8" m={0.5} />
              {Array.from({ length: 8 }, (_, k) => (
                <Box key={k} p={[Math.cos((k * PI) / 4) * 1.1, Math.sin((k * PI) / 4) * 1.1, 0]} s={[0.4, 0.4, 0.2]} c="#94a3b8" rz={(k * PI) / 4} />
              ))}
              <Cyl r0={0.3} h={0.24} seg={6} rx={PI / 2} c="#0f172a" />
            </group>
          </Spin>
        </group>
      ))}
      {/* cones and safety signs */}
      {ring(6, 0.2).map((a, i) => (
        <At key={i} a={a} r={11.8}>
          <Cone p={[0, 0.4, 0]} r0={0.35} h={0.8} seg={6} c="#fb923c" />
          <Cyl p={[0, 0.02, 0]} r0={0.45} h={0.05} seg={6} c="#1e293b" />
        </At>
      ))}
      <pointLight position={[0, 6.5, 1]} intensity={42} color="#effff7" distance={0} decay={2} />
    </>
  )
}

export function ProjectPlace({ index, accent, reduced }: { index: number; accent: string; reduced: boolean }) {
  switch (index % PROJECT_VARIANTS) {
    case 0:
      return <PayrollPlace accent={accent} reduced={reduced} />
    case 1:
      return <SupplementsPlace accent={accent} reduced={reduced} />
    case 2:
      return <SamplePlace accent={accent} reduced={reduced} />
    case 3:
      return <UGCPlace accent={accent} reduced={reduced} />
    case 4:
      return <InventoryPlace accent={accent} reduced={reduced} />
    case 5:
      return <ProductionPlace accent={accent} reduced={reduced} />
    default:
      return <MaintenancePlace accent={accent} reduced={reduced} />
  }
}

import { Color, Float32BufferAttribute, IcosahedronGeometry, Vector3 } from 'three'
import { createNoise3D, mulberry32 } from './noise'
import { GROUND_LIST, PLANET_RADIUS, PLATEAU_E, PLOT_LIST, radiusFromElevation } from './layout'

const PLATEAUS = [...GROUND_LIST, ...PLOT_LIST]

const noise = createNoise3D(11)

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const _d = new Vector3()

/** Elevation in "e" units: <0 sea floor, 0 shoreline, ~0.7 high peaks. */
export function elevation(dir: Vector3): number {
  const n =
    noise(dir.x * 1.4 + 10, dir.y * 1.4, dir.z * 1.4) * 0.62 +
    noise(dir.x * 3.1, dir.y * 3.1 + 5, dir.z * 3.1) * 0.28 +
    noise(dir.x * 6.5, dir.y * 6.5, dir.z * 6.5 + 9) * 0.1
  let e = n * 1.15 - 0.1
  // Gentle land bumps so the big landmarks always have ground to stand on.
  for (const g of GROUND_LIST) e += Math.exp(-((dir.angleTo(g.dir) / 0.5) ** 2)) * 0.5
  // Carve a channel of water around each project island so it reads as an island.
  for (const g of PLOT_LIST) {
    const a = dir.angleTo(g.dir)
    const moat = smoothstep(g.flat, g.flat + 0.05, a) * (1 - smoothstep(g.flat + 0.09, g.flat + 0.2, a))
    e = e * (1 - moat) + -0.07 * moat
  }
  // Flatten every landmark plateau last so it always wins.
  for (const g of PLATEAUS) {
    const w = 1 - smoothstep(g.flat * 0.72, g.flat, dir.angleTo(g.dir))
    e = e * (1 - w) + PLATEAU_E * w
  }
  return Math.min(e, 0.95)
}

/** True when a direction is close to a landmark plateau. */
export function nearLandmark(dir: Vector3, margin = 0.14): boolean {
  return PLATEAUS.some((g) => dir.angleTo(g.dir) < g.flat + margin)
}

const PALETTE = {
  seabed: new Color('#2f78c4'),
  sand: new Color('#e4d79a'),
  grassLow: new Color('#a6ee6a'),
  grassHigh: new Color('#63cf68'),
  hill: new Color('#6fae6c'),
  rock: new Color('#8a93a8'),
  snow: new Color('#f3f7ff'),
}

function colorFor(e: number, out: Color) {
  if (e < 0) return out.copy(PALETTE.seabed)
  if (e < 0.03) return out.copy(PALETTE.sand)
  if (e < 0.3) return out.lerpColors(PALETTE.grassLow, PALETTE.grassHigh, (e - 0.03) / 0.27)
  if (e < 0.46) return out.lerpColors(PALETTE.grassHigh, PALETTE.hill, (e - 0.3) / 0.16)
  if (e < 0.6) return out.lerpColors(PALETTE.hill, PALETTE.rock, (e - 0.46) / 0.14)
  return out.lerpColors(PALETTE.rock, PALETTE.snow, Math.min(1, (e - 0.6) / 0.12))
}

/** Faceted, displaced icosphere with one flat colour per triangle. */
export function buildTerrainGeometry(detail: number) {
  const geo = new IcosahedronGeometry(1, detail) // non-indexed → hard facets
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const rand = mulberry32(5)
  const elev = new Float32Array(pos.count)
  const v = new Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize()
    const e = elevation(v)
    elev[i] = e
    v.multiplyScalar(radiusFromElevation(e))
    pos.setXYZ(i, v.x, v.y, v.z)
  }

  const c = new Color()
  for (let i = 0; i < pos.count; i += 3) {
    const e = (elev[i] + elev[i + 1] + elev[i + 2]) / 3
    colorFor(e, c)
    c.multiplyScalar(0.93 + rand() * 0.14)
    for (let k = 0; k < 3; k++) {
      colors[(i + k) * 3] = c.r
      colors[(i + k) * 3 + 1] = c.g
      colors[(i + k) * 3 + 2] = c.b
    }
  }

  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
  return geo
}

export interface Scatter {
  position: Vector3
  normal: Vector3
  yaw: number
  scale: number
}

/** Picks random points on land for trees / houses. */
export function scatterOnLand(
  count: number,
  seed: number,
  range: [number, number],
  margin = 0.14,
): Scatter[] {
  const rand = mulberry32(seed)
  const out: Scatter[] = []
  let guard = 0
  while (out.length < count && guard++ < count * 80) {
    const u = rand() * 2 - 1
    const t = rand() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    _d.set(s * Math.cos(t), u, s * Math.sin(t))
    const e = elevation(_d)
    if (e < range[0] || e > range[1] || nearLandmark(_d, margin)) continue
    const normal = _d.clone()
    out.push({
      position: normal.clone().multiplyScalar(radiusFromElevation(e) - 0.004),
      normal,
      yaw: rand() * Math.PI * 2,
      scale: 0.7 + rand() * 0.7,
    })
  }
  return out
}

export const SEA_RADIUS = PLANET_RADIUS

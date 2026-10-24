import { Quaternion, Vector3 } from 'three'
import { portfolio } from '../data/portfolio'
import { mulberry32 } from './noise'
import type { SectionId } from '../data/portfolio'

/* ── Planet metrics ─────────────────────────────────────────────────────── */
export const PLANET_RADIUS = 2
export const PLATEAU_E = 0.2
export const LAND_SCALE = 0.35
export const SEA_SCALE = 0.15

export const radiusFromElevation = (e: number) =>
  PLANET_RADIUS + (e > 0 ? e * LAND_SCALE : e * SEA_SCALE)

export const PLATEAU_RADIUS = radiusFromElevation(PLATEAU_E)

/* ── Helpers ────────────────────────────────────────────────────────────── */
const rad = (d: number) => (d * Math.PI) / 180
const UP = new Vector3(0, 1, 0)

export function latLon(lat: number, lon: number): Vector3 {
  const la = rad(lat)
  const lo = rad(lon)
  return new Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo))
}

/** Quaternion that turns local +Y into the given surface normal. */
export function alignToNormal(normal: Vector3): Quaternion {
  return new Quaternion().setFromUnitVectors(UP, normal.clone().normalize())
}

export function tangentBasis(n: Vector3) {
  const east = new Vector3(0, 1, 0).cross(n).normalize()
  const north = n.clone().cross(east).normalize()
  return { east, north }
}

/* ── Ground landmarks (sit on flattened plateaus) ───────────────────────── */
export type GroundId = Extract<SectionId, 'about' | 'skills' | 'contact'>

export const GROUND: Record<GroundId, { dir: Vector3; flat: number }> = {
  about: { dir: latLon(12, 4), flat: 0.27 },
  skills: { dir: latLon(-8, 58), flat: 0.34 },
  contact: { dir: latLon(10, -56), flat: 0.25 },
}

export const GROUND_LIST = Object.values(GROUND)

/* ── Project islands (real islands on the planet surface) ──────────────── */
/** Angular radius (rad) of each island's flattened plateau. */
export const PLOT_FLAT = 0.19

/** Change this number to shuffle where the project islands appear. */
export const PLOT_SEED = 7

/**
 * Scatters the project islands "randomly" but evenly: for every island many
 * random spots are tried and the one farthest from all existing landmarks wins.
 * The first two islands are kept on the visible (front) side of the planet.
 */
export function plotDirs(count: number): Vector3[] {
  const rand = mulberry32(PLOT_SEED)
  const placed: Vector3[] = GROUND_LIST.map((g) => g.dir)
  const out: Vector3[] = []
  const maxLat = Math.sin(rad(58)) // keep clear of the poles
  for (let i = 0; i < count; i++) {
    const frontOnly = i < 2
    let best: Vector3 | null = null
    let bestScore = -1
    for (let k = 0; k < 400; k++) {
      const lat = Math.asin((rand() * 2 - 1) * maxLat)
      const lon = rand() * Math.PI * 2 - Math.PI
      const d = latLon((lat * 180) / Math.PI, (lon * 180) / Math.PI)
      if (frontOnly && d.z < 0.4) continue
      let nearest = Infinity
      for (const p of placed) nearest = Math.min(nearest, d.angleTo(p))
      const score = nearest + rand() * 0.25 // a little noise keeps it irregular
      if (score > bestScore) {
        bestScore = score
        best = d
      }
    }
    const d = best ?? latLon(0, 180)
    placed.push(d)
    out.push(d)
  }
  return out
}

export const PLOT_LIST = plotDirs(portfolio.projects.length).map((dir) => ({ dir, flat: PLOT_FLAT }))

/* ── Experience orbit ───────────────────────────────────────────────────── */
export const ORBIT_RADIUS = 3.3
export const ORBIT_TILT: [number, number, number] = [0.5, 0, -0.22]

/* ── Camera poses ───────────────────────────────────────────────────────── */
export interface Pose {
  position: Vector3
  target: Vector3
}

/** Pulls the camera back on narrow (portrait) screens so content still fits. */
export const fit = (aspect: number) => (aspect < 1 ? 1 + (1 - aspect) * 0.55 : 1)

function overviewDistance(aspect: number, fov: number) {
  if (aspect >= 1) return 10.2
  const half = Math.tan((fov * Math.PI) / 360)
  return Math.min(16, Math.max(10.2, 2.9 / (half * aspect)))
}

export function overviewPose(aspect: number, fov: number): Pose {
  const d = overviewDistance(aspect, fov)
  return {
    position: new Vector3(0, 0.16, 1).normalize().multiplyScalar(d),
    target: new Vector3(0, 0, 0),
  }
}

export function heroPose(aspect: number, fov: number): Pose {
  const d = overviewDistance(aspect, fov) * (aspect < 1 ? 1.12 : 1.02)
  return {
    position: new Vector3(0.22, 0.12, 1).normalize().multiplyScalar(d),
    target: new Vector3(0, 0, 0),
  }
}

/** Camera on the "outside" of a landmark, looking down at a target point on it. */
export function focusPose(dir: Vector3, target: Vector3, dist: number, elevationDeg: number): Pose {
  const { north } = tangentBasis(dir)
  const el = rad(elevationDeg)
  const position = target
    .clone()
    .addScaledVector(dir, Math.cos(el) * dist)
    .addScaledVector(north, -Math.sin(el) * dist)
  return { position, target: target.clone() }
}

const GROUND_VIEW: Record<GroundId, { lift: number; dist: number }> = {
  about: { lift: 0.4, dist: 2.1 },
  contact: { lift: 0.45, dist: 2.2 },
  skills: { lift: 0.25, dist: 2.8 },
}

export function groundPose(id: GroundId, aspect: number): Pose {
  const { dir } = GROUND[id]
  const v = GROUND_VIEW[id]
  const target = dir.clone().multiplyScalar(PLATEAU_RADIUS + v.lift)
  return focusPose(dir, target, v.dist * fit(aspect), 60)
}

function surfacePose(dir: Vector3, dist: number, elevationDeg: number, lift: number): Pose {
  const { north } = tangentBasis(dir)
  const target = dir.clone().multiplyScalar(PLATEAU_RADIUS + lift)
  const el = rad(elevationDeg)
  const position = target
    .clone()
    .addScaledVector(dir, Math.cos(el) * dist)
    .addScaledVector(north, -Math.sin(el) * dist)
  return { position, target }
}

/** Y-rotation that turns a landmark's scene so its front faces the zoomed camera (which sits south of it). */
export function facingCameraRy(dir: Vector3): number {
  const { north } = tangentBasis(dir)
  const s = north.clone().negate().applyQuaternion(alignToNormal(dir).invert())
  return Math.atan2(s.x, s.z)
}

export function islandPose(index: number, count: number, aspect: number): Pose {
  const dir = plotDirs(count)[index] ?? new Vector3(0, 0, 1)
  return surfacePose(dir, 2.0 * fit(aspect), 58, 0.4)
}

export function experiencePose(aspect: number): Pose {
  const f = fit(aspect)
  return {
    position: new Vector3(0.8, 6.2, 7.4).multiplyScalar(f),
    target: new Vector3(0, 0, 0),
  }
}

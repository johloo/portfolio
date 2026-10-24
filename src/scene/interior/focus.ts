import { Vector3 } from 'three'
import { portfolio } from '../../data/portfolio'
import type { SectionId } from '../../data/portfolio'
import { fit } from '../layout'
import type { Pose } from '../layout'

/** Where the interior worlds live — far from the planet; the camera "travels" there through a warp. */
export const INTERIOR_POS = new Vector3(120, 0, 0)

export type InteriorFocus =
  | { kind: 'about' | 'contact' | 'skills' }
  | { kind: 'project'; index: number }
  | { kind: 'exp'; index: number }

export function interiorFocus(
  section: SectionId | null,
  projectId: string | null,
  experienceId: string | null,
): InteriorFocus | null {
  if (section === 'about' || section === 'contact' || section === 'skills') return { kind: section }
  if (section === 'projects' && projectId) {
    const index = portfolio.projects.findIndex((p) => p.id === projectId)
    if (index >= 0) return { kind: 'project', index }
  }
  if (section === 'experience' && experienceId) {
    const index = portfolio.experience.items.findIndex((i) => i.id === experienceId)
    if (index >= 0) return { kind: 'exp', index }
  }
  return null
}

/** Same kind of place (so switching skill / experience item keeps the camera where it is). */
export const sameKind = (a: InteriorFocus | null, b: InteriorFocus | null) => !!a && !!b && a.kind === b.kind

interface View {
  eye: [number, number, number]
  target: [number, number, number]
  min: number
  max: number
  minPolar?: number
}

const VIEWS: Record<InteriorFocus['kind'], View> = {
  about: { eye: [-1.0, 2.0, 3.6], target: [-1.0, 1.1, -0.9], min: 1.8, max: 4.8 },
  skills: { eye: [0, 1.9, 2.3], target: [0, 1.4, 0], min: 1.2, max: 2.6 },
  contact: { eye: [0, 2.6, 6.4], target: [0, 2.0, -0.8], min: 2.5, max: 9 },
  project: { eye: [0.6, 3.6, 9.6], target: [0, 1.2, 0], min: 3, max: 14.5 },
  exp: { eye: [0.5, 3.4, 8.2], target: [0, 1.0, 0], min: 3, max: 13.5, minPolar: 0.5 },
}

export function interiorPose(f: InteriorFocus, aspect: number) {
  const v = VIEWS[f.kind]
  const k = f.kind === 'exp' ? Math.min(fit(aspect), 1.15) : fit(aspect)
  const target = INTERIOR_POS.clone().add(new Vector3(...v.target))
  const eye = INTERIOR_POS.clone().add(new Vector3(...v.target)).add(
    new Vector3(v.eye[0] - v.target[0], v.eye[1] - v.target[1], v.eye[2] - v.target[2]).multiplyScalar(k),
  )
  const pose: Pose = { position: eye, target }
  return { pose, min: v.min, max: f.kind === 'exp' ? v.max : v.max * k, minPolar: v.minPolar ?? 0.25 }
}

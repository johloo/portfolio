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
  about: { eye: [-0.4, 4.6, 10.6], target: [-0.6, 0.9, -0.8], min: 2, max: 15 },
  skills: { eye: [0, 9.5, 16.5], target: [0, 2.2, 0], min: 3, max: 24 },
  contact: { eye: [0, 5.4, 13.5], target: [0, 2.6, -0.8], min: 3, max: 19 },
  project: { eye: [0.6, 6.4, 10.2], target: [0, 1.0, -0.6], min: 3, max: 19 },
  exp: { eye: [0.5, 4.4, 11], target: [0, 1.0, 0], min: 3, max: 16, minPolar: 0.5 },
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

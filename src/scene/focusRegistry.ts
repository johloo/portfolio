import type { Object3D } from 'three'

/** Lets the camera look up the live world position of individual 3D objects. */
const map = new Map<string, Object3D>()

export const focusRegistry = {
  set(key: string, obj: Object3D | null) {
    if (obj) map.set(key, obj)
    else map.delete(key)
  },
  get(key: string) {
    return map.get(key)
  },
}

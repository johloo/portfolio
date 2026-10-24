/** Tiny event channel so HTML controls can nudge the 3D camera. */
const bus = new EventTarget()

export const sceneBus = {
  zoom(factor: number) {
    bus.dispatchEvent(new CustomEvent<number>('zoom', { detail: factor }))
  },
  onZoom(cb: (factor: number) => void) {
    const handler = (e: Event) => cb((e as CustomEvent<number>).detail)
    bus.addEventListener('zoom', handler)
    return () => bus.removeEventListener('zoom', handler)
  },
}

/** Full-screen "warp" overlay used while travelling between the planet and a location. */
export const fadeBus = {
  set(v: number) {
    bus.dispatchEvent(new CustomEvent<number>('fade', { detail: v }))
  },
  on(cb: (v: number) => void) {
    const handler = (e: Event) => cb((e as CustomEvent<number>).detail)
    bus.addEventListener('fade', handler)
    return () => bus.removeEventListener('fade', handler)
  },
}

/** A frame orbiting a project was clicked → open the picture gallery (HTML overlay). */
export const galleryBus = {
  open(projectId: string, index: number) {
    bus.dispatchEvent(new CustomEvent('gallery', { detail: { projectId, index } }))
  },
  on(cb: (d: { projectId: string; index: number }) => void) {
    const handler = (e: Event) => cb((e as CustomEvent<{ projectId: string; index: number }>).detail)
    bus.addEventListener('gallery', handler)
    return () => bus.removeEventListener('gallery', handler)
  },
}

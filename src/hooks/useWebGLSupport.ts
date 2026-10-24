let cached: boolean | undefined

/** Synchronously detects whether a WebGL context can be created. */
export function detectWebGL(): boolean {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    cached = Boolean(gl)
    // Release the probe context immediately.
    const lose = (gl as WebGLRenderingContext | null)?.getExtension?.('WEBGL_lose_context')
    lose?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

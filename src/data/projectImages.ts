import { portfolio } from './portfolio'
import type { Project, ProjectScreenshot } from './portfolio'

/**
 * Drop image files into  src/assets/projects/<project-id>/  (png, jpg, webp…).
 * They are picked up automatically — no code or data edit needed. Files are ordered by name.
 */
const found = import.meta.glob('../assets/projects/*/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** Prefixes root-relative paths (e.g. /screenshots/a.png) with the deploy base. */
const assetUrl = (src: string) => (src.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + src : src)

/** Folder images first (sorted by file name), then any screenshots listed in portfolio.ts. */
export function imagesFor(project: Project): ProjectScreenshot[] {
  const fromFolder = Object.keys(found)
    .filter((path) => path.split('/').slice(-2)[0] === project.id)
    .sort()
    .map((path) => ({ src: found[path], alt: `${project.title} — ${path.split('/').pop()?.replace(/\.[^.]+$/, '')}` }))
  const listed = project.screenshots.map((s) => ({ ...s, src: assetUrl(s.src) }))
  return [...fromFolder, ...listed]
}

export const projectImageCount = (id: string) => {
  const p = portfolio.projects.find((x) => x.id === id)
  return p ? imagesFor(p).length : 0
}

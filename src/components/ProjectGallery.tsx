import { ChevronLeft, ChevronRight, ImageOff, Pause, Play, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Project } from '../data/portfolio'
import { imagesFor } from '../data/projectImages'

const SLIDE_MS = 3800

/**
 * Picture gallery opened from the orbiting frames: slideshow (play / pause) or manual
 * arrows, keyboard (← → Space Esc), swipe on touch and a thumbnail strip.
 */
export function ProjectGallery({
  project,
  startIndex,
  reducedMotion,
  onClose,
}: {
  project: Project
  startIndex: number
  reducedMotion: boolean
  onClose: () => void
}) {
  const images = imagesFor(project)
  const n = images.length
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(0, n - 1)))
  const [dir, setDir] = useState(1)
  const [playing, setPlaying] = useState(!reducedMotion && n > 1)
  const [tick, setTick] = useState(0) // restarts the progress bar
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (n < 2) return
      setDir(delta)
      setIndex((i) => (i + delta + n) % n)
      setTick((t) => t + 1)
    },
    [n],
  )

  useEffect(() => {
    if (!playing || n < 2) return
    const id = window.setTimeout(() => go(1), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [playing, index, tick, go, n])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation() // don't also let the panel handle this Escape
        onClose()
      }
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ' && n > 1 && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [go, onClose, n])

  const current = images[index]
  return (
    <div
      className={`gallery-overlay${reducedMotion ? ' is-still' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} pictures`}
      style={{ '--accent': project.accent } as CSSProperties}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gallery-box">
        <header className="gallery-top">
          <div>
            <strong>{project.title}</strong>
            {n > 0 && (
              <span>
                {index + 1} / {n}
              </span>
            )}
          </div>
          <div className="gallery-actions">
            {n > 1 && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
                title={playing ? 'Pause slideshow' : 'Play slideshow'}
              >
                {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              </button>
            )}
            <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close gallery" title="Close (Esc)">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div
          className="gallery-stage"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          }}
        >
          {n > 1 && (
            <button type="button" className="gallery-arrow gallery-arrow--prev" onClick={() => go(-1)} aria-label="Previous picture">
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
          )}
          {current ? (
            <img
              key={current.src}
              className={`gallery-img ${dir > 0 ? 'from-right' : 'from-left'}`}
              src={current.src}
              alt={current.alt}
              draggable={false}
            />
          ) : (
            <div className="gallery-empty">
              <ImageOff size={40} aria-hidden="true" />
              <p>No pictures yet</p>
              <small>
                Add images to <code>src/assets/projects/{project.id}/</code> and they will appear here.
              </small>
            </div>
          )}
          {n > 1 && (
            <button type="button" className="gallery-arrow gallery-arrow--next" onClick={() => go(1)} aria-label="Next picture">
              <ChevronRight size={26} aria-hidden="true" />
            </button>
          )}
        </div>

        {n > 1 && (
          <>
            <div className="gallery-progress" aria-hidden="true">
              <i key={`${index}-${tick}-${playing}`} className={playing ? 'run' : ''} style={{ animationDuration: `${SLIDE_MS}ms` }} />
            </div>
            <div className="gallery-thumbs" role="list">
              {images.map((im, i) => (
                <button
                  key={im.src}
                  type="button"
                  role="listitem"
                  className={i === index ? 'is-on' : ''}
                  onClick={() => {
                    setDir(i > index ? 1 : -1)
                    setIndex(i)
                    setTick((t) => t + 1)
                  }}
                  aria-label={`Show picture ${i + 1}`}
                  aria-current={i === index}
                >
                  <img src={im.src} alt="" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

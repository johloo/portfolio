import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  label: string
  title: string
  onClose: () => void
  children: ReactNode
  /** Optional element rendered before the close button (e.g. a back button). */
  leading?: ReactNode
  /** Changing this value re-focuses the heading (e.g. list → detail). */
  focusKey?: string
}

/**
 * Glass side-panel (bottom sheet on mobile). Non-modal dialog: focus moves in
 * when it opens and returns to the trigger when it closes.
 */
export function PanelShell({ label, title, onClose, children, leading, focusKey }: Props) {
  const headingId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<Element | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    return () => {
      const el = previouslyFocused.current as HTMLElement | null
      if (el && document.contains(el) && typeof el.focus === 'function') el.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    bodyRef.current?.scrollTo({ top: 0 })
  }, [focusKey])

  return (
    <section className="panel" role="dialog" aria-modal="false" aria-labelledby={headingId}>
      <header className="panel__header">
        <div className="panel__heading">
          <p className="label">{label}</p>
          <h2 id={headingId} ref={headingRef} tabIndex={-1}>
            {title}
          </h2>
        </div>
        <div className="panel__header-actions">
          {leading}
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close panel and return to the planet" title="Close (Esc)">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="panel__body" ref={bodyRef}>
        {children}
      </div>
    </section>
  )
}

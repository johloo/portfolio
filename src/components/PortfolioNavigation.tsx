import { useEffect, useRef, useState } from 'react'
import { Menu, Moon, Orbit, Sparkles, Sun, X, Zap } from 'lucide-react'
import type { Theme } from '../scene/themeState'
import { portfolio, sections } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'

interface Props {
  activeSection: SectionId | null
  onSelect: (id: SectionId) => void
  onHome: () => void
  reducedMotion: boolean
  onToggleMotion: () => void
  theme: Theme
  onToggleTheme: () => void
}

/** Conventional, fully keyboard-accessible navigation (works without 3D). */
export function PortfolioNavigation({
  activeSection,
  onSelect,
  onHome,
  reducedMotion,
  onToggleMotion,
  theme,
  onToggleTheme,
}: Props) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const choose = (id: SectionId) => {
    setOpen(false)
    onSelect(id)
  }

  return (
    <header className="nav">
      <button type="button" className="nav__brand" onClick={onHome} aria-label={`${portfolio.person.name} — back to start`}>
        <Orbit size={20} aria-hidden="true" />
        <span>JCS</span>
      </button>

      <nav className={`nav__links${open ? ' is-open' : ''}`} id="primary-nav" aria-label="Primary">
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="nav__link"
                aria-current={activeSection === s.id ? 'page' : undefined}
                onClick={() => choose(s.id)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav__tools">
        <button
          type="button"
          className="icon-btn theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'night' ? 'Switch to day mode' : 'Switch to night mode'}
          title={theme === 'night' ? 'Day mode' : 'Night mode'}
        >
          {theme === 'night' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleMotion}
          aria-pressed={reducedMotion}
          aria-label={reducedMotion ? 'Motion is reduced. Turn full motion on' : 'Reduce motion'}
          title={reducedMotion ? 'Reduced motion: on' : 'Reduced motion: off'}
        >
          {reducedMotion ? <Zap size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}
        </button>
        <button
          ref={toggleRef}
          type="button"
          className="icon-btn nav__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}

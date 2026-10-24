import { ArrowRight, Mail, Orbit } from 'lucide-react'
import { portfolio } from '../data/portfolio'

interface Props {
  onExplore: () => void
  onProjects: () => void
  onContact: () => void
  fallback?: boolean
}

export function HeroSection({ onExplore, onProjects, onContact, fallback }: Props) {
  const { person, stats } = portfolio
  return (
    <section className="hero" aria-labelledby="hero-name">
      <p className="eyebrow fade-up" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <span className="eyebrow__dot" aria-hidden="true" /> Portfolio · Digital Universe
      </p>

      <h1 id="hero-name" className="hero__name fade-up" style={{ '--d': '0.2s' } as React.CSSProperties}>
        {person.name.toUpperCase()}
      </h1>

      <p className="hero__title fade-up" style={{ '--d': '0.32s' } as React.CSSProperties}>
        {person.title}
      </p>

      <p className="hero__tagline fade-up" style={{ '--d': '0.44s' } as React.CSSProperties}>
        “{person.tagline}”
      </p>

      <ul className="stats fade-up" style={{ '--d': '0.58s' } as React.CSSProperties} aria-label="Highlights">
        {stats.map((s) => (
          <li key={s.label} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="hero__actions fade-up" style={{ '--d': '0.72s' } as React.CSSProperties}>
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          <Orbit size={18} aria-hidden="true" />
          Explore My Universe
        </button>
        <button type="button" className="btn btn--ghost" onClick={onProjects}>
          View My Projects
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" className="btn btn--ghost" onClick={onContact}>
          <Mail size={18} aria-hidden="true" />
          Contact Me
        </button>
      </div>

      {fallback && (
        <p className="hero__note fade-up" style={{ '--d': '0.85s' } as React.CSSProperties}>
          Interactive 3D isn’t available on this device — the full portfolio is still available through the menu.
        </p>
      )}
    </section>
  )
}

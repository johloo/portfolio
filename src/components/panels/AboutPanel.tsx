import { ArrowRight } from 'lucide-react'
import { portfolio } from '../../data/portfolio'
import type { SectionId } from '../../data/portfolio'
import { PanelShell } from './PanelShell'

interface Props {
  onClose: () => void
  onOpenSection: (id: SectionId) => void
}

export function AboutPanel({ onClose, onOpenSection }: Props) {
  const { person, about, stats } = portfolio
  return (
    <PanelShell label="Research station" title={about.heading} onClose={onClose}>
      <div className="identity">
        <p className="identity__name">{person.name}</p>
        <p className="identity__title">{person.title}</p>
      </div>

      <blockquote className="quote">“{about.quote}”</blockquote>

      {about.introduction.map((p) => (
        <p key={p} className="prose">
          {p}
        </p>
      ))}

      <ul className="stats stats--compact" aria-label="Highlights">
        {stats.map((s) => (
          <li key={s.label} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>

      <h3 className="subhead">Technical interests</h3>
      <ul className="chips">
        {about.interests.map((i) => (
          <li key={i} className="chip">
            {i}
          </li>
        ))}
      </ul>

      <h3 className="subhead">Approach to problem-solving</h3>
      <ol className="steps">
        {about.approach.map((a, i) => (
          <li key={a.title}>
            <span className="steps__num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <strong>{a.title}</strong>
              <p>{a.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="subhead">Experience</h3>
      <p className="prose">{about.experienceNote}</p>

      <div className="panel__cta">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onOpenSection('projects')}>
          See my projects <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onOpenSection('contact')}>
          Get in touch <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </PanelShell>
  )
}

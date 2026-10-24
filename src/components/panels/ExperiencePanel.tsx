import { useEffect, useRef } from 'react'
import { portfolio } from '../../data/portfolio'
import { PanelShell } from './PanelShell'

interface Props {
  experienceId: string | null
  onClose: () => void
  onSelectItem: (id: string | null) => void
}

export function ExperiencePanel({ experienceId, onClose, onSelectItem }: Props) {
  const { experience } = portfolio
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    if (experienceId) refs.current[experienceId]?.scrollIntoView({ block: 'nearest' })
  }, [experienceId])

  return (
    <PanelShell label="Orbital stations" title="Experience" onClose={onClose}>
      <div className="exp-hero">
        <span className="exp-hero__value">{experience.headline}</span>
        <p>{experience.summary}</p>
      </div>

      <ol className="timeline" aria-label="Experience timeline">
        {experience.items.map((item) => {
          const active = experienceId === item.id
          return (
            <li key={item.id} ref={(el) => void (refs.current[item.id] = el)} className={active ? 'is-active' : ''}>
              <span className="timeline__node" aria-hidden="true" />
              <button
                type="button"
                className="timeline__card"
                aria-pressed={active}
                onClick={() => onSelectItem(active ? null : item.id)}
              >
                {(item.period || item.organization) && (
                  <span className="timeline__meta">
                    {[item.period, item.organization].filter(Boolean).join(' · ')}
                  </span>
                )}
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </PanelShell>
  )
}

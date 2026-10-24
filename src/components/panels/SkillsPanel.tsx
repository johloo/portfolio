import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { portfolio } from '../../data/portfolio'
import { PanelShell } from './PanelShell'

interface Props {
  skillId: string | null
  onClose: () => void
  onSelectSkill: (id: string | null) => void
}

export function SkillsPanel({ skillId, onClose, onSelectSkill }: Props) {
  const { skills, skillCategories } = portfolio
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  // When a tower is clicked in 3D, bring its row into view.
  useEffect(() => {
    if (skillId) refs.current[skillId]?.scrollIntoView({ block: 'nearest' })
  }, [skillId])

  return (
    <PanelShell label="Energy towers" title="Skills" onClose={onClose}>
      <p className="prose">
        Each tower’s height reflects proficiency. Select a skill for a short note — it lights up in the 3D view too.
      </p>

      {skillCategories.map((cat) => {
        const list = skills.filter((s) => s.category === cat.id)
        if (list.length === 0) return null
        return (
          <section key={cat.id} className="skill-group" style={{ '--cat': cat.color } as CSSProperties}>
            <h3 className="subhead subhead--cat">
              <span className="dot" aria-hidden="true" />
              {cat.label}
            </h3>
            <ul className="skill-list">
              {list.map((s) => {
                const open = skillId === s.id
                return (
                  <li key={s.id} ref={(el) => void (refs.current[s.id] = el)} className={open ? 'is-open' : ''}>
                    <button
                      type="button"
                      className="skill"
                      aria-expanded={open}
                      aria-controls={`skill-${s.id}`}
                      onClick={() => onSelectSkill(open ? null : s.id)}
                    >
                      <span className="skill__row">
                        <span className="skill__name">{s.name}</span>
                        <span className="skill__pct">{s.level}%</span>
                      </span>
                      <span
                        className="bar"
                        role="progressbar"
                        aria-label={`${s.name} proficiency`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={s.level}
                      >
                        <span className="bar__fill" style={{ width: `${s.level}%` }} />
                      </span>
                    </button>
                    <p id={`skill-${s.id}`} className="skill__note" hidden={!open}>
                      {s.summary}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </PanelShell>
  )
}

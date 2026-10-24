import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { portfolio } from '../../data/portfolio'
import type { Project } from '../../data/portfolio'
import { GithubIcon } from '../BrandIcons'
import { imagesFor } from '../../data/projectImages'
import { ProjectPreview } from '../ProjectPreview'


interface Props {
  project: Project
  index: number
  onSelectProject: (id: string) => void
}

/** Full details for one project. Links and gallery render only when configured. */
export function ProjectDetailPanel({ project, index, onSelectProject }: Props) {
  const all = portfolio.projects
  const prev = all[(index - 1 + all.length) % all.length]
  const next = all[(index + 1) % all.length]
  const { github, demo } = project.links
  const hasLinks = Boolean(github || demo)
  const shots = imagesFor(project)

  return (
    <div className="project-detail">
      {shots.length > 0 ? (
        <div className="gallery" role="list" aria-label={`${project.title} screenshots`}>
          {shots.map((s) => (
            <a key={s.src} role="listitem" href={s.src} target="_blank" rel="noreferrer">
              <img src={s.src} alt={s.alt} loading="lazy" />
            </a>
          ))}
        </div>
      ) : (
        <ProjectPreview project={project} index={index} />
      )}

      <div className="project-detail__meta">
        <div>
          {project.category && <p className="project-detail__category">{project.category}</p>}
          <p className="project-detail__tagline">{project.tagline}</p>
        </div>
        {project.status && <span className="badge">{project.status}</span>}
      </div>

      <p className="prose">{project.description}</p>

      {project.technologies.length > 0 && (
        <>
          <h3 className="subhead">Technologies</h3>
          <ul className="chips">
            {project.technologies.map((t) => (
              <li key={t} className="chip chip--tech">
                {t}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="subhead">Feature areas</h3>
      <ul className="checklist">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      {project.contributions.length > 0 && (
        <>
          <h3 className="subhead">My contributions</h3>
          <ul className="checklist checklist--alt">
            {project.contributions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {hasLinks && (
        <div className="panel__cta">
          {github && (
            <a className="btn btn--ghost btn--sm" href={github} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
          )}
          {demo && (
            <a className="btn btn--primary btn--sm" href={demo} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      )}

      <div className="pager" role="group" aria-label="Browse projects">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSelectProject(prev.id)}>
          <ChevronLeft size={16} aria-hidden="true" /> {prev.title}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSelectProject(next.id)}>
          {next.title} <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

import { ArrowLeft, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { portfolio } from '../../data/portfolio'
import { ProjectPreview } from '../ProjectPreview'
import { PanelShell } from './PanelShell'
import { ProjectDetailPanel } from './ProjectDetailPanel'

interface Props {
  projectId: string | null
  onClose: () => void
  onSelectProject: (id: string) => void
  onBackToList: () => void
}

export function ProjectsPanel({ projectId, onClose, onSelectProject, onBackToList }: Props) {
  const index = portfolio.projects.findIndex((p) => p.id === projectId)
  const project = index >= 0 ? portfolio.projects[index] : null

  return (
    <PanelShell
      label={project ? 'Project island' : 'Islands on the planet'}
      title={project ? project.title : 'Projects'}
      onClose={onClose}
      focusKey={project?.id ?? 'list'}
      leading={
        project ? (
          <button type="button" className="icon-btn" onClick={onBackToList} aria-label="Back to all projects" title="All projects">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        ) : null
      }
    >
      {project ? (
        <ProjectDetailPanel project={project} index={index} onSelectProject={onSelectProject} />
      ) : (
        <>
          <p className="prose">
            Each island on the planet is one of my projects. Select one below — or click its island in the 3D view.
          </p>
          <ul className="project-list">
            {portfolio.projects.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="project-card"
                  style={{ '--accent': p.accent } as CSSProperties}
                  onClick={() => onSelectProject(p.id)}
                >
                  <ProjectPreview project={p} index={i} compact />
                  <span className="project-card__text">
                    <strong>{p.title}</strong>
                    <span>{p.tagline}</span>
                    {(p.category || p.technologies.length > 0) && (
                      <span className="project-card__tech">{p.technologies.length > 0 ? p.technologies.join(' · ') : p.category}</span>
                    )}
                  </span>
                  <ChevronRight size={18} aria-hidden="true" className="project-card__arrow" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </PanelShell>
  )
}

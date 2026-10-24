import type { CSSProperties } from 'react'
import type { Project } from '../data/portfolio'
import { PROJECT_VARIANTS } from '../data/projectVariants'

/**
 * Original CSS illustration used until real screenshots are added.
 * It is deliberately abstract and always captioned — never presented as a
 * screenshot of the real application.
 */
export function ProjectPreview({ project, index, compact = false }: { project: Project; index: number; compact?: boolean }) {
  const variant = index % PROJECT_VARIANTS
  return (
    <figure className={`preview${compact ? ' preview--compact' : ''}`} style={{ '--accent': project.accent } as CSSProperties}>
      <div className="preview__frame" aria-hidden="true">
        <div className="preview__bar">
          <i />
          <i />
          <i />
        </div>
        <div className={`preview__canvas preview__canvas--${variant}`}>
          {variant === 0 && (
            <>
              <div className="pv-row pv-row--head" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="pv-row" />
              ))}
              <div className="pv-coin" />
            </>
          )}
          {variant === 1 && (
            <>
              <div className="pv-hero" />
              <div className="pv-cards">
                <span />
                <span />
                <span />
              </div>
            </>
          )}
          {variant === 2 && (
            <>
              <div className="pv-grid">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="pv-bars">
                {[40, 65, 50, 85, 60].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </>
          )}
          {variant === 3 && (
            <>
              <div className="pv-feed">
                <span />
                <span />
                <span />
              </div>
              <div className="pv-play" />
            </>
          )}
          {variant === 4 && (
            <>
              {[0, 1, 2].map((r) => (
                <div key={r} className="pv-shelf">
                  {[0, 1, 2, 3, 4].map((c) => (
                    <span key={c} style={{ opacity: (r + c) % 4 === 0 ? 1 : 0.45 }} />
                  ))}
                </div>
              ))}
              <div className="pv-bars pv-bars--thin">
                {[55, 80, 40, 70].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </>
          )}
          {variant === 5 && (
            <>
              <div className="pv-stages">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={i < 3 ? 'is-on' : ''} />
                ))}
              </div>
              <div className="pv-row pv-row--head" />
              <div className="pv-row" />
              <div className="pv-row" />
            </>
          )}
          {variant === 6 && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="pv-issue">
                  <i className={`pv-dot pv-dot--${i % 3}`} />
                  <span />
                </div>
              ))}
              <div className="pv-gear" />
            </>
          )}
        </div>
      </div>
      {!compact && <figcaption>Illustrative preview — not a screenshot</figcaption>}
    </figure>
  )
}

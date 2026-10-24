const LABELS = {
  engine: 'Loading 3D engine…',
  planet: 'Building the planet…',
  ready: 'Ready for launch',
} as const

interface Props {
  stage: keyof typeof LABELS
  progress: number
  done: boolean
}

/** Full-screen splash shown while the 3D chunk downloads and the scene builds. */
export function LoadingScreen({ stage, progress, done }: Props) {
  const pct = stage === 'ready' ? 100 : stage === 'planet' ? Math.max(70, progress) : Math.max(25, progress * 0.5)
  return (
    <div className={`loader${done ? ' loader--done' : ''}`} role="status" aria-live="polite">
      <div className="loader__orbit" aria-hidden="true">
        <span className="loader__planet" />
        <span className="loader__ring" />
        <span className="loader__sat" />
      </div>
      <p className="loader__brand">John Carlo Salva</p>
      <div className="loader__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="loader__label">
        {LABELS[stage]} <span>{Math.round(pct)}%</span>
      </p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Home, Minus, Plus, RotateCcw } from 'lucide-react'
import { sceneBus } from '../scene/sceneBus'

interface Props {
  show3D: boolean
  panelOpen: boolean
  onReset: () => void
  onHome: () => void
}

/** Reset / zoom buttons plus a short first-visit hint. */
export function SceneControls({ show3D, panelOpen, onReset, onHome }: Props) {
  const [hintVisible, setHintVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 9000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (panelOpen) setHintVisible(false)
  }, [panelOpen])

  return (
    <>
      {show3D && hintVisible && !panelOpen && (
        <p className="hint" role="note">
          Drag to rotate · Scroll or pinch to zoom · Click a glowing marker
        </p>
      )}
      <div className="controls" role="group" aria-label="Camera controls">
        <button type="button" className="icon-btn" onClick={onHome} aria-label="Back to intro" title="Back to intro">
          <Home size={18} aria-hidden="true" />
        </button>
        {show3D && (
          <>
            <button type="button" className="icon-btn" onClick={onReset} aria-label="Reset camera to planet overview" title="Reset camera">
              <RotateCcw size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn" onClick={() => sceneBus.zoom(0.78)} aria-label="Zoom in" title="Zoom in">
              <Plus size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn" onClick={() => sceneBus.zoom(1.28)} aria-label="Zoom out" title="Zoom out">
              <Minus size={18} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </>
  )
}

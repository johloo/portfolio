import { ArrowLeft } from 'lucide-react'

/** Always-visible way back to the planet overview while inside a location. */
export function ReturnToPlanet({ onReturn }: { onReturn: () => void }) {
  return (
    <button type="button" className="return-btn" onClick={onReturn}>
      <ArrowLeft size={16} aria-hidden="true" />
      <span>Return to Planet</span>
    </button>
  )
}

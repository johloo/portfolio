import { Html } from '@react-three/drei'

interface Props {
  title: string
  subtitle?: string
  position?: [number, number, number]
}

/** DOM tooltip anchored in 3D space. Only mounted while hovered/active. */
export function Tooltip({ title, subtitle, position = [0, 0.34, 0] }: Props) {
  return (
    <Html position={position} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      <div className="scene-tooltip" role="presentation">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </Html>
  )
}

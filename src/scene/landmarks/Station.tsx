/** A small orbital station / satellite model. Origin at its centre. */
export function StationModel({
  accent = '#67e8f9',
  scale = 1,
}: {
  accent?: string
  scale?: number
}) {
  return (
    <group scale={scale}>
      <mesh>
        <boxGeometry args={[0.13, 0.08, 0.08]} />
        <meshStandardMaterial color="#dfe6ff" flatShading metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.04, 6]} />
        <meshStandardMaterial color="#9fb0e8" flatShading metalness={0.4} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.06, 5]} />
            <meshStandardMaterial color="#9fb0e8" flatShading />
          </mesh>
          <mesh position={[s * 0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.008, 0.1]} />
            <meshStandardMaterial color="#1e3a8a" emissive={accent} emissiveIntensity={0.35} flatShading metalness={0.3} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.115, 0]}>
        <sphereGeometry args={[0.014, 6, 5]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  )
}

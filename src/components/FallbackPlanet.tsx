/** Static low-poly planet used when WebGL is unavailable or the scene crashes. */
export function FallbackPlanet() {
  return (
    <div className="fallback-planet" role="img" aria-label="Illustration of a low-poly planet in space">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <radialGradient id="fp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
          </radialGradient>
          <clipPath id="fp-clip">
            <circle cx="200" cy="200" r="140" />
          </clipPath>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#fp-glow)" />
        <g clipPath="url(#fp-clip)">
          <rect width="400" height="400" fill="#2f86d1" />
          <polygon points="60,200 200,60 200,200" fill="#3a96e0" />
          <polygon points="200,60 340,200 200,200" fill="#2a78c2" />
          <polygon points="60,200 200,340 200,200" fill="#2872b8" />
          <polygon points="340,200 200,340 200,200" fill="#246aae" />
          <polygon points="110,150 190,120 215,185 140,215" fill="#7fd653" />
          <polygon points="140,215 215,185 200,250 150,262" fill="#5cc24f" />
          <polygon points="235,230 305,205 320,265 255,292" fill="#6fcf58" />
          <polygon points="270,120 318,150 295,195 250,170" fill="#4fb85a" />
          <polygon points="190,120 215,185 175,170" fill="#f3f7ff" />
        </g>
        <ellipse cx="200" cy="200" rx="185" ry="48" fill="none" stroke="#67e8f9" strokeOpacity="0.4" strokeWidth="1.5" transform="rotate(-24 200 200)" />
        <circle cx="338" cy="136" r="6" fill="#a78bfa" />
      </svg>
    </div>
  )
}

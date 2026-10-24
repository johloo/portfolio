/** Shared, frame-rate-friendly camera transition state (read inside useFrame). */
export const cameraState = {
  /** 0 → 1 while a fly-to is in progress; 1 when the camera has arrived. */
  progress: 1,
  /** True while a fly-to is running (clicks retarget from the current pose, never overlap). */
  transitioning: false,
  /** True while the camera is inside a location's interior world. */
  interior: false,
}

/** Detail scenes reveal once the camera is close enough to the destination. */
// The planet-side preview is disabled: the interior world takes over instead.
export const ARRIVAL_AT = 2

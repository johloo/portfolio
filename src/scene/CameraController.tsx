import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Quaternion, Vector3 } from 'three'
import type { PerspectiveCamera } from 'three'
import { portfolio } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'
import {
  experiencePose,
  fit,
  groundPose,
  heroPose,
  islandPose,
  overviewPose,
} from './layout'
import type { GroundId, Pose } from './layout'
import { fadeBus, sceneBus } from './sceneBus'
import { focusRegistry } from './focusRegistry'
import { cameraState } from './cameraState'
import { interiorFocus, interiorPose, sameKind } from './interior/focus'
import type { InteriorFocus } from './interior/focus'

interface Controls {
  target: Vector3
  enabled: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  minDistance: number
  maxDistance: number
  minPolarAngle: number
  maxPolarAngle: number
  update: () => void
  addEventListener: (type: string, cb: () => void) => void
  removeEventListener: (type: string, cb: () => void) => void
}

interface Props {
  view: 'hero' | 'explore'
  section: SectionId | null
  projectId: string | null
  skillId: string | null
  experienceId: string | null
  resetNonce: number
  panelOpen: boolean
  isCompact: boolean
  reducedMotion: boolean
  fov: number
}

const MIN_CAMERA_RADIUS = 3.0
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

interface Anim {
  active: boolean
  t: number
  duration: number
  fromDir: Vector3
  toDir: Vector3
  fromLen: number
  toLen: number
  fromTarget: Vector3
  toTarget: Vector3
}

/**
 * Owns every camera move.
 *
 *  planet ──fly-to──▶ landmark ──warp fade──▶ interior world (360° orbit)
 *  interior ──warp fade──▶ landmark ──fly-to──▶ planet overview
 *
 * Only one fly-to runs at a time (a new request retargets from the current
 * pose), and the planet ⇄ interior hand-off is a small state machine driven by
 * `seq` + the fade value, so rapid clicking can never leave it half-way.
 */
export function CameraController({
  view,
  section,
  projectId,
  experienceId,
  resetNonce,
  panelOpen,
  isCompact,
  reducedMotion,
  fov,
}: Props) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const controls = useThree((s) => s.controls) as unknown as Controls | null

  const anim = useRef<Anim>({
    active: false,
    t: 0,
    duration: 1.8,
    fromDir: new Vector3(),
    toDir: new Vector3(),
    fromLen: 1,
    toLen: 1,
    fromTarget: new Vector3(),
    toTarget: new Vector3(),
  })
  const spin = useRef(0)
  const idle = useRef(true)
  const idleTimer = useRef<number | undefined>(undefined)
  const zoomTarget = useRef<number | null>(null)
  const shift = useRef({ x: 0, y: 0 })
  const first = useRef(true)

  /* planet ⇄ interior hand-off */
  const mode = useRef<'planet' | 'interior'>('planet')
  const current = useRef<InteriorFocus | null>(null)
  const want = useRef<InteriorFocus | null>(null)
  const seq = useRef<'none' | 'enter' | 'exit'>('none')
  const fade = useRef(0)
  const fadeTarget = useRef(0)
  const landmarkPose = useRef<Pose | null>(null)
  const pending = useRef<Pose | null>(null)

  const aspect = size.width / size.height
  const bucket = aspect < 0.8 ? 'portrait' : aspect < 1.25 ? 'square' : 'landscape'

  const startFly = (pose: Pose) => {
    if (!controls) return
    const st = anim.current
    st.fromDir.copy(camera.position).normalize()
    st.fromLen = camera.position.length()
    st.fromTarget.copy(controls.target)
    st.toDir.copy(pose.position).normalize()
    st.toLen = pose.position.length()
    st.toTarget.copy(pose.target)
    st.t = 0
    cameraState.progress = 0
    cameraState.transitioning = true
    st.duration = reducedMotion ? 0.001 : 1.9
    st.active = true
    zoomTarget.current = null
    controls.enabled = false
  }

  const enterInterior = (f: InteriorFocus) => {
    if (!controls) return
    const { pose, min, max, minPolar } = interiorPose(f, aspect)
    mode.current = 'interior'
    current.current = f
    cameraState.interior = true
    anim.current.active = false
    cameraState.progress = 1
    cameraState.transitioning = false
    camera.position.copy(pose.position)
    controls.target.copy(pose.target)
    controls.minDistance = min
    controls.maxDistance = max
    controls.minPolarAngle = minPolar
    controls.maxPolarAngle = 1.55
    controls.enabled = true
    zoomTarget.current = null
    ;(camera as PerspectiveCamera).fov = fov
    ;(camera as PerspectiveCamera).updateProjectionMatrix()
    camera.lookAt(pose.target)
    controls.update()
  }

  const leaveInterior = () => {
    if (!controls) return
    mode.current = 'planet'
    current.current = null
    cameraState.interior = false
    controls.minDistance = 1.2
    controls.maxDistance = 18
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI
    const from = landmarkPose.current
    if (from) {
      camera.position.copy(from.position)
      controls.target.copy(from.target)
      camera.lookAt(from.target)
      controls.update()
    }
    if (pending.current) {
      startFly(pending.current)
      pending.current = null
    } else controls.enabled = true
  }

  /* React to the UI state: decide where the camera should be. */
  useEffect(() => {
    if (!controls) return
    const a = aspect
    const f = view === 'hero' ? null : interiorFocus(section, projectId, experienceId)

    let pose: Pose
    if (view === 'hero') pose = heroPose(a, fov)
    else if (section === 'projects') {
      const idx = projectId ? portfolio.projects.findIndex((p) => p.id === projectId) : -1
      pose = idx >= 0 ? islandPose(idx, portfolio.projects.length, a) : overviewPose(a, fov)
    } else if (section === 'experience') {
      const station = experienceId ? focusRegistry.get(`station:${experienceId}`) : undefined
      if (station) {
        const p = station.getWorldPosition(new Vector3())
        const out = new Vector3(p.x, 0, p.z).normalize()
        pose = {
          position: p.clone().addScaledVector(out, 2.6 * fit(a)).add(new Vector3(0, 0.9, 0)),
          target: p.clone().add(new Vector3(0, 0.35, 0)),
        }
      } else pose = experiencePose(a)
    } else if (section) pose = groundPose(section as GroundId, a)
    else pose = overviewPose(a, fov)
    if (f) landmarkPose.current = pose

    if (first.current) {
      first.current = false
      if (f) {
        want.current = f
        enterInterior(f)
      } else {
        camera.position.copy(pose.position)
        controls.target.copy(pose.target)
        camera.lookAt(pose.target)
        controls.update()
      }
      return
    }

    if (mode.current === 'interior') {
      if (sameKind(f, current.current)) {
        // e.g. another skill / experience item: stay in the same place
        current.current = f
        want.current = f
        if (seq.current === 'exit') {
          seq.current = 'none'
          fadeTarget.current = 0
          pending.current = null
        }
        return
      }
      // leave through the warp, then fly on from the landmark
      want.current = f
      pending.current = pose
      seq.current = 'exit'
      fadeTarget.current = 1
      return
    }

    want.current = f
    seq.current = 'none'
    fadeTarget.current = 0
    startFly(pose)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, view, section, projectId, experienceId, resetNonce, bucket, fov, reducedMotion])

  /* Pause idle spin while the user interacts, resume after a beat. */
  useEffect(() => {
    if (!controls) return
    const start = () => {
      idle.current = false
      window.clearTimeout(idleTimer.current)
    }
    const end = () => {
      window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => (idle.current = true), 2600)
    }
    controls.addEventListener('start', start)
    controls.addEventListener('end', end)
    return () => {
      controls.removeEventListener('start', start)
      controls.removeEventListener('end', end)
      window.clearTimeout(idleTimer.current)
    }
  }, [controls])

  /* Button-driven zoom. */
  useEffect(
    () =>
      sceneBus.onZoom((factor) => {
        if (!controls) return
        const len = camera.position.distanceTo(controls.target)
        const base = zoomTarget.current ?? len
        zoomTarget.current = Math.min(controls.maxDistance, Math.max(controls.minDistance, base * factor))
      }),
    [camera, controls],
  )

  /* Never leave the warp overlay (or the interior flag) behind. */
  useEffect(
    () => () => {
      fadeBus.set(0)
      cameraState.interior = false
      cameraState.progress = 1
      cameraState.transitioning = false
    },
    [],
  )

  const tmpDir = useRef(new Vector3())
  const tmpOffset = useRef(new Vector3())
  const full = useRef(new Quaternion())
  const partial = useRef(new Quaternion())
  const identity = useRef(new Quaternion())
  const lastSent = useRef(-1)

  useFrame((_, dt) => {
    if (!controls) return
    const st = anim.current
    const cam = camera as PerspectiveCamera

    /* 0 — warp fade + planet ⇄ interior hand-off */
    const fs = reducedMotion ? 60 : 2.8
    const d = fadeTarget.current - fade.current
    fade.current += Math.max(-fs * dt, Math.min(fs * dt, d))
    if (Math.abs(fade.current - lastSent.current) > 0.004) {
      lastSent.current = fade.current
      fadeBus.set(fade.current)
    }
    if (seq.current === 'enter' && fade.current >= 0.999 && want.current) {
      enterInterior(want.current)
      seq.current = 'none'
      fadeTarget.current = 0
    } else if (seq.current === 'exit' && fade.current >= 0.999) {
      seq.current = 'none'
      fadeTarget.current = 0
      leaveInterior()
    }

    /* 1 — fly-to animation (planet only) */
    if (st.active) {
      st.t = Math.min(1, st.t + dt / st.duration)
      const k = ease(st.t)
      full.current.setFromUnitVectors(st.fromDir, st.toDir)
      partial.current.slerpQuaternions(identity.current, full.current, k)
      tmpDir.current.copy(st.fromDir).applyQuaternion(partial.current)
      const len = st.fromLen + (st.toLen - st.fromLen) * k
      camera.position.copy(tmpDir.current).multiplyScalar(len)
      controls.target.lerpVectors(st.fromTarget, st.toTarget, k)
      camera.lookAt(controls.target)
      cameraState.progress = k
      // subtle cinematic dolly: the lens widens mid-flight, then settles
      cam.fov = fov + (reducedMotion ? 0 : Math.sin(Math.PI * st.t) * 7)
      cam.updateProjectionMatrix()
      if (st.t >= 1) {
        st.active = false
        cameraState.progress = 1
        cameraState.transitioning = false
        cam.fov = fov
        cam.updateProjectionMatrix()
        controls.enabled = true
        controls.update()
        // arrived at a landmark that has an interior → travel inside
        if (mode.current === 'planet' && want.current) {
          seq.current = 'enter'
          fadeTarget.current = 1
        }
      }
    }

    /* 2 — idle auto-rotate (planet only, eased in and out) */
    const spinAllowed =
      mode.current === 'planet' &&
      seq.current === 'none' &&
      (view === 'hero' || !section || (section === 'projects' && !projectId)) &&
      !reducedMotion
    const wanted = spinAllowed && idle.current && !st.active ? (view === 'hero' ? 0.7 : 0.55) : 0
    spin.current += (wanted - spin.current) * (1 - Math.exp(-2.2 * dt))
    if (st.active) spin.current = 0 // never fight a fly-to
    controls.autoRotate = spin.current > 0.02
    controls.autoRotateSpeed = spin.current

    /* 3 — smooth button zoom */
    if (zoomTarget.current !== null && !st.active) {
      tmpOffset.current.subVectors(camera.position, controls.target)
      const len = tmpOffset.current.length()
      const next = len + (zoomTarget.current - len) * (1 - Math.exp(-9 * dt))
      tmpOffset.current.setLength(next)
      camera.position.copy(controls.target).add(tmpOffset.current)
      if (Math.abs(next - zoomTarget.current) < 0.01) zoomTarget.current = null
    }

    /* 4 — never let the camera sink into the planet while orbiting a landmark */
    if (mode.current === 'planet' && camera.position.length() < MIN_CAMERA_RADIUS) {
      camera.position.setLength(MIN_CAMERA_RADIUS)
    }

    /* 5 — off-centre framing (shifts the rendered image, not the scene) */
    let tx = 0
    let ty = 0
    if (view === 'hero') {
      if (isCompact) ty = -0.03
      else tx = -0.2
    } else if (panelOpen) {
      if (isCompact) ty = 0.2
      else tx = 0.17
    }
    const sft = shift.current
    const lerp = reducedMotion ? 1 : 1 - Math.exp(-4 * dt)
    sft.x += (tx - sft.x) * lerp
    sft.y += (ty - sft.y) * lerp
    if (Math.abs(sft.x) > 0.0005 || Math.abs(sft.y) > 0.0005) {
      cam.setViewOffset(size.width, size.height, sft.x * size.width, sft.y * size.height, size.width, size.height)
    } else if (cam.view) {
      cam.clearViewOffset()
    }
  })

  return null
}

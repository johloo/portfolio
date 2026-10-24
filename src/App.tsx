import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { portfolio, sections } from './data/portfolio'
import type { SectionId } from './data/portfolio'
import { useIsCompact, useMediaQuery } from './hooks/useMediaQuery'
import { detectWebGL } from './hooks/useWebGLSupport'
import type { Theme } from './scene/themeState'
import { fadeBus, galleryBus } from './scene/sceneBus'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FallbackPlanet } from './components/FallbackPlanet'
import { HeroSection } from './components/HeroSection'
import { LoadingScreen } from './components/LoadingScreen'
import { PortfolioNavigation } from './components/PortfolioNavigation'
import { ProjectGallery } from './components/ProjectGallery'
import { ReturnToPlanet } from './components/ReturnToPlanet'
import { SceneControls } from './components/SceneControls'
import { AboutPanel } from './components/panels/AboutPanel'
import { ContactPanel } from './components/panels/ContactPanel'
import { ExperiencePanel } from './components/panels/ExperiencePanel'
import { ProjectsPanel } from './components/panels/ProjectsPanel'
import { SkillsPanel } from './components/panels/SkillsPanel'

const PlanetScene = lazy(() => import('./scene/PlanetScene'))

const isSection = (v: string): v is SectionId => sections.some((s) => s.id === v)

function readHash(): SectionId | null {
  const h = window.location.hash.replace('#', '')
  return isSection(h) ? h : null
}

type Stage = 'engine' | 'planet' | 'ready'

export default function App() {
  const isCompact = useIsCompact()
  const osReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [motionOverride, setMotionOverride] = useState<'reduce' | 'full' | null>(() => {
    try {
      const v = localStorage.getItem('motion')
      return v === 'reduce' || v === 'full' ? v : null
    } catch {
      return null
    }
  })
  const reducedMotion = motionOverride ? motionOverride === 'reduce' : osReducedMotion

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem('theme')
      if (v === 'day' || v === 'night') return v
    } catch {
      /* storage unavailable — fall back to night */
    }
    return 'night'
  })
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'night' ? 'day' : 'night')), [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#050816' : '#7cc0f7')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* the preference just won't persist */
    }
  }, [theme])

  const [gallery, setGallery] = useState<{ projectId: string; index: number } | null>(null)
  useEffect(() => galleryBus.on(setGallery), [])
  const warpRef = useRef<HTMLDivElement>(null)
  useEffect(
    () =>
      fadeBus.on((v) => {
        if (warpRef.current) warpRef.current.style.opacity = String(v)
      }),
    [],
  )

  const webgl = useMemo(() => detectWebGL(), [])
  const [sceneFailed, setSceneFailed] = useState(false)
  const show3D = webgl && !sceneFailed

  const initial = useMemo(readHash, [])
  const [view, setView] = useState<'hero' | 'explore'>(initial ? 'explore' : 'hero')
  const [section, setSection] = useState<SectionId | null>(initial)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [skillId, setSkillId] = useState<string | null>(null)
  const [experienceId, setExperienceId] = useState<string | null>(null)
  const [resetNonce, setResetNonce] = useState(0)

  const [stage, setStage] = useState<Stage>('engine')
  const [progress, setProgress] = useState(0)
  const [loaderGone, setLoaderGone] = useState(false)

  const panelOpen = view === 'explore' && section !== null

  /* ── Navigation actions ──────────────────────────────────────────────── */
  const clearSelection = () => {
    setProjectId(null)
    setSkillId(null)
    setExperienceId(null)
  }

  const openSection = useCallback((id: SectionId) => {
    setView('explore')
    setSection((prev) => {
      if (prev !== id) {
        setProjectId(null)
        setSkillId(null)
        setExperienceId(null)
      }
      return id
    })
  }, [])

  const selectProject = useCallback((id: string) => {
    setView('explore')
    setSection('projects')
    setSkillId(null)
    setExperienceId(null)
    setProjectId(id)
  }, [])

  const selectSkill = useCallback((id: string | null) => {
    setView('explore')
    setSection('skills')
    setProjectId(null)
    setExperienceId(null)
    setSkillId(id)
  }, [])

  const selectExperience = useCallback((id: string | null) => {
    setView('explore')
    setSection('experience')
    setProjectId(null)
    setSkillId(null)
    setExperienceId(id)
  }, [])

  const closePanel = useCallback(() => {
    setSection(null)
    setProjectId(null)
    setSkillId(null)
    setExperienceId(null)
  }, [])

  const explore = useCallback(() => {
    setView('explore')
    setSection(null)
    clearSelection()
  }, [])

  const goHome = useCallback(() => {
    setView('hero')
    closePanel()
    setResetNonce((n) => n + 1)
  }, [closePanel])

  const resetCamera = useCallback(() => {
    closePanel()
    setResetNonce((n) => n + 1)
  }, [closePanel])

  const toggleMotion = useCallback(() => {
    const next = reducedMotion ? 'full' : 'reduce'
    setMotionOverride(next)
    try {
      localStorage.setItem('motion', next)
    } catch {
      /* storage unavailable — the preference just won't persist */
    }
  }, [reducedMotion])

  /* ── Escape: step back one level, then close ─────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || view !== 'explore') return
      if (projectId) setProjectId(null)
      else if (section) closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, section, projectId, closePanel])

  /* ── Keep the URL hash in sync (deep links like /#projects) ──────────── */
  useEffect(() => {
    const target = view === 'explore' && section ? `#${section}` : window.location.pathname + window.location.search
    if (section || window.location.hash) {
      window.history.replaceState(null, '', target)
    }
  }, [view, section])

  useEffect(() => {
    const onHash = () => {
      const s = readHash()
      if (s) openSection(s)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [openSection])

  /* ── Loader lifecycle ────────────────────────────────────────────────── */
  const onSceneReady = useCallback(() => {
    setStage('ready')
    setProgress(100)
  }, [])

  useEffect(() => {
    if (!show3D) {
      setStage('ready')
      setProgress(100)
    }
  }, [show3D])

  const loaderVisible = !loaderGone
  useEffect(() => {
    if (stage !== 'ready') return
    const t = window.setTimeout(() => setLoaderGone(true), 650)
    return () => window.clearTimeout(t)
  }, [stage])

  const panelCommon = { onClose: closePanel }

  return (
    <div className="app" data-reduced-motion={reducedMotion} data-view={view} data-theme={theme}>
      {/* ── Background: the 3D universe (or a graceful fallback) ───────── */}
      <div className="scene" aria-hidden={!show3D}>
        <div className="sky" aria-hidden="true">
          <span className="sky__night" />
          <span className="sky__day" />
        </div>
        {show3D ? (
          <ErrorBoundary fallback={<FallbackPlanet />} onError={() => setSceneFailed(true)}>
            <Suspense fallback={null}>
              <PlanetScene
                view={view}
                section={section}
                projectId={projectId}
                skillId={skillId}
                experienceId={experienceId}
                resetNonce={resetNonce}
                panelOpen={panelOpen}
                isCompact={isCompact}
                reducedMotion={reducedMotion}
                theme={theme}
                onSelectSection={openSection}
                onSelectProject={selectProject}
                onSelectSkill={(id) => selectSkill(id)}
                onSelectExperience={(id) => selectExperience(id)}
                onReady={() => {
                  setStage((s) => (s === 'ready' ? s : 'planet'))
                  // let the first frames render before revealing
                  window.setTimeout(onSceneReady, 350)
                }}
                onProgress={setProgress}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <FallbackPlanet />
        )}
        <div className="scene-vignette" />
        <div className="warp" ref={warpRef} aria-hidden="true" />
      </div>

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <PortfolioNavigation
        activeSection={view === 'explore' ? section : null}
        onSelect={openSection}
        onHome={goHome}
        reducedMotion={reducedMotion}
        onToggleMotion={toggleMotion}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="main-content" tabIndex={-1}>
        {view === 'hero' && (
          <HeroSection
            onExplore={explore}
            onProjects={() => openSection('projects')}
            onContact={() => openSection('contact')}
            fallback={!show3D}
          />
        )}

        {view === 'explore' && (
          <SceneControls
            show3D={show3D}
            panelOpen={panelOpen}
            onReset={resetCamera}
            onHome={goHome}
          />
        )}

        {panelOpen && <ReturnToPlanet onReturn={closePanel} />}
        {panelOpen && gallery && gallery.projectId === projectId && (
          <ProjectGallery
            key={gallery.projectId}
            project={portfolio.projects.find((p) => p.id === gallery.projectId)!}
            startIndex={gallery.index}
            reducedMotion={reducedMotion}
            onClose={() => setGallery(null)}
          />
        )}

        {panelOpen && section === 'about' && <AboutPanel {...panelCommon} onOpenSection={openSection} />}
        {panelOpen && section === 'projects' && (
          <ProjectsPanel
            {...panelCommon}
            projectId={projectId}
            onSelectProject={selectProject}
            onBackToList={() => setProjectId(null)}
          />
        )}
        {panelOpen && section === 'skills' && (
          <SkillsPanel {...panelCommon} skillId={skillId} onSelectSkill={selectSkill} />
        )}
        {panelOpen && section === 'experience' && (
          <ExperiencePanel {...panelCommon} experienceId={experienceId} onSelectItem={selectExperience} />
        )}
        {panelOpen && section === 'contact' && <ContactPanel {...panelCommon} />}
      </main>

      {loaderVisible && <LoadingScreen stage={stage} progress={progress} done={stage === 'ready'} />}

      {view === 'explore' && (
        <h1 className="sr-only">
          {portfolio.person.name} — {portfolio.person.title}
        </h1>
      )}
    </div>
  )
}

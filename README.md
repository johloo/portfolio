# John Carlo Salva — Digital Universe Portfolio

An interactive low-poly 3D planet portfolio built with **React, Vite, TypeScript, Three.js, React Three Fiber and Drei**.
Visitors can orbit the planet, fly to project islands on its surface, skill towers, orbital stations and a contact beacon — or use a conventional keyboard-accessible menu.

## Run it

```bash
npm install
npm run dev        # development server → http://localhost:5173
npm run build      # type-check + production build into /dist
npm run preview    # serve the production build locally
```

Requires Node 18+ (developed on Node 22).

## Update your content (no 3D code needed)

**Everything lives in [`src/data/portfolio.ts`](src/data/portfolio.ts):**

| What | Where in the file |
|---|---|
| Name, title, tagline | `person` |
| Email, phone, location, Formspree ID | `contact` |
| **Hide phone / location / email publicly** | `contact.visibility` → set `phone`, `location` or `email` to `false` |
| GitHub / LinkedIn (shown only when filled in) | `social` |
| Hero statistics | `stats` |
| About text | `about` |
| Skills + exact percentages | `skills` (towers in 3D resize automatically) |
| Projects | `projects` |
| Experience timeline | `experience.items` (optional `period` / `organization` fields appear when filled in) |

### Adding project links, status and real screenshots

Each project supports `links.github`, `links.demo`, `status` and `screenshots`. Anything left empty is **hidden** — nothing is invented.

```ts
links: { github: 'https://github.com/you/payroll', demo: '' },   // demo button stays hidden
status: 'Completed',                                              // badge appears when set
screenshots: [{ src: '/screenshots/payroll-1.png', alt: 'Payroll dashboard' }],
```

Put image files in `public/screenshots/`. Until real screenshots exist, a clearly labelled *“Illustrative preview — not a screenshot”* CSS illustration is shown.

### Adding a project / skill / timeline entry

Add an object to the matching array. Project islands, towers and stations in the 3D scene are generated from the data automatically.
(Islands are generated on the planet's surface, with four distinct designs that repeat if you add more than four projects.)

## Contact form (Formspree)

Posts JSON to `https://formspree.io/f/xyklajyn` with `name`, `email`, `_replyto`, `subject`, `_subject`, `message` and a `_gotcha` honeypot.
Success is shown **only after Formspree responds with a success status**; failures show Formspree's error message plus a direct email fallback.
A form must be activated in your Formspree dashboard (confirm the first submission email) before it delivers mail.

## Day / night mode

The sun/moon button in the top bar switches between **night** (stars, moon, glowing windows) and **day** (blue sky, sun, bright light). The whole UI re-themes with it and the choice is remembered in the browser. The default is night; change it in `src/App.tsx` (`return 'night'` in the `theme` state).

## Project island placement

Islands are scattered across the planet automatically, as far from each other and from the other landmarks as possible. To shuffle the arrangement, change `PLOT_SEED` in `src/scene/layout.ts` and refresh.

## Accessibility & performance

- Full keyboard navigation, visible focus rings, skip link, labelled form fields, `aria-live` status messages.
- `Esc` closes a panel (project detail → project list → close).
- Reduced motion respects the OS setting, with an in-app toggle (top-right ✦ button).
- No-WebGL / scene-crash fallback keeps every section available.
- Quality tiers: lower geometry, star and particle counts on small screens; adaptive pixel ratio via `PerformanceMonitor`.
- The 3D scene is code-split and lazy-loaded; all geometry is procedural (no model or texture downloads).

## Structure

```
src/
  data/portfolio.ts        ← all editable content
  scene/                   ← 3D: PlanetScene, LowPolyPlanet, SpaceEnvironment, OrbitingLandmarks,
                             InteractiveMarker, CameraController, landmarks/*
  components/              ← HeroSection, PortfolioNavigation, SceneControls, LoadingScreen, FallbackPlanet
  components/panels/       ← About, Projects, ProjectDetail, Skills, Experience, Contact, ContactForm
  styles/index.css         ← design tokens + all styles
```

## Deploying

`npm run build` outputs a static site in `dist/` — deploy to Netlify, Vercel, Cloudflare Pages or any static host.
For GitHub Pages under a sub-path, set `base: '/<repo-name>/'` in `vite.config.ts`.

## Landmark close-ups
Clicking a landmark flies the camera right up to it and reveals its own detailed low-poly scene (code in `src/scene/details/`). Camera distances live in `GROUND_VIEW` (`src/scene/layout.ts`) and `CameraController.tsx`.

### Close-up scenes (on the planet)
Opening a landmark zooms the camera into it and swaps it for a richer low-poly scene, with a mini avatar acting out that section. Scenes live in `src/scene/stage/scenes.tsx`, the avatar in `Avatar.tsx`, camera distances in `GROUND_VIEW` (`src/scene/layout.ts`).

### Transitions
`CameraController` runs one fly-to at a time (a new click retargets from the current pose, so animations never overlap). It publishes progress in `cameraState.ts`; detail scenes reveal via `useArrived` once the camera is ~60% there. A subtle FOV dolly plays mid-flight (skipped with reduced motion). **← Return to Planet** (`ReturnToPlanet.tsx`) is shown inside every location.

## Interior worlds (click a landmark → new place)

Clicking a landmark zooms the camera from the planet down to it, a short warp fade
plays, then you arrive in a full low-poly place (`src/scene/interior/`):

- **About** – research lab: avatar at dual monitors, holo globe, server racks, window to space.
- **Skills** – energy-tower plaza: 9 towers around you while the avatar walks the ring.
- **Contact** – signal hub: beacon, dishes, waving avatar.
- **Experience** – inside a large orbital satellite hall (windows onto space, solar wings, planet outside); scroll to zoom the whole hall.
- **Projects** – each has its own themed place: payroll hall with vault, supplements showroom, sample warehouse with a giant spreadsheet, UGC studio with moderation wall.

Interactions: click the avatar in the lab to hear about me (edit lines in `about.chat` in `src/data/portfolio.ts`); click any energy tower to select that skill; the avatar roams, types and waves on its own.

Drag to orbit 360° inside. **← Return to Planet** (or close the panel) fades back and
flies out to the planet overview. Reduced-motion makes the fades near-instant.

## Adding more projects

Append an object to `projects` in `src/data/portfolio.ts` — islands, panel list, camera targets and navigation all follow the array length. Seven distinct 3D looks exist (`src/data/projectVariants.ts`); extra projects reuse them in order. `technologies` / `contributions` / `links` / `screenshots` stay hidden while empty (the three newest projects have `TODO(John)` markers).

## Project images (orbiting frames)

Drop screenshots into `src/assets/projects/<project-id>/` (png / jpg / webp; ordered by file name, e.g. `01-dashboard.png`).
They appear automatically as frames orbiting the project inside its 3D place and in the project panel gallery — no code or data edit needed.
Empty slots stay as placeholder frames (minimum 5). Folder names = project ids in `src/data/portfolio.ts`.

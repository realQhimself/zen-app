# Zen App (禅 Space)

A mobile-first meditation & mindfulness practice app with pixel art aesthetics.

## Stack
- React 19 + Vite 7 + React Router 7
- Tailwind CSS 4 (theme in `src/index.css` under `@theme`)
- Framer Motion (page transitions, micro-animations)
- Lucide React (icons)
- PWA via vite-plugin-pwa
- Deployed to GitHub Pages (`gh-pages` branch)

## Project Structure
```
src/
  App.jsx              — Router + bottom navigation
  index.css            — Tailwind theme, all CSS animations
  utils/
    zen.js             — Shared: safeLoad/safeSave, XP helpers, RANKS, storage keys
    zen.test.js        — Unit tests (vitest)
  hooks/
    useWeather.js      — Weather data hook
    useGardenState.js  — Garden state (check-in, place/remove items)
    useMonkMovement.js — Monk movement, proximity detection, keyboard/mobile input
  components/
    WeatherEffects.jsx — Weather overlay components
    garden/
      gardenData.js    — Items, constants, default state
      NPCs.jsx         — Buddha + Muyu SVGs and NPC wrappers
      VirtualJoystick.jsx — Mobile joystick + desktop keyboard hint
      ItemRenderer.jsx — Placed item rendering, long-press delete
      ItemPicker.jsx   — Bottom sheet item picker
  pages/
    Home.jsx           — Profile, ranks, habits, dailies, todos
    Meditation.jsx     — Breathing guide (Date.now engine + Wake Lock)
    Fish.jsx           — Instrument simulator (muyu, bowl, drum)
    Garden.jsx         — Zen garden (assembles components above)
    Sutra.jsx          — Heart Sutra character-by-character copying
public/
  audio/               — Sound files (.mp3, .m4a)
  images/              — Backgrounds and pixel art sprites
    garden/            — Monk sprites, placeable item sprites
```

## Key Conventions

### Routing
- Base path: `/zen-app/` (GitHub Pages deployment)
- Use `import.meta.env.BASE_URL` for all asset paths
- Navigation links use React Router's `useNavigate()`

### Styling
- Custom theme colors: `zen-bg`, `zen-ink`, `zen-red`, `zen-dark`, `zen-sand`, `zen-stone`, `zen-gold`, `zen-moss`, `zen-cloud`
- Font: Noto Serif SC (loaded from Google Fonts)
- Frosted glass cards: use `.zen-card` class
- All custom animations go in `src/index.css`, not inline
- Mobile-first: use `env(safe-area-inset-bottom)` for bottom spacing

### State / Persistence
- All user data lives in `localStorage` (no backend)
  - `zen_profile` — { totalXP, spentXP } (unified XP/merit economy)
  - `zen_garden` — { cycleStartDate, checkIns[], items[] }
  - `zen_monk_pos` — { x, y }
  - `zen_garden_muted` — boolean
- XP helpers (`readProfile`, `addXP`, `spendXP`, `refundXP`) live in `src/utils/zen.js`
  - `spendXP()` returns `false` if insufficient balance
- Storage keys are centralized in `KEYS` object from `src/utils/zen.js`
- `safeLoad`/`safeSave` handle localStorage errors with memory fallback

### Audio
- Audio files go in `public/audio/`
- Use `new Audio()` for BGM, audio element pools for rapid-fire sounds
- Always respect mute state; save mute preference to localStorage
- BGM: `garden.mp3`, `bowl-horizon.mp3`
- SFX: `muyu-sample2.mp3` (selected muyu sound), `muyu.m4a`, `bowl.m4a`, `drum.m4a`

### Garden Page Specifics
- Fixed NPCs (Buddha statue, muyu drum) are SVG art, always present
  - Buddha → navigates to `/meditation`
  - Muyu → navigates to `/fish` (plays sound on tap)
- Placeable items are pixel art sprites, cost XP, stored in garden state
- Monk movement: WASD/arrows on desktop, virtual joystick on mobile
- Proximity detection radius: 12 units (items), 15 units (NPCs)

## Language
- UI text is in Chinese (Simplified)
- Code comments and variable names in English

## GitHub
- Repo: `realQhimself/zen-app`
- Primary branch: `main`
- Deploy: `npm run deploy` (builds + pushes to gh-pages)

## Workflow Preferences
- Commit after each completed feature, not in bulk
- Test changes visually in browser before committing
- Prefer CSS animations over JS animations where possible
- No unnecessary abstractions — direct, readable code
- Run `npx vitest run` before committing to verify tests pass

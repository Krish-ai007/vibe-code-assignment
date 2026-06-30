# Wobb Scout — Influencer Search (Assignment Submission)

A reworked version of the starter influencer search app: full visual redesign, Zustand
state management, a working "Add to List" feature with persistence, several bug fixes,
and performance/code-quality cleanup.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (verified passing)
npm run lint     # verified passing, 0 errors
```

## What I changed

### Bugs found & fixed
- **Case-sensitive search bug** (`dataHelpers.ts`): `filterProfiles` lowercased the
  query/fullname before comparing, but compared `username` against the raw, non-lowercased
  query — so searching `"mr"` matched full names but not usernames like `MrBeast`. Both
  sides are now lowercased and the query is trimmed.
- **Inconsistent engagement rate formula**: `ProfileDetailPage` multiplied the raw rate by
  `10,000` in one stat tile while `formatters.ts` multiplied by `100` elsewhere, so the
  *same field* showed two different percentages depending on where it was rendered.
  Consolidated into a single `formatEngagementRate` in `utils/formatters.ts`.
- **Stale closure on click counter**: `SearchPage` did `setClickCount(clickCount + 1)`
  inside a handler created fresh each render, which under-counts rapid clicks. It also
  triggered a re-render purely to log to the console. Replaced with a `useRef` counter
  (no unnecessary re-renders, no stale value).
- **`useEffect` calling `setState` synchronously on mount** in `ProfileDetailPage`
  (caught by the `react-hooks` lint rule): replaced the `loaded` boolean with a derived
  `loadedFor === username` check, plus a cancellation flag so an in-flight request for a
  previous username can't overwrite the current one after a fast route change.
- **Deprecated, React-19-incompatible dependency**: `react-beautiful-dnd` was listed in
  `package.json` but unused anywhere in the code, and its peer-dependency range (React
  16-18) broke `npm install` outright under React 19. Removed it.
- **Missing `alt` text on all avatar `<img>` tags** — accessibility issue, fixed via the
  new `Avatar` component (also adds a graceful initials fallback for broken/missing
  image URLs instead of a broken-image icon).
- **Recomputing the full dataset on every render**: `extractProfiles()` parses/maps the
  entire platform JSON file and was called on every render of `SearchPage`, including on
  every keystroke while typing in the search box. Wrapped in `useMemo`, keyed on
  `platform`.
- **Dead code**: `SearchBar.tsx` was an unused, near-duplicate of the search input
  already implemented inside `PlatformFilter`. Removed.
- Search input is now debounced (150ms) so filtering doesn't run on every single
  keystroke for large datasets.

### State management: Zustand
There was no existing `Context` to "replace" in the starter as cloned — the assignment's
state-management requirement is implemented as a Zustand store (`src/store/listStore.ts`)
for the "Add to List" feature, using `zustand/middleware/persist` to back it with
`localStorage` automatically (handles the "persistent after refresh" requirement without
hand-rolled `useEffect`/`localStorage.getItem` boilerplate).

### "Add to List" feature
- `ProfileCard` (search results grid) and `ProfileDetailPage` both have a working
  **Add to List** button, with an "Added" state once a profile is in the list.
- Duplicate prevention via `isInList` lookup keyed on `user_id` before adding.
- New `/list` route (`ListPage.tsx`) displays every saved profile with platform badge,
  follower count, and a remove button; includes a "Clear all" action.
- List persists across page refreshes via `localStorage` (Zustand `persist`).
- The header (`Layout.tsx`) shows a live count badge linking to `/list` from anywhere
  in the app.

### UI/UX redesign
Full visual overhaul: dark, custom design-token system (CSS variables for color, radius,
shadow), a segmented-control platform switcher, responsive card grid, skeleton loading
states on the profile detail page, empty states for no-results/empty-list, accessible
focus rings, `aria-pressed`/`aria-label`/`aria-current` attributes on interactive
elements, and `motion` (the React-19-compatible successor to Framer Motion) for list
enter/exit and layout animations.

### Code quality / structure
```
src/
  components/
    ui/            # reusable design-system primitives: Button, Badge, Avatar, EmptyState, Skeleton
    *.tsx          # feature components (ProfileCard, ProfileList, PlatformFilter, Layout, VerifiedBadge)
  hooks/
    useDebouncedValue.ts
  pages/
    SearchPage.tsx
    ProfileDetailPage.tsx
    ListPage.tsx     # new
  store/
    listStore.ts      # Zustand store
  utils/
    cn.ts             # clsx + tailwind-merge helper
    dataHelpers.ts
    formatters.ts      # single source of truth now (was duplicated per-component)
    profileLoader.ts
```
- Removed duplicated local `formatFollowersLocal`/`formatFollowersDetail` functions that
  lived inside individual components; everything now goes through `utils/formatters.ts`.
- `ProfileCard` is wrapped in `React.memo`; each card subscribes to its own slice of the
  Zustand store (`isInList(profile.user_id)`) so adding/removing one profile doesn't
  re-render the rest of the grid.
- Strict TypeScript throughout (`noUnusedLocals`/`noUnusedParameters` were already on in
  `tsconfig.app.json` — kept them honest, no `any`s introduced).

## Libraries added
- **zustand** — state management (required by the assignment).
- **motion** — the actively-maintained, React 19-compatible successor to
  `framer-motion`, used for the list/grid animations.
- **lucide-react** — lightweight icon set, used throughout the new UI.
- **clsx** + **tailwind-merge** — small `cn()` helper for conditional/conflict-free
  Tailwind class composition in the design-system components.
- **Removed**: `react-beautiful-dnd` (unused, deprecated, incompatible with React 19 —
  see Bugs above).

## Assumptions
- No drag-and-drop reordering was implemented for "My List" — the spec only asked for
  add/prevent-duplicates/display/remove/persist, and `react-beautiful-dnd` (the only
  drag library hinted at in the starter's dependencies) is unmaintained and broken under
  React 19. If reordering is desired, `@dnd-kit` would be the React-19-safe choice.
- The list is stored per-browser via `localStorage`, not synced to any backend (no
  backend exists in this starter).
- `platform` in the URL query string for `/profile/:username` defaults to `instagram`
  if missing/invalid, rather than rendering "unknown" as before.

## Trade-offs
- Kept Google Fonts (`Inter` + `Clash Display`) loaded via CSS `@import` rather than
  self-hosting, for simplicity — trades a small network request for not vendoring font
  files.
- Did not add a testing library (e.g. Vitest) given the scope/time budget; this is the
  most obvious next addition (see below).
- Per-card Zustand subscriptions add a small amount of boilerplate vs. one big selector,
  but avoid re-rendering the entire grid on every list mutation — worth it given the
  assignment explicitly calls out render/perf optimization.

## Remaining improvements (given more time)
- Unit tests (Vitest + React Testing Library) for `filterProfiles`, the Zustand store,
  and the Add to List interaction.
- Virtualized list rendering (e.g. `@tanstack/react-virtual`) if the dataset were much
  larger than the current sample JSON files.
- Deploy to Vercel/Netlify and link the live URL here.
- `@dnd-kit`-based manual reordering of the "My List" page.

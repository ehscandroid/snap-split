# Instruction for a fresh Claude Code instance: rebuild "Snap-Split" as "content-portal-v2"

You are rebuilding the React app currently called **Snap-Split** from a written spec alone — you do **not** have access to the original repository or source code. The rebuilt project is the **replacement** for this repo and must be named **`content-portal-v2`** (package name, and the folder name if you scaffold a fresh directory rather than building in place).

This blueprint folder's parent directory is the current `snap-split` repo, which `content-portal-v2` is replacing. Scaffold the new project as `content-portal-v2` — do not name it, or leave it named, `snap-split`.

## Which files to use

This directory (`blueprint/`) has three files. Use them for different purposes — don't mix them up:

| File | What it is | When to use it |
|---|---|---|
| `snap-split-blueprint.md` | **The spec.** Component props, design tokens, routing map, data model, ASCII layout mocks — reverse-engineered from the real source. | Read this in full before writing any code. It's your primary reference for every phase below. |
| `snap-split-blueprint.html` | The same spec, rendered as a formatted page. | Only open this if you want a nicer-to-read view of the `.md` file — it has no extra information beyond the markdown. |
| `Snap-Split-premium.html` | **Not part of the spec.** This is a pre-built, bundled export of the *original app's compiled output* (a self-contained HTML bundle with a loading thumbnail) — not documentation, not something to read for component details, and not something to copy from. | Ignore it for build purposes. Do not open it looking for spec information — it won't have any, and its markup is bundler output, not source. |

Do not invent details the spec doesn't cover. Where the blueprint's final "Gaps" section flags something as unverified (e.g. `--font-primary` is undefined, several minor components weren't sampled), make the simplest reasonable choice, note it briefly, and move on rather than guessing silently or blocking on it.

## Build order — one phase at a time

Work through the phases below **strictly in order, one at a time**. Do not skip ahead or attempt to generate the whole app in a single pass — later phases depend on earlier ones actually existing and working, not just being planned.

After finishing each phase:
1. Stop.
2. Confirm `pnpm dev` runs with no errors.
3. Report back briefly what was built in that phase.
4. Wait for a go-ahead (or explicit continuation instruction) before starting the next phase, unless you were told up front to run through all phases autonomously.

Don't jump ahead to pages before primitives exist — most later phases depend on earlier ones being in place.

1. **Scaffold the Vite stack.** `pnpm create vite` (React + TypeScript template), project name **`content-portal-v2`**. Confirm `pnpm dev` runs a blank app before continuing.
2. **Add Tailwind CSS v4 and libraries.** Install `@tailwindcss/vite`, `react-router-dom`, `@iconify/react` + `@iconify-json/mdi`, `flag-icons`, `mgsmu-react`, `react-swipeable`. Wire Tailwind via the Vite plugin (CSS-first config — no `tailwind.config.js` needed, per the blueprint's §2).
3. **Global CSS + design tokens.** Create `src/style/app.css` per blueprint §2: `@import "tailwindcss"`, the dark custom-variant, thin-scrollbar rules, the `user-select: none` behavior. Build `ThemeContext` and `AccentContext` exactly as described (localStorage keys, CSS custom properties, the 7-color accent palette with its hex values).
4. **Types.** Create `src/types.ts` with `SdsItem`, `SdsPackage`, and the additional data-model shapes from blueprint §5 (`SdsRecord`, `TenantRef`, etc.) — centralize them here rather than splitting across mock files.
5. **Routing + layout shell.** Build `App.tsx`'s route table (blueprint §1) and the 3-panel `splitview/Layout.tsx` + `Panel.tsx` (blueprint §3) — resizable/collapsible panels, per-route panel visibility rules, global modal/toast mounts. Get this rendering with placeholder content in each panel before building real components.
6. **Primitives.** Build the `Button` family (all 6 variants), then core `FormElements` (`TextInput`, `DropdownSelect`, `DatePicker`, `ToggleSwitch`, `SegmentedControl`), then the `Status`/`Chip` system (`colorUtils.ts` → `Status.tsx` → chip variants → generic `Chip`). Use blueprint §4 for exact prop names and behavior.
7. **Composite components.** `Modal` + `ConfirmModal`, `Table` + `SortableHeader`, `NavItem`/`NavDivider`/`NavFavorites`, `PanelHeader`/`NavHeader`/`DetailHeader`, the `Sds` field-editing kit (`FieldCard`, `EditableValue`, etc.).
8. **Pages.** Build the showcase pages first (`Buttons`, `Chips`, `Statuses`, `Form`) using the `SectionHeader` pattern from blueprint §6.C — cheapest to visually verify. Then the domain pages (`Sds`, `Tenants`, `Packages`) that compose the Sds field-editing kit and tables.
9. **Wire it all together and verify.** Click through every route. Confirm panel collapse/resize, theme toggle, accent switch, and the modal flows all work. Compare against the ASCII mocks in blueprint §6.

## Design principles to follow throughout

- **Extract components into their own files.** No inline component definitions nested inside a parent file — every component, however small, gets its own `.tsx` file under `src/components/`. Follow the blueprint's folder grouping (`Button/`, `FormElements/`, `Status/`, `Sds/`, `NavItems/`).
- **Always `async/await`, never `.then()` chains.** This applies to every async call in the codebase — data fetching, storage reads, anything promise-based.
- **Never use blocking/sync I/O** if any Node-side code is involved (e.g. no `fs.readFileSync`) — async equivalents only.
- **Never use the `path` module** for file paths — use template literals / relative paths directly.
- **All types and interfaces go in `src/types.ts`.** Never define an interface inline inside a component file.
- **Functional components only**, props typed with `interface`. Keep components small and single-purpose; extract stateful logic into custom hooks (`useX.ts`) rather than bloating a component body.
- **State scope discipline:** local component state → `useState`/`useReducer`; state shared across a subtree → React Context; app-wide/cross-feature state → `mgsmu-react` (`useStateStore`), matching how the original uses it for the toast trigger.
- **Accent color is always CSS-variable-driven**, never a static Tailwind color class — apply it via inline `style` or `color-mix()`, and use JS mouseenter/leave handlers for hover states on accent-colored elements (a CSS var can't be targeted by a Tailwind `:hover` utility).
- **Design both light and dark themes** for every new component — check dark-mode parity before considering a component done.
- **2-space indentation, single quotes, no semicolons**, arrow functions over `function` declarations — match the rest of the codebase's style.
- **No test framework** — don't add one unless asked.
- Where the blueprint's gap list says something wasn't directly verified (e.g. `--font-primary` is undefined, several minor components weren't sampled), make the simplest reasonable choice and move on rather than blocking on it.

## Reporting back

After each phase, briefly confirm what was built and that `pnpm dev` still runs cleanly, then stop and wait as described in "Build order" above before moving to the next phase.

# Snap-Split — Reconstruction Blueprint

Portable spec for rebuilding this app from scratch, with no access to the original source. Written for a fresh Claude instance to follow end-to-end.

## 1. Overview

**What it is:** "Snap-Split" component library / showcase app. It hosts the canonical Button and FormElements components later copied into sibling project repos, plus a domain demo (SDS / chemical safety-data-sheet management: SDS records, Tenants, Packages) built on a resizable 3-panel ("split view") shell.

**Stack:**
- React 18 + Vite 5, TypeScript ~5.6
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, `@import "tailwindcss"` in CSS — no `tailwind.config.js`, no PostCSS-driven config)
- react-router-dom v6 (`BrowserRouter`)
- `mgsmu-react` (`useStateStore`) for cross-tree app state (toast trigger, SDS parse job signals)
- `@iconify/react` with `@iconify-json/mdi` — icons referenced as `"mdi:icon-name"` strings
- `flag-icons` package + custom `FlagIcon` wrapper
- `react-swipeable` (present in deps, likely used for mobile gestures — not seen in sampled files)
- No test framework
- Package manager: pnpm; scripts: `dev` (vite), `build` (`tsc --noEmit && vite build`), `lint`, `preview`

**Routing map** (`src/App.tsx`, all under one `<Layout />`):
| Path | Element |
|---|---|
| `/` | placeholder "Select a page" |
| `/form/:id`, `/form` | `Form` page |
| `/buttons` | `Buttons` showcase |
| `/sds` | `Sds` detail page |
| `/tenants` | `Tenants` page |
| `/statuses` | `Statuses` showcase |
| `/chips` | `Chips` showcase |
| `/packages` | `Packages` page |
| `/fullview` | placeholder |
| `*` | 404 placeholder |

`main.tsx` wraps `<App />` in `<ThemeProvider><AccentProvider>`.

## 2. Design tokens

**Theme (light/dark):** class-based via `.dark` on `<html>`, toggled by `ThemeContext` (`useTheme`), persisted to `localStorage['app-theme']`, defaults to `prefers-color-scheme`. Tailwind v4 custom variant: `@custom-variant dark (&:where(.dark, .dark *));`

**Accent color:** `AccentContext` (`useAccent`) — a picker of 7 named colors, persisted to `localStorage['app-accent']`, applied as CSS custom properties on `document.documentElement`:
```
--accent       (e.g. #3b82f6 blue default)
--accent-hover (e.g. #2563eb)
```
Full palette:
| id | value | hover |
|---|---|---|
| blue (default) | #3b82f6 | #2563eb |
| violet | #7c3aed | #6d28d9 |
| rose | #f43f5e | #e11d48 |
| emerald | #10b981 | #059669 |
| amber | #f59e0b | #d97706 |
| cyan | #06b6d4 | #0891b2 |
| slate | #64748b | #475569 |

Accent is consumed throughout via inline `style={{ backgroundColor: 'var(--accent)' }}` or `color-mix(in srgb, var(--accent) N%, transparent)` for tinted backgrounds — not a Tailwind class, always inline style/CSS var.

**Base surface colors:**
- App background: `#eaedf1` light / `#111` dark (outer layout)
- Panel/card surface: `white` / `#1e1e1e` dark, border `#eef1f5` / `white/10` dark
- Headline text: `#0f172a` light / `gray-100` dark, tracking `-0.01em` to `-0.02em` on headings
- Secondary text: `#64748b` / `gray-400` dark
- Panel shadow: `shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_32px_-22px_rgba(15,23,42,0.16)]`

**Radius convention:** `rounded-lg` (buttons/inputs), `rounded-xl`/`rounded-2xl` (panels, modals, cards), `rounded-full` (pills/chips-as-pills).

**Status color map** (semantic, not accent-driven) — see §5.

**Typography:** no custom font declared beyond `var(--font-primary)` fallback in `app.css` (undefined elsewhere — treat as system default or ask user which font to bind). Font smoothing antialiased.

**Global CSS quirks to replicate** (`src/style/app.css`):
- Custom thin scrollbar (webkit + `scrollbar-width: thin`)
- Global `user-select: none` on `*`, re-enabled (`text`) for `input, textarea`
- `h3 { margin-top: 10px }`

## 3. Layout & shell

**3-panel "split view"** (`splitview/Layout.tsx` + `splitview/Panel.tsx`):
- Outer flex row, `h-screen w-screen`, `p-4 gap-4`, background `#eaedf1`/`#111`
- Panel widths persisted per-panel to `localStorage` (`panel-left-width`, `panel-middle-width`, `panel-right-width`)
- Each `<Panel>` is a rounded-2xl bordered card with: sticky header (min-h 58px, shadow appears on scroll), scrollable content area, optional sticky footer, and a draggable right-edge resize handle (`onMouseDown` → parent tracks `resizing` panel index, listens to window `mousemove`/`mouseup`, applies `e.movementX`)
- Panels can **collapse**: below `collapseWidth` (env `VITE_PANEL_COLLAPSE_WIDTH`, default 40px) a panel auto-collapses to icon-only; collapse can also be manually toggled via a header +/− button when `closable`
- Panel config per slot: `{ initialWidth, minWidth, maxWidth, collapseWidth, closable?, showHandle?, fill?, gridColumns? }`

**Three panels in Layout, left→right:**
1. **Nav panel** (~200px, max 500, collapsible+closable) — logo/title header, footer with Profile/Settings nav items, body: grouped `NavItem`s under `NavDivider` labels: "HazChem" (SDS, Packages, Tenants), "Components" (Home, Statuses, Chips, Form, Buttons, Full View), "Favorites" (dynamic `NavFavorites`)
2. **Middle/list panel** (~200px, max 900, closable) — hidden entirely on `/fullview`, `/tenants`, `/statuses`, `/chips`, `/packages` routes. Header switches: on `/sds` shows a search bar with package-tag chip + parse/edit action buttons; otherwise shows "Items" title + Columns button. Body renders `SdsTable` (on `/sds`) or generic `Table`.
3. **Right/detail panel** (fills remaining space, no max) — `<Outlet context={{ detailWidth }}/>` for the routed page. On `/sds` header is suppressed (page renders its own sticky header); otherwise shows a `DetailHeader` with icon, title, subtitle, flag, and a `SplitButton` row (Save/Export/Delete demo).

For `/tenants`, `/statuses`, `/chips`, `/packages`: panels 2 collapses away and a single fill panel (no padding, no handle) renders the `<Outlet>` directly — i.e. those pages are full-bleed single-panel views, not part of the 3-panel master-detail.

Global modals mounted at Layout level: `SdsEditModal` (bulk edit/delete/download for selected SDS rows), `PackagePickerModal` (assign a package search filter via `?package=` query param), `ToastSimple` (listens to `mgsmu-react` `toastEdit` key).

**Nav item pattern** (`NavItem.tsx`): icon + label row, `rounded-[10px]`, active state = `color-mix(in srgb, var(--accent) 10%, transparent)` background + `color: var(--accent)`, optional numeric `badge`. Collapses to icon-only+tooltip when `navSmall` (nav panel width < 120px).

## 4. Component inventory

### Button (`components/Button/`)
Shared variant/size vocabulary across the family: `variant: 'primary'|'secondary'|'danger'|'success'|'warning'|'ghost'|'outline'`, `size: 'sm'|'md'|'lg'`. `primary` variant always uses `var(--accent)`/`var(--accent-hover)` via inline style + mouse-enter/leave handlers (not CSS `:hover`, since it's a CSS var).

| Component | Purpose | Key props | Notes |
|---|---|---|---|
| `Button` | Base button | `variant, size, loading, leftIcon, rightIcon` + native button attrs | `loading` swaps children for a spinning ring |
| `TextButton` | Low-emphasis text-only button | `variant: 'default'\|'primary'\|'danger'` | Plain hover-bg, no accent var |
| `IconButton` | Square icon-only button | `icon: ReactNode, size, variant: 'default'\|'primary'\|'danger'\|'ghost'` | Fixed square sizes (w/h 6/8/10) |
| `CheckboxButton` | Toggle-style button with checkmark box | `label, checked?, onChange?, variant: 'default'\|'primary'` | Controlled/uncontrolled dual mode |
| `DownloadButton` | Button with animated fill-progress on click | `label, downloadingText, duration(ms), onClick` | `requestAnimationFrame` progress bar as an absolutely-positioned inset div |
| `SplitButton` | Primary action + adjoining dropdown of secondary actions | `label, options: {label,icon?,onClick,disabled?}[], variant, size` | Dropdown closes on outside click; arrow rotates 180° when open |

### FormElements (`components/FormElements/`)
Common shape: `label`, controlled `value`/`onChange(value)`, optional `required`, `disabled`, `error`.

| Component | Purpose | Distinct behavior |
|---|---|---|
| `TextInput` | Standard text field | `variant: 'outlined'\|'underlined'`, clear (✕) button, maxLength counter |
| `FloatingInput` | Material-style floating label | Label animates to top-left when focused/filled |
| `InlineInput` | (not sampled — inline-edit style input, follow `TextInput` pattern) | |
| `DatePicker` | Label+input+calendar-icon trigger opening a modal with native `<input type="date">` | Split 3-zone control: label chip / text field / icon action button (same visual shape as `DropdownSelect`) |
| `NumberPicker` | (not sampled — numeric stepper, follow shared control shape) | |
| `DropdownSelect` | Same 3-zone shape as DatePicker, opens a modal list of `options: string[]` | Modal: click row to select, Cancel/Select footer |
| `ColorPicker` | (not sampled) | |
| `TimePicker` | (not sampled, mirrors DatePicker) | |
| `GrowingTextarea` | (not sampled — textarea that auto-grows with content) | |
| `ToggleSwitch` | Label + pill switch | Bordered row wrapper, `w-12 h-6` track, `translate-x-6` thumb animation |
| `ToggleRow` | (not sampled, likely wraps ToggleSwitch for list contexts) | |
| `FileUpload` | File row display: title/subtitle/size/date/icon, optional delete | Used in Sds page for the SDS PDF attachment |
| `HintText` / `HintField` | (not sampled — inline help text, `HintField` likely wraps a field + `HintText`) | |
| `ImageSlider` | (not sampled) | |
| `SegmentedControl<T>` | Generic tab-like control | Generic over string union `T`; active segment gets `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`; optional `content: Record<T, ReactNode>` renders below as a bordered panel |
| `Title`, `SectionTitle`, `CardTitle`, `Label` | (not sampled — typographic primitives) | |
| Re-exports | `PanelHeader, NavHeader, DetailHeader` (from `../PanelHeader`), `Button, ButtonRow` (from `./ButtonRow`), `DefaultButton` (aliased base `Button`) | FormElements/index.ts is the "everything" barrel |

Shared visual idiom for compound pickers (`DatePicker`, `DropdownSelect`, presumably `TimePicker`, `NumberPicker`): a single bordered `rounded-lg` row split into 3 zones — bordered label button (bg-gray-100) | text input (readonly or free-type) | solid action button (bg-blue-500/bg-purple-500) that opens a centered modal (`fixed inset-0 bg-black/50 flex items-center justify-center`) with Cancel/Select footer buttons.

### Chip / Status family (`components/Chip/`, `components/Status/`)
Core helpers (`Status/colorUtils.ts`): `lighten(hex, ratio)`, `darken(hex, ratio)`, `withAlpha(hex, alphaHex)` — all operate on `#rrggbb` hex, return `rgb(...)` or hex+alpha string. Used everywhere status/tenant/date chips need tinted backgrounds derived from one base color.

`Status.tsx` defines the canonical status vocabulary as `STATUS_MAP: Record<number, {title, background, color}>`:
| code | title | background |
|---|---|---|
| 0 | unknown | #BDC1C6 |
| 1 | identified | #FFB300 |
| 2 | similar | #C79869 |
| 3 | purchased | #3D85D8 |
| 4 | MSDS update | #F9DD04 |
| 5 | in progress | #71BD66 |
| 90 | Datarecord | #588157 |
| 91 | release | #00A400 |
| 92 | is obsolete | #71BD66 |
| 98 | attention | #9400D3 |
| 99 | sleep | #808080 |

`Status` component renders 3 forms via `form: 'chip'|'circle'|'dot'` prop — chip (pill, gradient fill if `percent` given), circle (avatar-style, first letter), dot (small status indicator).

| Component | Purpose |
|---|---|
| `StatusChipMuted` | Same STATUS_MAP lookup, alpha-tinted bg (`withAlpha(bg,'26')`) + darkened text |
| `StatusChipOutline` | Outlined pill, `border: 1.5px solid <bg>`, `color: bg` |
| `StatusChipSquare` | (not sampled, presumably `rounded-md` square variant) |
| `StatusProgress` | (not sampled — progress-bar variant of Status) |
| `DateTag`, `SdsDateTag` | (not sampled — date pill, `SdsDateTag` likely domain-specific wrapper) |
| `DueDateChip` | Date-severity pill: computes days-overdue → `'today'\|'goodNear'\|'goodFar'\|'past'\|'longPast'` severity bucket (thresholds: 7 days near/long-past), each with its own background/color/border |
| `TenantChip` | Upload-state pill for a tenant: derives `'never'\|'outdated'\|'upToDate'\|'failed'` from `uploadedAt` vs `latestAvailableAt` + `failed` flag; shows tenant name + id + status icon/label; `selected` state adds inset ring |
| `TenantChipCompact` | (not sampled, condensed TenantChip) |
| `UploadChip` | (not sampled, likely generic version of TenantChip's upload-state logic) |

`Chip` (`components/Chip/Chip.tsx`) — generic tag component, distinct from Status chips: `icon`/`iconNode`, `label`, `value?`, `count?`, `description?`, `size: 'sm'|'lg'`, `active?`, `onRemove?`, `onClick?`. `size="lg"` renders a full-width list-picker row (icon tile + label/description + count/remove); `size="sm"` (default) renders an inline dark pill (`bg-white/5 border-white/10`). Used for: package tags, generic filter chips (`icon label: value`), and large picker-modal rows.

### Sds field-editing kit (`components/Sds/`)
Purpose-built for the SDS detail page's inline edit mode (`editMode` toggle):
- `FieldCard` — labeled card wrapper (`label`, `editable`, optional `trailing`, `className`)
- `EditableValue` — text that becomes an input when `editable`
- `EditableTextarea`, `EditableSelect` — same pattern for multi-line text / picklist
- `ChipListField` — generic list-of-removable-chips field (`items, itemKey, renderItem, editable, onRemove, onAdd`)
- `CountBadge` — small numeric badge (used next to "Packages" field label)
- `TenantsField` — composite field rendering `TenantChip`s for a record's connected tenants + "add" trigger

### Tables & sorting
- `Table` — generic demo table (fetches `jsonplaceholder.typicode.com/todos`, maps `id % 4` to a 4-state status). Responsive 3-mode system (`collapsed | narrow | full`) driven by panel width thresholds (`VITE_PANEL_COLLAPSE_WIDTH`=40, `VITE_TABLE_NARROW_WIDTH`=280): collapsed→dot-only rows, narrow→2 columns, full→user-selected column set (persisted via a Columns modal, checkbox-toggle each `ColDef`). Row selection via checkbox column, "select all" header checkbox, accent-tinted selected-row background, sticky header, empty-state illustration, footer showing `N of M` + `K selected`.
- `SdsTable`, `TenantsTable`, `PackagesTable` (not sampled — domain-specific tables, presumably reuse the same responsive-mode + selection pattern as `Table`)
- `SortableHeader<T>` — generic sortable `<th>`: `column, label, sortColumn, sortDirection, onSort` — arrow icon shown only on the active column, direction flips its icon

### Modals
- `Modal` — base modal shell: `open, onClose, title, subtitle?, icon?/iconNode?, maxWidth ('max-w-md' default)`, `children`. Centered overlay (`bg-black/40`), rounded-2xl card, icon tile + title/subtitle header row + close (✕) button, content injected below header (each modal builds its own footer/body).
- `ConfirmModal` — thin wrapper: `title, description?, confirmLabel='Delete', cancelLabel='Cancel', onConfirm, onClose` → renders `Modal` + Cancel(secondary)/Confirm(danger) button row.
- `SdsEditModal`, `PackagePickerModal`, `SdsPickerModal`, `TenantModal`, `TenantPickerModal`, `TagPickerModal`, `TableFiltersModal` — domain modals (not all sampled), all presumably built on the same `Modal` shell.

### Toast
- `Toast`, `ToastSimple` — `ToastSimple` is mounted globally in `Layout` and driven via `mgsmu-react`'s `toastEdit` store key (`setData({open: true})` triggers it) rather than local state/props.

### Nav items
- `NavItem` — icon+label row/link (see §3)
- `NavDivider` — section label divider ("HazChem", "Components", "Favorites")
- `NavFavorites` — dynamic list of favorited nav entries (backed by `hooks/useFavorites.ts`)
- `NavItemModal` — nav item that opens a modal instead of navigating (used for Profile/Settings footer items)

### Panel headers
`PanelHeader.tsx` exports 3 header presets:
- `PanelHeader` — icon tile + title/subtitle + trailing action (button or static "tag")
- `NavHeader` — avatar/icon + title/subtitle + row of icon actions
- `DetailHeader` — larger detail-page header: icon tile (amber gradient bg), title + optional tag pill + optional status pill, subtitle, trailing slot, and a `buttonRow` slot below (used for the SplitButton demo row in Layout's right panel)

### Misc
- `Checkbox` — standalone checkbox with `state: 'unchecked'|'checked'|'error'|'progress'` (used in Buttons showcase)
- `FlagIcon` — wraps `flag-icons` CSS classes by `countryCode`
- `TagField`, `QualityTags` — (not sampled, domain tag display)
- `PackageIcon`, `SdsIcon` (`components/icons/`) — custom SVG icon components used in nav + headers

## 5. Data model (from `src/types.ts` + `data/mockSds.ts` usage)

```ts
interface SdsItem {
  id: number
  name: string
  casNumber: string
  hazardClass: string
  status: number          // → STATUS_MAP code
  manufacturer: string
  signalWord: string       // 'Danger' | 'Warning' | 'None'
  storageClass: string
  quantity: number
  location: string
  revisionDate: string
  packages: string[]
}

interface SdsPackage {
  id: number
  name: string
  description: string
}
```

Additional shape inferred from `pages/Sds.tsx` usage of `data/mockSds.ts` (`SdsRecord`, `TenantRef` — not in `types.ts`, defined locally in the mock data file): an `SdsRecord` extends far beyond `SdsItem` with detail fields — `molecularFormula, flashPoint, boilingPoint, density, vaporPressure, solubility, autoIgnitionTemp, phRange, storageTemp, notes, lastUpdated, tenants: TenantRef[]`. `TenantRef = { id: number, name: string }`.

Status codes are the shared vocabulary (§4) — `SdsItem.status` and the demo `Table`'s local 4-state (`Open/In Progress/Done/Cancelled`) are independent systems; don't conflate them.

**Note:** `types.ts` currently only holds `SdsItem`/`SdsPackage` — the richer `SdsRecord`/`TenantRef`/tenant-upload-state shapes live in `data/*.ts` mock files, not centralized. When rebuilding, either preserve that split or (cleaner) fold everything into `types.ts` per the project's own stated convention.

## 6. UI mocks (rough layout, not pixel-accurate)

### A. Shell — default state (e.g. `/sds`)
```
┌────────────┬───────────────────────┬──────────────────────────────────────┐
│ 🔀 Snap-Split│ [🔍 search][📦][⚙] │  🧪  Acetone                    🇩🇪 ✏│
│            │                       │      CAS 67-64-1 · SDS #12  Updated..│
│ HAZCHEM    │  ▤ Acetone       ●    │ ┌───────────────┬──────────────────┐│
│  📄 SDS    │  ▤ Toluene       ●    │ │ CAS Number     │ Hazard Class     ││
│  📦 Packages│  ▤ Xylene        ●    │ ├───────────────┴──────────────────┤│
│  🏢 Tenants │  ▤ ...                │ │ Solubility (full width)          ││
│            │                       │ ├───────────────────────────────────┤│
│ COMPONENTS │                       │ │ Packages [3]  [chip][chip][chip] ││
│  🏠 Home   │                       │ ├───────────────────────────────────┤│
│  📶 Statuses│                      │ │ Tenants  [TenantChip][TenantChip] ││
│  🔷 Chips  │                       │ ├───────────────────────────────────┤│
│  📝 Form   │                       │ │ 📄 Acetone_SDS.pdf   1.2MB       ││
│  🔘 Buttons│                       │ ├───────────────────────────────────┤│
│  ⛶ Fullview│                       │ │ Hazard Statements / Precautionary ││
│            │                       │ │ Statements / First Aid Measures  ││
│ FAVORITES  │                       │ └───────────────────────────────────┘│
│──────────  │                       │                                      │
│ 👤 Profile │                       │                                      │
│ ⚙ Settings │                       │                                      │
└────────────┴───────────────────────┴──────────────────────────────────────┘
  Panel 1        Panel 2 (list)              Panel 3 (detail, fill)
  ~200px         ~200-900px                  fills remainder
```
Panels: rounded-2xl white/dark cards, `gap-4` between them, `p-4` outer margin, subtle shadow. Panel 1 can collapse to a narrow icon rail (~40px). Panel 2 header swaps to a search+filter bar only on `/sds`.

### B. Full-bleed page (e.g. `/chips`, `/statuses`, `/tenants`, `/packages`)
```
┌────────────┬───────────────────────────────────────────────────────────────┐
│  (nav,      │  Chip family                              v1 · 2026-07-02   │
│   same as   │  ──────────────────────────────────────────────────────────  │
│   above)    │  ● Package · a grouping of SDS documents                     │
│            │  [📦 Q3 Reagents  12 ✕] [📦 Lab A intake  47 ✕] [...]         │
│            │                                                                │
│            │  ● Filter · attribute:value                                   │
│            │  [⚠ Hazard class: Flammable ✕] [🎯 Status: Expired ✕] [...]   │
│            │                                                                │
│            │  ● List view · large, for picker modals                      │
│            │  ┌──────────────────────────────────────────┐                │
│            │  │ 📦  Q3 Reagents                    12     │                │
│            │  │     Reagents restocked for Q1 lab ops     │                │
│            │  └──────────────────────────────────────────┘                │
└────────────┴───────────────────────────────────────────────────────────────┘
```
Nav panel present, middle panel gone, one fill panel holds the whole page (no header chrome — page renders its own titles).

### C. Buttons/Form showcase pattern (any `pages/*.tsx` showcase)
```
Section Header ───────────────────────────  v1 · date
[Primary] [Secondary] [Danger] [Success] [Warning] [Ghost] [Outline]

Section Header ───────────────────────────  v1 · date
[Small] [Medium] [Large]
```
Every showcase page = stack of `space-y-8`, each section: a `SectionHeader` (title left, "vN · date" mono-text right, bottom border) followed by a `flex flex-wrap gap-3` row of live component instances. This is the reusable "showcase page" pattern — copy `SectionHeader` verbatim into any new showcase page.

### D. Modal shape (any Modal-based dialog)
```
        ┌───────────────────────────────────┐
        │ [🖼]  Title                    ✕ │
        │       Subtitle text               │
        │ ─────────────────────────────────  │
        │  (content — form fields, list,     │
        │   confirmation text, etc.)         │
        │                                    │
        │                [Cancel] [Confirm]  │
        └───────────────────────────────────┘
  centered, bg-black/40 overlay, rounded-2xl, shadow-2xl
```

## 7. Rebuild checklist (ordered)

1. **Scaffold**: Vite + React + TS project; add Tailwind v4 via `@tailwindcss/vite`; add `@iconify/react` + `@iconify-json/mdi`; add `flag-icons`; add `react-router-dom`; add `mgsmu-react` (or a local equivalent minimal global-store hook if unavailable) and `react-swipeable`.
2. **Global CSS**: `src/style/app.css` — `@import "tailwindcss"`, dark custom-variant, thin scrollbar rules, `user-select: none` w/ input/textarea override.
3. **Theme + Accent contexts**: `ThemeContext` (light/dark, localStorage `app-theme`, toggles `.dark` class on `<html>`), `AccentContext` (7-color palette, localStorage `app-accent`, sets `--accent`/`--accent-hover` CSS vars on `<html>`). Wrap `<App>` in both in `main.tsx`.
4. **Types**: create `src/types.ts` with `SdsItem`, `SdsPackage`, and fold in `SdsRecord`/`TenantRef`/upload-state types (see §5 note — better to centralize these than replicate the original's split).
5. **Primitives first**: build `components/Button/*` (all 6), then `components/FormElements/*` (start with `TextInput`, `DropdownSelect`, `DatePicker`, `ToggleSwitch`, `SegmentedControl` as the load-bearing ones; the compound-modal-picker pattern generalizes to TimePicker/NumberPicker/ColorPicker).
6. **Status/Chip system**: `Status/colorUtils.ts` (lighten/darken/withAlpha) → `Status/Status.tsx` (STATUS_MAP + 3 forms) → the chip variants (Muted/Outline/Square) → `Chip/Chip.tsx` (generic tag) → domain chips (TenantChip, DueDateChip, UploadChip, DateTag family).
7. **Shell**: `splitview/Panel.tsx` (generic resizable/collapsible panel primitive) → `splitview/Layout.tsx` (3-panel composition + route-conditional panel visibility + global modals/toast mount).
8. **Nav**: `NavItem`, `NavDivider`, `NavFavorites` (+ `hooks/useFavorites.ts`), `NavItemModal`.
9. **Modals**: `Modal` base shell → `ConfirmModal` → domain modals (`SdsEditModal`, pickers) as needed per page.
10. **Tables**: `Table.tsx` (generic responsive/selectable table) → `SortableHeader` → domain tables.
11. **Pages**: build showcase pages (`Buttons`, `Chips`, `Statuses`, `Form`) using the `SectionHeader` showcase pattern (§6.C) first — cheapest to verify visually — then the domain pages (`Sds`, `Tenants`, `Packages`) which compose the Sds field-editing kit (`components/Sds/*`).
12. **Wire routing**: `App.tsx` router table (§1) inside `<Layout>`; verify panel visibility toggles per-route match the original (`isFullView/isTenants/isStatuses/isChips/isPackages` conditions in Layout).
13. **Polish pass**: accent-var usage consistency (always inline style/CSS var, never a Tailwind color class, for anything meant to react to accent changes), dark-mode class parity on every new component, hover-state JS handlers for `primary`-variant buttons (CSS vars can't be targeted by Tailwind `:hover`).

## Gaps / not directly verified

- Files not opened (characterized only by name/import context, pattern inferred from siblings): `InlineInput`, `NumberPicker`, `ColorPicker`, `TimePicker`, `GrowingTextarea`, `HintText`/`HintField`, `ImageSlider`, `Title`/`SectionTitle`/`CardTitle`/`Label`, `ButtonRow`, `StatusChipSquare`, `StatusProgress`, `DateTag`, `SdsDateTag`, `TenantChipCompact`, `UploadChip`, `SdsTable`, `TenantsTable`, `PackagesTable`, all `*PickerModal`/`*Modal` except `Modal`/`ConfirmModal`, `Checkbox` internals, `TagField`, `QualityTags`, all hooks except inferred usage, `data/mock*.ts` exact field lists beyond what `pages/Sds.tsx` destructures, `pages/Form.tsx`/`Tenants.tsx`/`Packages.tsx`/`Statuses.tsx` bodies.
- No `tailwind.config.js` exists (Tailwind v4 CSS-first config) — no centralized token file to extract; tokens above are reverse-engineered from literal class names/hex values in components.
- `--font-primary` CSS var referenced in `app.css` but never defined in sampled files — actual font family is unresolved; ask the user or default to a system font stack.
- No test framework, no CI config inspected.
- `react-swipeable` is a dependency but wasn't observed in any sampled component — likely used in an unsampled mobile-nav or table-row-swipe interaction.
- Animation/transition durations are mostly explicit in Tailwind classes (`duration-150`, `duration-200`) so these transferred faithfully; the download-button progress fill uses `requestAnimationFrame`, not CSS transition — verified from source.

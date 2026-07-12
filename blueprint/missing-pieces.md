# Missing Pieces — Follow-up to snap-split-blueprint.md

This document covers stack pieces that existed in `snap-split` but were **not** captured in
`snap-split-blueprint.md` / `BUILD_PROMPT.md`, and therefore did not make it into the rebuilt
stack. Each section is written so another agent can reproduce the piece from scratch without
needing to open the original source.

Source of truth for everything below: `snap-split/src/components/`.

---

## 1. Modal system

There are three distinct modal shapes in this codebase. They share the same outer chrome
(backdrop + rounded card) but differ in how they present content inside.

### 1.1 `Modal` — base single-pane modal

File: `src/components/Modal.tsx`

Plain modal used for simple forms/pickers (e.g. the Columns modal, generic confirm/edit dialogs).

**Structure:**
- Full-screen fixed overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40`.
  Clicking the overlay calls `onClose`.
- Card: `bg-white dark:bg-[#1e1e1e] rounded-2xl w-full {maxWidth} mx-4 shadow-2xl border overflow-hidden`.
  `onClick` on the card calls `e.stopPropagation()` so clicks inside don't close it.
- Header row (`px-6 py-5`, flex, gap-4):
  - Optional 56×56 icon tile (`w-14 h-14 rounded-xl bg-[#f1f4f8] dark:bg-white/5`) showing either
    a passed-in `iconNode` or an Iconify `icon` string.
  - Title (`text-[17px] font-bold`) + optional subtitle (`text-[13px] text-[#64748b]`).
  - Close button, top-right, 32×32, `mdi:close` icon.
- `children` render below the header — the modal itself has no scroll/body wrapper, so each
  usage supplies its own `px-6 pb-6` content block.

**Props:** `open, onClose, title, subtitle?, icon?, iconNode?, maxWidth? (default 'max-w-md'), children`.

Returns `null` when `open` is false — no exit animation, it's a hard mount/unmount.

### 1.2 `TableFiltersModal` — swipeable tabbed modal (pill tab switcher)

File: `src/components/TableFiltersModal.tsx`

Used for the table's **Statuses / Filters / Columns** modal (three tabs, one modal). This is
the "edit table" modal you're asking about.

**Structure:**
- Same overlay/card chrome as `Modal`, but `max-w-md` fixed.
- Header: a pill-style segmented tab switcher instead of a title —
  `flex-1 flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1`, one button per tab:
  - Active tab: `bg-white dark:bg-white/10 text-gray-900 shadow-sm`
  - Inactive: `text-gray-500 hover:text-gray-700`
  - Each tab button shows an Iconify icon (14px) + label.
  - Close button (`mdi:close`) sits to the right of the tab group, outside it.
- Body is a **horizontal filmstrip**: one wrapper div with `overflow-hidden`, containing an
  inner flex row with `transition-transform duration-300 ease-in-out` and
  `style={{ transform: 'translateX(-{active * 100}%)' }}`. Each child (one per tab, passed in
  as `children: React.ReactNode[]`) is wrapped `w-full flex-shrink-0` so exactly one pane is
  visible at a time and switching tabs slides the strip.

**Swipe gesture** (this is the "how swipe is built" part):
- Uses the `react-swipeable` library's `useSwipeable` hook, not custom touch handlers.
- Hook config:
  ```ts
  const handlers = useSwipeable({
    onSwipedLeft:  () => goTo(active + 1),
    onSwipedRight: () => goTo(active - 1),
    trackMouse: false,          // touch/trackpad only, not mouse-drag
    preventScrollOnSwipe: true, // stops vertical page scroll from hijacking a horizontal swipe
  })
  ```
- `handlers` is spread onto the **filmstrip wrapper div** (the one with `overflow-hidden`), not
  the individual panes. So a swipe anywhere over the sliding area triggers `goTo`.
- `goTo(index)` clamps: `Math.max(0, Math.min(tabs.length - 1, index))` — swiping past the first
  or last tab is a no-op, it doesn't wrap.
- Tapping a tab pill calls `goTo(i)` directly — same clamped setter, so pill-tap and swipe are
  perfectly consistent (both just move `active` state; the transform recalculates from that).

**Props:** `open, onClose, tabs: {key, label, icon}[], children: ReactNode[], initialTab? (default 0)`.
`children.length` must equal `tabs.length` — index `i` of one maps to index `i` of the other.

### 1.3 `SdsEditModal` — sidebar + swipeable content (bulk-edit modal)

File: `src/components/SdsEditModal.tsx`

Used for the bulk "Edit N selected items" modal (Parse Files / Change Status / Send Mails /
Create XLS). Same swipe mechanism as `TableFiltersModal`, but navigation is a **left sidebar**
list instead of a pill tab bar, and the modal is wider/taller (`max-w-2xl`, `maxHeight: 80vh`,
internal flex column so header/body/footer split correctly on tall content).

**Structure:**
- Header (fixed, `border-b`): 36×36 icon tile + "Edit" title + "{n} items selected" subtitle +
  close button.
- Body: `flex flex-1 min-h-0` — sidebar + sliding content side by side.
  - **Sidebar** (`w-44 flex-shrink-0 border-r p-2`): one button per section
    (`{key, label, icon}[]`), active state = `bg-gray-100 dark:bg-white/10`. Below the section
    list there's a flex-1 spacer, then a second button group (Download / Delete) separated by a
    `border-t` — these call `onDownload`/`onDelete` props directly, they are not slides.
  - **Sliding content** (`flex-1 overflow-hidden`): identical filmstrip pattern to
    `TableFiltersModal` — `useSwipeable` on the wrapper, `translateX(-{active*100}%)` on the
    inner flex row, one `w-full flex-shrink-0 p-6 overflow-auto` pane per section.
- Clicking a sidebar item calls the same clamped `goTo(index)` as swiping — one state, two
  input methods.

#### 1.3.1 The panes, in detail

> Note: the current `sections` array in `SdsEditModal.tsx` also lists a "Parse Files" entry
> first, but that functionality actually belongs to the separate toolbar + job-runner flow
> documented in full in §3 (`useStateStore('sdsParseTrigger')` etc. in `Layout.tsx` /
> `SdsTable.tsx`) — leave it out of this modal in the rebuild. Only **Change Status**,
> **Send Mails**, and **Create XLS** belong here.

Each pane is `w-full flex-shrink-0 p-6 overflow-auto`, and each starts with the same header
line pattern: `<p className="text-sm font-medium ... mb-3">{Verb} for {selectedCount} item{s}</p>`
(pluralization: `` {selectedCount} item{selectedCount !== 1 ? 's' : ''} ``). This pane content is
currently **mocked/static UI only** in the source — no wiring back to real bulk-action
callbacks yet, and the "Status" pane's labels (Active/Draft/Archived/Review) don't match the
app's real `STATUS_MAP` used everywhere else (see §2.7) — that's a gap to close in the rebuild,
not a pattern to copy verbatim.

1. **Change Status** (`mdi:tag-outline`)
   - A vertical list of buttons, one per status, each `flex items-center gap-3 px-4 py-3
     rounded-xl border text-left`, hover border darkens (no active/selected state — clicking one
     is meant to be an immediate bulk action, not a radio pick).
   - Each row = a small pill (`px-2.5 py-1 rounded-full text-xs font-medium`, pastel bg + colored
     text, e.g. `bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400` for
     "Active") showing the status label, followed by muted helper text "Set all to {label}".
   - Current hardcoded set: `Active` (green), `Draft` (yellow), `Archived` (red), `Review`
     (blue) — **replace with the real `STATUS_MAP`** (`src/components/Status/Status.tsx`, codes
     0/1/2/3/4/5/90/91/92/98/99) and reuse `StatusChipMuted`/`StatusChipSquare` for the pill
     instead of ad-hoc Tailwind color pairs, so it stays visually consistent with the status
     filter tab (§2.2) and table cells.
   - No button/API wiring yet — clicking a row should bulk-set `row.status` for every id in the
     current selection.

2. **Send Mails** (`mdi:email-outline`)
   - Two labeled fields, stacked (`flex flex-col gap-1` each, `text-xs text-gray-400` label
     above the control):
     - "Recipients" → plain `<input type="text" placeholder="email@example.com">`, single field
       (not a chip/multi-recipient input — one string).
     - "Template" → native `<select>` with three hardcoded options: "SDS Update Notification",
       "Hazard Summary", "Expiry Warning".
   - Both inputs use the same styling: `bg-gray-50 dark:bg-white/5 border border-gray-200
     dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none
     focus:border-gray-300 dark:focus:border-white/20`.
   - Primary button below: accent-filled, "Send". No `onChange`/controlled state or submit
     handler yet — needs to be wired to whatever mail-send endpoint exists, passing the current
     selection's ids + recipients string + chosen template.

3. **Create XLS** (`mdi:microsoft-excel`)
   - Same checklist pattern (4 checkbox rows, each a `<label>` wrapping a native
     `<input type="checkbox" defaultChecked className="accent-[var(--accent)]">` + text, all
     uncontrolled/`defaultChecked`): "Include hazard data", "Include storage info", "Include
     first aid measures", "Include supplier details".
   - Primary button: accent-filled, "Generate XLS". Needs wiring to an export endpoint that
     takes the selection + chosen include-flags and returns/downloads a file — nothing on the
     frontend currently triggers a download.

**Reproduction checklist for "a modal with a swipeable multi-pane body":**
1. Track `active: number` state and a `goTo(i)` setter that clamps to `[0, paneCount - 1]`.
2. Build the pane strip: outer div `overflow-hidden`, inner div `flex transition-transform
   duration-300 ease-in-out` with inline `style={{ transform: 'translateX(-' + active*100 + '%)' }}`.
3. Each pane: `w-full flex-shrink-0` (add `p-6 overflow-auto` if content can scroll).
4. Wire `useSwipeable({ onSwipedLeft: () => goTo(active+1), onSwipedRight: () => goTo(active-1),
   trackMouse: false, preventScrollOnSwipe: true })` and spread the returned handlers onto the
   **outer** (`overflow-hidden`) div — not onto individual panes, not onto the card.
5. Whatever also controls `active` (tab pills, sidebar buttons) must call the same `goTo`, never
   set `active` directly, so swipe and click stay in sync and both respect the clamp.
6. Package: `react-swipeable` (already a dependency — check `package.json`/`pnpm-lock.yaml` in
   snap-split before adding again).

---

## 2. Table: statuses, filters, columns

The "real" implementation is `src/components/SdsTable.tsx` (the `src/components/Table.tsx` file
is an older/simpler demo version fetching jsonplaceholder — prefer SdsTable's patterns for the
rebuild, they're what's actually in use).

### 2.1 State lives in the URL, not component state

All filter/search state is read from and written to `useSearchParams()` (react-router), *not*
local `useState`. This means filters survive refresh and are shareable via URL:

- `search` — free text, matched against name + CAS number.
- `package` — tag filter (single value, `row.packages.includes(tag)`).
- `status` — comma-joined list of numeric status codes. Empty/absent = "all shown". Setter
  always collapses back to "delete the param" when the resulting set is empty or equals the
  full set (`allStatusCodes.length`) — so the URL never carries a redundant "all statuses"
  param.
- `dateFrom` / `dateTo` — plain `YYYY-MM-DD` strings compared lexically against `row.revisionDate`.
- `overdue` — `'true'` boolean flag, toggled via a template filter row.
- `id` — the currently active/open row (row click sets this; some parent panel reads it to show
  a detail view).

Column visibility (`userCols`) and the Name-column pixel width are **not** URL state — they're
local `useState` (`userCols`) plus `localStorage` (name column width, key
`sds-table-name-col-width`, clamped 80–600px, default 220px).

### 2.2 Status filtering UI (the "favorite/only" pattern)

Each status row in the Statuses tab has two independent controls:

- **Star icon** (`selectOnlyStatus(code)`) — sets `status` param to *just* this code. Filled
  amber star (`text-amber-400`) when this is the only status currently selected
  (`isOnlySelected`), otherwise a gray outline star that fills amber on hover. This is a
  "solo" shortcut, not a toggle.
- **Toggle switch** (`toggleStatusFilter(code)`) — adds/removes this code from the shown set.
  Internally: read the current list (or default to *all* codes if the param is absent), flip
  membership, then collapse to "no param" if the result is empty or full. Switch track is
  `w-10 h-[22px] rounded-full`, accent color when on, gray when off; the thumb is a
  `translate-x-4`/`translate-x-0` sliding white circle — a plain CSS toggle, no library.
  `StatusChipSquare` for the row's chip is dimmed (`opacity-40`) when that status is currently
  hidden by the filter.
- A "Select all" text link appears only when the current selection is a strict subset (not 0,
  not all) — clicking it clears the `status` param entirely.
- Header line shows "`{shown} of {total} shown`" — `shown` = `statusFilter.length || allStatusCodes.length`.

### 2.3 Filters tab (non-status filters)

Simpler tab, straightforward form controls:
- A "Template filters" section using `ToggleRow` (title + subtitle + boolean switch) for
  canned filters like "SDS overdue (2+ years old)".
- A date range block: two native `<input type="date">` side by side (From/Max, To/Min cross-
  constrained via `max`/`min` props so you can't pick an invalid range), plus a clear (×) button
  that appears only when either date is set.

### 2.4 Columns tab

Plain checklist: one row per `colDefs` entry, click toggles membership in `userCols`
(`toggleCol`). Checkbox is a custom 16×16 div (not a native `<input>`) — accent-filled square
with a checkmark SVG when active, gray-bordered empty square when not. This same checklist
markup is reused identically in the standalone `Modal`-based Columns dialog in `Table.tsx` and
inside the third pane of `TableFiltersModal` in `SdsTable.tsx` — same JSX, so factor it as a
shared block if convenient, but it's currently duplicated in both files.

### 2.5 Responsive column collapsing

File: `src/hooks/useResponsiveColumns.ts` — this is the piece that makes the table adapt to
panel width (the app is a resizable 3-panel split view; the table lives in a panel that can be
dragged narrow).

- Reads three breakpoints from env vars (with defaults): `VITE_PANEL_COLLAPSE_WIDTH` (40),
  `VITE_TABLE_NARROW_WIDTH` (280), `VITE_TABLE_MEDIUM_WIDTH` (500).
- `getMode(width)` maps panel pixel width → `'collapsed' | 'narrow' | 'medium' | 'full'`.
- Each mode caps how many of the user's *chosen* columns actually render:
  `{ collapsed: 0, narrow: 2, medium: 4, full: Infinity }`. It always takes the **first N** of
  `userCols` in the user's chosen order — it does not re-sort by importance.
- `collapsed` mode drops the `<thead>` entirely, hides the per-row checkbox, and instead of
  cells renders a single centered dot per row: `<Status code={row.status} form="dot" />`
  wrapped in a `w-full text-center` cell, with `title={row.name}` on the `<tr>` for a native
  tooltip. This is what lets the panel collapse to a 40px rail and still show at-a-glance status
  per row.
- The hook is generic (`useResponsiveColumns<T>(width, cols: T[])`) — reused by any table type
  (Sds/Packages/Tenants), not Sds-specific.

### 2.6 Name column manual resize

Only the `name`/`title` column is user-resizable (drag handle), independent of the responsive
collapsing above:
- A 6px-wide invisible drag handle absolutely positioned at the column header's right edge
  (`absolute top-0 right-0 h-full w-1.5 cursor-col-resize`, highlights on hover).
- `onMouseDown` sets `resizingNameCol = true` (and calls `preventDefault()` to stop text
  selection while dragging).
- While resizing, a single `mousemove`/`mouseup` listener pair is attached to `window` (added/
  removed in a `useEffect` keyed on `resizingNameCol`) — width adjusts by `e.movementX` each
  event, clamped 80–600px.
- Width persists to `localStorage` on every change (`useEffect` keyed on `nameColWidth`), so it
  survives reload. Applied via `<col style={{ width: nameColWidth }}>` in a `<colgroup>` — the
  table uses `tableLayout: 'fixed'` in non-collapsed mode specifically so the `<col>` widths are
  respected.

### 2.7 Status chip variants

`src/components/Status/` exports several presentational variants over one shared
`STATUS_MAP: Record<number, {title, background, color}>` (see `Status.tsx` for the full map —
11 statuses, e.g. `0: unknown`, `5: in progress`, `91: release`, `99: sleep`):
- `Status` — the general one, `form: 'chip' | 'circle' | 'dot'`, supports a `percent` prop that
  renders a partial-fill gradient background (progress-within-a-chip effect).
- `StatusChipMuted` — soft/pastel chip (background at 15% alpha via `withAlpha`, text darkened
  15% via `darken`) — used in table cells.
- `StatusChipSquare` / `StatusChipOutline` — used in the filter list / elsewhere.
- Color math lives in `colorUtils.ts` (`lighten`, `darken`, `withAlpha` — hex string in, hex/rgba
  string out). Reuse these utilities rather than re-deriving tint/shade logic per component.

### 2.8 Row checkbox states beyond checked/unchecked

`src/components/Checkbox.tsx` is a 6-state control, not a boolean: `unchecked | checked |
success | attention | error | progress`. The `progress` state renders a spinning dashed-circle
SVG (`checkbox-rock` keyframe animation, rotates -135°→135°→-135° over 2.2s) instead of a
checkmark. `SdsTable` drives this from an in-flight "parse" background job: a row mid-parse
shows `progress`; on completion it shows `success`/`attention`/`error` for a moment (until
re-selected or reloaded), otherwise falls back to `checked`/`unchecked`. If your rebuild has any
row-level async batch action (parse, import, sync…), reuse this state machine instead of a
plain boolean checkbox + separate spinner.

---

## 3. Parse Files — toolbar flow, not a modal

There is **no dedicated "Parse Files" modal** in the current source — this is a common
misconception since §1.3.1 mentions it as excluded from `SdsEditModal`. The real parse flow
lives entirely in `src/splitview/Layout.tsx` (the toolbar above the Sds table) plus the
job-runner logic already inside `src/components/SdsTable.tsx`. Reproduce it as a toolbar
control + background job runner, not a modal.

### 3.1 Toolbar buttons

File: `src/splitview/Layout.tsx` (around the Sds panel's search/filter bar).

- Two buttons only appear once at least one row is selected (`sdsSelected > 0`):
  - **Edit ({n})** — accent-filled, `mdi:pencil-outline`, opens `SdsEditModal`
    (`setEditOpen(true)`) — this is the modal covered in §1.3.
  - **Parse** — separate from Edit, sits to its left. Not a modal trigger — a direct action
    button:
    - Idle state: `bg-yellow-700 hover:bg-yellow-800`, `mdi:file-search-outline` icon, label
      "Parse". `onClick` fires `pingSdsParse({ ts: Date.now() })`.
    - While a parse batch is running (`isSdsParsing`, derived from
      `sdsParseRunning?.running === true`), the same button slot swaps to a **Stop** button
      instead: `bg-red-500 hover:bg-red-600`, `mdi:stop` icon, label "Stop", `onClick` fires
      `pingSdsParseStop({ ts: Date.now() })`.
    - The `{ ts: Date.now() }` payload is a "ping" — the value itself is discarded by consumers,
      only used to force `mgsmu-react`'s change detection so repeated clicks re-trigger even if
      the previous value was identical.

### 3.2 Cross-component signaling (`mgsmu-react`)

Three global keys tie the toolbar button (Layout) to the job runner (SdsTable) without prop
drilling — see project convention: `mgsmu-react`'s `useStateStore`, never Zustand/Redux.

| Key | Written by | Read by | Purpose |
|---|---|---|---|
| `sdsParseTrigger` | Layout (Parse button) | SdsTable (`useEffect` watcher) | Starts a parse batch over the current selection |
| `sdsParseStop` | Layout (Stop button) | SdsTable (`useEffect` watcher) | Aborts all in-flight parses |
| `sdsParseRunning` | SdsTable | Layout (`isSdsParsing`) | Lets the toolbar know whether to show Parse or Stop |

### 3.3 Job runner (already documented in outline at §2.8, detailed here)

Lives inside `SdsTable.tsx`, triggered by the `sdsParseTrigger` effect:

- Snapshot the current selection into a local `queue` array (`Array.from(selectedRef.current)`)
  — `selectedRef` mirrors `selected` state via a ref so the running effect always reads the
  latest selection without re-subscribing.
- Concurrency cap comes from `getConcurrentParses()` (`src/components/NavItems/NavItemModal.tsx`
  §4 below), a `localStorage`-backed user setting (`concurrent-parses` key, clamped 1–5, default
  3) — this is the "Concurrent Parses" stepper in the Settings modal, not part of this flow's
  own UI.
- A `tryStartNext()` recursive dispatcher pulls one id off the queue at a time, guarded by
  `runningCount < maxConcurrent`, and re-checks `selectedRef.current.has(id)` before starting
  (an id deselected mid-queue is skipped, not parsed).
- Each row's parse (`parseRow(id)`) is staggered — `wait(PARSE_START_STAGGER_MS)` (1000ms)
  before attempting to start the *next* one, even if a concurrency slot is free — this avoids
  bursting all concurrent requests in the same tick.
- Each row parse:
  1. Adds `id` to `parsingIds` → row's checkbox renders the `progress` spin state (§2.8).
  2. Creates an `AbortController`, stores it in `abortControllersRef` keyed by `id`, and awaits
     a request that accepts `signal` (currently `mockParseRequest(5000, signal)` — a 5s
     `setTimeout` that rejects with `AbortedError` if the signal fires; swap this body for the
     real `fetch(url, { signal })` once the backend endpoint exists — the comment in source
     says exactly this).
  3. On abort (`AbortedError`): silently remove from `parsingIds`/`abortControllersRef` and
     return — no error state shown, this is a user-initiated Stop, not a failure.
  4. On completion: picks a random outcome for now (`error` / `attention` / `success`, roughly
     even thirds) — **this is mock/placeholder logic**, replace with the real parse result once
     the backend exists. Outcome updates `parseErrorIds`/`parseAttentionIds`/`parseSuccessIds`
     (mutually exclusive per id).
  5. On `success` or `attention`: calls `reloadItem(id)` (refetches that row's real data — see
     `useSdsData` hook) and briefly flags `flickerId` for 600ms to trigger a highlight
     transition on that row (`bg-gray-50` pulse via the row's `duration-500` transition class).
  6. Always: removes `id` from `parsingIds`, and if it was still selected, deselects it
     (`setSelected` + `onSelectionChange?.(next.size)`) — a row leaves the selection once its
     parse finishes, successful or not.
- `finishIfDone()` — once `runningCount === 0` and either the queue is empty or `stopRef.current`
  is true, sets `sdsParseRunning` to `{ running: false }`, flipping the toolbar button back to
  "Parse".
- The effect's cleanup function (fires on unmount or if `parseTrigger` changes again) sets
  `stopRef.current = true` and aborts every controller in `abortControllersRef` — so navigating
  away from the Sds table mid-parse cancels everything in flight, same as clicking Stop.

### 3.4 Concurrency setting

File: `src/components/NavItems/NavItemModal.tsx` — this is the same generic Settings modal
described nowhere else in this doc, worth noting since it's where §3.3's concurrency cap is
configured:
- `getConcurrentParses()` — exported helper, reads `localStorage['concurrent-parses']`, clamps
  1–5, defaults to 3. Called fresh each time a parse batch starts (§3.3), so a change takes
  effect on the *next* batch, not the currently running one.
- The Settings modal (opened via the `NavItemModal` with `label="Settings"`) renders a
  stepper row: "Concurrent Parses" title/subtitle + a `−`/count/`+` control
  (7×7 rounded buttons, disabled at the min/max bounds), calling
  `updateConcurrentParses(value)` which clamps, persists to `localStorage`, and updates local
  state — this row sits alongside the unrelated Dark Mode toggle and Accent Color picker in the
  same modal, all three driven by the generic `NavItemModal`'s hardcoded `label === 'Settings'`
  content branch (see §1.1's `Modal` — this reuses that same base modal, just with custom body
  content instead of generic `children`).

**Reproduction summary:** don't build a "Parse Files modal." Build (a) a toolbar
Parse/Stop button pair whose visibility depends on selection count and running state, (b) three
`mgsmu-react` keys connecting that button to the table's job runner, (c) a queue-based
concurrent-with-stagger job runner in the table component using `AbortController` per row and
the 6-state `Checkbox` for progress feedback, and (d) a small numeric setting (elsewhere, in
Settings) that caps concurrency.

---

## 4. Dependencies required

Confirm these are present in the target stack's `package.json` (they're used by the pieces
above and were easy to miss since they're not "components" per se):
- `react-swipeable` — swipe gesture handling for both modal types in §1.
- `@iconify/react` — all icons throughout (`Icon icon="mdi:..."`).
- `mgsmu-react` — `useStateStore` used for cross-component parse-job signaling
  (`sdsParseTrigger`, `sdsParseStop`, `sdsParseRunning` in `SdsTable.tsx`) — per project
  convention this is the standard global-state library, not Zustand/Redux.

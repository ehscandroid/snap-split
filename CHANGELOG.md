# Changelog

## [0.2.0] — 2026-06-17

### Added
- `Modal.tsx` — shared modal shell used by all modals in the app (header with icon box, title, subtitle, close button)
- Anti-flicker inline script in `index.html` — dark mode class applied before first paint, eliminating the light→dark flash on reload
- Panel max-widths added to `.env` (`VITE_PANEL_LEFT_MAX_WIDTH`, `VITE_PANEL_MIDDLE_MAX_WIDTH`, `VITE_PANEL_RIGHT_MAX_WIDTH`)

### Changed
- **Design overhaul** to match premium reference layout:
  - Outer wrapper: `bg-[#eaedf1]`, `p-4 gap-4`
  - Panels: `rounded-2xl`, `border border-[#eef1f5]`, layered box-shadow (`0 1px 2px` + `0 16px 32px -22px`)
  - Panel header: `min-h-[58px]`, `px-5`
  - Nav items: `gap-3 px-[11px] py-[9px] rounded-[10px]`, 18×18 icons, `text-[14px]`
  - Brand title: `text-[16px] font-bold tracking-[-0.01em]`
  - Favorites: uppercase section label, `text-[13.5px]` item text, `text-[11px]` meta tag
  - Middle panel header: `text-[17px] font-bold`
  - Right panel icon box: warm yellow gradient (`#fef9ec → #fdf0d0`)
  - Detail header tag: `text-[11.5px]` pill with `bg-[#f1f4f8] border-[#e6eaf0]`
- `NavItemModal` and `Table` modals migrated to shared `Modal` component
- Settings modal: removed footer row; content uses section labels + row layout matching reference design
- Collapsed table panel: status dots enlarged (`w-3.5 h-3.5`), centered, no horizontal scroll (`overflow-x-hidden`, padding removed)
- Panel footer: renders in both collapsed and expanded states (fixes missing Profile/Settings in collapsed nav)
- Nav footer separator border moved from Panel component to explicit layout; panel footer `border-t` removed

### Fixed
- Favorites items missing `cursor-pointer`
- Dark mode flicker on reload

## [0.0.0.1] — initial

- Three-panel resizable layout (left nav, middle table, right detail)
- Drag-to-resize handles with localStorage persistence
- Collapsible panels
- Light/dark theme toggle with accent color picker
- Button component library (SplitButton, TextButton, IconButton, CheckboxButton, DownloadButton)
- Form element library (TextInput, DropdownSelect, DatePicker, TimePicker, ColorPicker, and more)
- Table with search, column toggle, narrow/collapsed responsive modes
- NavFavorites pinned items
- FlagIcon component

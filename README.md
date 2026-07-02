# Snap-Split

A three-panel split-view shell for React apps — resizable, collapsible panels with a shared component library for buttons and form elements.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Iconify (MDI icon set)

## Structure

```
src/
├── components/
│   ├── Button/          # SplitButton, TextButton, IconButton, CheckboxButton, DownloadButton
│   ├── FormElements/    # TextInput, DropdownSelect, DatePicker, TimePicker, ColorPicker, ...
│   ├── Modal.tsx        # Shared modal shell (header + close + content slot)
│   ├── NavItem.tsx      # Sidebar nav link with active state and badge support
│   ├── NavItemModal.tsx # Nav item that opens a Modal (Profile, Settings)
│   ├── NavFavorites.tsx # Pinned favorites list in the sidebar
│   ├── PanelHeader.tsx  # DetailHeader, PanelHeader, NavHeader variants
│   ├── Table.tsx        # Data table with search, column toggle, collapsed dot mode
│   ├── Checkbox.tsx
│   ├── FlagIcon.tsx
│   └── QualityTags.tsx
├── splitview/
│   ├── Layout.tsx       # Three-panel layout with drag-to-resize
│   └── Panel.tsx        # Individual resizable/collapsible panel
├── pages/
│   ├── Buttons.tsx      # Button component showcase
│   └── Form.tsx         # Form element showcase
├── context/
│   ├── ThemeContext.tsx  # Light/dark theme with localStorage persistence
│   └── AccentContext.tsx # Accent color with localStorage persistence
└── style/
    └── app.css
```

## Environment

All panel and table dimensions are configured via `.env`:

```env
VITE_PORT=5682

VITE_PANEL_COLLAPSE_WIDTH=60   # width at which a panel collapses to icon-only
VITE_TABLE_NARROW_WIDTH=280    # width at which the table switches to narrow mode

VITE_PANEL_LEFT_MAX_WIDTH=500
VITE_PANEL_MIDDLE_MAX_WIDTH=900
VITE_PANEL_RIGHT_MAX_WIDTH=1500
```

## Panel behaviour

- Drag the handle between panels to resize
- Click **−** to collapse a panel; click **+** to expand
- The left panel collapses to icon-only nav; the middle panel collapses to status-dot rows
- Panel widths are persisted in `localStorage`

## Component library

This repo is the **mother repo** for shared UI components (buttons, form elements). When a component needs a new variant:

1. Make the change here first
2. Copy the updated file(s) into the target project repo

## Dev

```bash
pnpm install
pnpm dev
```

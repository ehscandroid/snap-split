import { useState, useEffect } from 'react'

export type ColumnMode = 'collapsed' | 'narrow' | 'medium' | 'full'

const COLLAPSE_WIDTH = parseInt(import.meta.env.VITE_PANEL_COLLAPSE_WIDTH) || 40
const NARROW_WIDTH   = parseInt(import.meta.env.VITE_TABLE_NARROW_WIDTH)   || 280
const MEDIUM_WIDTH   = parseInt(import.meta.env.VITE_TABLE_MEDIUM_WIDTH)   || 500

const getMode = (width: number): ColumnMode => {
  if (width <= COLLAPSE_WIDTH) return 'collapsed'
  if (width <= NARROW_WIDTH)   return 'narrow'
  if (width <= MEDIUM_WIDTH)   return 'medium'
  return 'full'
}

const COL_COUNT_BY_MODE: Record<ColumnMode, number> = {
  collapsed: 0,
  narrow: 2,
  medium: 4,
  full: Infinity,
}

export const useResponsiveColumns = <T,>(width: number, cols: T[]) => {
  const [mode, setMode] = useState<ColumnMode>(() => getMode(width))

  useEffect(() => { setMode(getMode(width)) }, [width])

  const visibleCols = cols.slice(0, COL_COUNT_BY_MODE[mode])

  return { mode, visibleCols }
}

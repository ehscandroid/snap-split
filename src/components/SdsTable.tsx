import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useArrowNavigation from '../hooks/useArrowNavigation'
import TableFiltersModal from './TableFiltersModal'

interface SdsItem {
  id: number
  name: string
  casNumber: string
  hazardClass: string
  status: number
}

const states: Record<number, { title: string; color: string }> = {
  0: { title: 'Active',   color: 'green'  },
  1: { title: 'Draft',    color: 'yellow' },
  2: { title: 'Archived', color: 'red'    },
  3: { title: 'Review',   color: 'blue'   },
}

const chipColors: Record<string, string> = {
  blue:   'bg-blue-50   text-blue-600   dark:bg-blue-500/10   dark:text-blue-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
  green:  'bg-green-50  text-green-600  dark:bg-green-500/10  dark:text-green-400',
  red:    'bg-red-50    text-red-500    dark:bg-red-500/10    dark:text-red-400',
}

const dotColors: Record<string, string> = {
  blue:   'bg-blue-400   dark:bg-blue-500',
  yellow: 'bg-yellow-400 dark:bg-yellow-500',
  green:  'bg-green-500  dark:bg-green-400',
  red:    'bg-red-400    dark:bg-red-500',
}

const MOCK_DATA: SdsItem[] = [
  { id: 1, name: 'Ethanol',           casNumber: '64-17-5',   hazardClass: 'Flammable',  status: 0 },
  { id: 2, name: 'Acetone',           casNumber: '67-64-1',   hazardClass: 'Flammable',  status: 1 },
  { id: 3, name: 'Hydrochloric Acid', casNumber: '7647-01-0', hazardClass: 'Corrosive',  status: 0 },
  { id: 4, name: 'Sodium Hydroxide',  casNumber: '1310-73-2', hazardClass: 'Corrosive',  status: 2 },
  { id: 5, name: 'Methanol',          casNumber: '67-56-1',   hazardClass: 'Toxic',      status: 3 },
  { id: 6, name: 'Toluene',           casNumber: '108-88-3',  hazardClass: 'Flammable',  status: 0 },
  { id: 7, name: 'Benzene',           casNumber: '71-43-2',   hazardClass: 'Carcinogen', status: 1 },
  { id: 8, name: 'Sulfuric Acid',     casNumber: '7664-93-9', hazardClass: 'Corrosive',  status: 0 },
]

type Mode = 'collapsed' | 'narrow' | 'full'

const COLLAPSE_WIDTH = parseInt(import.meta.env.VITE_PANEL_COLLAPSE_WIDTH) || 40
const NARROW_WIDTH   = parseInt(import.meta.env.VITE_TABLE_NARROW_WIDTH)   || 280

const getMode = (width: number): Mode => {
  if (width <= COLLAPSE_WIDTH) return 'collapsed'
  if (width <= NARROW_WIDTH)   return 'narrow'
  return 'full'
}

type ColKey = 'name' | 'casNumber' | 'hazardClass' | 'status'

interface ColDef {
  key: ColKey
  label: string
}

const colDefs: ColDef[] = [
  { key: 'name',       label: 'Name'        },
  { key: 'casNumber',  label: 'CAS Number'  },
  { key: 'hazardClass',label: 'Hazard Class'},
  { key: 'status',     label: 'Status'      },
]

const DEFAULT_COLS: ColKey[] = ['name', 'casNumber', 'status']

interface SdsTableProps {
  tabResizer?: number
  searchTerm?: string
  filtersOpen?: boolean
  filtersTab?: number
  onFiltersClose?: () => void
  onSelectionChange?: (count: number) => void
}

const SdsTable: React.FC<SdsTableProps> = ({ tabResizer = 400, searchTerm = '', filtersOpen = false, filtersTab = 0, onFiltersClose, onSelectionChange }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>(() => getMode(tabResizer))
  const [userCols, setUserCols] = useState<ColKey[]>(DEFAULT_COLS)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggleCol = (key: ColKey) => {
    setUserCols((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const toggleSelect = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      onSelectionChange?.(next.size)
      return next
    })
  }

  const toggleAll = (rows: SdsItem[]) => {
    setSelected((prev) => {
      const allSelected = rows.every((r) => prev.has(r.id))
      const next = allSelected ? new Set<number>() : new Set(rows.map((r) => r.id))
      onSelectionChange?.(next.size)
      return next
    })
  }

  useEffect(() => { setMode(getMode(tabResizer)) }, [tabResizer])

  const activeId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  const filtered = searchTerm
    ? MOCK_DATA.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.casNumber.includes(searchTerm)
      )
    : MOCK_DATA

  useArrowNavigation(filtered)

  const handleRowClick = (id: number) => {
    setSearchParams({ id: String(id) })
  }

  return (
    <div className="h-full flex flex-col">


      <TableFiltersModal
        open={filtersOpen}
        onClose={onFiltersClose!}
        initialTab={filtersTab}
        tabs={[
          { key: 'columns',  label: 'Columns', icon: 'mdi:table-column'  },
          { key: 'advanced', label: 'Filters',  icon: 'mdi:filter-outline' },
        ]}
      >
        <div className="flex flex-col px-6 pb-6 gap-1">
          {colDefs.map((col) => {
            const isActive = userCols.includes(col.key)
            return (
              <button key={col.key} onClick={() => toggleCol(col.key)} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f5f7fa] dark:hover:bg-white/5 transition-colors">
                <span className="text-[14px] text-[#334155] dark:text-gray-300">{col.label}</span>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? '' : 'border-gray-300 dark:border-gray-600'}`} style={isActive ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>
                  {isActive && <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </button>
            )
          })}
        </div>
        <div className="px-6 pb-6">
          <p className="text-[14px] text-[#64748b] dark:text-gray-500">Filters TBD</p>
        </div>
      </TableFiltersModal>

      <div className={`flex-1 min-h-0 overflow-auto ${mode === 'collapsed' ? 'px-0 overflow-x-hidden' : 'px-4'}`}>
        <table className="w-full border-collapse">
          {mode !== 'collapsed' && (
            <thead>
              <tr>
                <th className="w-10 px-3 h-9 text-left sticky top-0 bg-white dark:bg-[#1e1e1e]">
                  {(() => {
                    const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))
                    return (
                      <svg className="w-5 h-5 cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: allSelected ? 'var(--accent)' : undefined }} onClick={() => toggleAll(filtered)}>
                        <rect x="3" y="3" width="18" height="18" rx="2" className={allSelected ? '' : 'stroke-gray-300 hover:stroke-gray-400'} />
                        {allSelected && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />}
                      </svg>
                    )
                  })()}
                </th>
                {userCols.map((col) => (
                  <th key={col} className={`h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] ${col === 'name' ? '' : 'w-28'}`}>
                    {colDefs.find((d) => d.key === col)?.label}
                  </th>
                ))}
              </tr>
              <tr><td colSpan={userCols.length + 1} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
            </thead>
          )}
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={userCols.length + 1} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    {mode !== 'collapsed' && <span className="text-base font-medium">No results found</span>}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const isActive = row.id === activeId
                const status = states[row.status] ?? states[0]
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    title={mode === 'collapsed' ? row.name : undefined}
                    className={`border-b border-gray-100 dark:border-white/5 transition-colors duration-100 cursor-pointer ${isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : {}}
                  >
                    {mode === 'collapsed' ? (
                      <td className="w-full text-center py-2.5 px-2 align-middle">
                        <div className={`w-3.5 h-3.5 rounded-full mx-auto ${dotColors[status.color]}`} />
                      </td>
                    ) : (<>
                      <td className="w-10 px-3 py-2.5 align-middle">
                        <svg className="w-5 h-5 cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={(e) => toggleSelect(e, row.id)}>
                          <rect x="3" y="3" width="18" height="18" rx="2" className={selected.has(row.id) ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={selected.has(row.id) ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}} />
                          {selected.has(row.id) && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                        </svg>
                      </td>
                      {userCols.map((col) => (
                        <td key={col} className="px-2 py-2.5 align-middle">
                          {col === 'name' && (
                            <span className={`text-sm line-clamp-1 ${isActive ? 'font-medium' : 'text-gray-700 dark:text-gray-300'}`} style={isActive ? { color: 'var(--accent)' } : {}}>
                              {row.name}
                            </span>
                          )}
                          {col === 'casNumber' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{row.casNumber}</span>
                          )}
                          {col === 'hazardClass' && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{row.hazardClass}</span>
                          )}
                          {col === 'status' && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${chipColors[status.color]}`}>
                              {status.title}
                            </span>
                          )}
                        </td>
                      ))}</>)}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {mode !== 'collapsed' && (
        <div className="flex-shrink-0 flex items-center px-3 h-8 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {filtered.length} of {MOCK_DATA.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default SdsTable

import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useArrowNavigation from '../hooks/useArrowNavigation'
import { useSdsData } from '../hooks/useSdsData'
import { useResponsiveColumns } from '../hooks/useResponsiveColumns'
import TableFiltersModal from './TableFiltersModal'
import { Status, STATUS_MAP, StatusChipSquare, StatusChipMuted } from './Status'
import { ToggleRow } from './FormElements'
import type { SdsItem } from '../types'

type ColKey = 'name' | 'casNumber' | 'hazardClass' | 'status' | 'manufacturer' | 'signalWord' | 'storageClass' | 'quantity' | 'location' | 'revisionDate'

interface ColDef {
  key: ColKey
  label: string
}

const colDefs: ColDef[] = [
  { key: 'name',         label: 'Name'          },
  { key: 'casNumber',    label: 'CAS Number'    },
  { key: 'hazardClass',  label: 'Hazard Class'  },
  { key: 'status',       label: 'Status'        },
  { key: 'manufacturer', label: 'Manufacturer'  },
  { key: 'signalWord',   label: 'Signal Word'   },
  { key: 'storageClass', label: 'Storage Class' },
  { key: 'quantity',     label: 'Quantity'      },
  { key: 'location',     label: 'Location'      },
  { key: 'revisionDate', label: 'Revision Date' },
]

const DEFAULT_COLS: ColKey[] = colDefs.map((col) => col.key)

interface SdsTableProps {
  tabResizer?: number
  filtersOpen?: boolean
  filtersTab?: number
  onFiltersClose?: () => void
  onSelectionChange?: (count: number) => void
}

const SdsTable: React.FC<SdsTableProps> = ({ tabResizer = 400, filtersOpen = false, filtersTab = 0, onFiltersClose, onSelectionChange }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, loading } = useSdsData(searchParams)

  const searchTerm = searchParams.get('search') ?? ''
  const packageTag = searchParams.get('package')
  const allStatusCodes = Object.keys(STATUS_MAP).map(Number)
  const statusFilter = (searchParams.get('status') ?? '').split(',').filter(Boolean).map(Number)
  const dateFrom = searchParams.get('dateFrom') ?? ''
  const dateTo = searchParams.get('dateTo') ?? ''

  const setDateFrom = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      value ? next.set('dateFrom', value) : next.delete('dateFrom')
      return next
    })
  }

  const setDateTo = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      value ? next.set('dateTo', value) : next.delete('dateTo')
      return next
    })
  }

  const overdueOnly = searchParams.get('overdue') === 'true'

  const toggleOverdueOnly = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      overdueOnly ? next.delete('overdue') : next.set('overdue', 'true')
      return next
    })
  }

  const [userCols, setUserCols] = useState<ColKey[]>(DEFAULT_COLS)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggleStatusFilter = (code: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const raw = (next.get('status') ?? '').split(',').filter(Boolean).map(Number)
      const current = raw.length ? raw : allStatusCodes
      const updated = current.includes(code) ? current.filter((c) => c !== code) : [...current, code]
      updated.length === 0 || updated.length === allStatusCodes.length
        ? next.delete('status')
        : next.set('status', updated.join(','))
      return next
    })
  }

  const selectOnlyStatus = (code: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('status', String(code))
      return next
    })
  }

  const selectAllStatuses = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('status')
      return next
    })
  }

  const { mode, visibleCols } = useResponsiveColumns(tabResizer, userCols)

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

  const activeId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  const filtered = data
    .filter((row) => !searchTerm ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.casNumber.includes(searchTerm)
    )
    .filter((row) => !packageTag || row.packages.includes(packageTag))
    .filter((row) => statusFilter.length === 0 || statusFilter.includes(row.status))
    .filter((row) => !dateFrom || row.revisionDate >= dateFrom)
    .filter((row) => !dateTo || row.revisionDate <= dateTo)

  useArrowNavigation(filtered)

  const handleRowClick = (id: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('id', String(id))
      return next
    })
  }

  return (
    <div className="h-full flex flex-col">

      <TableFiltersModal
        open={filtersOpen}
        onClose={onFiltersClose!}
        initialTab={filtersTab}
        tabs={[
          { key: 'statuses', label: 'Statuses', icon: 'mdi:tag-multiple-outline' },
          { key: 'advanced', label: 'Filters',  icon: 'mdi:filter-outline' },
          { key: 'columns',  label: 'Columns', icon: 'mdi:table-column'  },
        ]}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-6 pb-4">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[#0f172a] dark:text-gray-100">Filter statuses</p>
              <p className="text-[13px] text-[#64748b] dark:text-gray-500">
                {statusFilter.length === 0 ? allStatusCodes.length : statusFilter.length} of {allStatusCodes.length} shown
              </p>
            </div>
            {statusFilter.length > 0 && statusFilter.length < allStatusCodes.length && (
              <button onClick={selectAllStatuses} className="text-[13px] font-medium hover:underline flex-shrink-0" style={{ color: 'var(--accent)' }}>Select all</button>
            )}
            <button
              onClick={onFiltersClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Done
            </button>
          </div>

          <div className="flex flex-col px-6 pb-6 gap-1">
            {allStatusCodes.map((code) => {
              const isShown = statusFilter.length === 0 || statusFilter.includes(code)
              const isOnlySelected = statusFilter.length === 1 && statusFilter[0] === code
              return (
                <div key={code} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f5f7fa] dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => selectOnlyStatus(code)}
                      className={`transition-colors flex-shrink-0 ${isOnlySelected ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400 dark:text-gray-600 dark:hover:text-amber-400'}`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isOnlySelected ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <StatusChipSquare code={code} className={isShown ? '' : 'opacity-40'} />
                  </div>
                  <button
                    onClick={() => toggleStatusFilter(code)}
                    className={`relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0 ${isShown ? 'bg-[var(--accent)]' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full transition-transform ${isShown ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-6 pb-4">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[#0f172a] dark:text-gray-100">Filters</p>
              <p className="text-[13px] text-[#64748b] dark:text-gray-500">Narrow results by other criteria</p>
            </div>
            <button
              onClick={onFiltersClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Done
            </button>
          </div>

          <div className="flex flex-col px-6 pb-6 gap-1">
            <p className="text-[13px] font-semibold text-[#334155] dark:text-gray-300 mb-1">Template filters</p>
            <ToggleRow
              title="SDS overdue"
              subtitle="2+ years old"
              value={overdueOnly}
              onChange={toggleOverdueOnly}
            />
          </div>

          <div className="flex flex-col px-6 pb-6 gap-2">
            <p className="text-[13px] font-semibold text-[#334155] dark:text-gray-300">Revision date</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[12px] text-[#64748b] dark:text-gray-500">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[12px] text-[#64748b] dark:text-gray-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => { setDateFrom(''); setDateTo('') }}
                  className="self-end mb-[9px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Clear dates"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
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
                {visibleCols.map((col) => (
                  <th key={col} className={`h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] ${col === 'name' ? '' : 'w-28'}`}>
                    {colDefs.find((d) => d.key === col)?.label}
                  </th>
                ))}
              </tr>
              <tr><td colSpan={visibleCols.length + 1} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
            </thead>
          )}
          <tbody>
            {loading ? null : filtered.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 1} className="py-16 text-center">
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
                        <Status code={row.status} form="dot" className="mx-auto" />
                      </td>
                    ) : (<>
                      <td className="w-10 px-3 py-2.5 align-middle">
                        <svg className="w-5 h-5 cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={(e) => toggleSelect(e, row.id)}>
                          <rect x="3" y="3" width="18" height="18" rx="2" className={selected.has(row.id) ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={selected.has(row.id) ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}} />
                          {selected.has(row.id) && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                        </svg>
                      </td>
                      {visibleCols.map((col) => (
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
                            <StatusChipMuted code={row.status} />
                          )}
                          {col === 'manufacturer' && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{row.manufacturer}</span>
                          )}
                          {col === 'signalWord' && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{row.signalWord}</span>
                          )}
                          {col === 'storageClass' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{row.storageClass}</span>
                          )}
                          {col === 'quantity' && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{row.quantity}</span>
                          )}
                          {col === 'location' && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{row.location}</span>
                          )}
                          {col === 'revisionDate' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{row.revisionDate}</span>
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
            {filtered.length} of {data.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default SdsTable

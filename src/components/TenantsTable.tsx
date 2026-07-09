import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useArrowNavigation from '../hooks/useArrowNavigation'
import { useTenants } from '../hooks/useTenants'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { SortableHeader } from './SortableHeader'
import { TENANT_STATUSES, type TenantRecord } from '../data/mockTenants'

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

type Mode = 'collapsed' | 'narrow' | 'full'
type SortColumn = 'name' | 'customer' | 'remark' | 'status'
type SortDirection = 'asc' | 'desc'

const COLLAPSE_WIDTH = parseInt(import.meta.env.VITE_PANEL_COLLAPSE_WIDTH) || 40
const NARROW_WIDTH   = parseInt(import.meta.env.VITE_TABLE_NARROW_WIDTH)   || 280

const getMode = (width: number): Mode => {
  if (width <= COLLAPSE_WIDTH) return 'collapsed'
  if (width <= NARROW_WIDTH)   return 'narrow'
  return 'full'
}

interface TenantsTableProps {
  tabResizer?: number
  onRowClick: (id: string) => void
  onAdd?: () => void
}

const TenantsTable: React.FC<TenantsTableProps> = ({ tabResizer = 400, onRowClick, onAdd }) => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  const [mode, setMode] = useState<Mode>(() => getMode(tabResizer))
  const [sortColumn, setSortColumn] = useState<SortColumn>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const { tenants } = useTenants()

  useEffect(() => { setMode(getMode(tabResizer)) }, [tabResizer])

  const activeId = searchParams.get('id')

  const toggleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortValue = (row: TenantRecord, column: SortColumn): string => {
    if (column === 'status') return TENANT_STATUSES[row.status]?.title ?? ''
    return row[column]
  }

  // TODO: once paginated, replace this client-side filter with a backend query using debouncedSearchTerm
  const filtered = debouncedSearchTerm
    ? tenants.filter((row) =>
        row.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        row.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : tenants

  const sorted = [...filtered].sort((a, b) => {
    const cmp = sortValue(a, sortColumn).localeCompare(sortValue(b, sortColumn))
    return sortDirection === 'asc' ? cmp : -cmp
  })

  useArrowNavigation(sorted)

  return (
    <div className="h-full flex flex-col">

      {mode !== 'collapsed' && (
        <div className="flex items-center gap-2 py-3 px-4">
          <div className="relative flex-1 flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 gap-2 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search tenants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            />
            {searchTerm && (
              <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setSearchTerm('')}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <button
            onClick={onAdd}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            New
          </button>
        </div>
      )}

      <div className={`flex-1 min-h-0 overflow-auto ${mode === 'collapsed' ? 'px-0 overflow-x-hidden' : 'px-4'}`}>
        <table className="w-full border-collapse">
          {mode !== 'collapsed' && (
            <thead>
              <tr>
                <SortableHeader column="name" label="Name" sortColumn={sortColumn} sortDirection={sortDirection} onSort={toggleSort} />
                {mode === 'full' && (
                  <>
                    <SortableHeader column="customer" label="Customer" sortColumn={sortColumn} sortDirection={sortDirection} onSort={toggleSort} />
                    <SortableHeader column="remark" label="Remark" sortColumn={sortColumn} sortDirection={sortDirection} onSort={toggleSort} />
                  </>
                )}
                <SortableHeader column="status" label="Status" sortColumn={sortColumn} sortDirection={sortDirection} onSort={toggleSort} className="w-28" />
              </tr>
              <tr><td colSpan={mode === 'full' ? 4 : 2} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
            </thead>
          )}
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    {mode !== 'collapsed' && <span className="text-base font-medium">No results found</span>}
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((row) => {
                const isActive = row.id === activeId
                const status = TENANT_STATUSES[row.status] ?? TENANT_STATUSES[0]
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick(row.id)}
                    title={mode === 'collapsed' ? row.name : undefined}
                    className={`border-b border-gray-100 dark:border-white/5 transition-colors duration-100 cursor-pointer ${isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : {}}
                  >
                    <td className={`py-2.5 px-2 align-middle ${mode === 'collapsed' ? 'w-full text-center' : ''}`}>
                      {mode === 'collapsed' ? (
                        <div className={`w-3.5 h-3.5 rounded-full mx-auto ${dotColors[status.color]}`} />
                      ) : (
                        <div>
                          <span
                            className={`text-sm line-clamp-1 ${isActive ? 'font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                            style={isActive ? { color: 'var(--accent)' } : {}}
                          >
                            {row.name}
                          </span>
                          {mode === 'narrow' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{row.customer}</span>
                          )}
                        </div>
                      )}
                    </td>
                    {mode === 'full' && (
                      <>
                        <td className="px-2 py-2.5 align-middle">
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{row.customer}</span>
                        </td>
                        <td className="px-2 py-2.5 align-middle">
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{row.remark || '—'}</span>
                        </td>
                      </>
                    )}
                    {mode !== 'collapsed' && (
                      <td className="px-2 py-2.5 align-middle">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${chipColors[status.color]}`}>
                          {status.title}
                        </span>
                      </td>
                    )}
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
            {sorted.length} of {tenants.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default TenantsTable

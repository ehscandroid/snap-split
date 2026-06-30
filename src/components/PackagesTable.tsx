import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { StatusProgress, DueDateChip } from './Status'
import useArrowNavigation from '../hooks/useArrowNavigation'

type PackageContext = 'normal' | 'archived'

interface Package {
  id: number
  name: string
  dueDate: string
  items: number
  statusBreakdown: Record<number, number>
}

// TODO: replace with real package data
const MOCK_DATA: Package[] = [
  { id: 1, name: 'Starter Package',    dueDate: '2026-07-15', items: 24, statusBreakdown: { 1: 0.05, 5: 0.95 } },
  { id: 2, name: 'Pro Package',        dueDate: '2026-08-02', items: 58, statusBreakdown: { 0: 0.2, 3: 0.5, 91: 0.3 } },
  { id: 3, name: 'Enterprise Package', dueDate: '2026-09-20', items: 142, statusBreakdown: { 2: 0.15, 5: 0.25, 90: 0.4, 92: 0.2 } },
  { id: 4, name: 'Legacy Package',     dueDate: '2026-06-15', items: 9, statusBreakdown: { 91: 1 } },
]

interface PackagesTableProps {
  onRowClick: (id: number) => void
  onAdd?: () => void
}

const PackagesTable: React.FC<PackagesTableProps> = ({ onRowClick, onAdd }) => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [context, setContext] = useState<PackageContext>('normal')

  const activeId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  const filtered = searchTerm
    ? MOCK_DATA.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : MOCK_DATA

  useArrowNavigation(filtered)

  return (
    <div className="h-full flex flex-col">

      <div className="flex items-center gap-2 py-3 px-4">
        <div className="relative flex-1 flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 gap-2 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search packages"
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

      <div className="flex-1 min-h-0 overflow-auto px-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e]">
                Package Name
              </th>
              <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-32">
                Due Date
              </th>
              <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-20">
                Items
              </th>
              <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-96">
                Progress
              </th>
            </tr>
            <tr><td colSpan={4} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span className="text-base font-medium">No results found</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const isActive = row.id === activeId
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick(row.id)}
                    className={`border-b border-gray-100 dark:border-white/5 transition-colors duration-100 cursor-pointer ${isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : {}}
                  >
                    <td className="py-2.5 px-2 align-middle">
                      <span
                        className={`text-sm line-clamp-1 ${isActive ? 'font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                        style={isActive ? { color: 'var(--accent)' } : {}}
                      >
                        {row.name}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle">
                      <DueDateChip date={row.dueDate} />
                    </td>
                    <td className="px-2 py-2.5 align-middle">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{row.items}</span>
                    </td>
                    <td className="px-2 py-2.5 align-middle">
                      <StatusProgress data={row.statusBreakdown} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between px-3 h-8 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          {filtered.length} of {MOCK_DATA.length}
        </span>
        <div className="flex items-center gap-1">
          {(['normal', 'archived'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setContext(option)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize transition-colors ${
                context === option
                  ? 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PackagesTable

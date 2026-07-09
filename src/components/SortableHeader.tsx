import { Icon } from '@iconify/react'

interface SortableHeaderProps<T extends string> {
  column: T
  label: string
  sortColumn: T
  sortDirection: 'asc' | 'desc'
  onSort: (column: T) => void
  className?: string
}

export function SortableHeader<T extends string>({ column, label, sortColumn, sortDirection, onSort, className = '' }: SortableHeaderProps<T>) {
  const isActive = column === sortColumn

  return (
    <th
      onClick={() => onSort(column)}
      className={`h-9 px-2 text-left text-xs font-medium uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] cursor-pointer select-none transition-colors ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'} ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <Icon
          icon={isActive && sortDirection === 'desc' ? 'mdi:arrow-down' : 'mdi:arrow-up'}
          width={12}
          height={12}
          className={isActive ? 'opacity-100' : 'opacity-0'}
        />
      </span>
    </th>
  )
}

export default SortableHeader

import { Icon } from '@iconify/react'

interface ChipProps {
  icon?: string
  iconNode?: React.ReactNode
  label: string
  value?: string
  count?: number
  description?: string
  size?: 'sm' | 'lg'
  active?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export const Chip: React.FC<ChipProps> = ({ icon, iconNode, label, value, count, description, size = 'sm', active = false, onRemove, onClick, className = '' }) => {
  const hasTrailingElement = count !== undefined || !!onRemove
  const icon_ = iconNode ?? (icon && <Icon icon={icon} width={size === 'lg' ? 20 : 14} height={size === 'lg' ? 20 : 14} className="text-gray-400 flex-shrink-0" />)

  if (size === 'lg') {
    return (
      <span
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-colors ${
          active
            ? 'border-[var(--accent)] bg-[#f5f7fa] dark:bg-white/5'
            : 'border-gray-200 dark:border-white/10 hover:bg-[#f5f7fa] dark:hover:bg-white/5'
        } ${className}`}
      >
        <div className="w-10 h-10 rounded-lg bg-[#f1f4f8] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
          {icon_}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#0f172a] dark:text-gray-100 truncate">
            {label}
            {value && <span className="ml-1.5 font-semibold">{value}</span>}
          </p>
          {description && <p className="text-xs text-[#64748b] dark:text-gray-400 truncate">{description}</p>}
        </div>
        {count !== undefined && (
          <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[11px] font-semibold text-gray-200 flex-shrink-0">
            {count}
          </span>
        )}
        {onRemove && (
          <button onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
            <Icon icon="mdi:close" width={15} height={15} />
          </button>
        )}
      </span>
    )
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-2 pl-2.5 ${hasTrailingElement ? 'pr-2' : 'pr-3'} py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap cursor-pointer transition-colors hover:bg-white/10 hover:border-white/20 ${className}`}
    >
      {icon_}
      <span>
        {label}
        {value && <span className="ml-1.5 font-semibold text-gray-100">{value}</span>}
      </span>
      {count !== undefined && (
        <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[11px] font-semibold text-gray-200">
          {count}
        </span>
      )}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
          <Icon icon="mdi:close" width={13} height={13} />
        </button>
      )}
    </span>
  )
}

export default Chip

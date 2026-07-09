import { Icon } from '@iconify/react'

interface TagFieldProps {
  value: string[]
  onEdit: () => void
}

export const TagField: React.FC<TagFieldProps> = ({ value, onEdit }) => {
  return (
    <div className="w-full min-h-[46px] px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg flex flex-wrap items-center gap-1.5">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-[13px] font-medium text-emerald-700 dark:text-emerald-300"
        >
          {tag}
        </span>
      ))}
      <button
        type="button"
        onClick={onEdit}
        className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-white/10 transition-colors ml-auto"
      >
        <Icon icon="mdi:pencil-outline" width={14} height={14} />
      </button>
    </div>
  )
}

export default TagField

interface ChipListFieldProps<T> {
  items: T[]
  itemKey: (item: T) => string | number
  renderItem: (item: T) => React.ReactNode
  editable: boolean
  onRemove: (item: T) => void
  onAdd: () => void
}

export function ChipListField<T>({ items, itemKey, renderItem, editable, onRemove, onAdd }: ChipListFieldProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={itemKey(item)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 shadow-sm">
          {renderItem(item)}
          {editable && (
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          )}
        </span>
      ))}
      {editable && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-dashed border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200"
        >
          + Add more
        </button>
      )}
    </div>
  )
}

export default ChipListField

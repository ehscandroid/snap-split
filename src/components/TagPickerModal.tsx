import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Button } from './Button'

interface TagPickerModalProps {
  open: boolean
  title: string
  options: string[]
  selected: string[]
  onClose: () => void
  onSave: (tags: string[]) => void
}

export const TagPickerModal: React.FC<TagPickerModalProps> = ({ open, title, options, selected, onClose, onSave }) => {
  const [draft, setDraft] = useState<Set<string>>(new Set(selected))

  useEffect(() => {
    if (open) setDraft(new Set(selected))
  }, [open])

  const toggle = (tag: string) => {
    setDraft((prev) => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  const handleSave = () => {
    onSave(Array.from(draft))
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5">
          <h2 className="flex-1 text-[17px] font-bold text-[#0f172a] dark:text-gray-100 truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f4f8] dark:hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          <div className="max-h-80 overflow-y-auto flex flex-col gap-1">
            {options.map((tag) => {
              const isChecked = draft.has(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" className={isChecked ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={isChecked ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}} />
                    {isChecked && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                  </svg>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tag}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 dark:border-white/10">
          <Button variant="primary" onClick={handleSave}>
            Apply{draft.size > 0 ? ` (${draft.size})` : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TagPickerModal

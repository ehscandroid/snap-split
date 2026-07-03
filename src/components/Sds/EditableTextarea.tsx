import { useEffect, useRef } from 'react'
import type { EditableValueProps } from './EditableValue'

export const EditableTextarea: React.FC<EditableValueProps> = ({ value, onChange, editable }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => { adjustHeight() }, [value])

  return (
    <div
      className={`flex items-start gap-2 rounded border p-2 transition-colors duration-200 ${
        editable ? 'bg-gray-50 dark:bg-black/25 border-gray-200 dark:border-white/10' : 'bg-transparent border-transparent'
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!editable}
        tabIndex={editable ? 0 : -1}
        rows={1}
        className="w-full bg-transparent rounded text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none resize-none overflow-hidden"
      />
      <button
        type="button"
        onClick={() => onChange('')}
        tabIndex={editable && value ? 0 : -1}
        className={`flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${editable && value ? 'visible' : 'invisible'}`}
      >
        ✕
      </button>
    </div>
  )
}

export default EditableTextarea

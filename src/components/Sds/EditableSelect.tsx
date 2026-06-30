import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Modal } from '../Modal'
import type { EditableValueProps } from './EditableValue'

export interface EditableSelectProps extends EditableValueProps {
  options: string[]
  modalTitle: string
}

export const EditableSelect: React.FC<EditableSelectProps> = ({ value, onChange, editable, options, modalTitle }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={`flex items-center gap-2 rounded pr-2 transition-[padding] duration-200 ${editable ? 'pl-2 py-1 bg-white/60 dark:bg-black/10' : 'pl-0 py-0 bg-transparent'}`}>
        <input
          type="text"
          value={value}
          readOnly
          tabIndex={-1}
          className="w-full bg-transparent rounded text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none cursor-default"
        />
        <button
          type="button"
          onClick={() => editable && setOpen(true)}
          tabIndex={editable ? 0 : -1}
          className={`flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${editable ? 'visible' : 'invisible'}`}
        >
          <Icon icon="mdi:chevron-down" width={16} height={16} />
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={modalTitle}>
        <div className="px-6 pb-6 space-y-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setOpen(false) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${option === value ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default EditableSelect

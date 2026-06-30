export interface EditableValueProps {
  value: string
  onChange: (value: string) => void
  editable: boolean
}

export const EditableValue: React.FC<EditableValueProps> = ({ value, onChange, editable }) => (
  <div className={`flex items-center gap-2 rounded pr-2 transition-[padding] duration-200 ${editable ? 'pl-2 py-1 bg-white/60 dark:bg-black/10' : 'pl-0 py-0 bg-transparent'}`}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={!editable}
      tabIndex={editable ? 0 : -1}
      className="w-full bg-transparent rounded text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
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

export default EditableValue

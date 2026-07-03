export interface EditableValueProps {
  value: string
  onChange: (value: string) => void
  editable: boolean
}

export const EditableValue: React.FC<EditableValueProps> = ({ value, onChange, editable }) => (
  <div
    className={`flex items-center gap-2 rounded pr-2 py-1 border transition-[padding-left,background-color,border-color] duration-200 ${
      editable ? 'pl-2 bg-gray-50 dark:bg-black/25 border-gray-200 dark:border-white/10' : 'pl-0 bg-transparent border-transparent'
    }`}
  >
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

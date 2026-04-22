import { useState, useRef } from 'react';

interface ColorPickerModalProps {
  onClose: () => void;
  onSelect: (color: string) => void;
  initialValue: string;
  title?: string;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ onClose, onSelect, initialValue, title = 'Select Color' }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#1f2937'];
  const [selected, setSelected] = useState(initialValue);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelected(color)}
              className={`w-10 h-10 rounded-lg border-2 ${selected === color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">Custom:</span>
          <input
            type="color"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="#000000"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={() => { onSelect(selected); onClose(); }} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Select</button>
        </div>
      </div>
    </div>
  );
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = '#000000',
  modalTitle,
  required,
  disabled,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden group focus-within:border-orange-500 dark:focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:focus-within:ring-orange-800 ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'} ${error ? 'border-red-500 dark:border-red-400' : ''}`}>
        <button 
          type="button"
          onClick={() => inputRef.current?.focus()} 
          className={`h-10 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 flex items-center ${disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </button>
        <div className="relative flex-1 flex items-center h-10">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={label}
            className="w-full h-full px-3 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100"
          />
          {value && !disabled && (
            <button
              type="button"
              onClick={() => onChange('#ef4444')}
              className="absolute right-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
        {!disabled && (
          <button 
            type="button"
            onClick={() => setShowModal(true)} 
            className="h-10 px-4 bg-orange-500 text-white hover:bg-orange-600 flex items-center"
          >
            🎨
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {showModal && <ColorPickerModal onClose={() => setShowModal(false)} onSelect={(color) => onChange(color)} initialValue={value} title={modalTitle} />}
    </>
  );
};

export default ColorPicker;

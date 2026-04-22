import { useState, useRef } from 'react';

interface NumberPickerModalProps {
  onClose: () => void;
  onSelect: (num: number) => void;
  initialValue: number;
  min?: number;
  max?: number;
  step?: number;
  title?: string;
}

const NumberPickerModal: React.FC<NumberPickerModalProps> = ({ onClose, onSelect, initialValue, min = 0, max = 100, step = 1, title = 'Enter Quantity' }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setValue(v => Math.max(min, v - step))} 
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg text-xl hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            −
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Math.min(max, Math.max(min, Number(e.target.value))))}
            min={min}
            max={max}
            step={step}
            className="w-24 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button 
            onClick={() => setValue(v => Math.min(max, v + step))} 
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg text-xl hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            +
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={() => { onSelect(value); onClose(); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Select</button>
        </div>
      </div>
    </div>
  );
};

interface NumberPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  modalTitle?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter quantity',
  modalTitle,
  min = 0,
  max = 100,
  step = 1,
  required,
  disabled,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden group focus-within:border-green-500 dark:focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200 dark:focus-within:ring-green-800 ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'} ${error ? 'border-red-500 dark:border-red-400' : ''}`}>
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
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            aria-label={label}
            className="w-full h-full px-3 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100"
          />
          {value > 0 && !disabled && (
            <button
              type="button"
              onClick={() => onChange(min)}
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
            className="h-10 px-4 bg-green-500 text-white hover:bg-green-600 flex items-center"
          >
            #
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {showModal && <NumberPickerModal onClose={() => setShowModal(false)} onSelect={(num) => onChange(num)} initialValue={value} min={min} max={max} step={step} title={modalTitle} />}
    </>
  );
};

export default NumberPicker;

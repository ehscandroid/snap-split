import { useState, useRef } from 'react';

interface DatePickerModalProps {
  onClose: () => void;
  onSelect: (date: string) => void;
  title?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ onClose, onSelect, title = 'Select Date' }) => {
  const [selectedDate, setSelectedDate] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={() => { onSelect(selectedDate); onClose(); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Select</button>
        </div>
      </div>
    </div>
  );
};

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter date',
  modalTitle,
  required,
  disabled,
  error,
  minDate,
  maxDate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden group focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-800 ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'} ${error ? 'border-red-500 dark:border-red-400' : ''}`}>
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
              onClick={() => onChange('')}
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
            className="h-10 px-4 bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          >
            📅
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {showModal && <DatePickerModal onClose={() => setShowModal(false)} onSelect={(date) => onChange(date)} title={modalTitle} />}
    </>
  );
};

export default DatePicker;

import { useState, useRef } from 'react';

interface TimePickerModalProps {
  onClose: () => void;
  onSelect: (time: string) => void;
  initialValue: string;
  title?: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onClose, onSelect, initialValue, title = 'Select Time' }) => {
  const [selectedTime, setSelectedTime] = useState(initialValue);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={() => { onSelect(selectedTime); onClose(); }} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">Select</button>
        </div>
      </div>
    </div>
  );
};

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select time',
  modalTitle,
  required,
  disabled,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden group focus-within:border-cyan-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-200 dark:focus-within:ring-cyan-800 ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'} ${error ? 'border-red-500 dark:border-red-400' : ''}`}>
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
            readOnly
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
            className="h-10 px-4 bg-cyan-500 text-white hover:bg-cyan-600 flex items-center"
          >
            🕐
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {showModal && <TimePickerModal onClose={() => setShowModal(false)} onSelect={(time) => onChange(time)} initialValue={value} title={modalTitle} />}
    </>
  );
};

export default TimePicker;

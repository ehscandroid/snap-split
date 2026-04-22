import React from 'react';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface RadioListProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const RadioIcon: React.FC<{ checked: boolean }> = ({ checked }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-400" />
    {checked && (
      <circle cx="12" cy="12" r="6" fill="currentColor" className="text-blue-500" />
    )}
  </svg>
);

export const RadioList: React.FC<RadioListProps> = ({
  options,
  value,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
              value === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <RadioIcon checked={value === option.value} />
            <span className="text-gray-900 dark:text-gray-100">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadioList;
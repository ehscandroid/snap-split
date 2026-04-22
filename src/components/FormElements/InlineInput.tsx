import { useState } from 'react';

type InputVariant = 'outlined' | 'underlined';

interface InlineInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  maxLength?: number;
  autoComplete?: 'off' | 'on' | 'name' | 'email' | 'tel' | 'current-password';
  variant?: InputVariant;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  labelWidth?: string;
}

export const InlineInput: React.FC<InlineInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  autoComplete,
  variant = 'outlined',
  required,
  disabled,
  error,
  labelWidth = 'w-32',
}) => {
  return (
    <div className="flex items-center gap-4 group">
      <label className={`${labelWidth} text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-label={label}
          className={`w-full px-3 py-2 pr-8 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
            variant === 'underlined'
              ? 'border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-none'
              : 'border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-focus-within:border-blue-500'
          } ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''} ${error ? 'border-red-500 dark:border-red-400' : ''}`}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
        {maxLength && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default InlineInput;

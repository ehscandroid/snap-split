import { useState } from 'react';

type InputVariant = 'outlined' | 'underlined';

interface FloatingInputProps {
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
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
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
}) => {
  return (
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-label={label}
        className={`w-full px-3 pt-2 pb-1.5 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 ${
          variant === 'underlined'
            ? 'border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-none'
            : 'border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-focus-within:border-blue-500'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''} ${error ? 'border-red-500 dark:border-red-400' : ''}`}
      />
      <label className={`absolute left-2 bg-white dark:bg-gray-900 px-1 transition-all duration-200 pointer-events-none ${
        value || placeholder ? '-top-2 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2 text-gray-500'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FloatingInput;

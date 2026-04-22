import { useState, useRef, useEffect } from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SplitButtonOption {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface SplitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  options: SplitButtonOption[];
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2 text-base',
};

const dropdownSizeClasses = {
  sm: 'px-1.5 py-1',
  md: 'px-2 py-1.5',
  lg: 'px-2.5 py-2',
};

export const SplitButton: React.FC<SplitButtonProps> = ({
  label,
  options,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <button
        disabled={disabled || loading}
        onClick={onClick}
        className={`
          rounded-l-lg font-medium transition-colors cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
        `}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          label
        )}
      </button>
      <div className="relative">
        <button
          disabled={disabled || loading}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            h-full rounded-r-lg transition-transform duration-75
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            ${variantClasses[variant]}
            ${dropdownSizeClasses[size]}
            active:translate-y-px
          `}
        >
          <span className={`transition-transform duration-150 inline-block ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 min-w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((option, index) => (
              <button
                key={index}
                disabled={option.disabled || disabled || loading}
                onClick={() => handleOptionClick(option.onClick)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${option.disabled || disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                `}
              >
                {option.icon && <span>{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitButton;

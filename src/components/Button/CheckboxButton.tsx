import { useState } from 'react';
import { ButtonHTMLAttributes } from 'react';

interface CheckboxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: 'default' | 'primary';
}

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckboxButton: React.FC<CheckboxButtonProps> = ({
  label,
  checked: controlledChecked,
  onChange,
  variant = 'default',
  disabled,
  ...props
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const newValue = !isChecked;
    
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    
    onChange?.(newValue);
    props.onClick?.(e);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' ? (
          isChecked
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ) : (
          isChecked
            ? 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
      `}
      {...props}
    >
      <span
        className={`
          w-5 h-5 rounded flex items-center justify-center
          transition-colors duration-150
          ${isChecked
            ? variant === 'primary'
              ? 'bg-white text-blue-500'
              : 'bg-blue-500 text-white'
            : 'bg-white border-2 border-gray-300'
          }
        `}
      >
        {isChecked && <CheckIcon />}
      </span>
      {label}
    </button>
  );
};

export default CheckboxButton;

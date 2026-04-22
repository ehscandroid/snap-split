import { ButtonHTMLAttributes } from 'react';

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger';
}

const variantClasses = {
  default: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
};

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        px-3 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer
        hover:bg-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default TextButton;

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
}

const sizeClasses = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-10 h-10 text-lg',
};

const variantClasses = {
  default: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;

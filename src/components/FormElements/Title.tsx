import React from 'react';
import { Icon } from '@iconify/react';

type TitleVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TitleAlign = 'left' | 'center' | 'right';
type TitleSize = 'sm' | 'md' | 'lg';

interface TitleProps {
  children: React.ReactNode;
  variant?: TitleVariant;
  align?: TitleAlign;
  size?: TitleSize;
  icon?: string;
  subtitle?: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  action?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<TitleSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const alignClasses: Record<TitleAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Title: React.FC<TitleProps> = ({
  children,
  variant = 'h3',
  align = 'left',
  size = 'md',
  icon,
  subtitle,
  badge,
  badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  action,
  disabled = false,
  className = '',
}) => {
  const Variant = variant;

  const headingClasses = `
    font-semibold text-gray-900 dark:text-gray-100
    ${sizeClasses[size]}
    ${alignClasses[align]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <div className={`flex items-center gap-3 ${alignClasses[align]}`}>
      {align === 'right' && action && <div className="ml-auto">{action}</div>}
      {icon && (
        <Icon
          icon={icon}
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : ''}`}
        />
      )}
      <div className="flex flex-col">
        <Variant className={headingClasses}>{children}</Variant>
        {subtitle && (
          <span className={`text-sm text-gray-500 dark:text-gray-400 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}>
            {subtitle}
          </span>
        )}
      </div>
      {badge !== undefined && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
      {align !== 'right' && action && <div className="ml-auto">{action}</div>}
    </div>
  );
};

interface SectionTitleProps {
  children: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
  bordered?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  description,
  action,
  icon,
  bordered = true,
  className = '',
}) => {
  return (
    <div className={`${bordered ? 'border-b border-gray-200 dark:border-gray-700 pb-3 mb-4' : ''} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <Icon icon={icon} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  image?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  subtitle,
  image,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {image && (
        <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
            {children}
          </h4>
          {action && <div>{action}</div>}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  optional = false,
  hint,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
          {children}
        </span>
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-xs text-gray-400 dark:text-gray-500">(optional)</span>}
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Title;

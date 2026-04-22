import { Icon } from '@iconify/react';

interface DateTimeDisplayProps {
  label: string;
  value: string;
  format?: 'de' | 'us';
  icon?: string;
  className?: string;
}

const formatDate = (dateStr: string, format: 'de' | 'us'): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return format === 'de'
    ? `${day}-${month}-${year} ${hours}:${minutes}`
    : `${month}/${day}/${year} ${hours}:${minutes}`;
};

export const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  label,
  value,
  format = 'de',
  icon,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm ${className}`}>
      {icon && <Icon icon={icon} className="w-4 h-4 text-gray-500" />}
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <span className="text-gray-900 dark:text-gray-100">{formatDate(value, format)}</span>
    </div>
  );
};

export default DateTimeDisplay;
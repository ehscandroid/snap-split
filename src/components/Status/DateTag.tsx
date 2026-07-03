import { Icon } from '@iconify/react';
import { withAlpha, darken } from './colorUtils';

interface DateTagProps {
  date: string | Date;
  tone?: 'neutral' | 'progress';
  className?: string;
}

const PROGRESS_COLOR = '#71BD66';

const formatDate = (date: Date): string => {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const DateTag: React.FC<DateTagProps> = ({ date, tone = 'neutral', className = '' }) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  const toneStyle = tone === 'progress'
    ? { backgroundColor: withAlpha(PROGRESS_COLOR, '26'), color: darken(PROGRESS_COLOR, 0.15) }
    : undefined;

  return (
    <span
      className={`inline-flex items-center gap-1.5 pl-[9px] pr-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
        tone === 'neutral' ? 'bg-gray-50 text-gray-500 border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10' : ''
      } ${className}`}
      style={toneStyle}
    >
      <Icon icon="mdi:calendar-blank-outline" width={13} height={13} />
      {formatDate(parsedDate)}
    </span>
  );
};

export default DateTag;

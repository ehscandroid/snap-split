interface DueDateChipProps {
  date: string | Date;
  className?: string;
}

type Severity = 'today' | 'goodNear' | 'goodFar' | 'past' | 'longPast';

const NEAR_DAYS = 7;
const LONG_PAST_DAYS = 7;

const severityStyles: Record<Severity, { background: string; color: string; border?: string }> = {
  today:    { background: '#FAFAF8', color: '#475569', border: '#E2E8F0' },
  goodNear: { background: '#9BD86B', color: '#1B3A0F' },
  goodFar:  { background: '#2E7D32', color: '#FFFFFF' },
  past:     { background: '#FB923C', color: '#212529' },
  longPast: { background: '#C62828', color: '#FFFFFF' },
};

const getSeverity = (date: Date): Severity => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  const daysOverdue = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

  if (daysOverdue === 0) return 'today';
  if (daysOverdue < 0) return daysOverdue >= -NEAR_DAYS ? 'goodNear' : 'goodFar';
  if (daysOverdue <= LONG_PAST_DAYS) return 'past';
  return 'longPast';
};

const formatDate = (date: Date): string => {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const DueDateChip: React.FC<DueDateChipProps> = ({ date, className = '' }) => {
  const due = typeof date === 'string' ? new Date(date) : date;
  const severity = getSeverity(due);
  const { background, color, border } = severityStyles[severity];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shadow-sm ${className}`}
      style={{ backgroundColor: background, color, border: border ? `1px solid ${border}` : undefined }}
    >
      {formatDate(due)}
    </span>
  );
};

export default DueDateChip;

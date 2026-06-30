interface SdsDateTagProps {
  date: string | Date;
  className?: string;
}

const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

const isOlderThanTwoYears = (date: Date): boolean => {
  const today = new Date();
  return today.getTime() - date.getTime() > TWO_YEARS_MS;
};

const formatDate = (date: Date): string => {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const SdsDateTag: React.FC<SdsDateTagProps> = ({ date, className = '' }) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const isOld = isOlderThanTwoYears(parsedDate);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shadow-sm ${className}`}
      style={isOld
        ? { backgroundColor: '#FA8072', color: '#FFFFFF' }
        : { backgroundColor: '#FFFFFF', color: '#212529', border: '1px solid #E2E8F0' }
      }
    >
      {formatDate(parsedDate)}
    </span>
  );
};

export default SdsDateTag;

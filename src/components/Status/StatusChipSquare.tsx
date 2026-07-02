import { STATUS_MAP, FALLBACK_STATUS } from './Status';
import { lighten } from './colorUtils';

interface StatusChipSquareProps {
  code: number;
  title?: string;
  percent?: number;
  className?: string;
}

// Overrides for statuses whose default text color is too low-contrast against their background
const TEXT_OVERRIDES: Record<number, string> = {
  2: '#3F2A14', // similar     — dark brown over tan
  4: '#5C4B00', // MSDS update — deep amber over yellow
};

export const StatusChipSquare: React.FC<StatusChipSquareProps> = ({ code, title: titleOverride, percent, className = '' }) => {
  const { title: defaultTitle, background, color } = STATUS_MAP[code] ?? FALLBACK_STATUS;
  const title = titleOverride ?? defaultTitle;

  const fillStyle: React.CSSProperties = percent === undefined
    ? { backgroundColor: background }
    : { background: `linear-gradient(to right, ${background} ${percent * 100}%, ${lighten(background, 0.6)} ${percent * 100}%)` };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[13px] font-semibold whitespace-nowrap shadow-sm ${className}`}
      style={{ ...fillStyle, color: TEXT_OVERRIDES[code] ?? color, borderRadius: 8 }}
    >
      {title}
    </span>
  );
};

export default StatusChipSquare;

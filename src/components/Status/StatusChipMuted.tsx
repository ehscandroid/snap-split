import { STATUS_MAP, FALLBACK_STATUS } from './Status';
import { darken, withAlpha } from './colorUtils';

interface StatusChipMutedProps {
  code: number;
  title?: string;
  className?: string;
}

export const StatusChipMuted: React.FC<StatusChipMutedProps> = ({ code, title: titleOverride, className = '' }) => {
  const { title: defaultTitle, background } = STATUS_MAP[code] ?? FALLBACK_STATUS;
  const title = titleOverride ?? defaultTitle;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[13px] font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: withAlpha(background, '26'), color: darken(background, 0.15), borderRadius: 8 }}
    >
      {title}
    </span>
  );
};

export default StatusChipMuted;

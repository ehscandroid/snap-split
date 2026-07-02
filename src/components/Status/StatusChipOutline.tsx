import { STATUS_MAP, FALLBACK_STATUS } from './Status';

interface StatusChipOutlineProps {
  code: number;
  title?: string;
  className?: string;
}

export const StatusChipOutline: React.FC<StatusChipOutlineProps> = ({ code, title: titleOverride, className = '' }) => {
  const { title: defaultTitle, background } = STATUS_MAP[code] ?? FALLBACK_STATUS;
  const title = titleOverride ?? defaultTitle;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[13px] font-semibold whitespace-nowrap bg-white dark:bg-transparent ${className}`}
      style={{ color: background, border: `1.5px solid ${background}`, borderRadius: 8 }}
    >
      {title}
    </span>
  );
};

export default StatusChipOutline;

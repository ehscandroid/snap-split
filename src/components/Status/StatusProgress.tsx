import { STATUS_MAP, FALLBACK_STATUS } from './Status';

interface StatusProgressProps {
  data: Record<number, number>;
  className?: string;
}

export const StatusProgress: React.FC<StatusProgressProps> = ({ data, className = '' }) => {
  const entries = Object.entries(data)
    .map(([code, percent]) => ({ code: Number(code), percent }))
    .filter(({ percent }) => percent > 0);

  return (
    <div className={`flex w-full h-5 rounded-full overflow-hidden ${className}`}>
      {entries.map(({ code, percent }) => {
        const { title, background } = STATUS_MAP[code] ?? FALLBACK_STATUS;
        return (
          <div
            key={code}
            title={`${title} (${Math.round(percent * 100)}%)`}
            className="h-full"
            style={{ width: `${percent * 100}%`, backgroundColor: background }}
          />
        );
      })}
    </div>
  );
};

export default StatusProgress;

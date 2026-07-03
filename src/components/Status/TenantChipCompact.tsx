import { withAlpha, darken } from './colorUtils';

type UploadState = 'never' | 'outdated' | 'upToDate' | 'failed';

interface TenantChipCompactProps {
  tenantId: number;
  tenantName: string;
  uploadedAt?: string | Date;
  latestAvailableAt: string | Date;
  failed?: boolean;
  className?: string;
}

const STATE_COLORS: Record<UploadState, string> = {
  outdated: '#FB923C',
  never:    '#94A3B8',
  upToDate: '#71BD66',
  failed:   '#C62828',
};

const toDate = (value: string | Date): Date => (typeof value === 'string' ? new Date(value) : value);

const getState = (uploadedAt: Date | undefined, latestAvailableAt: Date, failed: boolean): UploadState => {
  if (failed) return 'failed';
  if (!uploadedAt) return 'never';
  return uploadedAt < latestAvailableAt ? 'outdated' : 'upToDate';
};

export const TenantChipCompact: React.FC<TenantChipCompactProps> = ({
  tenantId,
  tenantName,
  uploadedAt,
  latestAvailableAt,
  failed = false,
  className = '',
}) => {
  const parsedUploadedAt = uploadedAt ? toDate(uploadedAt) : undefined;
  const parsedLatestAvailableAt = toDate(latestAvailableAt);
  const state = getState(parsedUploadedAt, parsedLatestAvailableAt, failed);
  const color = STATE_COLORS[state];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: withAlpha(color, '26'), color: darken(color, 0.15) }}
    >
      {tenantName} <span className="opacity-70 ml-1">#{tenantId}</span>
    </span>
  );
};

export default TenantChipCompact;

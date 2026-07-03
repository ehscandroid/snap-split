import { Icon } from '@iconify/react';
import { withAlpha, darken } from './colorUtils';

type UploadState = 'never' | 'outdated' | 'upToDate' | 'failed';

interface TenantChipProps {
  tenantId: number;
  tenantName: string;
  uploadedAt?: string | Date;
  latestAvailableAt: string | Date;
  failed?: boolean;
  reason?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const STATE_CONFIG: Record<UploadState, { color: string; icon: string; label: string }> = {
  outdated: { color: '#FB923C', icon: 'mdi:clock-outline',         label: 'New file available' },
  never:    { color: '#94A3B8', icon: 'mdi:upload-outline',        label: 'Never uploaded' },
  upToDate: { color: '#71BD66', icon: 'mdi:check-circle-outline',  label: 'Uploaded' },
  failed:   { color: '#C62828', icon: 'mdi:alert-circle-outline',  label: 'Upload failed' },
};

const toDate = (value: string | Date): Date => (typeof value === 'string' ? new Date(value) : value);

const formatDate = (date: Date): string => {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getState = (uploadedAt: Date | undefined, latestAvailableAt: Date, failed: boolean): UploadState => {
  if (failed) return 'failed';
  if (!uploadedAt) return 'never';
  return uploadedAt < latestAvailableAt ? 'outdated' : 'upToDate';
};

export const TenantChip: React.FC<TenantChipProps> = ({
  tenantId,
  tenantName,
  uploadedAt,
  latestAvailableAt,
  failed = false,
  reason,
  selected = false,
  onSelect,
  className = '',
}) => {
  const parsedUploadedAt = uploadedAt ? toDate(uploadedAt) : undefined;
  const parsedLatestAvailableAt = toDate(latestAvailableAt);
  const state = getState(parsedUploadedAt, parsedLatestAvailableAt, failed);
  const { color, icon, label } = STATE_CONFIG[state];

  const statusText = state === 'failed' && reason
    ? reason
    : state === 'upToDate' && parsedUploadedAt
      ? formatDate(parsedUploadedAt)
      : label;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`inline-flex items-center gap-1.5 pl-2.5 pr-4 py-1.5 rounded-md whitespace-nowrap text-left transition-shadow ${selected ? 'ring-1 ring-inset' : ''} ${className}`}
      style={{ backgroundColor: withAlpha(color, '26'), ...(selected ? { boxShadow: `inset 0 0 0 1px ${darken(color, 0.15)}` } : {}) }}
    >
      <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" strokeWidth="0" className="fill-gray-400/60" style={selected ? { fill: darken(color, 0.15) } : {}} />
        {selected && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
      </svg>
      <span className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
          {tenantName} <span className="text-gray-400 dark:text-gray-500">#{tenantId}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: darken(color, 0.15) }}>
          <Icon icon={icon} width={12} height={12} />
          {statusText}
        </span>
      </span>
    </button>
  );
};

export default TenantChip;

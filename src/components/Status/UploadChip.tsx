import { Icon } from '@iconify/react';
import { withAlpha, darken } from './colorUtils';

type UploadState = 'never' | 'outdated' | 'upToDate' | 'failed';

interface UploadChipProps {
  uploadedAt?: string | Date;
  latestAvailableAt: string | Date;
  failed?: boolean;
  reason?: string;
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

export const UploadChip: React.FC<UploadChipProps> = ({ uploadedAt, latestAvailableAt, failed = false, reason, className = '' }) => {
  const parsedUploadedAt = uploadedAt ? toDate(uploadedAt) : undefined;
  const parsedLatestAvailableAt = toDate(latestAvailableAt);
  const state = getState(parsedUploadedAt, parsedLatestAvailableAt, failed);
  const { color, icon, label } = STATE_CONFIG[state];

  const text = state === 'failed' && reason
    ? reason
    : state === 'upToDate' && parsedUploadedAt
      ? formatDate(parsedUploadedAt)
      : label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 pl-[9px] pr-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: withAlpha(color, '26'), color: darken(color, 0.15) }}
    >
      <Icon icon={icon} width={13} height={13} />
      {text}
    </span>
  );
};

export default UploadChip;

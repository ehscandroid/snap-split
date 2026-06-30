interface StatusProps {
  code: number;
  form?: 'chip' | 'circle' | 'dot';
  percent?: number;
  title?: string;
  className?: string;
}

export interface StatusConfig {
  title: string;
  background: string;
  color: string;
}

export const STATUS_MAP: Record<number, StatusConfig> = {
  0:  { title: 'unknown',      background: '#BDC1C6', color: '#FFFFFF' },
  1:  { title: 'identified',   background: '#FFB300', color: '#00008B' },
  2:  { title: 'similar',      background: '#C79869', color: '#FFFFFF' },
  3:  { title: 'purchased',    background: '#3D85D8', color: '#FFFFFF' },
  4:  { title: 'MSDS update',  background: '#F9DD04', color: '#212529' },
  5:  { title: 'in progress',  background: '#71BD66', color: '#FFFFFF' },
  90: { title: 'Datarecord',   background: '#588157', color: '#FFFF00' },
  91: { title: 'release',      background: '#00A400', color: '#FFFFFF' },
  92: { title: 'is obsolete',  background: '#71BD66', color: '#FFFFFF' },
  98: { title: 'attention',    background: '#9400D3', color: '#FFFFFF' },
  99: { title: 'sleep',        background: '#808080', color: '#FFFFFF' },
};

export const FALLBACK_STATUS: StatusConfig = { title: 'unknown', background: '#BDC1C6', color: '#FFFFFF' };

const lighten = (hex: string, ratio: number): string => {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);

  const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio);

  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

export const Status: React.FC<StatusProps> = ({ code, form = 'chip', percent, title: titleOverride, className = '' }) => {
  const { title: defaultTitle, background, color } = STATUS_MAP[code] ?? FALLBACK_STATUS;
  const title = titleOverride ?? defaultTitle;

  const fillStyle: React.CSSProperties = percent === undefined
    ? { backgroundColor: background }
    : {
        background: `linear-gradient(to right, ${background} ${percent * 100}%, ${lighten(background, 0.6)} ${percent * 100}%)`,
      };

  if (form === 'dot') {
    return (
      <span
        title={title}
        aria-label={title}
        className={`inline-block w-2.5 h-2.5 rounded-full ${className}`}
        style={{ backgroundColor: background }}
      />
    );
  }

  if (form === 'circle') {
    return (
      <span
        title={title}
        aria-label={title}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${className}`}
        style={{ ...fillStyle, color }}
      >
        {title.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm ${className}`}
      style={{ ...fillStyle, color }}
    >
      {title}
    </span>
  );
};

export default Status;

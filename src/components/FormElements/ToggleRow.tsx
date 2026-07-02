interface ToggleRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({ title, subtitle, value, onChange, className = '' }) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left hover:bg-[#f5f7fa] dark:hover:bg-white/5 transition-colors ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-[14px] text-[#334155] dark:text-gray-300">{title}</span>
        {subtitle && <span className="block text-[12px] text-[#64748b] dark:text-gray-500">{subtitle}</span>}
      </span>
      <span
        role="switch"
        aria-checked={value}
        className={`relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[var(--accent)]' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
    </button>
  );
};

export default ToggleRow;

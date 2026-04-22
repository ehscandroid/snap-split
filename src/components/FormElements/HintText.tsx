interface HintTextProps {
  message: string;
  variant?: 'icon' | 'line';
  color?: 'yellow' | 'orange' | 'blue' | 'green';
}

const colorMap = {
  yellow: { 
    bg: 'bg-yellow-50 dark:bg-yellow-900/30', 
    border: 'border-yellow-200 dark:border-yellow-700', 
    text: 'text-yellow-800 dark:text-yellow-200', 
    icon: '⚠️', 
    line: 'bg-yellow-400 dark:bg-yellow-500' 
  },
  orange: { 
    bg: 'bg-orange-50 dark:bg-orange-900/30', 
    border: 'border-orange-200 dark:border-orange-700', 
    text: 'text-orange-800 dark:text-orange-200', 
    icon: '⚠️', 
    line: 'bg-orange-400 dark:bg-orange-500' 
  },
  blue: { 
    bg: 'bg-blue-50 dark:bg-blue-900/30', 
    border: 'border-blue-200 dark:border-blue-700', 
    text: 'text-blue-800 dark:text-blue-200', 
    icon: 'ℹ️', 
    line: 'bg-blue-400 dark:bg-blue-500' 
  },
  green: { 
    bg: 'bg-green-50 dark:bg-green-900/30', 
    border: 'border-green-200 dark:border-green-700', 
    text: 'text-green-800 dark:text-green-200', 
    icon: '✓', 
    line: 'bg-green-400 dark:bg-green-500' 
  },
};

export const HintText: React.FC<HintTextProps> = ({ message, variant = 'icon', color = 'yellow' }) => {
  const colors = colorMap[color];

  if (variant === 'line') {
    return (
      <div className={`flex items-start ${colors.bg} border ${colors.border} rounded-lg overflow-hidden`}>
        <div className={`w-1.5 ${colors.line} self-stretch`} />
        <p className={`text-sm ${colors.text} p-3`}>{message}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${colors.bg} border ${colors.border} rounded-lg p-3`}>
      <span className={`${colors.text} text-lg`}>{colors.icon}</span>
      <p className={`text-sm ${colors.text}`}>{message}</p>
    </div>
  );
};

export default HintText;

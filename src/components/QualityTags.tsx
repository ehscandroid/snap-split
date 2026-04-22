import React from 'react';

interface QualityTagsProps {
  value: number;
  max?: number;
  colorScheme?: string[];
  size?: number;
  className?: string;
}

const DiamondIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z" />
  </svg>
);

const defaultColorScheme = [
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-400',
  'text-green-600',
];

export const QualityTags: React.FC<QualityTagsProps> = ({
  value,
  max = 5,
  colorScheme = defaultColorScheme,
  size = 20,
  className = '',
}) => {
  const tags = Array.from({ length: max }, (_, i) => i < value);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {tags.map((filled, index) => (
        <DiamondIcon
          key={index}
          size={size}
          className={filled ? colorScheme[index] || colorScheme[colorScheme.length - 1] : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
    </div>
  );
};

export default QualityTags;
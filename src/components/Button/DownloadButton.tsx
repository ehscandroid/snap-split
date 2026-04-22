import { useState } from 'react';
import { ButtonHTMLAttributes } from 'react';

interface DownloadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  downloadingText?: string;
  duration?: number;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  label = 'Download',
  downloadingText = 'Downloading...',
  duration = 2000,
  onClick,
  disabled,
  ...props
}) => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDownloading || disabled) return;

    setIsDownloading(true);
    setProgress(0);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsDownloading(false);
          setProgress(0);
          onClick?.(e);
        }, 200);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <button
      disabled={disabled || isDownloading}
      onClick={handleClick}
      className={`
        relative px-4 py-2 text-sm font-medium rounded-lg overflow-hidden
        bg-blue-500 text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${isDownloading ? 'opacity-90' : 'hover:bg-blue-600'}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isDownloading && <span>↓</span>}
        {isDownloading ? downloadingText : label}
      </span>
      <div
        className="absolute inset-0 bg-blue-700 transition-none"
        style={{ width: `${progress}%` }}
      />
    </button>
  );
};

export default DownloadButton;

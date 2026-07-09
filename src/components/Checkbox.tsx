import React from 'react'

type CheckboxState = 'unchecked' | 'checked' | 'success' | 'attention' | 'error' | 'progress'

interface CheckboxProps {
  state: CheckboxState
  onClick?: () => void
  className?: string
  size?: number
}

export const Checkbox: React.FC<CheckboxProps> = ({ state, onClick, className = '', size = 20 }) => {
  if (state === 'progress') {
    return (
      <>
        <style>{`
          @keyframes checkbox-rock {
            0%   { transform: rotate(-135deg); }
            50%  { transform: rotate(135deg); }
            100% { transform: rotate(-135deg); }
          }
          .checkbox-rock { animation: checkbox-rock 2.2s ease-in-out infinite; }
        `}</style>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`checkbox-rock cursor-pointer ${className}`}
          style={{ color: 'var(--accent)' }}
          onClick={onClick}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="3 6"
            strokeLinecap="round"
          />
        </svg>
      </>
    )
  }

  const colors: Record<string, string> = {
    unchecked: 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400',
    checked: 'text-gray-900 dark:text-gray-100',
    success: 'text-green-500',
    attention: 'text-pink-700 dark:text-pink-500',
    error: 'text-red-500',
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`cursor-pointer transition-colors duration-150 ${colors[state]} ${className}`}
      onClick={onClick}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
      {(state === 'checked' || state === 'success') && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />}
      {state === 'attention' && <path d="M12 8v5M12 16.5v.01" strokeLinecap="round" />}
      {state === 'error' && <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />}
    </svg>
  )
}

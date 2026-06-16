import React from 'react'

type CheckboxState = 'unchecked' | 'checked' | 'error' | 'progress'

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
          .checkbox-rock { animation: checkbox-rock 1.4s ease-in-out infinite; }
        `}</style>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`checkbox-rock text-blue-500 cursor-pointer ${className}`}
          onClick={onClick}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        </svg>
      </>
    )
  }

  const colors: Record<string, string> = {
    unchecked: 'text-gray-300 hover:text-gray-400',
    checked: 'text-green-500',
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
      {state === 'checked' && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />}
      {state === 'error' && <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />}
    </svg>
  )
}

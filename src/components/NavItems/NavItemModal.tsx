import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTheme } from '../../context/ThemeContext'
import { useAccent, ACCENT_COLORS } from '../../context/AccentContext'
import { Modal } from '../Modal'

interface NavItemModalProps {
  icon: string
  label: string
  modalContent?: React.ReactNode
  collapsed?: boolean
  navSmall?: boolean
  active?: boolean
  badge?: number
  badgeColor?: string
}

export const NavItemModal: React.FC<NavItemModalProps> = ({
  icon,
  label,
  modalContent,
  collapsed = false,
  navSmall = false,
  active = false,
  badge,
  badgeColor = 'bg-red-500',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { accent, setAccent } = useAccent()

  const isCollapsed = collapsed || navSmall

  const subtitleMap: Record<string, string> = {
    Settings: 'Manage appearance and preferences.',
    Profile: 'Manage your account details.',
  }

  const renderContent = () => {
    if (label === 'Settings' && !modalContent) {
      return (
        <div className="flex flex-col">
          <div className="px-6 py-3">
            <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[#64748b] dark:text-gray-500">Appearance</span>
          </div>

          <div className="flex items-center gap-4 px-6 py-4 border-t border-[#f1f4f8] dark:border-white/5">
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#0f172a] dark:text-gray-100">Dark Mode</div>
              <div className="text-[13px] text-[#64748b] dark:text-gray-400 mt-0.5">Switch between light and dark theme.</div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 bg-gray-200 dark:bg-gray-600"
              style={theme === 'dark' ? { backgroundColor: accent } : {}}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-start gap-4 px-6 py-4 border-t border-[#f1f4f8] dark:border-white/5">
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#0f172a] dark:text-gray-100">Accent Color</div>
              <div className="text-[13px] text-[#64748b] dark:text-gray-400 mt-0.5">Choose your preferred accent color.</div>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  title={color.label}
                  onClick={() => setAccent(color)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 flex-shrink-0"
                  style={{ backgroundColor: color.value }}
                >
                  {accent.id === color.id && (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (label === 'Profile' && !modalContent) {
      return (
        <div className="flex flex-col">
          <div className="px-6 py-3">
            <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[#64748b] dark:text-gray-500">Account</span>
          </div>
          <div className="px-6 py-4 border-t border-[#f1f4f8] dark:border-white/5">
            <p className="text-[14px] text-[#64748b] dark:text-gray-400">Profile settings coming soon.</p>
          </div>
        </div>
      )
    }

    return <div className="px-6 pb-6">{modalContent}</div>
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-3 px-[11px] py-[9px] rounded-[10px] transition-all duration-150 cursor-pointer text-left
          hover:bg-[#f5f7fa] hover:text-[#1e293b]
          dark:hover:bg-white/5 dark:hover:text-gray-200
          ${active
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
            : 'text-[#475569] dark:text-gray-400'}
          ${isCollapsed ? 'justify-center w-full' : 'w-full'}
        `}
        title={isCollapsed ? label : undefined}
      >
        <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
          <Icon icon={icon} width={18} height={18} />
          {badge !== undefined && isCollapsed && (
            <span className={`absolute -top-0.5 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs rounded-full ${badgeColor} text-white`}>
              {badge}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <>
            <span className="truncate text-[14px] font-medium">{label}</span>
            {badge !== undefined && (
              <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${badgeColor} text-white`}>
                {badge}
              </span>
            )}
          </>
        )}
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
        subtitle={subtitleMap[label]}
        icon={icon}
      >
        {renderContent()}
      </Modal>
    </>
  )
}

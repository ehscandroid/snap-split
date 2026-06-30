import React from 'react'
import { Icon } from '@iconify/react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: string
  iconNode?: React.ReactNode
  maxWidth?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconNode,
  maxWidth = 'max-w-md',
  children,
}) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-[#1e1e1e] rounded-2xl w-full ${maxWidth} mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5">
          {(iconNode || icon) && (
            <div className="w-14 h-14 rounded-xl bg-[#f1f4f8] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
              {iconNode ?? <Icon icon={icon!} width={28} height={28} className="text-[#475569] dark:text-gray-400" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-bold text-[#0f172a] dark:text-gray-100">{title}</h2>
            {subtitle && (
              <p className="text-[13px] text-[#64748b] dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f4f8] dark:hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

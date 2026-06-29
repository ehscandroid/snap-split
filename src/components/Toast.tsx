import { Icon } from '@iconify/react'
import { useToasts, type ToastVariant } from '../hooks/useToast'

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  success: {
    bg: 'bg-white dark:bg-[#1e1e1e]',
    border: 'border-[#22c55e]/30',
    icon: 'mdi:check-circle-outline',
    iconColor: 'text-[#22c55e]',
  },
  error: {
    bg: 'bg-white dark:bg-[#1e1e1e]',
    border: 'border-[#ef4444]/30',
    icon: 'mdi:close-circle-outline',
    iconColor: 'text-[#ef4444]',
  },
  warning: {
    bg: 'bg-white dark:bg-[#1e1e1e]',
    border: 'border-[#f59e0b]/30',
    icon: 'mdi:alert-circle-outline',
    iconColor: 'text-[#f59e0b]',
  },
  info: {
    bg: 'bg-white dark:bg-[#1e1e1e]',
    border: 'border-[#3b82f6]/30',
    icon: 'mdi:information-outline',
    iconColor: 'text-[#3b82f6]',
  },
}

const Toast: React.FC = () => {
  const toasts = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(toast => {
        const s = variantStyles[toast.variant]
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_4px_24px_rgba(15,23,42,0.12)]
              ${s.bg} ${s.border}
              animate-[fadeSlideIn_0.2s_ease-out]
              pointer-events-auto
            `}
          >
            <Icon icon={s.icon} width={18} height={18} className={`flex-shrink-0 ${s.iconColor}`} />
            <span className="text-[13.5px] font-medium text-[#0f172a] dark:text-gray-100 leading-snug max-w-[320px]">
              {toast.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Toast

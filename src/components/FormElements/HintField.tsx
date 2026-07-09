import { Icon } from '@iconify/react'

interface HintFieldProps {
  children: React.ReactNode
}

export const HintField: React.FC<HintFieldProps> = ({ children }) => {
  return (
    <div className="-mt-3 flex items-center gap-2.5 rounded-lg border-l-4 border-l-gray-400 dark:border-l-white/30 bg-gray-50 dark:bg-white/5 px-4 py-2.5">
      <Icon icon="mdi:information-outline" width={16} height={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
    </div>
  )
}

export default HintField

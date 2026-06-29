import React, { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Icon } from '@iconify/react'

interface Tab {
  key: string
  label: string
  icon: string
}

interface TableFiltersModalProps {
  open: boolean
  onClose: () => void
  tabs: Tab[]
  children: React.ReactNode[]
  initialTab?: number
}

const TableFiltersModal: React.FC<TableFiltersModalProps> = ({
  open,
  onClose,
  tabs,
  children,
  initialTab = 0,
}) => {
  const [active, setActive] = useState(initialTab)

  const goTo = (index: number) => {
    setActive(Math.max(0, Math.min(tabs.length - 1, index)))
  }

  const handlers = useSwipeable({
    onSwipedLeft:  () => goTo(active + 1),
    onSwipedRight: () => goTo(active - 1),
    trackMouse: false,
    preventScrollOnSwipe: true,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4">
          <div className="flex-1 flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => goTo(i)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === i
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon icon={tab.icon} width={14} height={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Sliding panes */}
        <div {...handlers} className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {React.Children.map(children, (child, i) => (
              <div key={i} className="w-full flex-shrink-0">
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableFiltersModal

import React, { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Icon } from '@iconify/react'

interface SdsEditModalProps {
  open: boolean
  onClose: () => void
  selectedCount: number
  onDelete: () => void
  onDownload: () => void
}

const sections = [
  { key: 'status',    label: 'Change Status', icon: 'mdi:tag-outline'          },
  { key: 'mails',     label: 'Send Mails',    icon: 'mdi:email-outline'         },
  { key: 'parse',     label: 'Parse Files',   icon: 'mdi:file-search-outline'   },
  { key: 'xls',       label: 'Create XLS',    icon: 'mdi:microsoft-excel'       },
]

const SdsEditModal: React.FC<SdsEditModalProps> = ({ open, onClose, selectedCount, onDelete, onDownload }) => {
  const [active, setActive] = useState(0)

  const goTo = (index: number) => setActive(Math.max(0, Math.min(sections.length - 1, index)))

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
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:pencil-outline" width={18} height={18} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Edit</h2>
            <p className="text-[13px] text-gray-400 dark:text-gray-500">{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* Left sidebar */}
          <div className="flex flex-col w-44 flex-shrink-0 border-r border-gray-100 dark:border-white/5 p-2 gap-0.5">
            {sections.map((s, i) => (
              <button
                key={s.key}
                onClick={() => goTo(i)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-150 ${
                  active === i
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon icon={s.icon} width={16} height={16} className="flex-shrink-0" />
                {s.label}
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action buttons */}
            <div className="flex flex-col gap-0.5 pt-2 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={onDownload}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <Icon icon="mdi:download-outline" width={16} height={16} className="flex-shrink-0" />
                Download
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Icon icon="mdi:trash-can-outline" width={16} height={16} className="flex-shrink-0" />
                Delete
              </button>
            </div>
          </div>

          {/* Sliding content */}
          <div {...handlers} className="flex-1 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >

              {/* Status */}
              <div className="w-full flex-shrink-0 p-6 overflow-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Set status for {selectedCount} item{selectedCount !== 1 ? 's' : ''}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Active',   color: 'bg-green-50  text-green-600  dark:bg-green-500/10  dark:text-green-400'  },
                    { label: 'Draft',    color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400' },
                    { label: 'Archived', color: 'bg-red-50    text-red-500    dark:bg-red-500/10    dark:text-red-400'    },
                    { label: 'Review',   color: 'bg-blue-50   text-blue-600   dark:bg-blue-500/10   dark:text-blue-400'   },
                  ].map(({ label, color }) => (
                    <button key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors text-left`}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Set all to {label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mails */}
              <div className="w-full flex-shrink-0 p-6 overflow-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Send mail to recipients for {selectedCount} item{selectedCount !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 dark:text-gray-500">Recipients</label>
                    <input type="text" placeholder="email@example.com" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-300 dark:focus:border-white/20" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 dark:text-gray-500">Template</label>
                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none">
                      <option>SDS Update Notification</option>
                      <option>Hazard Summary</option>
                      <option>Expiry Warning</option>
                    </select>
                  </div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                    Send
                  </button>
                </div>
              </div>

              {/* Parse Files */}
              <div className="w-full flex-shrink-0 p-6 overflow-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Parse attached files for {selectedCount} item{selectedCount !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {['Extract hazard data', 'Extract storage conditions', 'Extract first aid info', 'Update fields automatically'].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                        <input type="checkbox" defaultChecked className="accent-[var(--accent)]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                    Run Parser
                  </button>
                </div>
              </div>

              {/* Create XLS */}
              <div className="w-full flex-shrink-0 p-6 overflow-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export {selectedCount} item{selectedCount !== 1 ? 's' : ''} to Excel</p>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {['Include hazard data', 'Include storage info', 'Include first aid measures', 'Include supplier details'].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                        <input type="checkbox" defaultChecked className="accent-[var(--accent)]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                    Generate XLS
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SdsEditModal

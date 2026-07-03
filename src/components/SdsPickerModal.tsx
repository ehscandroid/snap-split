import { useState } from 'react'
import { Icon } from '@iconify/react'
import { StatusChipMuted } from './Status'
import { Chip } from './Chip/Chip'
import { PackageIcon } from './icons/PackageIcon'
import { Button } from './Button'
import { PackagePickerModal } from './PackagePickerModal'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { SdsRecord } from '../data/mockSds'

interface SdsPickerModalProps {
  open: boolean
  onClose: () => void
  onAdd: (sds: SdsRecord[]) => void
  options: SdsRecord[]
}

export const SdsPickerModal: React.FC<SdsPickerModalProps> = ({ open, onClose, onAdd, options }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [packageTag, setPackageTag] = useState<string | null>(null)
  const [packagePickerOpen, setPackagePickerOpen] = useState(false)

  const filtered = options
    .filter((sds) => !packageTag || sds.packages.includes(packageTag))
    .filter((sds) => !debouncedSearchTerm ||
      sds.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      sds.casNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const reset = () => {
    setSearchTerm('')
    setSelected(new Set())
    setPackageTag(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleAdd = () => {
    onAdd(options.filter((sds) => selected.has(sds.id)))
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleClose}>
      <div
        className="bg-[#f8fafc] dark:bg-[#161616] rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="relative flex-1 flex items-center flex-wrap gap-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
            <Chip
              iconNode={<PackageIcon className="w-3.5 h-3.5" />}
              label={packageTag ?? ''}
              onClick={() => setPackagePickerOpen(true)}
              className={packageTag ? '' : '!gap-0 !pr-2.5'}
            />
            <input
              type="text"
              autoFocus
              placeholder="Search SDS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[60px] ml-0.5 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            />
            {searchTerm && (
              <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setSearchTerm('')}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-white dark:hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4">
          <div className="h-96 overflow-y-auto flex flex-col gap-1">
            {filtered.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">No matching SDS found</p>
              </div>
            ) : (
              filtered.map((sds) => {
                const isChecked = selected.has(sds.id)
                return (
                  <button
                    key={sds.id}
                    onClick={() => toggleSelect(sds.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white dark:hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" className={isChecked ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={isChecked ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}} />
                      {isChecked && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{sds.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{sds.casNumber}</p>
                    </div>
                    <StatusChipMuted code={sds.status} className="flex-shrink-0" />
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200 dark:border-white/10 mt-2">
          <Button variant="primary" onClick={handleAdd} disabled={selected.size === 0}>
            Add{selected.size > 0 ? ` (${selected.size})` : ''}
          </Button>
        </div>
      </div>
      </div>

      <PackagePickerModal
        open={packagePickerOpen}
        onClose={() => setPackagePickerOpen(false)}
        onSelect={(name) => { setPackageTag(name); setPackagePickerOpen(false) }}
        onClear={() => { setPackageTag(null); setPackagePickerOpen(false) }}
        activePackage={packageTag}
      />
    </>
  )
}

export default SdsPickerModal

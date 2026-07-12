import React, { useState } from 'react'
import { Modal } from './Modal'
import { Chip } from './Chip/Chip'
import { PackageIcon } from './icons/PackageIcon'
import { useSdsPackages } from '../hooks/useSdsPackages'

interface PackagePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (name: string) => void
  onClear?: () => void
  activePackage?: string | null
}

export const PackagePickerModal: React.FC<PackagePickerModalProps> = ({ open, onClose, onSelect, onClear, activePackage }) => {
  const { packages, loading } = useSdsPackages()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPackages = searchTerm
    ? packages.filter((pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : packages

  return (
    <Modal open={open} onClose={onClose} title="Choose Package" maxWidth="max-w-lg">
      <div className="px-6 pb-4">
        <div className="relative flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 gap-2 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search packages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {searchTerm && (
            <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setSearchTerm('')}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-6 pb-6 max-h-[60vh] overflow-y-auto">
        {activePackage && onClear && (
          <button
            onClick={onClear}
            className="self-start text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-1"
          >
            select All Files
          </button>
        )}
        {loading ? null : filteredPackages.map((pkg) => (
          <Chip
            key={pkg.id}
            size="lg"
            iconNode={<PackageIcon className="w-6 h-6" />}
            label={pkg.name}
            description={pkg.description}
            active={pkg.name === activePackage}
            onClick={() => onSelect(pkg.name)}
          />
        ))}
        {!loading && filteredPackages.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-gray-400 dark:text-gray-500">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-sm font-medium">No packages found</span>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default PackagePickerModal

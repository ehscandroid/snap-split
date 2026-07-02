import React from 'react'
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

  return (
    <Modal open={open} onClose={onClose} title="Choose Package" subtitle="Filter SDS items by package" maxWidth="max-w-lg">
      <div className="flex flex-col gap-2 px-6 pb-6 max-h-[60vh] overflow-y-auto">
        {activePackage && onClear && (
          <button
            onClick={onClear}
            className="self-start text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-1"
          >
            select All Files
          </button>
        )}
        {loading ? null : packages.map((pkg) => (
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
      </div>
    </Modal>
  )
}

export default PackagePickerModal

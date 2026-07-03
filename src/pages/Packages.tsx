import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Modal } from '../components/Modal'
import { ConfirmModal } from '../components/ConfirmModal'
import PackagesTable from '../components/PackagesTable'
import { PackageIcon } from '../components/icons/PackageIcon'
import { ToggleRow } from '../components/FormElements'
import { Button } from '../components/Button'
import { usePackages } from '../hooks/usePackages'
import type { PackageRecord } from '../data/mockPackages'

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { packages, updatePackage, addPackage, deletePackage } = usePackages()
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [archived, setArchived] = useState(false)

  const id = searchParams.get('id')
  const detail: PackageRecord | undefined = packages.find((row) => row.id === Number(id))
  const isOpen = isCreating || !!detail

  useEffect(() => {
    if (!detail) return
    setName(detail.name)
    setDueDate(detail.dueDate)
    setArchived(detail.archived)
  }, [detail?.id])

  const closeModal = () => {
    setIsCreating(false)
    setSearchParams({})
  }

  const openModal = (packageId: number) => {
    setSearchParams({ id: String(packageId) })
  }

  const openCreateModal = () => {
    setName('')
    setDueDate('')
    setArchived(false)
    setIsCreating(true)
  }

  const handleSave = () => {
    if (isCreating) {
      const nextCode = `PKG-${String(packages.length + 1).padStart(3, '0')}`
      addPackage({ name, code: nextCode, dueDate, items: 0, archived, statusBreakdown: {} })
    } else if (detail) {
      updatePackage(detail.id, { name, dueDate, archived })
    }
    closeModal()
  }

  const handleDelete = () => {
    if (!detail) return
    deletePackage(detail.id)
    setConfirmDeleteOpen(false)
    closeModal()
  }

  return (
    <>
      <PackagesTable onRowClick={openModal} onAdd={openCreateModal} />

      <Modal
        open={isOpen}
        onClose={closeModal}
        title={isCreating ? 'New Package' : detail?.name ?? ''}
        subtitle={isCreating ? undefined : detail?.code}
        iconNode={<PackageIcon className="w-10 h-10" />}
        maxWidth="max-w-lg"
      >
        {isOpen && (
          <div className="border-t border-gray-100 dark:border-white/10">
            <div className="px-6 py-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[15px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[15px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                <ToggleRow
                  title="Archived"
                  subtitle="Hide this package from the active list"
                  value={archived}
                  onChange={setArchived}
                  className="!bg-transparent hover:!bg-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10">
              {!isCreating ? (
                <button
                  onClick={() => setConfirmDeleteOpen(true)}
                  title="Delete package"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Icon icon="mdi:trash-can-outline" width={18} height={18} />
                </button>
              ) : <span />}
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete package?"
        description={detail ? `"${detail.name}" will be permanently removed.` : undefined}
        onConfirm={handleDelete}
        onClose={() => setConfirmDeleteOpen(false)}
      />
    </>
  )
}

export default Packages

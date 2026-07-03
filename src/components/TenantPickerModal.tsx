import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Modal } from './Modal'
import { Button } from './Button'
import { TenantChip } from './Status'
import { getMockTenantUploadState } from '../data/mockTenantUploadState'
import type { TenantRecord } from '../data/mockTenants'

interface TenantPickerModalProps {
  open: boolean
  onClose: () => void
  onAdd: (tenants: TenantRecord[]) => void
  documentName: string
  documentCasNumber: string
  documentRevisionDate: string | Date
  connectedTenants: TenantRecord[]
  availableTenants: TenantRecord[]
}

export const TenantPickerModal: React.FC<TenantPickerModalProps> = ({
  open,
  onClose,
  onAdd,
  documentName,
  documentCasNumber,
  documentRevisionDate,
  connectedTenants,
  availableTenants,
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const allTenants = [...connectedTenants, ...availableTenants]
  const connectedIds = new Set(connectedTenants.map((t) => t.id))

  const toggleSelect = (id: number) => {
    if (connectedIds.has(id)) return
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const reset = () => {
    setSelected(new Set())
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleAdd = () => {
    onAdd(availableTenants.filter((tenant) => selected.has(tenant.id)))
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={documentName}
      subtitle={`CAS ${documentCasNumber}`}
      icon="mdi:domain"
      maxWidth="max-w-2xl"
    >
      <div className="border-t border-gray-100 dark:border-white/10">
        <p className="px-6 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Connected tenants</p>

        {/* Content */}
        <div className="px-6">
          <div className="h-80 overflow-y-auto py-4">
            {allTenants.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">No tenants available</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTenants.map((tenant) => {
                  const isConnected = connectedIds.has(tenant.id)
                  const isChecked = isConnected || selected.has(tenant.id)
                  const uploadState = getMockTenantUploadState(tenant.id)
                  return (
                    <TenantChip
                      key={tenant.id}
                      tenantId={tenant.id}
                      tenantName={tenant.name}
                      latestAvailableAt={documentRevisionDate}
                      uploadedAt={uploadState.uploadedAt}
                      failed={uploadState.uploadFailed}
                      reason={uploadState.uploadFailReason}
                      selected={isChecked}
                      onSelect={() => toggleSelect(tenant.id)}
                      className={isConnected ? 'cursor-default opacity-90' : ''}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {selected.size} to connect
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} disabled={selected.size === 0}>
              Connect{selected.size > 0 ? ` ${selected.size} tenant${selected.size === 1 ? '' : 's'}` : ''}
              <Icon icon="mdi:arrow-right" width={16} height={16} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TenantPickerModal

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfirmModal } from '../components/ConfirmModal'
import TenantsTable from '../components/TenantsTable'
import { TenantModal } from '../components/TenantModal'
import { useTenants } from '../hooks/useTenants'

const Tenants = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { tenants, deleteTenant } = useTenants()
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const id = searchParams.get('id')
  const detail = tenants.find((row) => row.id === id)
  const isOpen = isCreating || !!detail

  const closeModal = () => {
    setIsCreating(false)
    setSearchParams({})
  }

  const openModal = (tenantId: string) => {
    setSearchParams({ id: tenantId })
  }

  const openCreateModal = () => {
    setIsCreating(true)
  }

  const handleCreated = (newId: string) => {
    setIsCreating(false)
    setSearchParams({ id: newId })
  }

  const handleDelete = () => {
    if (!detail) return
    deleteTenant(detail.id)
    setConfirmDeleteOpen(false)
    closeModal()
  }

  return (
    <>
      <TenantsTable onRowClick={openModal} onAdd={openCreateModal} />

      {isOpen && (
        <TenantModal
          tenantId={isCreating ? undefined : id ?? undefined}
          onClose={closeModal}
          onDeleteRequest={() => setConfirmDeleteOpen(true)}
          onSaved={handleCreated}
        />
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete tenant?"
        description={detail ? `"${detail.name}" will be permanently removed.` : undefined}
        onConfirm={handleDelete}
        onClose={() => setConfirmDeleteOpen(false)}
      />
    </>
  )
}

export default Tenants

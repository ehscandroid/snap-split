import { Icon } from '@iconify/react'
import { CountBadge } from './CountBadge'
import { TenantChipCompact } from '../Status'
import { getMockTenantUploadState } from '../../data/mockTenantUploadState'
import type { TenantRef } from '../../data/mockSds'

interface TenantsFieldProps {
  tenants: TenantRef[]
  latestAvailableAt: string | Date
  onOpenPicker: () => void
  className?: string
}

export const TenantsField: React.FC<TenantsFieldProps> = ({ tenants, latestAvailableAt, onOpenPicker, className = '' }) => {
  return (
    <div className={`rounded-lg px-3 py-2 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 ${className}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-xs text-gray-400 dark:text-gray-500">Tenants</p>
        <CountBadge count={tenants.length} />
        <button
          onClick={onOpenPicker}
          title="Edit tenants"
          className="ml-auto w-6 h-6 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/70 dark:hover:bg-white/10 transition-colors"
        >
          <Icon icon="mdi:pencil-outline" width={13} height={13} />
        </button>
      </div>
      {tenants.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No connected tenants</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tenants.map((tenant) => {
            const uploadState = getMockTenantUploadState(tenant.id)
            return (
              <TenantChipCompact
                key={tenant.id}
                tenantId={tenant.id}
                tenantName={tenant.name}
                latestAvailableAt={latestAvailableAt}
                uploadedAt={uploadState.uploadedAt}
                failed={uploadState.uploadFailed}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TenantsField

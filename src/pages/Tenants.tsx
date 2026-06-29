import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../components/Modal'
import TenantsTable from '../components/TenantsTable'

interface TenantDetail {
  id: number
  name: string
  email: string
  plan: string
  status: string
  createdAt: string
  seats: number
  region: string
}

const MOCK: Record<number, TenantDetail> = {
  1: { id: 1, name: 'Acme Corp',      email: 'admin@acme.com',     plan: 'Enterprise', status: 'Active',    createdAt: '2023-01-12', seats: 120, region: 'EU'   },
  2: { id: 2, name: 'Globex Inc',     email: 'it@globex.com',      plan: 'Pro',        status: 'Trial',     createdAt: '2024-03-05', seats: 25,  region: 'US'   },
  3: { id: 3, name: 'Initech',        email: 'ops@initech.com',    plan: 'Starter',    status: 'Pending',   createdAt: '2024-06-18', seats: 5,   region: 'US'   },
  4: { id: 4, name: 'Umbrella Ltd',   email: 'admin@umbrella.com', plan: 'Enterprise', status: 'Suspended', createdAt: '2022-11-30', seats: 200, region: 'EU'   },
  5: { id: 5, name: 'Hooli',          email: 'dev@hooli.com',      plan: 'Pro',        status: 'Active',    createdAt: '2023-08-22', seats: 40,  region: 'US'   },
  6: { id: 6, name: 'Pied Piper',     email: 'richard@pp.com',     plan: 'Starter',    status: 'Trial',     createdAt: '2024-09-01', seats: 8,   region: 'US'   },
  7: { id: 7, name: 'Dunder Mifflin', email: 'michael@dm.com',     plan: 'Pro',        status: 'Active',    createdAt: '2023-04-17', seats: 30,  region: 'EU'   },
  8: { id: 8, name: 'Vandelay Ind.',  email: 'art@vandelay.com',   plan: 'Enterprise', status: 'Pending',   createdAt: '2024-10-03', seats: 75,  region: 'APAC' },
}

const Tenants = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [detail, setDetail] = useState<TenantDetail | null>(null)

  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) { setDetail(null); return }
    // TODO: replace with real API call — await fetch(`/api/tenants/${id}`)
    setDetail(MOCK[Number(id)] ?? null)
  }, [id])

  const openModal = (tenantId: number) => {
    setSearchParams({ id: String(tenantId) })
  }

  const closeModal = () => {
    setSearchParams({})
  }

  return (
    <>
      <TenantsTable onRowClick={openModal} onAdd={() => console.log('new tenant')} />

      <Modal
        open={!!detail}
        onClose={closeModal}
        title={detail?.name ?? ''}
        subtitle={detail?.email}
        icon="mdi:domain"
        maxWidth="max-w-lg"
      >
        {detail && (
          <div className="px-6 pb-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Plan',    value: detail.plan            },
              { label: 'Status',  value: detail.status          },
              { label: 'Region',  value: detail.region          },
              { label: 'Seats',   value: String(detail.seats)   },
              { label: 'Created', value: detail.createdAt       },
              { label: 'Email',   value: detail.email           },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}

export default Tenants

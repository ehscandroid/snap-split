import { useEffect } from 'react'
import { useStateStore } from 'mgsmu-react'
import { MOCK_TENANTS, type TenantRecord } from '../data/mockTenants'

const SIMULATED_DELAY_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useTenants = () => {
  const [store, setStore] = useStateStore('tenants')

  useEffect(() => {
    if (store) return
    let cancelled = false

    const load = async () => {
      // TODO: replace with real API call — await fetch('/api/tenants')
      await delay(SIMULATED_DELAY_MS)
      if (!cancelled) setStore({ list: MOCK_TENANTS })
    }

    load()
    return () => { cancelled = true }
  }, [])

  const tenants: TenantRecord[] = store?.list ?? []

  const updateTenant = (id: number, patch: Partial<TenantRecord>) => {
    setStore({ list: tenants.map((tenant) => (tenant.id === id ? { ...tenant, ...patch } : tenant)) })
  }

  const addTenant = (tenant: Omit<TenantRecord, 'id'>) => {
    const id = crypto.randomUUID()
    setStore({ list: [...tenants, { ...tenant, id }] })
    return id
  }

  const deleteTenant = (id: number) => {
    setStore({ list: tenants.filter((tenant) => tenant.id !== id) })
  }

  return { tenants, updateTenant, addTenant, deleteTenant }
}

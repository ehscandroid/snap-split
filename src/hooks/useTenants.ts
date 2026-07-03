import { useEffect, useState } from 'react'
import { useStateStore } from 'mgsmu-react'
import { MOCK_TENANTS, type TenantRecord } from '../data/mockTenants'

export const useTenants = () => {
  const [store, setStore] = useStateStore('tenants')
  const [initial] = useState<TenantRecord[]>(MOCK_TENANTS)

  useEffect(() => {
    if (!store) setStore({ list: initial })
  }, [])

  const tenants: TenantRecord[] = store?.list ?? initial

  const updateTenant = (id: number, patch: Partial<TenantRecord>) => {
    setStore({ list: tenants.map((tenant) => (tenant.id === id ? { ...tenant, ...patch } : tenant)) })
  }

  const addTenant = (tenant: Omit<TenantRecord, 'id'>) => {
    const id = tenants.reduce((max, t) => Math.max(max, t.id), 0) + 1
    setStore({ list: [...tenants, { ...tenant, id }] })
    return id
  }

  const deleteTenant = (id: number) => {
    setStore({ list: tenants.filter((tenant) => tenant.id !== id) })
  }

  return { tenants, updateTenant, addTenant, deleteTenant }
}

import { useEffect, useState } from 'react'
import { useStateStore } from 'mgsmu-react'
import { MOCK_PACKAGES, type PackageRecord } from '../data/mockPackages'

export const usePackages = () => {
  const [store, setStore] = useStateStore('packages')
  const [initial] = useState<PackageRecord[]>(MOCK_PACKAGES)

  useEffect(() => {
    if (!store) setStore({ list: initial })
  }, [])

  const packages: PackageRecord[] = store?.list ?? initial

  const updatePackage = (id: number, patch: Partial<PackageRecord>) => {
    setStore({ list: packages.map((pkg) => (pkg.id === id ? { ...pkg, ...patch } : pkg)) })
  }

  const addPackage = (pkg: Omit<PackageRecord, 'id'>) => {
    const id = packages.reduce((max, p) => Math.max(max, p.id), 0) + 1
    setStore({ list: [...packages, { ...pkg, id }] })
    return id
  }

  const deletePackage = (id: number) => {
    setStore({ list: packages.filter((pkg) => pkg.id !== id) })
  }

  return { packages, updatePackage, addPackage, deletePackage }
}

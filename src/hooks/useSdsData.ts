import { useState, useEffect, useCallback } from 'react'
import type { URLSearchParamsInit } from 'react-router-dom'
import type { SdsItem } from '../types'

const MOCK_PACKAGES: Record<number, string[]> = {
  1: ['Lab Reagents Q1', 'Hazmat Shipment 04', 'Solvent Restock'],
  2: ['Flammables Batch B', 'Inventory Refresh'],
  3: ['Acid Storage Unit', 'Quarterly Compliance', 'Site Transfer 12', 'Cold Chain Pack'],
  4: ['Bulk Order 2026-02', 'Plant Maintenance'],
  5: ['Toxic Handling Kit', 'Methanol Resupply', 'Lab Safety Bundle'],
  6: ['Solvent Restock', 'Hazmat Shipment 04'],
  7: ['Carcinogen Watchlist', 'Site Transfer 12'],
  8: ['Acid Storage Unit', 'Bulk Order 2026-02', 'Cold Chain Pack'],
  9: ['Flammables Batch B', 'Lab Reagents Q1'],
  10: ['Quarterly Compliance', 'Plant Maintenance'],
}

const MOCK_DATA: SdsItem[] = [
  { id: 1,  name: 'Ethanol',           casNumber: '64-17-5',   hazardClass: 'Flammable',  status: 91, manufacturer: 'Merck',       signalWord: 'Danger',  storageClass: 'GHS-3',  quantity: 40,  location: 'Warehouse A / Shelf 2', revisionDate: '2025-03-11' },
  { id: 2,  name: 'Acetone',           casNumber: '67-64-1',   hazardClass: 'Flammable',  status: 1,  manufacturer: 'Sigma-Aldrich', signalWord: 'Danger', storageClass: 'GHS-3',  quantity: 25,  location: 'Warehouse A / Shelf 1', revisionDate: '2024-11-02' },
  { id: 3,  name: 'Hydrochloric Acid', casNumber: '7647-01-0', hazardClass: 'Corrosive',  status: 5,  manufacturer: 'Honeywell',   signalWord: 'Danger',  storageClass: 'GHS-8',  quantity: 12,  location: 'Warehouse B / Shelf 5', revisionDate: '2025-01-20' },
  { id: 4,  name: 'Sodium Hydroxide',  casNumber: '1310-73-2', hazardClass: 'Corrosive',  status: 92, manufacturer: 'BASF',        signalWord: 'Danger',  storageClass: 'GHS-8',  quantity: 8,   location: 'Warehouse B / Shelf 3', revisionDate: '2023-07-15' },
  { id: 5,  name: 'Methanol',          casNumber: '67-56-1',   hazardClass: 'Toxic',      status: 3,  manufacturer: 'Merck',       signalWord: 'Danger',  storageClass: 'GHS-3',  quantity: 30,  location: 'Warehouse A / Shelf 4', revisionDate: '2025-05-30' },
  { id: 6,  name: 'Toluene',           casNumber: '108-88-3',  hazardClass: 'Flammable',  status: 91, manufacturer: 'Fisher Scientific', signalWord: 'Warning', storageClass: 'GHS-3', quantity: 18, location: 'Warehouse A / Shelf 2', revisionDate: '2024-09-08' },
  { id: 7,  name: 'Benzene',           casNumber: '71-43-2',   hazardClass: 'Carcinogen', status: 98, manufacturer: 'Sigma-Aldrich', signalWord: 'Danger', storageClass: 'GHS-8',  quantity: 5,   location: 'Warehouse C / Shelf 1', revisionDate: '2025-02-14' },
  { id: 8,  name: 'Sulfuric Acid',     casNumber: '7664-93-9', hazardClass: 'Corrosive',  status: 0,  manufacturer: 'Honeywell',   signalWord: 'Danger',  storageClass: 'GHS-8',  quantity: 22,  location: 'Warehouse B / Shelf 5', revisionDate: '2024-12-19' },
  { id: 9,  name: 'Isopropyl Alcohol', casNumber: '67-63-0',   hazardClass: 'Flammable',  status: 2,  manufacturer: 'BASF',        signalWord: 'Warning', storageClass: 'GHS-3',  quantity: 60,  location: 'Warehouse A / Shelf 1', revisionDate: '2025-06-01' },
  { id: 10, name: 'Ammonium Hydroxide',casNumber: '1336-21-6', hazardClass: 'Corrosive',  status: 99, manufacturer: 'Merck',       signalWord: 'Danger',  storageClass: 'GHS-8',  quantity: 14,  location: 'Warehouse B / Shelf 4', revisionDate: '2024-04-27' },
].map((item) => ({ ...item, packages: MOCK_PACKAGES[item.id] ?? [] }))

const SIMULATED_DELAY_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSdsData = (searchParams: URLSearchParamsInit) => {
  const [data, setData] = useState<SdsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = new URLSearchParams(searchParams).toString()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await delay(SIMULATED_DELAY_MS)
        if (cancelled) return
        setData(MOCK_DATA)
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [query])

  const updateItem = useCallback(async (id: number, patch: Partial<SdsItem>) => {
    await delay(SIMULATED_DELAY_MS)
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }, [])

  return { data, loading, error, updateItem }
}

import { useState, useEffect } from 'react'
import type { SdsPackage } from '../types'

// TODO: replace with real package data — await fetch('/api/sds/packages')
const MOCK_PACKAGES: SdsPackage[] = [
  { id: 1, name: 'Lab Reagents Q1',       description: 'Reagents restocked for Q1 lab operations' },
  { id: 2, name: 'Hazmat Shipment 04',    description: 'Fourth hazardous materials shipment of the year' },
  { id: 3, name: 'Solvent Restock',       description: 'Routine solvent inventory replenishment' },
  { id: 4, name: 'Flammables Batch B',    description: 'Batch B of flammable liquid intake' },
  { id: 5, name: 'Inventory Refresh',     description: 'General inventory refresh across storage units' },
  { id: 6, name: 'Acid Storage Unit',     description: 'Items assigned to the dedicated acid storage unit' },
  { id: 7, name: 'Quarterly Compliance',  description: 'Items under quarterly compliance review' },
  { id: 8, name: 'Site Transfer 12',      description: 'Materials transferred from site 12' },
  { id: 9, name: 'Cold Chain Pack',       description: 'Temperature-controlled storage package' },
  { id: 10, name: 'Bulk Order 2026-02',   description: 'Bulk order placed February 2026' },
  { id: 11, name: 'Plant Maintenance',    description: 'Materials reserved for plant maintenance' },
  { id: 12, name: 'Toxic Handling Kit',   description: 'Kit for handling toxic substances' },
  { id: 13, name: 'Methanol Resupply',    description: 'Methanol resupply order' },
  { id: 14, name: 'Lab Safety Bundle',    description: 'Bundled lab safety equipment and materials' },
  { id: 15, name: 'Carcinogen Watchlist', description: 'Items flagged on the carcinogen watchlist' },
]

const SIMULATED_DELAY_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSdsPackages = () => {
  const [packages, setPackages] = useState<SdsPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      await delay(SIMULATED_DELAY_MS)
      if (!cancelled) {
        setPackages(MOCK_PACKAGES)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { packages, loading }
}

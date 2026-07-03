import { useState, useEffect, useCallback } from 'react'
import type { SdsItem } from '../types'
import { MOCK_SDS } from '../data/mockSds'

const SIMULATED_DELAY_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSdsData = (searchParams: URLSearchParams) => {
  const [data, setData] = useState<SdsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParams = new URLSearchParams(searchParams)
  fetchParams.delete('id') // row selection only, must not retrigger a refetch
  const query = fetchParams.toString()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await delay(SIMULATED_DELAY_MS)
        if (cancelled) return
        setData(MOCK_SDS)
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

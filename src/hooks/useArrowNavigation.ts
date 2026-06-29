import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const useArrowNavigation = (items: { id: number }[]) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const currentIndex = activeId ? items.findIndex((r) => r.id === activeId) : -1
      const nextIndex = e.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, items.length - 1)
        : Math.max(currentIndex - 1, 0)
      const next = items[nextIndex]
      if (next) setSearchParams({ id: String(next.id) })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeId, items, setSearchParams])
}

export default useArrowNavigation

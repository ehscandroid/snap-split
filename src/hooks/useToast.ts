import { useStateStore } from 'mgsmu-react'
import { useEffect } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

type SetFn = (updater: (prev: Toast[]) => Toast[]) => void
let _set: SetFn | null = null

export const showToast = (message: string, variant: ToastVariant = 'info', duration = 3500) => {
  if (!_set) return
  const id = crypto.randomUUID()
  _set(prev => [...prev, { id, message, variant, duration }])
  setTimeout(() => {
    _set?.(prev => prev.filter(t => t.id !== id))
  }, duration)
}

export const useToasts = (): Toast[] => {
  const [toasts, setToasts] = useStateStore<Toast[]>('__snap_toasts')

  // Register the setter so showToast() can use it imperatively
  useEffect(() => {
    if (!toasts) setToasts([])
    _set = setToasts as SetFn
    return () => { _set = null }
  }, [setToasts, toasts])

  return toasts ?? []
}

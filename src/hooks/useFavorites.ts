import { useEffect, useState } from 'react'
import { useStateStore } from 'mgsmu-react'

const STORAGE_KEY = 'favorite-packages'

export interface FavoritePackage {
  id: number
  name: string
}

const readStored = (): FavoritePackage[] => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

const writeStored = (favorites: FavoritePackage[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export const useFavorites = () => {
  const [store, setStore] = useStateStore('favoritePackages')
  const [initial] = useState<FavoritePackage[]>(() => store?.favorites ?? readStored())

  useEffect(() => {
    if (!store) setStore({ favorites: initial })
  }, [])

  const favorites: FavoritePackage[] = store?.favorites ?? initial
  const favoriteIds = new Set(favorites.map((fav) => fav.id))

  const toggleFavorite = (pkg: FavoritePackage) => {
    const next = favoriteIds.has(pkg.id)
      ? favorites.filter((fav) => fav.id !== pkg.id)
      : [...favorites, pkg]
    writeStored(next)
    setStore({ favorites: next })
  }

  return { favorites, favoriteIds, toggleFavorite }
}

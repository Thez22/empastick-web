import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { CartItem } from '../lib/cart'
import { getCart } from '../lib/cart'
import { useAuth } from './AuthContext'

interface CartContextValue {
  items: CartItem[]
  loading: boolean
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue>({ items: [], loading: true, refresh: async () => {} })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const cart = await getCart(user?.uid ?? null)
    setItems(cart)
    setLoading(false)
  }, [user?.uid])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <CartContext.Provider value={{ items, loading, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

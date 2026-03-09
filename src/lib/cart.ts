import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const CART_KEY = 'empastick_cart'

export interface CartItem {
  name: string
  color: string
  plan: string
  basePrice: number
  monthlyPrice: number
  quantity: number
}

function getLocal(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function setLocal(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export async function getCart(userId: string | null): Promise<CartItem[]> {
  if (!userId) return getLocal()
  try {
    const snap = await getDoc(doc(db, 'carts', userId))
    return (snap.data()?.items as CartItem[]) ?? []
  } catch {
    return getLocal()
  }
}

export async function saveCart(userId: string | null, items: CartItem[]): Promise<void> {
  setLocal(items)
  if (!userId) return
  try {
    await setDoc(doc(db, 'carts', userId), { items, updatedAt: new Date() }, { merge: true })
  } catch {
    // keep local
  }
}

export async function addToCart(userId: string | null, item: Omit<CartItem, 'quantity'>): Promise<void> {
  const cart = await getCart(userId)
  const existing = cart.findIndex(
    (i) => i.name === item.name && i.color === item.color && i.plan === item.plan
  )
  if (existing >= 0) cart[existing].quantity += 1
  else cart.push({ ...item, quantity: 1 })
  await saveCart(userId, cart)
}

export async function removeFromCart(userId: string | null, index: number): Promise<void> {
  const cart = await getCart(userId)
  cart.splice(index, 1)
  await saveCart(userId, cart)
}

export async function updateQuantity(userId: string | null, index: number, quantity: number): Promise<void> {
  const cart = await getCart(userId)
  if (!cart[index]) return
  cart[index].quantity = quantity
  if (quantity <= 0) cart.splice(index, 1)
  await saveCart(userId, cart)
}

export async function clearCart(userId: string | null): Promise<void> {
  await saveCart(userId, [])
}

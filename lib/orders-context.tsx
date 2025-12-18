"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

export interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
}

export interface Order {
  id: number
  products: CartProduct[]
  total: number
  totalQuantity: number
  customerName?: string
  customerEmail?: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void
  clearOrders: () => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const STATUSES: Order["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  console.log(orders);
  
  /* ---------- FETCH DUMMY ORDERS ---------- */
  useEffect(() => {
    const fetchDummyOrders = async () => {
      try {
        const cartsRes = await fetch("https://dummyjson.com/carts?limit=10")
        const cartsData = await cartsRes.json()

        const mappedOrders: Order[] = await Promise.all(
          cartsData.carts.map(async (cart: any, index: number) => {
            const userRes = await fetch(
              `https://dummyjson.com/users/${cart.userId}`
            )
            const user = await userRes.json()

            return {
              id: cart.id,
              products: cart.products.map((p: any) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                quantity: p.quantity,
                thumbnail: p.thumbnail,
              })),
              total: cart.total,
              totalQuantity: cart.totalQuantity,
              customerName: `${user.firstName} ${user.lastName}`,
              customerEmail: user.email,
              date: new Date(
                Date.now() - index * 24 * 60 * 60 * 1000
              ).toISOString(),
              status: STATUSES[index % STATUSES.length],
            }
          })
        )

        setOrders(mappedOrders)
      } catch (error) {
        console.error("❌ Failed to fetch dummy orders:", error)
      }
    }

    fetchDummyOrders()
  }, [])

  /* ---------- ADD REAL ORDER ---------- */
  const addOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      id: Date.now(),
      ...orderData,
      date: new Date().toISOString(),
      status: "pending",
    }

    setOrders((prev) => [newOrder, ...prev])
  }

  const clearOrders = () => {
    setOrders([])
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }
  return context
}

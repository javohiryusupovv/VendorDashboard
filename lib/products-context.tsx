"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export interface Product {
  id: number
  title: string
  description: string
  price: number
  stock: number
  category: string
  thumbnail: string
}

interface FetchParams {
  search?: string
  category?: string
  skip?: number
  limit?: number
}

interface ProductsContextType {
  products: Product[]
  totalProducts: number
  isLoading: boolean
  fetchProducts: (params?: FetchParams) => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<Product>
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: number) => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = useCallback(async (params?: FetchParams) => {
    setIsLoading(true)

    try {
      let url = "https://dummyjson.com/products"

      if (params?.search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
          params.search
        )}`
      } else if (params?.category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(
          params.category
        )}`
      }

      const qs = new URLSearchParams()
      if (params?.limit !== undefined) qs.set("limit", String(params.limit))
      if (params?.skip !== undefined) qs.set("skip", String(params.skip))

      if (qs.toString()) {
        url += url.includes("?") ? `&${qs}` : `?${qs}`
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch products")

      const data = await res.json()

      setProducts((prev) => {
        // pagination bo‘lsa → merge
        if (params?.skip && params.skip > 0) {
          const ids = new Set(prev.map((p) => p.id))
          return [...prev, ...data.products.filter((p: Product) => !ids.has(p.id))]
        }

        // first load / filter → replace
        return data.products
      })

      setTotalProducts(data.total)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* ---------- CRUD ---------- */
  const addProduct = async (product: Omit<Product, "id">) => {
    const res = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })

    const newProduct = await res.json()
    setProducts((prev) => [newProduct, ...prev])
    setTotalProducts((prev) => prev + 1)
    return newProduct
  }

  const updateProduct = async (id: number, product: Partial<Product>) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })

    const updated = await res.json()
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    )
    return updated
  }

  const deleteProduct = async (id: number) => {
    await fetch(`https://dummyjson.com/products/${id}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setTotalProducts((prev) => Math.max(0, prev - 1))
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        totalProducts,
        isLoading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider")
  }
  return ctx
}

"use client"

import { useEffect, useState, useRef } from "react"
import { useI18n } from "@/lib/i18n-context"
import { useProducts, type Product } from "@/lib/products-context"
import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Loader2, LayoutGrid, List } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

const ITEMS_PER_PAGE = 15

export default function ProductsPage() {
  const { t, language } = useI18n()
  const {
    products,
    isLoading,
    totalProducts,
    fetchProducts,
    deleteProduct,
  } = useProducts()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  /* ---------- RESET + FIRST LOAD ---------- */
  useEffect(() => {
    setAllProducts([])

    fetchProducts({
      search: debouncedSearch,
      category: category !== "all" ? category : undefined,
      skip: 0,
      limit: ITEMS_PER_PAGE,
    })
  }, [debouncedSearch, category, fetchProducts])

  /* ---------- MERGE PRODUCTS (NO DUPLICATES) ---------- */
  useEffect(() => {
    setAllProducts((prev) => {
      const ids = new Set(prev.map((p) => p.id))
      const merged = [...prev]

      products.forEach((p) => {
        if (!ids.has(p.id)) merged.push(p)
      })

      return merged
    })
  }, [products])

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoadingMore &&
          allProducts.length < totalProducts
        ) {
          setIsLoadingMore(true)

          await fetchProducts({
            search: debouncedSearch,
            category: category !== "all" ? category : undefined,
            skip: allProducts.length,
            limit: ITEMS_PER_PAGE,
          })

          setIsLoadingMore(false)
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [
    allProducts.length,
    totalProducts,
    isLoadingMore,
    fetchProducts,
    debouncedSearch,
    category,
  ])

  /* ---------- CRUD ---------- */
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteId)
      setAllProducts((prev) => prev.filter((p) => p.id !== deleteId))
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("products")}</h2>
          <p className="text-muted-foreground">
            {allProducts.length} / {totalProducts}{" "}
            {language === "uz" ? "ta mahsulot" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "grid" | "table")}
          >
            <TabsList>
              <TabsTrigger value="table">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("add_product")}
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* CONTENT */}
      {isLoading && allProducts.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("no_products")}
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <ProductTable products={allProducts} onEdit={handleEdit} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}

          {/* SCROLL SENTINEL */}
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isLoadingMore && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            )}
          </div>
        </>
      )}

      {/* FORM */}
      <ProductForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        product={editingProduct}
      />

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "uz"
                ? "Mahsulotni o‘chirish"
                : "Delete product"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "uz"
                ? "Bu amalni qaytarib bo'lmaydi."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting
                ? language === "uz"
                  ? "O'chirilmoqda..."
                  : "Deleting..."
                : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

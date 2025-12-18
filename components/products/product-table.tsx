"use client"

import { useState } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n-context"
import { useProducts, type Product } from "@/lib/products-context"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const { t } = useI18n()
  const { deleteProduct } = useProducts()

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteId)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{t("image")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead className="text-right">{t("price")}</TableHead>
              <TableHead className="text-right">{t("stock")}</TableHead>
              <TableHead className="w-20">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* IMAGE */}
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                {/* TITLE */}
                <TableCell>
                  <p className="font-medium line-clamp-1">
                    {product.title}
                  </p>
                </TableCell>

                {/* CATEGORY */}
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>

                {/* PRICE */}
                <TableCell className="text-right font-medium">
                  ${product.price.toFixed(2)}
                </TableCell>

                {/* STOCK */}
                <TableCell className="text-right">
                  <span
                    className={
                      product.stock < 10 ? "text-destructive" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>

                {/* ACTIONS */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setDeleteId(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* DELETE CONFIRM */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Mahsulotni o'chirish
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo'lmaydi. Mahsulot butunlay o'chiriladi.
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
              {isDeleting ? "O'chirilmoqda..." : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n-context"
import type { Product } from "@/lib/products-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2, Star } from "lucide-react"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useI18n()

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted">
        <Image src={product.thumbnail || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{product.discountPercentage.toFixed(0)}%
          </Badge>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        </div>
        <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>
          {product.stock} {t("stock")}
        </Badge>
      </CardFooter>
    </Card>
  )
}

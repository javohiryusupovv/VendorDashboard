"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface TopProductsTableProps {
  products: { id: number; title: string; thumbnail: string; sales: number; quantity: number }[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const maxSales = Math.max(...products.map((p) => p.sales))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Sales</TableHead>
          <TableHead className="w-[200px]">Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium line-clamp-1 max-w-[200px]">{product.title}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{product.quantity}</TableCell>
            <TableCell className="text-right font-medium">${product.sales.toFixed(2)}</TableCell>
            <TableCell>
              <Progress value={(product.sales / maxSales) * 100} className="h-2" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

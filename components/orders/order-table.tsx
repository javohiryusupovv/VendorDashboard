"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { useI18n } from "@/lib/i18n-context"
import type { Order } from "@/lib/orders-context"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  const { t, language } = useI18n()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sortField, setSortField] = useState<"date" | "total">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const sortedOrders = [...orders].sort((a, b) => {
    const comparison =
      sortField === "date"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : a.total - b.total

    return sortDirection === "desc" ? -comparison : comparison
  })

  const toggleSort = (field: "date" | "total") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: "date" | "total" }) => {
    if (sortField !== field) return null
    return sortDirection === "desc" ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronUp className="h-4 w-4" />
    )
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("items")}</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => toggleSort("total")}
                >
                  {t("total")}
                  <SortIcon field="total" />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => toggleSort("date")}
                >
                  {t("date")}
                  <SortIcon field="date" />
                </Button>
              </TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">#{order.id}</TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.products.slice(0, 3).map((product, idx) => (
                        <div
                          key={idx}
                          className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background bg-muted"
                        >
                          <Image
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {order.totalQuantity}{" "}
                      {language === "uz" ? "dona" : "items"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  ${order.total.toFixed(2)}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {format(new Date(order.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ORDER DETAILS */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Buyurtma #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.customerName} –{" "}
              {selectedOrder &&
                format(new Date(selectedOrder.date), "PPP")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">{t("items")}</h4>

              <ScrollArea className="h-52">
                <div className="space-y-3">
                  {selectedOrder?.products.map((product, idx) => {
                    const productTotal =
                      product.price * product.quantity

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} × $
                            {product.price.toFixed(2)}
                          </p>
                        </div>

                        <p className="font-medium">
                          ${productTotal.toFixed(2)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-medium text-lg">
                <span>{t("total")}</span>
                <span>${selectedOrder?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

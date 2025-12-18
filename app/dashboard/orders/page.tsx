"use client"

import { useState, useMemo } from "react"
import { useI18n } from "@/lib/i18n-context"
import { useOrders } from "@/lib/orders-context"
import { OrderTable } from "@/components/orders/order-table"
import { OrderFilters } from "@/components/orders/order-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export default function OrdersPage() {
  const { t, language } = useI18n()
  const { orders } = useOrders()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = debouncedSearch.toLowerCase()

      const matchesSearch =
        !debouncedSearch ||
        order.id.toString().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.customerEmail?.toLowerCase().includes(searchLower)

      return matchesSearch
    })
  }, [orders, debouncedSearch])

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
    const pendingOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length
    const completedOrders = orders.filter((o) => o.status === "delivered").length

    return { totalRevenue, pendingOrders, completedOrders }
  }, [orders])

  const statCards = [
    {
      title: t("total_orders"),
      value: orders.length,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("revenue"),
      value: `$${stats.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("orders")}</h2>
        <p className="text-muted-foreground">
          {filteredOrders.length} / {orders.length}{" "}
          {language === "uz" ? "ta buyurtma" : "orders"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderFilters
        search={search}
        onSearchChange={setSearch}
      />

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {language === "uz" ? "Buyurtmalar topilmadi" : "No orders found"}
          </p>
        </div>
      ) : (
        <OrderTable orders={filteredOrders} />
      )}
    </div>
  )
}

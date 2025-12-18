"use client"

import { useMemo, useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { useOrders } from "@/lib/orders-context"
import { useProducts } from "@/lib/products-context"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

import { SalesChart } from "@/components/analytics/sales-chart"
import { CategoryChart } from "@/components/analytics/category-chart"
import { TopProductsTable } from "@/components/analytics/top-products-table"

export default function AnalyticsPage() {
  const { t, language } = useI18n()
  const { orders } = useOrders()
  const { products } = useProducts()
  const [period, setPeriod] = useState<"daily" | "weekly">("daily")
  console.log(products);
  
  /* ---------- TOTAL STATS ---------- */
  const totalStats = useMemo(() => {
    const totalRevenue = orders.reduce((a, o) => a + o.total, 0)

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: new Set(
        orders.map((o) => o.customerEmail).filter(Boolean)
      ).size,
    }
  }, [orders, products])

  /* ---------- DAILY / WEEKLY SALES ---------- */
  const dailySales = useMemo(() => {
    return [...Array(14)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (13 - i))

      const dayOrders = orders.filter(
        (o) =>
          new Date(o.date).toDateString() === d.toDateString()
      )

      return {
        date: d.toISOString().split("T")[0],
        sales: dayOrders.reduce((a, o) => a + o.total, 0),
        orders: dayOrders.length,
      }
    })
  }, [orders])

  const weeklySales = useMemo(() => {
    return [...Array(8)].map((_, i) => {
      const start = new Date()
      start.setDate(start.getDate() - i * 7)

      const weekOrders = orders.filter((o) => {
        const d = new Date(o.date)
        return (
          d >= new Date(start.getTime() - 7 * 86400000) &&
          d <= start
        )
      })

      return {
        week: `Week ${8 - i}`,
        sales: weekOrders.reduce((a, o) => a + o.total, 0),
        orders: weekOrders.length,
      }
    }).reverse()
  }, [orders])

  const chartData = period === "daily" ? dailySales : weeklySales

  /* ---------- CATEGORY DATA ---------- */
  const categoryData = useMemo(() => {
    const map = new Map<string, { sales: number; count: number }>()

    orders.forEach((o) => {
      o.products.forEach((p: any) => {
        const cat = p.category || "other"
        const prev = map.get(cat) || { sales: 0, count: 0 }
        map.set(cat, {
          sales: prev.sales + p.price * p.quantity,
          count: prev.count + p.quantity,
        })
      })
    })

    return Array.from(map.entries())
      .map(([category, v]) => ({
        category,
        sales: v.sales,
        count: v.count,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6)
  }, [orders])

  /* ---------- TOP PRODUCTS ---------- */
  const topProducts = useMemo(() => {
    const map = new Map<
      number,
      { title: string; thumbnail: string; sales: number; quantity: number }
    >()

    orders.forEach((o) => {
      o.products.forEach((p) => {
        const prev = map.get(p.id)
        if (prev) {
          prev.sales += p.price * p.quantity
          prev.quantity += p.quantity
        } else {
          map.set(p.id, {
            title: p.title,
            thumbnail: p.thumbnail,
            sales: p.price * p.quantity,
            quantity: p.quantity,
          })
        }
      })
    })

    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
  }, [orders])

  const statCards = [
    {
      title: t("revenue"),
      value: `$${totalStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: t("total_orders"),
      value: totalStats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: t("total_products"),
      value: totalStats.totalProducts,
      icon: Package,
    },
    {
      title: language === "uz" ? "Mijozlar" : "Customers",
      value: totalStats.totalCustomers,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">{t("analytics")}</h2>
        <p className="text-muted-foreground">
          {language === "uz"
            ? "Savdo va buyurtmalar tahlili"
            : "Sales and orders analysis"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {s.title}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between flex-row">
            <div>
              <CardTitle>
                {language === "uz" ? "Savdo tahlili" : "Sales Overview"}
              </CardTitle>
              <CardDescription>
                {language === "uz"
                  ? "Buyurtmalar asosida"
                  : "Based on orders"}
              </CardDescription>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
              <TabsList>
                <TabsTrigger value="daily">{t("daily")}</TabsTrigger>
                <TabsTrigger value="weekly">{t("weekly")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <SalesChart data={chartData} period={period} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "uz"
                ? "Kategoriya bo'yicha"
                : "By Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* TOP PRODUCTS */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "uz"
              ? "Eng ko'p sotilgan mahsulotlar"
              : "Top Selling Products"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopProductsTable products={topProducts} />
        </CardContent>
      </Card>
    </div>
  )
}

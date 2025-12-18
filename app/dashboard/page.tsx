"use client"

import { useMemo } from "react"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"
import { useProducts } from "@/lib/products-context"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import Link from "next/link"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export default function DashboardPage() {
  const { t, language } = useI18n()
  const { user } = useAuth()
  const { orders } = useOrders()
  const { products } = useProducts()

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
    const totalSales = orders.reduce((acc, o) => acc + o.totalQuantity, 0)

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalSales,
    }
  }, [orders, products])

  /* ---------- LAST 7 DAYS SALES ---------- */
  const recentSales = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))

      const sales = orders
        .filter(
          (o) =>
            new Date(o.date).toDateString() === date.toDateString()
        )
        .reduce((acc, o) => acc + o.total, 0)

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        sales,
      }
    })
  }, [orders])

  const statCards = [
    {
      title: t("total_products"),
      value: stats.totalProducts,
      change: "+",
      trend: "up",
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/dashboard/products",
    },
    {
      title: t("total_orders"),
      value: stats.totalOrders,
      change: "+",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/dashboard/orders",
    },
    {
      title: t("revenue"),
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+",
      trend: "up",
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      href: "/dashboard/analytics",
    },
    {
      title: t("total_sales"),
      value: stats.totalSales,
      change: "-",
      trend: "down",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/dashboard/analytics",
    },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">{t("dashboard")}</h2>
        <p className="text-muted-foreground">
          {language === "uz"
            ? "Umumiy ko'rsatkichlar va tezkor havolalar"
            : "Overview and quick links"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
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
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {language === "uz" ? "real vaqt" : "real time"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CHART + ACTIONS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "uz"
                ? "So'nggi 7 kunlik savdolar"
                : "Last 7 Days Sales"}
            </CardTitle>
            <CardDescription>
              {language === "uz"
                ? "Buyurtmalar asosida"
                : "Based on orders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recentSales}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    labelStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: 500,
                    }}
                    itemStyle={{
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`$${value}`, "Sales"]}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "uz" ? "Tezkor havolalar" : "Quick Actions"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/products">
              <Button variant="outline" className="w-full justify-start mb-4 cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                {t("add_product")}
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full justify-start cursor-pointer">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {language === "uz"
                  ? "Buyurtmalarni ko'rish"
                  : "View Orders"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

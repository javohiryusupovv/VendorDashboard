"use client"

import dynamic from "next/dynamic"
import { useTheme } from "@/lib/theme-context"
import type ApexCharts from "apexcharts"

interface SalesChartProps {
  data: { date?: string; week?: string; sales: number; orders: number }[]
  period: "daily" | "weekly"
}

export function SalesChart({ data, period }: SalesChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const categories = data.map((item) => {
    if (period === "daily" && item.date) {
      const date = new Date(item.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    return item.week || ""
  })

  const salesData = data.map((item) => item.sales)
  const ordersData = data.map((item) => item.orders)

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3b82f6", "#10b981"],
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: isDark ? "#9ca3af" : "#6b7280",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: "Revenue ($)",
          style: { color: isDark ? "#9ca3af" : "#6b7280" },
        },
        labels: {
          style: { colors: isDark ? "#9ca3af" : "#6b7280" },
          formatter: (value) => `$${value.toLocaleString()}`,
        },
      },
      {
        opposite: true,
        title: {
          text: "Orders",
          style: { color: isDark ? "#9ca3af" : "#6b7280" },
        },
        labels: {
          style: { colors: isDark ? "#9ca3af" : "#6b7280" },
        },
      },
    ],
    grid: {
      borderColor: isDark ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: isDark ? "#d1d5db" : "#374151",
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (value, { seriesIndex }) => {
          if (seriesIndex === 0) return `$${value.toLocaleString()}`
          return value.toString()
        },
      },
    },
  }

  const series = [
    { name: "Revenue", data: salesData },
    { name: "Orders", data: ordersData },
  ]

  const ReactApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

  return (
    <div className="h-[350px] w-full">
      <ReactApexCharts options={options} series={series} type="line" height={350} width="100%" />
    </div>
  )
}

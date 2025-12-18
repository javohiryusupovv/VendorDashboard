"use client"

import dynamic from "next/dynamic"
import { useTheme } from "@/lib/theme-context"
import type ApexCharts from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface CategoryChartProps {
  data: { category: string; sales: number; count: number }[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const labels = data.map((item) => item.category)
  const values = data.map((item) => item.sales)

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels,
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"],
    legend: {
      position: "right",
      labels: {
        colors: isDark ? "#d1d5db" : "#374151",
      },
      formatter: (seriesName) => {
        return seriesName.charAt(0).toUpperCase() + seriesName.slice(1)
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              color: isDark ? "#d1d5db" : "#374151",
            },
            value: {
              show: true,
              color: isDark ? "#d1d5db" : "#374151",
              formatter: (val) => `$${Number(val).toLocaleString()}`,
            },
            total: {
              show: true,
              label: "Total",
              color: isDark ? "#9ca3af" : "#6b7280",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                return `$${total.toLocaleString()}`
              },
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    stroke: {
      width: 2,
      colors: [isDark ? "#1f2937" : "#ffffff"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }

  return (
    <div className="h-[300px] w-full">
      <Chart options={options} series={values} type="donut" height={300} width="100%" />
    </div>
  )
}

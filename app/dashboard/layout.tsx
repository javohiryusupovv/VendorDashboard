"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useNotifications } from "@/lib/notification-context"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const isMobile = useMobile()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    const notifications = [
      { title: "Yangi buyurtma", message: "John Doe dan $150.00 lik buyurtma keldi", type: "info" as const },
      { title: "Mahsulot sotildi", message: "iPhone 15 Pro sotildi", type: "success" as const },
      { title: "Stock ogohlantirish", message: "Samsung Galaxy stock kam qoldi", type: "warning" as const },
    ]

    const interval = setInterval(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      addNotification(randomNotification)
    }, 30000) // Every 30 seconds

    // Initial notification after 5 seconds
    const timeout = setTimeout(() => {
      addNotification({
        title: "Xush kelibsiz!",
        message: "Vendor Dashboard'ga muvaffaqiyatli kirdingiz",
        type: "success",
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [user, addNotification])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={isMobile ? "" : "lg:pl-64"}>
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

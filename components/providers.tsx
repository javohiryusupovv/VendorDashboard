"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { I18nProvider } from "@/lib/i18n-context"
import { ThemeProvider } from "@/lib/theme-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ProductsProvider } from "@/lib/products-context"
import { OrdersProvider } from "@/lib/orders-context"
import { ErrorBoundary } from "@/components/error-boundary"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <I18nProvider>
            <NotificationProvider>
              <ProductsProvider>
                <OrdersProvider>{children}</OrdersProvider>
              </ProductsProvider>
            </NotificationProvider>
          </I18nProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

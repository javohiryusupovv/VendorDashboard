"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-100 flex-col items-center justify-center gap-4 p-8">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Xatolik yuz berdi</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {this.state.error?.message || "Kutilmagan xatolik yuz berdi"}
            </p>
            <Button onClick={() => this.setState({ hasError: false })}>Qayta urinish</Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

"use client"

import type React from "react"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: PageHeaderAction
}

export function PageHeader({ title, description, icon: Icon, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
          </div>
        </div>
        {action && (
          <Button onClick={action.onClick} variant={action.variant || "default"} className="flex items-center gap-2">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { ReferenceDataProvider } from "@/contexts/reference-data-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <ReferenceDataProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
          <DashboardSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <MobileHeader />
            <main
              className="flex-1 overflow-auto scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="p-6 space-y-6 min-h-full overflow-hidden scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div
                  className="max-w-7xl mx-auto overflow-hidden scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ReferenceDataProvider>
  )
}

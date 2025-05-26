"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardList,
  Cog,
  Database,
  FileText,
  LayoutDashboard,
  Package,
  Users,
  Layers,
  Truck,
  ChevronLeft,
  LineChart,
  Trash,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"

type SidebarProps = {
  isOpen: boolean
  toggle: () => void
}

export function DashboardSidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Admin Panel",
      href: "/dashboard/admin",
      icon: Users,
    },
    {
      title: "Role Management",
      href: "/dashboard/admin/roles",
      icon: ClipboardList,
      parent: "Admin Panel",
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
      parent: "Admin Panel",
    },
    {
      title: "Reference Data Management",
      href: "/dashboard/admin/reference-data",
      icon: Database,
      parent: "Admin Panel",
    },
    {
      title: "System Settings",
      href: "/dashboard/admin/settings",
      icon: Cog,
      parent: "Admin Panel",
    },
    {
      title: "Product Management",
      href: "/dashboard/product-manager",
      icon: Package,
    },
    {
      title: "Product Definition",
      href: "/dashboard/product-manager/products",
      icon: Package,
      parent: "Product Management",
    },
    {
      title: "Manufacturing Process",
      href: "/dashboard/product-manager/manufacturing",
      icon: Truck,
      parent: "Product Management",
    },
    {
      title: "Task Management",
      href: "/dashboard/task-manager",
      icon: ClipboardList,
    },
    {
      title: "Task Alerts Management",
      href: "/dashboard/task-manager/alerts",
      icon: Bell,
      parent: "Task Management",
    },
    {
      title: "Task Repository",
      href: "/dashboard/task-manager/repository",
      icon: ClipboardList,
      parent: "Task Management",
    },
    {
      title: "Task Assignment",
      href: "/dashboard/task-manager/assignments",
      icon: Users,
      parent: "Task Management",
    },
    {
      title: "Task Dashboard",
      href: "/dashboard/task-manager/dashboards",
      icon: LayoutDashboard,
      parent: "Task Management",
    },
    {
      title: "Task Tracking",
      href: "/dashboard/task-manager/tracking",
      icon: Activity,
      parent: "Task Management",
    },
    {
      title: "Performance Analytics",
      href: "/dashboard/analytics",
      icon: LineChart,
      parent: "Task Management",
    },
    {
      title: "Inventory Management",
      href: "/dashboard/inventory",
      icon: Database,
    },
    {
      title: "SKU Management",
      href: "/dashboard/inventory/skus",
      icon: Layers,
      parent: "Inventory Management",
    },
    {
      title: "Wastage Tracking",
      href: "/dashboard/inventory/wastage",
      icon: Trash,
      parent: "Inventory Management",
    },
    {
      title: "Procurement",
      href: "/dashboard/inventory/procurement",
      icon: Package,
      parent: "Inventory Management",
    },
    {
      title: "Inventory Analytics",
      href: "/dashboard/inventory/analytics",
      icon: BarChart3,
      parent: "Inventory Management",
    },
    {
      title: "Asset Management",
      href: "/dashboard/asset-management",
      icon: Package,
    },
    {
      title: "Asset Management",
      href: "/dashboard/asset-management/assets",
      icon: Package,
      parent: "Asset Management",
    },
    {
      title: "Asset Dashboard",
      href: "/dashboard/asset-management/dashboard",
      icon: BarChart3,
      parent: "Asset Management",
    },
    {
      title: "Audit Management",
      href: "/dashboard/audit",
      icon: FileText,
    },
    {
      title: "Audit Form Management",
      href: "/dashboard/audit/forms",
      icon: FileText,
      parent: "Audit Management",
    },
    {
      title: "Audit Report",
      href: "/dashboard/audit/reports",
      icon: BarChart3,
      parent: "Audit Management",
    },
  ]

  // Filter main navigation items (those without a parent)
  const mainNavItems = navItems.filter((item) => !item.parent)

  // Check if a nav item is active or one of its children is active
  const isActiveOrHasActiveChild = (item: any) => {
    if (pathname && pathname === item.href) return true
    return navItems.some((child) => child.parent === item.title && pathname && pathname === child.href)
  }

  return (
    <div
      className={cn(
        "h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white border-r border-slate-700/50 transition-all duration-300 ease-in-out shadow-2xl",
        isOpen ? "w-72" : "w-20",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 h-20 bg-slate-900/50">
        <div className={cn("flex items-center", !isOpen && "justify-center")}>
          {isOpen ? (
            <div className="relative h-10 w-48">
              <Image
                src="/logo_full.svg"
                alt="Worcoor Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="brightness-0 invert"
              />
            </div>
          ) : (
            <div className="relative h-8 w-8">
              <Image
                src="/logo_full.svg"
                alt="Worcoor Icon"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="brightness-0 invert"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200 h-9 w-9"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
        <nav className="p-4 space-y-2">
          {mainNavItems.map((item) => (
            <div key={`nav-${item.href}`} className="space-y-1">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActiveOrHasActiveChild(item)
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white",
                  !isOpen && "justify-center px-3",
                )}
                title={!isOpen ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 transition-transform duration-200",
                    isActiveOrHasActiveChild(item) ? "h-5 w-5" : "h-4 w-4",
                    "group-hover:scale-110",
                  )}
                />
                {isOpen && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {navItems.some((child) => child.parent === item.title) && (
                      <div
                        className={cn(
                          "transition-transform duration-200",
                          isActiveOrHasActiveChild(item) && "rotate-90",
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </>
                )}
                {/* Active indicator */}
                {isActiveOrHasActiveChild(item) && !isOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-l-full" />
                )}
              </Link>

              {/* Child items */}
              {isOpen && isActiveOrHasActiveChild(item) && (
                <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {navItems
                    .filter((child) => child.parent === item.title)
                    .map((child) => (
                      <Link
                        key={`child-${child.href}`}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                          pathname === child.href
                            ? "bg-slate-800 text-blue-300 border-l-2 border-blue-400"
                            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-l-2 border-transparent hover:border-slate-600",
                        )}
                      >
                        <child.icon className="h-4 w-4 group-hover:scale-105 transition-transform duration-200" />
                        <span className="truncate">{child.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50 h-20 bg-slate-900/30">
        {isOpen ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors duration-200">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@worcoor.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg hover:scale-105 transition-transform duration-200">
              A
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

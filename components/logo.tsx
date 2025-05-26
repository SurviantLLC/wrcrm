import Image from "next/image"
import { usePathname } from "next/navigation"

interface LogoProps {
  className?: string
  size?: number
  alwaysShow?: boolean // New prop to override path-based visibility
}

// List of paths where the logo should be displayed
const PATHS_WITH_LOGO = [
  "/dashboard",
  "/dashboard/admin",
  "/dashboard/product-manager",
  "/dashboard/task-manager",
  "/dashboard/inventory",
  "/dashboard/audit",
  "/dashboard/asset-management/assets"
]

export function Logo({ className = "", size = 32, alwaysShow = false }: LogoProps) {
  const pathname = usePathname()
  
  // Show logo if alwaysShow is true or if the current path is in the allowed list
  const shouldShowLogo = alwaysShow || PATHS_WITH_LOGO.includes(pathname)
  
  if (!shouldShowLogo) {
    // Return an empty div with the same dimensions to maintain layout
    return <div className={`relative ${className}`} style={{ width: size, height: size }} />
  }
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Mark%403x-czqo4PXNUZJICBDMDTfCPYwi4yR1AO.png"
        alt="Worcoor Logo"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  )
}

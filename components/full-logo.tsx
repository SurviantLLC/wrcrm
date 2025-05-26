import Image from "next/image"

interface FullLogoProps {
  className?: string
}

export function FullLogo({ className = "" }: FullLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ height: "40px" }}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/H_Logo%403x-kbxa5EEVooqXmEnSTBwybFTmBd9ITD.png"
        alt="Worcoor Logo"
        width={180}
        height={40}
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  )
}

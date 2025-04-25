"use client"
import { type ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLoadScript } from "@react-google-maps/api"

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return <div>{children}</div>
}

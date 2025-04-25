import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { RootLayout } from "./RootLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexa Group",
  description: "Plan your trips, discover destinations, and travel with confidence",
    generator: 'v0.dev'
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayout>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                {children}
                <Footer />
                <Toaster />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </RootLayout>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextAuthProvider } from "@/providers/next-auth"
import { Toaster } from "sonner"
import { NavWrapper } from "@/components/nav-wrapper"
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ICONIK 2026 - International Conference by Indonesian Students in Korea",
  description: "Recent Innovations at the Multidisciplinary Crossroads for Indonesia’s Sustainable Development Goals.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <NextAuthProvider>
          <Suspense fallback={<p>Memuat...</p>}>
            <NavWrapper />
            {children}
          </Suspense>
        </NextAuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}

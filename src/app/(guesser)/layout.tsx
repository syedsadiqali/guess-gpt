import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"

import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

import "../globals.css"

import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SiteHeader } from "@/components/layouts/site-header"
import { siteConfig } from "@/config/site"
import { SiteFooter } from "@/components/layouts/site-footer"


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "guess-image",
    "find-person-place-things-in-image"
  ],
  authors: [
    {
      name: "syedsadiqali",
      url: "https://guess-gpt.vercel.app",
    },
  ],
  creator: "syedsadiqali",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    creator: "@alisyedsadiq1",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter/>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

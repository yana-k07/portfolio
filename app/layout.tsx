import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

// Geist Sans for the text, Geist Mono for the small facts. Both self-hosted
// by the `geist` package, no runtime font request.
export const metadata: Metadata = {
  title: 'Yana Kovalova, product designer',
  description: 'Product designer for complex B2B interfaces.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a08' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {/* Keyboard users skip the bar; both pages' <main> carry id="main". */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-[13px]/4 focus:font-semibold focus:text-background"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

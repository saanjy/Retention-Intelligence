import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signal — Retention Intelligence',
  description: 'Explainable telecom churn analytics and AI-powered retention recommendations.',
  generator: 'v0.app',
icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Pkg8CxeImKz8O1pSKy3VNbADwjmAsj.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [{ color: '#f7f9f8' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

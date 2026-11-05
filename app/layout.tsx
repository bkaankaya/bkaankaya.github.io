import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://bkaankaya.github.io'),
  title: 'B. Kaan Kaya | Software Engineer',
  description: 'I build end-to-end products that combine software, AI and real-world impact.',
  openGraph: {
    title: 'B. Kaan Kaya | Software Engineer',
    description: 'Thoughtful software, designed and built to make a real-world impact.',
    url: 'https://bkaankaya.github.io/',
    type: 'website',
    images: [
      {
        url: '/portrait-kaan.webp',
        width: 520,
        height: 520,
        alt: 'Portrait of B. Kaan Kaya',
      },
    ],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080a16' },
    { media: '(prefers-color-scheme: light)', color: '#f6f7fb' },
  ],
  colorScheme: 'dark light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

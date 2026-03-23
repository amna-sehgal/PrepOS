import type { Metadata } from 'next'
import { Archivo, Familjen_Grotesk } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-familjen',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PrepOS — Your interview operating system',
  description:
    'The AI-powered interview prep platform built for Indian college students. Mock interviews, smart tracker, brainstorm board — all in one place.',
  keywords: ['interview prep', 'college students', 'India', 'DSA', 'mock interview', 'placement'],
  openGraph: {
    title: 'PrepOS — Your interview operating system',
    description: 'From brainstorming project ideas to cracking your Razorpay interview.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${familjen.variable}`}>
      <body className="bg-ghost antialiased">{children}</body>
    </html>
  )
}

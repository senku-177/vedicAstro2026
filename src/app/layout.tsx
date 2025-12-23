import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Vedic Wisdom 2026 - Discover Your Stars',
  description: 'Get instant personality insights based on Vedic Astrology.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
       <Script 
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="lazyOnload"
        />
        
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-[#050511]">
          {/* Constellation Background Effect */}
          <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          {children}
        </div>
      </body>
    </html>
  )
}
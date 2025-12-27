import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Link from 'next/link' // FIXED: Import from next/link
import { Sparkles } from 'lucide-react' // Optional: added a nice icon

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Vedic Wisdom 2026 - Discover Your Stars',
  description: 'Get instant AI-powered Vedic Astrology and Tarot insights for the year 2026.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script 
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="beforeInteractive" // Changed to beforeInteractive so it's ready for payment immediately
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#050511] text-slate-200`}>
        {/* Main App Container */}
        <div className="max-w-md mx-auto min-h-screen relative flex flex-col shadow-2xl bg-[#050511] border-x border-slate-900/50">
          
          {/* Constellation/Noise Background Effect */}
          <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
          
          {/* Page Content */}
          <main className="flex-grow relative z-10">
            {children}
          </main>

          {/* Footer - Now inside the max-w-md for a consistent "App" feel */}
          <footer className="relative z-10 bg-[#0a0a15]/80 backdrop-blur-md border-t border-slate-800 py-10 px-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-amber-500 font-bold text-lg tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> VEDIC WISDOM
              </div>
              
              <nav className="flex gap-6 text-xs font-medium text-slate-500 uppercase tracking-tighter">
                <Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms</Link>
              </nav>
              
              <p className="text-slate-600 text-[10px] mt-2">
                © 2026 Vedic Wisdom. Decisions based on astrology are your own responsibility.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
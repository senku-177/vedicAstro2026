'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center py-10 relative overflow-hidden bg-[#050511]">
      
      {/* Background Star Animation */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 text-yellow-500/30"
      ><Star size={24} /></motion.div>

      <div className="z-10 w-full max-w-sm space-y-6 flex flex-col items-center">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
            <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-2">Vedic Wisdom 2026</span>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] leading-tight text-white">
              Unlock Your <br /> 
              <span className="gold-gradient-text bg-gradient-to-r from-yellow-200 to-yellow-600 bg-clip-text text-transparent">Free Vedic Teaser</span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg">Discover Your Stars Now!</p>
            <p className="text-sm text-gray-400">अपने सितारों को जानें - अभी मुफ्त में!</p>
        </motion.div>

        {/* Timer Card - Forces Horizontal Layout */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="w-full cosmic-card p-4 border-t-2 border-red-500/50 bg-gradient-to-b from-red-900/20 to-transparent rounded-2xl border-white/10 border"
        >
          <div className="flex items-center justify-center gap-2 text-red-300 mb-4 text-xs uppercase font-bold tracking-wide">
            <Clock size={14} /> New Year Insights Await - Start Free!
          </div>
          
          {/* Flex container specifically for the timer blocks */}
          <div className="flex flex-row justify-center items-center gap-4">
            <div className="bg-white/5 rounded-lg p-3 w-20 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="text-2xl font-bold text-white">23</div>
                <div className="text-[10px] text-gray-400 uppercase">Hrs</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 w-20 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="text-2xl font-bold text-white">53</div>
                <div className="text-[10px] text-gray-400 uppercase">Min</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 w-20 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="text-2xl font-bold text-white">29</div>
                <div className="text-[10px] text-gray-400 uppercase">Sec</div>
            </div>
          </div>
        </motion.div>

        <Link href="/input" className="block w-full">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full glow-btn bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-full text-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-yellow-500/20"
          >
            Get Free Teaser <span>→</span>
          </motion.button>
        </Link>

        {/* Social Proof */}
        <div className="pt-4 flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
           <div className="flex -space-x-2 justify-center">
             {[1,2,3,4].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#050511] bg-gray-700`} style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover'}}></div>)}
           </div>
           <span>Join 50,000+ Indians</span>
        </div>
        
        <div className="flex justify-center gap-4 text-xs text-green-400 mt-2">
            <span className="flex items-center gap-1">✓ 100% Free Preview</span>
            <span className="flex items-center gap-1">✓ Instant Results</span>
        </div>
      </div>
    </main>
  );
}
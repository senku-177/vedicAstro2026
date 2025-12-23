'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from 'next/link';

export default function TeaserResult() {
  const searchParams = useSearchParams();
  
  // Extract all possible params
  const name = searchParams.get('name') || 'Friend';
  const dob = searchParams.get('dob') || '';
  const time = searchParams.get('time') || '';
  const place = searchParams.get('place') || '';
  const leadId = searchParams.get('leadId') || ''; // Will be used later when available

  const [showUpsell, setShowUpsell] = useState(false);
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [teaserData, setTeaserData] = useState({
    sunSign: 'Loading...',
    moonSign: 'Loading...',
    personality: 'Calculating your unique cosmic profile...',
  });

  useEffect(() => {
    const generateTeaser = async () => {
      try {
        const response = await fetch('/api/generate-teaser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, dob, time, place }),
        });

        if (!response.ok) throw new Error('Failed to generate teaser');

        const data = await response.json();
        setTeaserData({
          sunSign: data.sunSign || 'Aries (Mesh)',
          moonSign: data.moonSign || 'Taurus (Vrishabha)',
          personality: data.personality || 'Your cosmic energy is being revealed...',
        });
      } catch (error) {
        console.error('Teaser generation failed:', error);
        // Safe fallback
        setTeaserData({
          sunSign: 'Aries (Mesh)',
          moonSign: 'Taurus (Vrishabha)',
          personality: 'You possess a dynamic blend of energy and stability. Your fiery spirit drives ambition, while grounded intuition provides balance. This cosmic profile hints at great potential in 2026... but the full truth is waiting to be unlocked.',
        });
      } finally {
        setLoading(false);
        setTimeout(() => setShowUpsell(true), 3000); // Strong cliffhanger timing
      }
    };

    generateTeaser();
  }, [dob, time, place, name]);

  // Helper to build checkout URL with ALL params preserved
  const buildCheckoutUrl = (plan: string, price: number) => {
    const params = new URLSearchParams();
    params.set('plan', plan);
    params.set('price', price.toString());
    params.set('name', name);
    if (dob) params.set('dob', dob);
    if (time) params.set('time', time);
    if (place) params.set('place', place);
    if (leadId) params.set('leadId', leadId); // Automatically included when available

    return `/checkout?${params.toString()}`;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050511] text-center p-6">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-yellow-400 text-xl font-[family-name:var(--font-playfair)]">Aligning your stars...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050511] p-4 pb-24">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />

      <div className="text-center mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-white">Welcome, {name} 🙏</h1>
        <p className="text-gray-400 text-sm">Here's your complimentary cosmic profile</p>
      </div>

      {/* Free Teaser Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="cosmic-card p-6 mb-4 border-l-4 border-yellow-500 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
      >
        <div className="absolute top-0 right-0 p-2 bg-yellow-500/10 rounded-bl-xl text-yellow-500 text-xs font-bold">FREE</div>

        {/* Sun Sign */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-500"><Sparkles size={24} /></div>
          <div>
            <h3 className="font-bold text-lg text-white">Your Sun Sign</h3>
            <p className="text-yellow-400 font-[family-name:var(--font-playfair)] text-xl">{teaserData.sunSign}</p>
          </div>
        </div>

        {/* Moon Sign */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-full text-blue-500"><Sparkles size={24} /></div>
          <div>
            <h3 className="font-bold text-lg text-white">Your Moon Sign</h3>
            <p className="text-blue-400 font-[family-name:var(--font-playfair)] text-xl">{teaserData.moonSign}</p>
          </div>
        </div>

        {/* Personality Teaser + Cliffhanger */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {teaserData.personality}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {['Bold', 'Intuitive', 'Driven', 'Resilient'].map(t => (
            <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">{t}</span>
          ))}
        </div>
      </motion.div>

      {/* Blurred Premium Preview + Unlock Overlay */}
      <div className="relative">
        <div className="cosmic-card p-6 mb-4 opacity-50 blur-[3px] rounded-2xl">
          <div className="h-8 w-3/4 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={() => setShowUpsell(true)}
            className="pointer-events-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl animate-pulse flex items-center gap-3 hover:scale-105 transition"
          >
            <Lock size={20} />
            Unlock Your Full 2026 Destiny Now
          </button>
        </div>
      </div>

      {/* Upsell Modal - All Links Preserve Params */}
      <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
        <DialogContent className="bg-[#101025] border border-white/10 text-white w-[95%] max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Unlock Your Full Report</DialogTitle> {/* Hidden but accessible */}
          <div className="p-5 bg-gradient-to-br from-purple-900/50 to-transparent">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Intrigued? Unlock More...</h2>
              <button onClick={() => setShowUpsell(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-300 mt-1">Your 2026 cosmic blueprint is ready — claim it now!</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Vedic Report */}
            <Link href={buildCheckoutUrl('vedic', 499)}>
              <div className="border border-purple-500/30 bg-purple-900/10 rounded-xl p-5 flex justify-between items-center hover:bg-purple-900/20 transition-all cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-2xl">🔮</div>
                  <div>
                    <h3 className="font-bold text-lg">Full 2026 Vedic Report</h3>
                    <p className="text-xs text-gray-400 mt-1">Kundli • Transits • Career • Love • Health</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">₹499</div>
                  <div className="text-xs text-gray-500 line-through">₹799</div>
                </div>
              </div>
            </Link>

            {/* Bundle - Best Value */}
            <Link href={buildCheckoutUrl('bundle', 699)}>
              <div className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-900/30 to-amber-900/20 rounded-xl p-5 relative overflow-hidden cursor-pointer transform hover:scale-105 transition">
                <div className="absolute -top-2 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/30 flex items-center justify-center text-yellow-400 text-2xl">✨</div>
                    <div>
                      <h3 className="font-bold text-yellow-100 text-lg">Complete Bundle</h3>
                      <p className="text-xs text-yellow-400">Full Vedic Report + Tarot Reading</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">₹699</div>
                    <div className="text-xs text-gray-500 line-through">₹1098</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Tarot Only */}
            <Link href={buildCheckoutUrl('tarot', 299)}>
              <div className="border border-blue-500/30 bg-blue-900/10 rounded-xl p-5 flex justify-between items-center hover:bg-blue-900/20 transition cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl">🃏</div>
                  <div>
                    <h3 className="font-bold">Tarot Reading</h3>
                    <p className="text-xs text-gray-400">3-Card Spread + Deep Analysis</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">₹299</div>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
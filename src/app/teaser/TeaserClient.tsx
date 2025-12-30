'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Loader2, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TeaserResult() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name') || 'Friend';
  const dob = searchParams.get('dob') || '';
  const time = searchParams.get('time') || '';
  const place = searchParams.get('place') || '';
  const leadId = searchParams.get('leadId') || '';

  const { width, height } = useWindowSize();
  const [showUpsell, setShowUpsell] = useState(false);
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
        setTeaserData({
          sunSign: 'Aries (Mesh)',
          moonSign: 'Taurus (Vrishabha)',
          personality: 'You possess a dynamic blend of energy and stability. Your fiery spirit drives ambition, while grounded intuition provides balance. This cosmic profile hints at great potential in 2026... but the full truth is waiting to be unlocked.',
        });
      } finally {
        setLoading(false);
        setTimeout(() => setShowUpsell(true), 3000);
      }
    };

    generateTeaser();
  }, [dob, time, place, name]);

  const buildCheckoutUrl = (plan: string, price: number) => {
    const params = new URLSearchParams();
    params.set('plan', plan);
    params.set('price', price.toString());
    params.set('name', name);
    if (dob) params.set('dob', dob);
    if (time) params.set('time', time);
    if (place) params.set('place', place);
    if (leadId) params.set('leadId', leadId);

    return `/checkout?${params.toString()}`;
  };

  type SectionKey = 'intro' | 'personality' | 'transits' | 'career' | 'finance' | 'health' | 'love' | 'lucky' | 'kundli';

  const sections: { key: SectionKey; title: string }[] = [
    { key: 'intro', title: '2026 Overview' },
    { key: 'personality', title: 'Your Core Personality' },
    { key: 'transits', title: 'Planetary Transits' },
    { key: 'career', title: 'Career & Success' },
    { key: 'finance', title: 'Wealth & Prosperity' },
    { key: 'health', title: 'Health & Vitality' },
    { key: 'love', title: 'Love & Relationships' },
    { key: 'lucky', title: 'Lucky Elements' },
    { key: 'kundli', title: 'Birth Chart Insights' },
  ];

  type SectionState = { unlocked: boolean; loading: boolean; content: string };

  const [sectionState, setSectionState] = useState<Record<SectionKey, SectionState>>(() =>
    sections.reduce((acc, s) => {
      acc[s.key] = { unlocked: false, loading: false, content: '' };
      return acc;
    }, {} as Record<SectionKey, SectionState>)
  );

  const boilerplates: Record<SectionKey, string[]> = {
    intro: [
      `Namaste ${name}, 2026 holds powerful shifts for you. Jupiter brings expansion, but Saturn tests resilience...`,
      `${name}, the stars align for transformation. New doors open, yet patience is key...`,
    ],
    personality: [
      `Your ${teaserData.sunSign} fire meets ${teaserData.moonSign} depth, ${name}. Leadership comes naturally...`,
      `${name}, you blend courage and intuition. Hidden strengths are waiting to emerge...`,
    ],
    transits: [
      `Major transits activate your growth houses, ${name}. Opportunities arise mid-year...`,
      `Jupiter favors prosperity, but Rahu brings surprises, ${name}...`,
    ],
    career: [
      `Career growth is highlighted, ${name}. Promotions or new roles possible...`,
      `Your professional path gains momentum in 2026, ${name}...`,
    ],
    finance: [
      `Financial stability improves post-April, ${name}. Investments may pay off...`,
      `Wealth flow strengthens, but mindful spending advised, ${name}...`,
    ],
    health: [
      `Vitality remains strong with care, ${name}. Yoga and balance recommended...`,
      `Health supports your ambitions, but rest is essential, ${name}...`,
    ],
    love: [
      `Relationships deepen beautifully, ${name}. Romance blooms for singles...`,
      `Love life flourishes with communication, ${name}...`,
    ],
    lucky: [
      `Lucky colors: Red & Gold. Numbers: 1, 9. Dates: 5th, 14th...`,
      `Your cosmic luck peaks on Thursdays, ${name}...`,
    ],
    kundli: [
      `Your Kundli shows strong Lagna and beneficial yogas, ${name}...`,
      `Birth chart reveals hidden potential for success, ${name}...`,
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setSectionState(prev => {
        const newState = { ...prev };
        sections.forEach(s => {
          const options = boilerplates[s.key] || ['Unlock to reveal your destiny...'];
          newState[s.key].content = options[Math.floor(Math.random() * options.length)];
        });
        return newState;
      });
    }, 2000);
  }, [loading]);

  const unlockSection = async (sectionKey: SectionKey) => {
    setSectionState(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: true } }));
    try {
      const orderRes = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50, currency: 'INR' }),
      });
      const order = await orderRes.json();
      if (!order.id) throw new Error('Order failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Vedic Wisdom',
        description: `Unlock ${sectionKey} section`,
        order_id: order.id,
        handler: async (response: any) => {
          const aiRes = await fetch('/api/generate-section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section: sectionKey,
              name, dob, time, place,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });
          const data = await aiRes.json();
          setSectionState(prev => ({
            ...prev,
            [sectionKey]: { unlocked: true, loading: false, content: data.text },
          }));
        },
        theme: { color: '#f59e0b' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setSectionState(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: false } }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full" />
      <p className="text-yellow-400 mt-6 text-xl">Aligning your stars...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050511] p-3 sm:p-4 pb-24">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />

      {/* Tighter Header */}
      <div className="text-center mb-5 pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome, {name} 🙏</h1>
        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-widest font-medium">Your 2026 Cosmic Blueprint</p>
      </div>

      {/* Compressed Free Cosmic Profile */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4 sm:p-6 rounded-2xl mb-6 border-l-4 border-yellow-500 shadow-xl"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-500" /> Free Profile
          </h2>
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">LIFETIME ACCESS</span>
        </div>
        
        {/* Row Layout for Signs */}
        <div className="flex flex-row justify-around items-center gap-2 mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="text-center flex-1">
            <p className="text-gray-400 text-[10px] uppercase tracking-tighter mb-1 flex items-center justify-center gap-1">
              <Sun size={10} /> Sun Sign
            </p>
            <p className="text-base sm:text-2xl font-bold text-yellow-400 leading-tight truncate">{teaserData.sunSign}</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" /> 
          <div className="text-center flex-1">
            <p className="text-gray-400 text-[10px] uppercase tracking-tighter mb-1 flex items-center justify-center gap-1">
              <Moon size={10} /> Moon Sign
            </p>
            <p className="text-base sm:text-2xl font-bold text-blue-400 leading-tight truncate">{teaserData.moonSign}</p>
          </div>
        </div>
        
        <p className="text-gray-300 text-xs sm:text-base leading-relaxed text-center sm:text-left">{teaserData.personality}</p>
      </motion.div>

      {/* Premium Sections Area */}
      <h2 className="text-xl font-bold text-white mb-4 px-1">Unlock Your Full Destiny</h2>

      <div className="space-y-4">
        {sections.map((section) => {
          const state = sectionState[section.key];
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4 sm:p-6 rounded-2xl relative overflow-hidden border border-white/5"
            >
              <h3 className="text-lg font-bold text-white mb-3">{section.title}</h3>

              {state.loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="animate-spin text-yellow-500" size={28} />
                </div>
              ) : state.unlocked ? (
                <p className="text-sm sm:text-gray-300 leading-relaxed">{state.content}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-5">{state.content}</p>
                  <div className="relative">
                    <div className="blur-sm text-gray-600 text-xs select-none pointer-events-none">
                      <p>The complete personalized insight for this section is ready...</p>
                      <p>Unlock to reveal your full cosmic guidance for 2026.</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => unlockSection(section.key)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition active:scale-95"
                      >
                        <Lock size={14} />
                        Unlock for ₹50
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Fixed Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050511] via-[#050511]/90 to-transparent pointer-events-none z-40">
        <div className="pointer-events-auto max-w-sm mx-auto">
          <button
            onClick={() => setShowUpsell(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 px-6 rounded-full font-bold text-base shadow-2xl flex items-center justify-center gap-2 hover:scale-105 transition transform active:scale-95 border border-white/20"
          >
            <Lock size={18} />
            Unlock Full 2026 Destiny
            <Sparkles size={18} />
          </button>
        </div>
      </div>

      {/* Upsell Modal */}
      <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
        <DialogContent className="bg-[#101025] border border-white/10 text-white w-[95%] max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Unlock Your Full Report</DialogTitle>
          <div className="p-5 bg-gradient-to-br from-purple-900/50 to-transparent">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Intrigued? Unlock More...</h2>
              <button onClick={() => setShowUpsell(false)} className="text-gray-400 hover:text-white" />
            </div>
            <p className="text-xs text-gray-300 mt-1">Your 2026 cosmic blueprint is ready — claim it now!</p>
          </div>

          <div className="p-5 space-y-4">
            <Link href={buildCheckoutUrl('vedic', 299)}>
              <div className="border border-purple-500/30 bg-purple-900/10 rounded-xl p-4 flex justify-between items-center hover:bg-purple-900/20 transition-all cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl">🔮</div>
                  <div>
                    <h3 className="font-bold text-base">Full 2026 Vedic Report</h3>
                    <p className="text-[10px] text-gray-400">Kundli • Transits • Career • Love</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">₹299</div>
                  <div className="text-[10px] text-gray-500 line-through">₹599</div>
                </div>
              </div>
            </Link>

            <Link href={buildCheckoutUrl('bundle', 499)}>
              <div className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-900/30 to-amber-900/20 rounded-xl p-4 relative overflow-hidden cursor-pointer transform hover:scale-105 transition">
                <div className="absolute -top-1 right-3 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center text-yellow-400 text-xl">✨</div>
                    <div>
                      <h3 className="font-bold text-yellow-100 text-base">Complete Bundle</h3>
                      <p className="text-[10px] text-yellow-400">Full Vedic Report + Tarot Reading</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-400">₹499</div>
                    <div className="text-[10px] text-gray-500 line-through">₹1098</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={buildCheckoutUrl('tarot', 299)}>
              <div className="border border-blue-500/30 bg-blue-900/10 rounded-xl p-4 flex justify-between items-center hover:bg-blue-900/20 transition cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">🃏</div>
                  <div>
                    <h3 className="font-bold text-base">Tarot Reading</h3>
                    <p className="text-[10px] text-gray-400">3-Card Spread Analysis</p>
                  </div>
                </div>
                <div className="text-xl font-bold">₹299</div>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
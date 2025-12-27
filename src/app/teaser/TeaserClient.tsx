// app/teaser/page.tsx

'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Loader2 } from 'lucide-react';
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

  // Boilerplate teasers (random per load)
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
    // Simulate teaser load
    setTimeout(() => {
      setLoading(false);
      // Random boilerplates
      setSectionState(prev => {
        const newState = { ...prev };
        sections.forEach(s => {
          const options = boilerplates[s.key] || ['Unlock to reveal your destiny...'];
          newState[s.key].content = options[Math.floor(Math.random() * options.length)];
        });
        return newState;
      });
    }, 2000);
  }, []);

  const unlockSection = async (sectionKey: SectionKey) => {
    setSectionState(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: true } }));

    try {
      // Create ₹100 order
      const orderRes = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, currency: 'INR' }),
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
          // Call server to generate full section
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
    <div className="min-h-screen bg-[#050511] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full" />
      <p className="text-yellow-400 mt-6 text-xl">Aligning your stars...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050511] p-4 pb-24">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {name} 🙏</h1>
        <p className="text-gray-400">Your 2026 Cosmic Blueprint</p>
      </div>

      {/* Free Sun/Moon Teaser */}
      <motion.div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 rounded-2xl mb-8 border-l-4 border-yellow-500">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Free Cosmic Profile</h2>
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">FREE</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Sun Sign</p>
            <p className="text-2xl font-bold text-yellow-400">{teaserData.sunSign}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Moon Sign</p>
            <p className="text-2xl font-bold text-blue-400">{teaserData.moonSign}</p>
          </div>
        </div>
        <p className="text-gray-300">{teaserData.personality}</p>
      </motion.div>

      {/* Premium Sections */}
      <h2 className="text-2xl font-bold text-white mb-6">Unlock Your Full Destiny</h2>

      {sections.map((section) => {
        const state = sectionState[section.key];
        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 rounded-2xl mb-6 relative overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>

            {state.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-yellow-500" size={32} />
              </div>
            ) : state.unlocked ? (
              <p className="text-gray-300 leading-relaxed">{state.content}</p>
            ) : (
              <>
                <p className="text-gray-300 mb-6">{state.content}</p>
                <div className="relative">
                  <div className="blur-sm text-gray-500">
                    <p>The complete personalized insight for this section is ready...</p>
                    <p>Unlock to reveal your full cosmic guidance for 2026.</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => unlockSection(section.key)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl hover:scale-105 transition"
                    >
                      <Lock size={20} />
                      Unlock for ₹100
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        );
      })}
        {/* Upsell */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050511] to-transparent pointer-events-none">
        <div className="pointer-events-auto max-w-sm mx-auto">
          <button
            onClick={() => setShowUpsell(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition transform active:scale-95"
          >
            <Lock size={20} />
            Unlock Your Full 2026 Destiny Now
            <Sparkles size={20} />
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
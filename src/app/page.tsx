'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, Users, Sparkles, Quote, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const zodiacs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  return (
    <main className="flex flex-col min-h-screen bg-[#050511] text-white overflow-hidden font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-12 relative text-center min-h-[90vh]">
        
        {/* Animated Background Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        <motion.div 
          initial={{ y: -30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-block px-4 py-1.5 mb-6 border border-yellow-500/30 rounded-full bg-yellow-500/10 backdrop-blur-md">
            <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
              <Sparkles size={12} /> 2026 Predictions Now Live
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-6 tracking-tight">
            Is 2026 Your <br />
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
              Breakthrough Year?
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            The stars already know what’s coming — career highs, love surprises, or hidden challenges.
          </p>

          <p className="text-xl md:text-2xl font-semibold text-white mb-10">
            Get your <span className="text-yellow-400 border-b border-yellow-400/50 pb-0.5">FREE Vedic Teaser</span> now.
          </p>
        </motion.div>

        {/* Urgency Timer */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f0f1a]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 mb-10 w-full max-w-sm shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2 text-red-400 mb-3 text-xs font-bold uppercase tracking-widest">
            <Clock size={14} /> Limited Offer Ends In
          </div>
          <div className="flex justify-center gap-4">
            {['Hours', 'Minutes', 'Seconds'].map((label, idx) => {
              const val = Object.values(timeLeft)[idx];
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-16 h-14 bg-[#1a1a2e] rounded-lg flex items-center justify-center border border-white/5 shadow-inner">
                    <span className="text-2xl font-mono font-bold text-white">
                      {val.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase mt-1.5">{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main CTA Button */}
        <Link href="/input">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-black font-bold text-lg shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.5)] transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            Get My Free Teaser
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-4">
          <span>✨ No Payment Required</span>
          <span>⚡ Instant Results</span>
        </p>

        {/* Zodiac Strip */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl mt-16 overflow-hidden mask-linear-fade"
        >
          <div className="flex justify-center space-x-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             {zodiacs.map((z, i) => (
                <span key={i} className="text-3xl cursor-default select-none animate-pulse-slow">{z}</span>
             ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-[#050511] to-[#0a0a15]">
        <div className="px-6">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Why Thousands Trust Their 2026 to Us</h2>
          <div className="space-y-8 max-w-2xl mx-auto">
            {[
              { icon: <Sparkles size={32} className="text-yellow-400" />, title: 'Accurate & Personalized', desc: 'Based on your exact birth time & place — not generic horoscopes' },
              { icon: <Clock size={32} className="text-red-400" />, title: 'Perfect Timing', desc: 'Know exactly when opportunities or challenges arrive in 2026' },
              { icon: <Users size={32} className="text-green-400" />, title: 'Life-Changing Results', desc: 'Users report promotions, new love, and peace after following guidance' },
            ].map((b, i) => (
              <motion.div 
                initial={{ x: -50, opacity: 0 }} 
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-6 p-6 bg-[#101025] rounded-2xl border border-white/10 shadow-xl"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
                  {b.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xl text-white mb-2">{b.title}</h3>
                  <p className="text-gray-300">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-20 bg-[#050511]">
        <div className="px-6 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">Trusted by 10,000+ Seekers</h2>
            <p className="text-gray-400 text-sm md:text-base">See why people are choosing Vedic Wisdom to plan their 2026.</p>
          </div>
          
          {/* Stacked Rows Layout */}
          <div className="flex flex-col gap-6">
            {[
              { 
                quote: "The free teaser was so scarily accurate about my traits that I didn't even hesitate. This actually feels like it's reading my mind—not just generic AI fluff.", 
                author: "Arjun R., Mumbai",
                tag: "Verified Early Access" 
              },
              { 
                quote: "I’ve been following these Vedic insights since last year. Every major transit predicted for my career played out exactly as expected. 2026 pre-order was a no-brainer.", 
                author: "Priya V., Delhi",
                tag: "Repeat Customer" 
              },
              { 
                quote: "I was anxious about a job change in 2026. This report didn't just give me 'luck'—it gave me a month-by-month strategy. I finally feel in control of my roadmap.", 
                author: "Karthik S., Bangalore",
                tag: "Full Report User" 
              },
              { 
                quote: "The level of detail in the Kundli analysis is next level. Seeing how my specific birth time influences my 2026 wealth house was a total eye-opener.", 
                author: "Megha J., Pune",
                tag: "Verified Purchase" 
              },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 md:p-8 bg-gradient-to-r from-[#0f0f1a] to-[#141424] rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-700 to-orange-800 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {t.author[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-wider text-yellow-500 uppercase bg-yellow-500/10 px-2 py-1 rounded-full">
                        {t.tag}
                      </span>
                      <Quote size={16} className="text-gray-600 group-hover:text-yellow-500/40 transition-colors" />
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">"{t.quote}"</p>
                    <p className="text-xs font-semibold text-gray-500">— {t.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-gradient-to-b from-[#050511] to-[#0a0a0f] text-center border-t border-white/5">
        <div className="px-6">
          <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">Don’t leave 2026 to chance.</h3>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            50,000+ Indians have already discovered their path. Unlock your personalized Vedic timeline now.
          </p>
          
          <Link href="/input">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl shadow-[0_0_50px_-15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)] transition-all flex items-center gap-3 mx-auto"
            >
              Start My Free Teaser <Sparkles size={20} className="text-yellow-600" />
            </motion.button>
          </Link>
        </div>
      </section>

    </main>
  );
}
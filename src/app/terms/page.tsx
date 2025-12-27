"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, ShieldAlert, Ban } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-amber-500 hover:text-amber-400">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universe
          </Button>
        </Link>

        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-4">Terms & Conditions</h1>
          <p className="text-slate-500">Effective Date: December 25, 2025</p>
        </header>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-[#18182f]/50 p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Scale size={24} />
              <h2 className="text-2xl font-semibold">1. Nature of Service</h2>
            </div>
            <p className="leading-relaxed mb-4">
              Vedic Wisdom provides astrological insights, tarot readings, and horoscope reports. By using this service, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Our reports are generated using a combination of Vedic principles and Artificial Intelligence (AI).</li>
              <li>The service is provided for <strong className="text-amber-200">entertainment purposes only</strong>.</li>
              <li>Astrological readings are interpretations of cosmic patterns and do not constitute legal, financial, or medical advice.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-8 border-l-2 border-amber-500/30">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Ban size={24} />
              <h2 className="text-2xl font-semibold">2. No Refund Policy</h2>
            </div>
            <p className="leading-relaxed italic text-amber-100 bg-amber-500/10 p-4 rounded-lg">
              Important: Due to the instant nature of digital goods (PDF delivery via email), we do not offer refunds once the report has been generated or sent. By making a payment, you waive your right to a refund unless a double-transaction error occurs.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-8">
            <h2 className="text-2xl font-semibold text-amber-500 mb-4">3. Accuracy of Data</h2>
            <p className="leading-relaxed">
              The accuracy of your report depends entirely on the <strong className="text-slate-100">Date, Time, and Place of Birth</strong> you provide. Vedic Wisdom is not responsible for incorrect interpretations resulting from inaccurate user data.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-8 bg-red-500/5 rounded-2xl border border-red-500/20">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <ShieldAlert size={24} />
              <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            </div>
            <p className="leading-relaxed">
              Vedic Wisdom and its creators shall not be held liable for any decisions, actions, or events that occur in your life following the consumption of our reports. You use this information at your own risk.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-slate-800 text-center">
          <p>© 2026 Vedic Wisdom. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
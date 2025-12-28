"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-amber-500 hover:text-amber-400">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universe
          </Button>
        </Link>

        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-4">Shipping & Delivery</h1>
          <p className="text-slate-500">How your celestial insights reach you.</p>
        </header>

        <div className="space-y-8">
          <section className="bg-[#18182f]/50 p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Zap size={24} />
              <h2 className="text-2xl font-semibold">Digital Delivery</h2>
            </div>
            <p className="leading-relaxed text-slate-400">
              Vedic Wisdom provides digital products only. No physical shipping is required. All reports (PDF format) are delivered electronically to the email address provided during checkout.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0a15]">
              <Clock className="text-amber-500 mb-3" size={32} />
              <h3 className="text-lg font-bold mb-2">Delivery Timeline</h3>
              <p className="text-sm text-slate-500">Reports are typically generated and emailed within <strong className="text-amber-200">5-15 minutes</strong> of successful payment confirmation.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#0a0a15]">
              <Mail className="text-amber-500 mb-3" size={32} />
              <h3 className="text-lg font-bold mb-2">Service Cost</h3>
              <p className="text-sm text-slate-500">Since delivery is purely electronic, there are <strong className="text-amber-200">zero shipping charges</strong> applied to any order.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
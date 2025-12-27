"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-amber-500 hover:text-amber-400">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universe
          </Button>
        </Link>

        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Your privacy is as sacred as the stars.</p>
        </header>

        <div className="space-y-10">
          <section className="p-8 bg-[#18182f]/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Database size={24} />
              <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            </div>
            <p className="mb-4">To generate your horoscope, we process:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-[#0a0a15] p-3 rounded border border-slate-800 text-slate-400">Email Address (For Delivery)</li>
              <li className="bg-[#0a0a15] p-3 rounded border border-slate-800 text-slate-400">Birth Date & Time</li>
              <li className="bg-[#0a0a15] p-3 rounded border border-slate-800 text-slate-400">Birth Location (Coordinates)</li>
              <li className="bg-[#0a0a15] p-3 rounded border border-slate-800 text-slate-400">Payment Status</li>
            </ul>
          </section>

          <section className="p-8">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Eye size={24} />
              <h2 className="text-2xl font-semibold">2. Third-Party Data Sharing</h2>
            </div>
            <p className="leading-relaxed mb-4">
              We never sell your data. However, we share necessary details with these trusted partners to fulfill your order:
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left bg-[#18182f]/50">
                <thead className="bg-[#1e1e38] text-amber-500">
                  <tr>
                    <th className="p-4">Partner</th>
                    <th className="p-4">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-4 font-semibold">OpenAI</td>
                    <td className="p-4">Personalized Interpretation Logic</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Razorpay</td>
                    <td className="p-4">Secure Payment Processing</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Resend</td>
                    <td className="p-4">Email PDF Delivery</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="p-8 bg-amber-500/5 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Lock size={24} />
              <h2 className="text-2xl font-semibold">3. Data Security</h2>
            </div>
            <p className="leading-relaxed">
              We use SSL encryption and follow industry standard protocols (DPDP 2023 compliance) to protect your birth details. Once your report is generated, your sensitive birth data is archived and eventually deleted from our active processing logs.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-slate-800 text-center text-slate-600">
          <p>Questions? Contact us at: <span className="text-amber-500/80 underline cursor-pointer">support@yourdomain.com</span></p>
        </footer>
      </div>
    </div>
  );
}
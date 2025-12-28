"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-amber-500 hover:text-amber-400">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universe
          </Button>
        </Link>

        <header className="mb-12 border-b border-slate-800 pb-8 text-center">
          <h1 className="text-4xl font-bold text-amber-500 mb-4">Contact Us</h1>
          <p className="text-slate-500">Need help with your report? Reach out to our team.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#18182f]/50 rounded-2xl border border-slate-800 text-center">
              <Mail className="mx-auto text-amber-500 mb-4" size={32} />
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-slate-400 break-words whitespace-normal">
              <a href="mailto:support@your2026horoscope.com" className="underline hover:text-white">support@your2026horoscope.com</a>
            </p>
          </div>
          
          <div className="p-8 bg-[#18182f]/50 rounded-2xl border border-slate-800 text-center">
            <MapPin className="mx-auto text-amber-500 mb-4" size={32} />
            <h3 className="font-bold mb-2">Location</h3>
            <p className="text-sm text-slate-400">Delhi, India</p>
          </div>

          <div className="p-8 bg-[#18182f]/50 rounded-2xl border border-slate-800 text-center">
            <MessageSquare className="mx-auto text-amber-500 mb-4" size={32} />
            <h3 className="font-bold mb-2">Response Time</h3>
            <p className="text-sm text-slate-400">Within 24 Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { CreditCard, Wallet, Banknote, ShieldCheck, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract all params
  const price = searchParams.get('price') || '499';
  const plan = searchParams.get('plan') || 'vedic';
  const name = searchParams.get('name') || 'User';
  const leadId = searchParams.get('leadId') || '';
  const dob = searchParams.get('dob') || '';
  const time = searchParams.get('time') || '';
  const place = searchParams.get('place') || '';

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod] = useState('upi'); // Visual only — Razorpay handles actual method

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handlePayment = async () => {
    if (!keyId) {
      alert('Payment gateway not configured. Contact support.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order on server
      const orderRes = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(price), currency: 'INR' }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.text();
        throw new Error(err || 'Failed to create order');
      }

      const order = await orderRes.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Vedic Wisdom 2026',
        description: `Unlock Your ${plan.toUpperCase()} Report`,
        order_id: order.id,
        image: '/logo.png', // Optional: add your logo
        handler: function (response: any) {
          // Capture ALL required Razorpay response fields
          const {
            razorpay_payment_id: payment_id,
            razorpay_order_id: order_id,
            razorpay_signature: signature,
          } = response;

          // Build success URL with EVERYTHING needed
          const successParams = new URLSearchParams({
            payment_id,
            order_id,
            razorpay_signature: signature,
            name,
            plan,
            leadId,
            ...(dob && { dob }),
            ...(time && { time }),
            ...(place && { place }),
          });

          router.push(`/success?${successParams.toString()}`);
        },
        prefill: {
          name,
        },
        theme: {
          color: '#f59e0b',
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050511] p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-[family-name:var(--font-playfair)] mb-8 text-white text-center">
        Secure Checkout
      </h1>

      {/* Order Summary */}
      <div className="cosmic-card w-full max-w-md p-6 mb-8 bg-[#101025] border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-400">Your Report</p>
            <p className="text-xl font-bold text-white capitalize">
              {plan === 'bundle' ? 'Complete Bundle' : plan === 'tarot' ? 'Tarot Reading' : 'Full 2026 Vedic Report'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Amount</p>
            <p className="text-3xl font-bold text-yellow-500">₹{price}</p>
          </div>
        </div>
      </div>

      {/* Payment Method Visuals (Razorpay handles actual selection) */}
      <p className="text-sm text-gray-400 mb-4">Powered by Razorpay • Choose any method</p>
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
        {[
          { icon: <Wallet size={28} />, label: 'UPI' },
          { icon: <CreditCard size={28} />, label: 'Cards' },
          { icon: <Banknote size={28} />, label: 'Net Banking' },
          { icon: <Wallet size={28} />, label: 'Wallets' },
        ].map((m, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-[#101025] border border-gray-700 flex flex-col items-center gap-3 text-gray-300"
          >
            {m.icon}
            <span className="font-medium">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="flex gap-6 text-green-400 text-sm mb-8">
        <span className="flex items-center gap-1"><ShieldCheck size={16} /> 100% Secure</span>
        <span className="flex items-center gap-1"><ShieldCheck size={16} /> SSL Encrypted</span>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full max-w-md bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 py-5 rounded-2xl text-xl font-bold text-black shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-70"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Processing...
          </>
        ) : (
          <>
            Pay ₹{price} Securely
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-6 text-center max-w-md">
        Instant digital delivery • No refunds after report generation
      </p>
    </div>
  );
}

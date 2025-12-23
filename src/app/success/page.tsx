// app/success/page.tsx

'use client';
import { useSearchParams, redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const signature = searchParams.get('razorpay_signature');

  const name = searchParams.get('name') || 'Friend';
  const plan = searchParams.get('plan') || 'vedic';
  const dob = searchParams.get('dob') || '';
  const time = searchParams.get('time') || '';
  const place = searchParams.get('place') || '';
  const leadId = searchParams.get('leadId') || '';

  const isTarotPlan = plan === 'tarot' || plan === 'bundle';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'input' | 'tarot' | 'sending' | 'sent' | 'error'>('input');

  // Tarot state
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!paymentId || !orderId || !signature) {
      redirect('/');
    }

    if (isTarotPlan) {
      setStatus('tarot');
    }
  }, [paymentId, orderId, signature, isTarotPlan]);

  const generateTarot = async () => {
    if (!question.trim()) {
      alert('Please ask a question!');
      return;
    }
    setGenerating(true);

    try {
      const res = await fetch('/api/generate-tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, name }),
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setCards(data.cards);
      setAnalysis(data.analysis);
    } catch (err) {
      setCards(['The Star', 'The Sun', 'The World']);
      setAnalysis('The universe is aligning beautiful things for you in 2026. Trust the journey.');
    } finally {
      setGenerating(false);
    }
  };

  const sendReport = async () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    setStatus('sending');

    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          dob,
          time,
          place,
          plan,
          paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          leadId,
          tarot: isTarotPlan ? { question, cards, analysis } : null,
        }),
      });

      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 text-white">
      {/* Email Input */}
      {status === 'input' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-6">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">Enter your email to receive your report</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full bg-[#101025] border border-gray-700 rounded-xl p-4 mb-6"
          />

          <button onClick={sendReport} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-5 rounded-xl font-bold text-black">
            Send My Report
          </button>
        </motion.div>
      )}

      {/* Tarot UI */}
      {status === 'tarot' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">🔮 Your Tarot Reading</h2>
          <p className="text-gray-400 mb-8">Ask anything about 2026</p>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does 2026 hold for my career?"
            className="w-full bg-[#101025] border border-purple-500/50 rounded-xl p-4 mb-6"
          />

          {cards.length === 0 && (
            <button
              onClick={generateTarot}
              disabled={generating || !question.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3"
            >
              {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
              {generating ? 'Drawing...' : 'Draw 3 Cards'}
            </button>
          )}

          {cards.length > 0 && (
            <div className="mt-10">
              <div className="flex justify-center gap-6 flex-wrap">
                {cards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="w-32 h-48 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl flex flex-col items-center justify-center p-4 border border-purple-500/50"
                  >
                    <Sparkles size={20} className="text-yellow-400 mb-2" />
                    <p className="text-sm font-bold text-center">{card}</p>
                    <p className="text-xs text-purple-300 mt-2">{i === 0 ? 'Past' : i === 1 ? 'Present' : 'Future'}</p>
                  </motion.div>
                ))}
              </div>

              {analysis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-[#18182f] rounded-2xl border border-purple-500/30">
                  <p className="text-gray-300 leading-relaxed">{analysis}</p>
                </motion.div>
              )}

              <button
                onClick={() => (plan === 'bundle' ? setStatus('input') : sendReport())}
                className="mt-10 w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-5 rounded-xl font-bold text-black text-lg"
              >
                {plan === 'bundle' ? 'Next: Get Vedic Report' : 'Send My Tarot Report'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Sending / Sent / Error */}
      {status === 'sending' && (
        <div className="text-center">
          <Loader2 className="animate-spin text-yellow-500 mb-6" size={60} />
          <h2 className="text-2xl font-bold">Preparing Your Report...</h2>
        </div>
      )}

      {status === 'sent' && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Report Sent!</h1>
          <p className="text-gray-300">Check your inbox: <span className="text-white font-bold">{email}</span></p>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <AlertCircle size={60} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <button onClick={() => setStatus(isTarotPlan ? 'tarot' : 'input')} className="text-yellow-500 underline">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
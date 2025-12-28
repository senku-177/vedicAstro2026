// app/api/generate-section/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import crypto from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, name, dob, time, place, paymentId, orderId, signature } = body;

    // Optional: Verify payment signature (recommended)
    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generated !== signature) {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 });
    }

    const prompt = `You are a Vedic astrologer. Generate a detailed, positive, personalized 200-250 word section on "${section}" for 2026.
    Use birth details: Name: ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}.
    Be honest about challenges but end positively. English only.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });

    const text = completion.choices[0]?.message?.content || 'Your cosmic guidance is ready...';

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: 'A beautiful journey awaits you in 2026.' });
  }
}
import React from 'react';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { AstrologyReport } from '@/lib/pdf';
import OpenAI from 'openai';
import { updateLeadStatus, createLeadInSheet } from '@/lib/google-sheets';

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SAFE FALLBACK DATA (Used if OpenAI fails/Quota exceeded so user still gets a PDF)
// Updated to English, matching the 10 sections with ~200-300 words each
const FALLBACK_DATA = {
  intro: "Namaste! Welcome to your personalized Vedic Horoscope for 2026. Based on your birth details, this year promises a blend of challenges and opportunities that will shape your destiny. With Jupiter's transit bringing growth and Saturn testing your resilience, 2026 is a year of transformation and achievement. Expect breakthroughs in personal and professional spheres, guided by the stars. Embrace the cosmic energies with positivity, and watch as doors open to abundance and fulfillment. This report is tailored to empower you with insights for a prosperous year ahead.",
  personality: "Your personality is a unique fusion of strength and intuition. As an Aries Sun, you possess natural leadership qualities, driven by passion and courage. Your Taurus Moon adds a layer of stability and determination, making you reliable and grounded in pursuits. With Leo Rising, you exude charisma and confidence, often inspiring those around you. Traits like ambition, resilience, and creativity define you, but watch for occasional stubbornness. Harness your inner fire to overcome obstacles, and your empathetic side will strengthen relationships. Overall, you are a dynamic individual destined for success through balanced action and reflection.",
  transits: "In 2026, planetary transits play a pivotal role in your journey. Jupiter enters Taurus in April, enhancing your financial prospects and bringing wisdom in decision-making. Saturn in Pisces encourages discipline in spiritual and emotional matters, potentially leading to inner growth. Rahu and Ketu's nodes influence unexpected changes, with Rahu in Aquarius sparking innovation in social circles. Mars energizes your career house mid-year, while Venus graces relationships in the latter half. Eclipses in March and September highlight key turning points. Navigate these influences with awareness, as they align to support your long-term goals and personal evolution.",
  career: "Career-wise, 2026 is a year of steady advancement and new horizons. Early months focus on consolidation, with opportunities for skill enhancement. Jupiter's shift in April opens doors to promotions or job changes, especially in creative or leadership roles. Saturn demands hard work, rewarding persistence with recognition by mid-year. Avoid impulsive decisions during Mercury retrogrades. Networking peaks in July-September, potentially leading to collaborations. Challenges in Q4 test adaptability, but overall, expect growth in income and status. Stay focused on goals, and leverage your natural drive for professional success.",
  finance: "Financial stability strengthens in 2026, with prudent planning yielding rewards. Jupiter's transit boosts earnings from investments or unexpected sources post-April. Early year calls for budgeting to handle minor expenses influenced by Rahu. Saturn teaches financial discipline, encouraging savings and long-term planning. Favorable periods for wealth accumulation are May-August. Avoid speculative risks during eclipses. By year-end, improved cash flow supports major purchases. Focus on diversified income streams, and your strategic approach will lead to prosperity and security.",
  health: "Health remains robust in 2026, with emphasis on balance and prevention. Saturn's influence may bring minor fatigue, so prioritize rest and nutrition. Jupiter enhances vitality mid-year, ideal for starting wellness routines like yoga. Watch for stress-related issues in Q2—meditation helps. Favorable transits support recovery from any ailments. Maintain a balanced diet and exercise to boost immunity. Overall, proactive care ensures a vibrant year, allowing you to pursue ambitions with full energy.",
  love: "Love and relationships flourish in 2026, with deeper connections forming. Venus transits foster romance, especially for singles in May-June. Couples experience harmony, though communication is key during retrogrades. Rahu may introduce exciting encounters, but discernment is advised. Family bonds strengthen post-September. For marriage prospects, mid-year is auspicious. Embrace vulnerability to nurture ties, and your year will be filled with affection and mutual growth.",
  lucky: "Lucky Dates: 5th, 14th, 23rd of each month. Lucky Numbers: 1, 9, 18. Lucky Colors: Red for energy, Gold for prosperity. Directions: East for new beginnings. Gemstones: Ruby for strength. These elements align with your chart to amplify positive energies throughout 2026.",
  kundli: "Your Kundli shows Aries Lagna with Sun in the 1st house, indicating strong self-identity and leadership. Moon in Taurus (2nd house) supports financial stability. Key planets: Jupiter in 9th for luck, Saturn in 12th for introspection. Overall, a balanced chart with emphasis on action and growth.",
  conclusion: "As 2026 unfolds, trust in the cosmic plan tailored for you. With determination and positivity, you'll navigate challenges and celebrate victories. Remember, the stars guide, but your actions shape destiny. Wishing you a year of abundance and joy. For more insights, explore our Tarot add-on.",
  tarot: [], // Empty for Vedic-only; add if bundle
  isTarot: false,
  tarotQuestion: "",
  tarotAnalysis: "",
  tarotCards: []
};

export async function POST(req: Request) {
  // Capture leadId to link this payment to the initial form fill
    const body = await req.json();
    const {
      email, name, dob, time, place, plan,
      paymentId, razorpay_order_id, razorpay_signature,
      leadId, tarot // { question, cards: string[], analysis: string }
    } = body
    
    if (!razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }

    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Payment signature mismatch — possible tampering');
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  
  let aiErrorLog = '';

  try {
    // 1. TRACKING: Update Google Sheet to "PAID" immediately
    // We try to find the existing lead. If not found, we create a new row.
    const leadUpdated = await updateLeadStatus(leadId, { 
        status: 'PAID', 
        paymentId: paymentId || 'N/A', 
        plan, 
        email, // Ensure email is captured if it wasn't before
        amount: plan?.includes('bundle') ? '699' : '499' 
    });

    if (!leadUpdated) {
        // Fallback: If tracking failed earlier or leadId is missing, create a new row now
        await createLeadInSheet({ 
            leadId: leadId || `fallback-${Date.now()}`, 
            name, 
            email, 
            dob, 
            time, 
            plan, 
            status: 'PAID', 
            paymentId 
        });
    }
    
    let reportData = { ...FALLBACK_DATA };
    // Determine whether tarot is included — either via selected plan or provided tarot payload
    const isTarot = plan === 'tarot' || plan === 'bundle' || (!!tarot)

    // 2. AI GENERATION: Create the content
    try {
        const systemPrompt = `You are an expert Vedic astrologer writing a positive, uplifting, personalized 2026 yearly horoscope report for an Indian user. 
        Use only these 10 exact sections in this exact order. Do not add any extra sections. 
        Make the language warm, empowering, easy to understand, and full of hope. 
        Always use the birth details I give you to make it feel 100% personal. 
        Keep each section 500 words appx, Try adding personalised details to each section and be real with any challenges user might face in future. 
        Use English language only - no Hindi text in the report content except for Vedic terms like Rashi, Guru, Shani. 
        End with a strong positive note.
        IMPORTANT: Output ONLY valid JSON.`;

        const userPrompt = `
          Birth details: Name: ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}.
          Generate JSON with keys: 
          "intro", "personality", "transits", "career", "finance", "health", "love", "lucky", "kundli", "conclusion".
        `;

        

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;

    console.log("tarot is here",tarot, isTarot, tarot.cards);
    if (isTarot && tarot) {
      reportData.isTarot = true;
      reportData.tarotQuestion = tarot.question;
      reportData.tarotAnalysis = tarot.analysis;
      reportData.tarotCards = tarot.cards; // array of strings
    }

    // 5. CRITICAL: String Normalization (Fixes "Objects are not valid as React child")
    const ensureString = (v: any): string => {
      if (v === null || v === undefined) return "";
      if (typeof v === 'string') return v;
      if (typeof v === 'object') {
        // Specifically fix the { content: "..." } issue
        if (v.content) return ensureString(v.content);
        if (v.text) return ensureString(v.text);
        try { return JSON.stringify(v); } catch { return ""; }
      }
      return String(v);
    };

    const keysToFix = ['intro','personality','transits','career','finance','health','love','lucky','kundli','conclusion', 'tarotQuestion', 'tarotAnalysis'];
    keysToFix.forEach(key => {
      //@ts-ignore
      reportData[key] = ensureString(reportData[key]);
    });
        if (content) {
            const parsed = JSON.parse(content);
            reportData = { ...reportData, ...parsed, isTarot: isTarot };
        }
    } catch (aiError: any) {
        console.error("OpenAI Failed (Using Fallback):", aiError.message);
        aiErrorLog = `AI Error: ${aiError.message}`;
        
        // Log the partial failure to sheets but CONTINUING flow
        await updateLeadStatus(leadId, { error: aiErrorLog });
    }

    // 3. PDF GENERATION
    console.log('report data : ' , reportData);
    const pdfBuffer = await renderToBuffer(<AstrologyReport name={name} data={reportData} />);

    // 4. EMAIL DELIVERY
    const { error } = await resend.emails.send({
      from: 'Vedic Wisdom <onboarding@resend.dev>', // CHANGE THIS after verifying domain
      to: email, // Can only be YOUR email until verified
      subject: `Your 2026 Vedic Horoscope is Ready, ${name}! ✨`,
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a;">
            <h1 style="color: #d97706;">Namaste, ${name} 🙏</h1>
            <p>Your personalized Vedic forecast for 2026 is attached.</p>
            <p>We have analyzed your <strong>Janma Kundli</strong> to bring you insights on career, health, and love.</p>
            <br/>
            <p>May the stars guide you.</p>
            <p style="font-size: 12px; color: #666;">Vedic Wisdom Team</p>
        </div>
      `,
      attachments: [{ filename: `Vedic_Report_2026_${name}.pdf`, content: pdfBuffer }],
    });

    if (error) throw new Error(error.message);

    // 5. SUCCESS: Update Sheet to FULFILLED
    const finalStatus = aiErrorLog ? 'SENT_WITH_FALLBACK' : 'FULFILLED';
    await updateLeadStatus(leadId, { status: finalStatus });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Critical Processing Error:", error);
    
    // Log fatal error to sheet so you know to refund or retry manually
    await updateLeadStatus(leadId, { status: 'FAILED', error: error.message });
    
    // Return 500 to frontend
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
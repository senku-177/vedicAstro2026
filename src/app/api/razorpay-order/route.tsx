import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Use the private Key Secret here - it NEVER leaves the server
// Note: NEXT_PUBLIC_RAZORPAY_KEY_ID is also used here as key_id
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();
    
    // Create an Order on the Razorpay server
    const options = {
      // Razorpay expects the amount in the smallest currency unit (paise)
      amount: amount * 100, 
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      // Optional: zero-down time for quicker testing
      payment_capture: 1 
    };

    console.log(`Creating order for ${amount} ${currency}`);

    const order = await razorpay.orders.create(options);
    
    // Send the Order ID, Amount, and Currency back to the client
    return NextResponse.json({
      id: order.id,
      amount: order.amount, // This is the amount in paise
      currency: order.currency,
    });

  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    // In production, check error type, but for now return generic error
    return NextResponse.json(
        { error: 'Failed to create Razorpay order.' }, 
        { status: 500 }
    );
  }
}
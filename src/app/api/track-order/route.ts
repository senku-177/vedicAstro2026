import { NextResponse } from 'next/server';
// Ensure this path is correct based on your folder structure
import { createLeadInSheet } from '@/lib/google-sheets'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fire and forget - tracking in background
    createLeadInSheet(body).catch(e => console.error("Tracking background error", e));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


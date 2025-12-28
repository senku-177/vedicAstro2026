// app/api/generate-tarot/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TAROT_DECK = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',
  'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands',
  'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups',
  'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords',
  'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles',
  'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands',
  'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups',
  'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords',
  'Page of Pentacles', 'Knight of Pentacles', 'Queen of Pentacles', 'King of Pentacles',
];
export async function POST(req: Request) {
  try {
    const { question, name } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question required' }, { status: 400 });
    }

    // Draw 3 random cards
    const shuffled = TAROT_DECK.sort(() => 0.5 - Math.random());
    const cards = shuffled.slice(0, 3);

    // Generate analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a mystical Tarot reader. Provide a warm, positive, 250-word analysis using:
Past: ${cards[0]}
Present: ${cards[1]}
Future: ${cards[2]}
Tie to the question and 2026. Be hopeful.`,
        },
        { role: 'user', content: `Question: "${question}" Name: ${name}` },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const analysis = completion.choices[0]?.message?.content || 'Positive growth and harmony ahead in 2026.';

    return NextResponse.json({ cards, analysis });
  } catch (error) {
    console.error('Tarot error:', error);
    return NextResponse.json({
      cards: ['The Star', 'The Sun', 'The World'],
      analysis: 'The universe is aligning for your success in 2026.',
    });
  }
}
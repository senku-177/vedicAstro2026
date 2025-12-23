import { NextResponse } from 'next/server';

// Standard Western (Tropical) Sun Sign Dates
const WESTERN_SUN_SIGNS = [
  { name: 'Capricorn', month: 1, day: 20 },
  { name: 'Aquarius', month: 2, day: 19 },
  { name: 'Pisces', month: 3, day: 20 },
  { name: 'Aries', month: 4, day: 20 },
  { name: 'Taurus', month: 5, day: 21 },
  { name: 'Gemini', month: 6, day: 21 },
  { name: 'Cancer', month: 7, day: 22 },
  { name: 'Leo', month: 8, day: 23 },
  { name: 'Virgo', month: 9, day: 23 },
  { name: 'Libra', month: 10, day: 23 },
  { name: 'Scorpio', month: 11, day: 22 },
  { name: 'Sagittarius', month: 12, day: 21 },
];

const MOON_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Calculates the Sun Sign based on Western (Tropical) dates
 */
function getSunSign(dob: string): string {
  if (!dob) return 'Aries';
  const [year, month, day] = dob.split('-').map(Number);

  const sign = WESTERN_SUN_SIGNS.find(s => {
    if (month === s.month) return day <= s.day;
    const nextMonth = month === 12 ? 1 : month + 1;
    if (nextMonth === s.month) return day > WESTERN_SUN_SIGNS[month - 1].day;
    return false;
  });

  if (month === 12 && day >= 22) return 'Capricorn';
  return sign ? sign.name : 'Aries';
}

/**
 * Approximates Moon Sign using a lunar reference point (Reference: Jan 1, 1970 was a Libra moon)
 * The Moon spends ~2.27 days in each sign.
 */
function getMoonSign(dob: string): string {
  if (!dob) return 'Cancer';
  const birthDate = new Date(dob);
  const refDate = new Date('1970-01-01'); // Reference epoch
  
  // Calculate difference in days
  const diffTime = Math.abs(birthDate.getTime() - refDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // The lunar cycle through all 12 signs is ~27.32 days
  // 27.32 / 12 = ~2.27 days per sign
  const cyclePosition = (diffDays % 27.32);
  const index = Math.floor((cyclePosition / 27.32) * 12);
  
  return MOON_SIGNS[index] || 'Leo';
}

const SIGN_TRAITS: Record<string, string> = {
  'Aries': 'bold leadership', 'Taurus': 'grounded strength', 'Gemini': 'social wit',
  'Cancer': 'emotional depth', 'Leo': 'magnetic charm', 'Virgo': 'analytical brilliance',
  'Libra': 'harmonious grace', 'Scorpio': 'intense intuition', 'Sagittarius': 'adventurous spirit',
  'Capricorn': 'ambitious drive', 'Aquarius': 'visionary ideas', 'Pisces': 'creative empathy'
};

function getDynamicTeaser(sunSign: string, moonSign: string, dob: string): string {
  const sunTrait = SIGN_TRAITS[sunSign] || 'unique energy';
  const moonTrait = SIGN_TRAITS[moonSign] || 'inner instincts';
  
  const day = parseInt(dob.split('-')[2]);

  const storyBases = [
    `You carry a rare cosmic blueprint: the ${sunTrait} of a ${sunSign} Sun combined with the ${moonTrait} of a ${moonSign} Moon. This makes your personality both powerful and deeply intuitive.`,
    `While your ${sunSign} Sun gives you ${sunTrait}, it is your ${moonSign} Moon that governs your secret desires. In 2026, these two forces will finally align for a major breakthrough.`,
    `As a ${sunSign} with a ${moonSign} Moon, you often feel a tug-of-war between your logic and your heart. 2026 is the year this internal conflict resolves into massive external success.`
  ];

  const cliffhangers = [
    `However, the 'Saturn Return' energy in your chart suggests a major relationship test is coming this July. Will you be ready?`,
    `I see a golden window for wealth between March and April—but only if you follow the specific lunar guidance in your full report.`,
    `A karmic debt from 2019 is finally being cleared this year, opening a door you thought was closed forever.`,
    `Your Moon sign suggests an unexpected travel opportunity in late 2026 that will redefine your career path.`
  ];

  const base = storyBases[day % storyBases.length];
  const cliff = cliffhangers[day % cliffhangers.length];

  return `${base} ${cliff}`;
}

export async function POST(req: Request) {
  try {
    const { dob } = await req.json();

    const sunSign = getSunSign(dob);
    const moonSign = getMoonSign(dob);
    const personality = getDynamicTeaser(sunSign, moonSign, dob);

    return NextResponse.json({
      sunSign,
      moonSign,
      personality,
    });
  } catch (error) {
    return NextResponse.json({
      sunSign: 'Aries',
      moonSign: 'Leo',
      personality: 'Your cosmic journey for 2026 is written in the stars. Your unique combination of Sun and Moon signs points toward a year of unprecedented growth.',
    });
  }
}
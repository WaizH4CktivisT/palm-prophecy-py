import { UserInfo, HandAnalysis, PalmReading, AIReadingRequest } from '@/types/palmistry';

// For demo purposes, we'll use a sophisticated pattern-based system
// In production, you'd integrate with OpenAI, Anthropic, or other AI APIs

const MYANMAR_PALMISTRY_KNOWLEDGE = {
  lifeLine: {
    long: {
      deep: ["အသက်ရှည်ကြီးရင့်မယ့် လက္ခဏာရှိတယ်", "ကျန်းမာရေးကောင်းမွန်ပြီး စွမ်းအင်ပြည့်ဝမယ်"],
      medium: ["သာမန်ထက် ပိုပြီး ကျန်းမာသန်စွမ်းမယ်", "ဘဝမှာ တည်ငြိမ်မှုရှိမယ်"],
      shallow: ["ကျန်းမာရေး ဂရုစိုက်ရမယ်", "စွမ်းအားအချို့ နည်းနိုင်တယ်"]
    },
    medium: {
      deep: ["အလယ်အလတ် အသက်တာရှိမယ်", "ကျန်းမာရေးမှာ ဂရုစိုက်ရမယ်"],
      medium: ["ပုံမှန် ကျန်းမာရေးရှိမယ်", "အလုပ်ခွန်အား ကောင်းမယ်"],
      shallow: ["ကိုယ့်ကိုကိုယ် စောင့်ရှောက်ရမယ်", "အနားယူခြင်း လိုအပ်တယ်"]
    },
    short: {
      deep: ["အသက်တို ဒါပေမယ့် ဘဝပြည့်စုံမယ်", "အရည်အချင်းရှိတဲ့ ဘဝရှိမယ်"],
      medium: ["လျှင်မြန်စွာ အောင်မြင်မယ်", "အချိန်ကို အကောင်းဆုံး အသုံးပြုမယ်"],
      shallow: ["အစောပိုင်း အခက်အခဲရှိမယ်", "ကြိုးစားမှုနဲ့ ကျော်လွှားမယ်"]
    }
  },
  heartLine: {
    business: ["လုပ်ငန်းခွင်မှာ စိတ်ရင်းမှန်တဲ့ လူတွေနဲ့ တွေ့မယ်", "စီးပွားရေး မိတ်ဖက်တွေနဲ့ ယုံကြည်မှုရှိမယ်"],
    education: ["ပညာရေးလမ်းမှာ ကူညီသူတွေ ရရှိမယ်", "ဆရာ၊ တပည့် ဆက်ဆံရေး ကောင်းမယ်"],
    health: ["စိတ်ကျန်းမာရေး ကောင်းမယ်", "စိတ်ဖိစီးမှု နည်းမယ်"],
    love: ["စစ်မှန်တဲ့ အချစ်တွေ့ရမယ်", "မိသားစု ခင်မင်ရင်းနှီးမှုရှိမယ်"]
  },
  headLine: {
    business: ["စီးပွားရေး ဆုံးဖြတ်ချက်တွေ ကောင်းမယ်", "လုပ်ငန်းခွင်မှာ ခေါင်းဆောင်မှု ရှိမယ်"],
    education: ["သင်ယူနိုင်စွမ်း မြင့်မားမယ်", "ပညာရေးမှာ ထူးခြားတဲ့ အောင်မြင်မှုရှိမယ်"],
    health: ["ကျန်းမာရေး ဆုံးဖြတ်ချက်တွေ ပညာရှိမယ်", "ကိုယ်ခန္ធာ နားလည်မှုရှိမယ်"],
    love: ["အချစ်ရေးမှာ ပညာရှိရှိ ဆုံးဖြတ်မယ်", "စိတ်ခံစားမှု ကောင်းစွာ ထိန်းချုပ်မယ်"]
  },
  fateLine: {
    strong: ["ကံကြမ္မာ အင်အားကြီးတယ်", "ကြိုးစားတိုင်း အောင်မြင်မယ်"],
    weak: ["အနည်းငယ် ကံကြမ္မာ အားနည်းတယ်", "ကြိုးစားမှုနဲ့ အောင်မြင်နိုင်မယ်"],
    absent: ["ကိုယ့်ကံကို ကိုယ် ဖန်တီးရမယ်", "လုပ်ငန်းခွန်အားနဲ့ အောင်မြင်မယ်"]
  }
};

const LUCKY_ELEMENTS = {
  numbers: [1, 3, 7, 8, 9, 11, 13, 21, 28, 35],
  colors: ['ရွှေရောင်', 'နီရောင်', 'ခရမ်းရောင်', 'အပြာရောင်', 'အစိမ်းရောင်'],
  days: ['တနင်္လာနေ့', 'အင်္ဂါနေ့', 'ဗုဒ္ဓဟူးနေ့', 'ကြာသပတေးနေ့', 'သောကြာနေ့']
};

export const generateAIPalmReading = async (request: AIReadingRequest): Promise<PalmReading> => {
  const { userInfo, handAnalysis } = request;
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  
  // Generate contextual reading based on multiple factors
  const reading = generateContextualReading(userInfo, handAnalysis);
  
  return reading;
};

const generateContextualReading = (userInfo: UserInfo, analysis: HandAnalysis): PalmReading => {
  const age = parseInt(userInfo.age);
  const { lifeAspect, gender, name } = userInfo;
  
  // Generate life line reading
  const lifeLineKey = analysis.lifeLine.length as keyof typeof MYANMAR_PALMISTRY_KNOWLEDGE.lifeLine;
  const depthKey = analysis.lifeLine.depth as keyof typeof MYANMAR_PALMISTRY_KNOWLEDGE.lifeLine[typeof lifeLineKey];
  const lifeLineOptions = MYANMAR_PALMISTRY_KNOWLEDGE.lifeLine[lifeLineKey][depthKey];
  const lifeLine = lifeLineOptions[Math.floor(Math.random() * lifeLineOptions.length)];
  
  // Generate heart line reading based on life aspect
  const aspectKey = lifeAspect as keyof typeof MYANMAR_PALMISTRY_KNOWLEDGE.heartLine;
  const heartLineOptions = MYANMAR_PALMISTRY_KNOWLEDGE.heartLine[aspectKey] || MYANMAR_PALMISTRY_KNOWLEDGE.heartLine.love;
  const heartLine = heartLineOptions[Math.floor(Math.random() * heartLineOptions.length)];
  
  // Generate head line reading
  const headLineOptions = MYANMAR_PALMISTRY_KNOWLEDGE.headLine[aspectKey] || MYANMAR_PALMISTRY_KNOWLEDGE.headLine.business;
  const headLine = headLineOptions[Math.floor(Math.random() * headLineOptions.length)];
  
  // Generate fate line reading
  const fateLineOptions = MYANMAR_PALMISTRY_KNOWLEDGE.fateLine[analysis.fateLine.clarity as keyof typeof MYANMAR_PALMISTRY_KNOWLEDGE.fateLine];
  const fateLine = fateLineOptions[Math.floor(Math.random() * fateLineOptions.length)];
  
  // Generate timeframe prediction
  const timeframe = generateTimeframe(age, lifeAspect);
  
  // Generate advice
  const advice = generateAdvice(userInfo, analysis);
  
  // Generate overall reading
  const overall = generateOverallReading(name, age, lifeAspect, analysis);
  
  // Generate lucky elements
  const luckyNumbers = generateLuckyNumbers();
  const luckyColors = generateLuckyColors();
  
  return {
    lifeLine,
    heartLine,
    headLine,
    fateLine,
    overall,
    timeframe,
    advice,
    luckyNumbers,
    luckyColors
  };
};

const generateTimeframe = (age: number, aspect: string): string => {
  const timeframes = {
    business: age < 30 
      ? "လာမယ့် ၆ လအတွင်း စီးပွားရေး အခွင့်အလမ်းကြီး ရရှိမယ်"
      : "လာမယ့် ၁ နှစ်အတွင်း လုပ်ငန်း တိုးတက်မှုရှိမယ်",
    education: age < 25 
      ? "လာမယ့် ၃ လအတွင်း ပညာရေး အောင်မြင်မှုရှိမယ်"
      : "လာမယ့် ၆ လအတွင်း ဗဟုသုတ တိုးတက်မှုရှိမယ်",
    health: "လာမယ့် ၂ လအတွင်း ကျန်းမာရေး သိသိသာသာ ကောင်းလာမယ်",
    love: age < 30 
      ? "လာမယ့် ၄ လအတွင်း အချစ်ရေး အပြောင်းအလဲရှိမယ်"
      : "လာမယ့် ၆ လအတွင်း မိသားစု ပျော်ရွှင်မှုရှိမယ်"
  };
  
  return timeframes[aspect as keyof typeof timeframes] || timeframes.business;
};

const generateAdvice = (userInfo: UserInfo, analysis: HandAnalysis): string => {
  const advices = {
    business: [
      "စီးပွားရေးမှာ သေချာမှုနဲ့ ဆုံးဖြတ်ပါ",
      "လုပ်ငန်းမိတ်ဖက်တွေကို ယုံကြည်မှုနဲ့ ရွေးချယ်ပါ",
      "အရင်းအမြစ် စုဆောင်းမှုကို ဆက်လက်လုပ်ပါ"
    ],
    education: [
      "ပညာသင်ကြားမှုမှာ စိတ်ရှည်သီးခံပါ",
      "နေ့စဉ် သင်ယူမှုကို ပုံမှန်လုပ်ပါ",
      "ဆရာများနဲ့ ကောင်းမွန်တဲ့ ဆက်ဆံရေး ထိန်းသိမ်းပါ"
    ],
    health: [
      "နေ့စဉ် ကာယကံ့ခိုင်ရေး လုပ်ပါ",
      "စိတ်ဖိစီးမှုကို လျှော့ချဖို့ အားထုတ်ပါ",
      "အပတ်စဉ် ဆေးစစ်ဖို့ မမေ့ပါနဲ့"
    ],
    love: [
      "အချစ်ရေးမှာ ရိုးသားမှုကို ထားပါ",
      "မိသားစုနဲ့ အချိန်ပိုပေးပါ",
      "စိတ်ခံစားမှုတွေကို ပွင့်လင်းစွာ ဖော်ပြပါ"
    ]
  };
  
  const aspectAdvices = advices[userInfo.lifeAspect as keyof typeof advices] || advices.business;
  return aspectAdvices[Math.floor(Math.random() * aspectAdvices.length)];
};

const generateOverallReading = (name: string, age: number, aspect: string, analysis: HandAnalysis): string => {
  const aspectNames = {
    business: 'စီးပွားရေး',
    education: 'ပညာရေး',
    health: 'ကျန်းမာရေး',
    love: 'အချစ်ရေး'
  };
  
  const aspectName = aspectNames[aspect as keyof typeof aspectNames] || 'ဘဝ';
  
  const palmCharacteristics = [];
  if (analysis.lifeLine.length === 'long') palmCharacteristics.push('အသက်ရှည်လက္ခဏာ');
  if (analysis.heartLine.branches > 2) palmCharacteristics.push('စိတ်ကြွယ်ဝမှု');
  if (analysis.headLine.clarity === 'clear') palmCharacteristics.push('ဉာဏ်ရည်ကြွယ်ဝမှု');
  if (analysis.fateLine.present) palmCharacteristics.push('ကံကြမ္မာကောင်းမှု');
  
  const characteristics = palmCharacteristics.length > 0 
    ? palmCharacteristics.join('၊ ') + ' တွေရှိတယ်'
    : 'အထူးလက္ခဏာများ ရှိတယ်';
  
  return `${name}ရဲ့ လက်ဝါးမှာ ${aspectName}နဲ့ ပတ်သက်ပြီး ${characteristics}။ အသက် ${age} နှစ်မှာ သင့်အတွက် အရေးကြီးတဲ့ အခိုက်အတန့် ရောက်နေပြီ။ လာမယ့်ကာလမှာ အထူးကောင်းမွန်တဲ့ အပြောင်းအလဲတွေ ရှိလာမယ်။`;
};

const generateLuckyNumbers = (): number[] => {
  const numbers = [...LUCKY_ELEMENTS.numbers];
  const result = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result.push(numbers.splice(randomIndex, 1)[0]);
  }
  return result;
};

const generateLuckyColors = (): string[] => {
  const colors = [...LUCKY_ELEMENTS.colors];
  const result = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    result.push(colors.splice(randomIndex, 1)[0]);
  }
  return result;
};

// Fallback function for when AI is unavailable
export const generateBasicReading = (userInfo: UserInfo): PalmReading => {
  return generateContextualReading(userInfo, {
    palmSize: 'medium',
    fingerLength: 'medium',
    lifeLine: { length: 'medium', depth: 'medium', curvature: 'curved' },
    heartLine: { position: 'medium', length: 'medium', branches: 2 },
    headLine: { slope: 'sloped', length: 'medium', clarity: 'clear' },
    fateLine: { present: true, clarity: 'weak', position: 'center' }
  });
};
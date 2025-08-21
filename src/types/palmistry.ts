export interface UserInfo {
  name: string;
  age: string;
  gender: string;
  dominantHand: string;
  lifeAspect: string;
}

export interface HandAnalysis {
  palmSize: 'small' | 'medium' | 'large';
  fingerLength: 'short' | 'medium' | 'long';
  lifeLine: {
    length: 'short' | 'medium' | 'long';
    depth: 'shallow' | 'medium' | 'deep';
    curvature: 'straight' | 'curved' | 'very_curved';
  };
  heartLine: {
    position: 'high' | 'medium' | 'low';
    length: 'short' | 'medium' | 'long';
    branches: number;
  };
  headLine: {
    slope: 'horizontal' | 'sloped' | 'steep';
    length: 'short' | 'medium' | 'long';
    clarity: 'clear' | 'faint' | 'broken';
  };
  fateLine: {
    present: boolean;
    clarity: 'strong' | 'weak' | 'absent';
    position: 'center' | 'left' | 'right';
  };
}

export interface PalmReading {
  lifeLine: string;
  heartLine: string;
  headLine: string;
  fateLine: string;
  overall: string;
  timeframe: string;
  advice: string;
  luckyNumbers?: number[];
  luckyColors?: string[];
}

export interface AIReadingRequest {
  userInfo: UserInfo;
  handAnalysis: HandAnalysis;
  timestamp: number;
}
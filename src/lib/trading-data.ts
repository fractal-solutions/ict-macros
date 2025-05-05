// Trading Sessions Data
export interface Session {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export const sessionsData: Session[] = [
  {
    id: 'asia-tokyo',
    name: 'Asia/Tokyo',
    startTime: '19:00',
    endTime: '04:00',
    description: 'Asian trading session covering Tokyo, Singapore, Hong Kong and Sydney markets.'
  },
  {
    id: 'london',
    name: 'London',
    startTime: '03:00',
    endTime: '12:00',
    description: 'European trading session centered around London, one of the largest and most influential financial centers.'
  },
  {
    id: 'ny-am',
    name: 'New York AM Session',
    startTime: '08:00',
    endTime: '12:00',
    description: 'Morning session of US markets with overlap to European markets, creating high volatility and liquidity.'
  },
  {
    id: 'ny-pm',
    name: 'New York PM Session',
    startTime: '13:30',
    endTime: '16:00',
    description: 'Afternoon session of US markets, typically featuring strong moves toward the close.'
  },
  {
    id: 'after-hours',
    name: 'After Hours / CBDR',
    startTime: '16:00',
    endTime: '20:00',
    description: 'Extended hours trading after regular market close, including Central Bank Dealer Rates adjustments.'
  }
];

// Killzones Data
export interface Killzone {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  relatedSession?: string;
}

export const killzonesData: Killzone[] = [
  {
    id: 'asian-kz',
    name: 'ICT Asian Killzone',
    startTime: '20:00',
    endTime: '00:00',
    description: 'Trading window capturing Asian session volatility and liquidity moves.',
    relatedSession: 'Asia/Tokyo'
  },
  {
    id: 'london-kz',
    name: 'ICT London Killzone',
    startTime: '02:00',
    endTime: '05:00',
    description: 'Strategic window during the London pre-open and open, targeting institutional liquidity.',
    relatedSession: 'London'
  },
  {
    id: 'ny-am-kz',
    name: 'New York AM Killzone',
    startTime: '08:30',
    endTime: '11:00',
    description: 'High-opportunity window during New York opening, targeting stop hunts and liquidity grabs.',
    relatedSession: 'New York AM Session'
  },
  {
    id: 'ny-pm-kz',
    name: 'New York PM Killzone',
    startTime: '13:30',
    endTime: '16:00',
    description: 'Afternoon session focusing on closing momentum and liquidity.',
    relatedSession: 'New York PM Session'
  },
  {
    id: 'silver-bullet-1',
    name: 'ICT Silver Bullet Setup #1',
    startTime: '03:00',
    endTime: '04:00',
    description: 'Key setup coinciding with London open volatility.',
    relatedSession: 'London'
  },
  {
    id: 'silver-bullet-2',
    name: 'ICT Silver Bullet Setup #2',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Mid-day setup targeting European close and US market momentum.',
    relatedSession: 'New York AM Session'
  },
  {
    id: 'silver-bullet-3',
    name: 'ICT Silver Bullet Setup #3',
    startTime: '14:00',
    endTime: '15:00',
    description: 'US afternoon setup targeting position adjustments before the close.',
    relatedSession: 'New York PM Session'
  }
];

// Macro Timings Data
export interface Macro {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  relatedSession?: string;
  isSpecialEvent?: boolean;
  macroNumber?: number;
}

export const macrosData: Macro[] = [
  {
    id: 'ipda-reset',
    name: 'IPDA Reset',
    startTime: '00:00',
    endTime: '00:05',
    description: 'Intraday Price Action reset point that often marks a key timing for new daily momentum.',
    isSpecialEvent: true
  },
  {
    id: 'london-pre-open',
    name: '#1 London Pre-Open Macro',
    startTime: '02:33',
    endTime: '03:00',
    description: 'Initial institutional positioning before London markets officially open.',
    relatedSession: 'London',
    macroNumber: 1
  },
  {
    id: 'london-open',
    name: '#2 London Open Macro',
    startTime: '04:03',
    endTime: '04:30',
    description: 'First major volatility surge as European markets fully engage.',
    relatedSession: 'London',
    macroNumber: 2
  },
  {
    id: 'true-daily-open',
    name: 'True Daily Open',
    startTime: '04:00',
    endTime: '04:05',
    description: 'Formal market open - critical reference point for the trading day.',
    isSpecialEvent: true
  },
  {
    id: 'ny-am-macro',
    name: '#3 New York AM Macro',
    startTime: '08:50',
    endTime: '09:10',
    description: 'Key volatility window as US traders enter and respond to European price action.',
    relatedSession: 'New York AM Session',
    macroNumber: 3
  },
  {
    id: 'london-close-macro',
    name: '#4 London Close Macro',
    startTime: '09:50',
    endTime: '10:10',
    description: 'European closing dynamics creating significant price movements.',
    relatedSession: 'London',
    macroNumber: 4
  },
  {
    id: 'london-fix-macro',
    name: '#5 London Fix Macro',
    startTime: '10:50',
    endTime: '11:10',
    description: 'Daily currency benchmark fixing window - high volatility period.',
    relatedSession: 'London',
    macroNumber: 5
  },
  {
    id: 'ny-am-close-macro',
    name: '#6 New York AM Close Macro',
    startTime: '11:50',
    endTime: '12:10',
    description: 'End of morning session with position squaring before lunch hour.',
    relatedSession: 'New York AM Session',
    macroNumber: 6
  },
  {
    id: 'ny-lunch-macro',
    name: '#7 New York Lunch Macro',
    startTime: '13:10',
    endTime: '13:40',
    description: 'Post-lunch positioning window before afternoon momentum builds.',
    relatedSession: 'New York PM Session',
    macroNumber: 7
  },
  {
    id: 'ny-pm-close-macro',
    name: '#8 New York PM Close Macro',
    startTime: '15:15',
    endTime: '15:45',
    description: 'End of day positioning with highest institutional volume.',
    relatedSession: 'New York PM Session',
    macroNumber: 8
  },
  {
    id: 'true-daily-close',
    name: 'True Daily Close',
    startTime: '16:01',
    endTime: '16:05',
    description: 'Official market close and settlement price establishment - critical reference for next day.',
    isSpecialEvent: true
  }
];
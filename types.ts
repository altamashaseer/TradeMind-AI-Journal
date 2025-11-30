export enum TradeOutcome {
  WIN = 'WIN',
  LOSS = 'LOSS',
  BREAK_EVEN = 'BREAK_EVEN'
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export interface Trade {
  id: string;
  userId: string;
  date: string;
  instrument: string; // e.g., BTCUSD, NQ_F, AAPL
  direction: TradeDirection;
  outcome: TradeOutcome;
  pnl: number;
  entryPrice?: number;
  exitPrice?: number;
  setup?: string; // e.g., "S/R Flip", "Gap Fill"
  notes: string;
  screenshotUrl?: string; // Base64 string for this demo
  aiAnalysis?: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  bestWin: number;
  worstLoss: number;
}
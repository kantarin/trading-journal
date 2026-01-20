export interface Trade {
    id: string
    symbol: string
    direction: 'LONG' | 'SHORT'
    entryPrice: number
    exitPrice?: number
    quantity: number
    date: string // ISO date string
    status: 'OPEN' | 'CLOSED'
    pnl?: number
    notes?: string
    setup?: string
    fees?: number
}

export interface TradeStats {
    totalTrades: number
    winRate: number
    profitFactor: number
    netPnL: number
    bestTrade: number
    worstTrade: number
}

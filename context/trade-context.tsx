"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Trade, TradeStats } from '@/types'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface TradeContextType {
    trades: Trade[]
    addTrade: (trade: Omit<Trade, 'id' | 'pnl' | 'status'>) => void
    updateTrade: (id: string, trade: Partial<Trade>) => void
    deleteTrade: (id: string) => void
    stats: TradeStats
}

const TradeContext = createContext<TradeContextType | undefined>(undefined)

const calculatePnL = (trade: Trade) => {
    if (!trade.exitPrice) return 0
    const diff = trade.direction === 'LONG'
        ? trade.exitPrice - trade.entryPrice
        : trade.entryPrice - trade.exitPrice
    return (diff * trade.quantity) - (trade.fees || 0)
}

export function TradeProvider({ children }: { children: React.ReactNode }) {
    const [trades, setTrades] = useLocalStorage<Trade[]>('trading-journal-trades', [])
    const [stats, setStats] = useState<TradeStats>({
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        netPnL: 0,
        bestTrade: 0,
        worstTrade: 0
    })

    useEffect(() => {
        // Recalculate stats whenever trades change
        const closedTrades = trades.filter(t => t.status === 'CLOSED')
        const totalTrades = closedTrades.length
        const netPnL = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0)
        const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0)
        const losingTrades = closedTrades.filter(t => (t.pnl || 0) <= 0)

        const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0

        const grossProfit = winningTrades.reduce((acc, t) => acc + (t.pnl || 0), 0)
        const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + (t.pnl || 0), 0))
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

        const bestTrade = Math.max(0, ...closedTrades.map(t => t.pnl || 0))
        const worstTrade = Math.min(0, ...closedTrades.map(t => t.pnl || 0))

        setStats({
            totalTrades,
            winRate,
            profitFactor,
            netPnL,
            bestTrade,
            worstTrade
        })
    }, [trades])

    const addTrade = (newTradeData: Omit<Trade, 'id' | 'pnl' | 'status'>) => {
        const isClosed = !!newTradeData.exitPrice
        const trade: Trade = {
            ...newTradeData,
            id: crypto.randomUUID(),
            status: isClosed ? 'CLOSED' : 'OPEN',
            pnl: 0
        }

        if (isClosed) {
            trade.pnl = calculatePnL(trade)
        }

        setTrades([trade, ...trades])
    }

    const updateTrade = (id: string, updates: Partial<Trade>) => {
        setTrades(trades.map(t => {
            if (t.id !== id) return t

            const updatedTrade = { ...t, ...updates }
            const isClosed = !!updatedTrade.exitPrice
            updatedTrade.status = isClosed ? 'CLOSED' : 'OPEN'

            if (isClosed) {
                updatedTrade.pnl = calculatePnL(updatedTrade)
            } else {
                updatedTrade.pnl = 0
            }

            return updatedTrade
        }))
    }

    const deleteTrade = (id: string) => {
        setTrades(trades.filter(t => t.id !== id))
    }

    return (
        <TradeContext.Provider value={{ trades, addTrade, updateTrade, deleteTrade, stats }}>
            {children}
        </TradeContext.Provider>
    )
}

export const useTrades = () => {
    const context = useContext(TradeContext)
    if (context === undefined) {
        throw new Error('useTrades must be used within a TradeProvider')
    }
    return context
}

"use client"

import { useTrades } from "@/context/trade-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'
import { useMemo } from "react"

export function AnalyticsCharts() {
    const { trades } = useTrades()

    const data = useMemo(() => {
        // Sort trades by date ascending
        const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        let cumulativePnL = 0
        return sorted.map(trade => {
            cumulativePnL += (trade.pnl || 0)
            return {
                date: new Date(trade.date).toLocaleDateString(),
                pnl: cumulativePnL,
                rawPnL: trade.pnl
            }
        })
    }, [trades])

    if (trades.length === 0) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#475569"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                    itemStyle={{ color: '#10b981' }}
                                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Equity']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pnl"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPnL)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle>Win/Loss Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-slate-500">
                        {/* Placeholder for future circular chart or bar chart */}
                        <div className="space-y-4 w-full">
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Wins</span>
                                    <span className="text-emerald-500">{trades.filter(t => (t.pnl || 0) > 0).length}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${(trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Losses</span>
                                    <span className="text-rose-500">{trades.filter(t => (t.pnl || 0) <= 0).length}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-rose-500 rounded-full"
                                        style={{ width: `${(trades.filter(t => (t.pnl || 0) <= 0).length / trades.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

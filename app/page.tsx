"use client"

import { useState } from "react"
import { useTrades } from "@/context/trade-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { TradeForm } from "@/components/trade-form"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, BarChart3, TrendingUp, Pencil } from "lucide-react"
import { Trade } from "@/types"

export default function Home() {
  const { stats, trades } = useTrades()
  const [isNewTradeOpen, setIsNewTradeOpen] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | undefined>(undefined)

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade)
    setIsNewTradeOpen(true)
  }

  const handleClose = () => {
    setIsNewTradeOpen(false)
    setTimeout(() => setEditingTrade(undefined), 300) // Clear after animation
  }

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">Trading Journal</h1>
          <p className="text-slate-400">Track, analyze, and improve your performance</p>
        </div>
        <button
          onClick={() => setIsNewTradeOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          + New Trade
        </button>
      </div>

      <Dialog
        isOpen={isNewTradeOpen}
        onClose={handleClose}
        title={editingTrade ? "Edit Trade" : "Record New Trade"}
      >
        <TradeForm onSuccess={handleClose} initialData={editingTrade} />
      </Dialog>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Net PnL"
          value={formatCurrency(stats.netPnL)}
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          trend={stats.netPnL >= 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={<Activity className="w-4 h-4 text-blue-400" />}
          subtext={`${stats.totalTrades} Trades`}
        />
        <StatsCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          icon={<TrendingUp className="w-4 h-4 text-purple-400" />}
        />
        <StatsCard
          title="Best Trade"
          value={formatCurrency(stats.bestTrade)}
          icon={<BarChart3 className="w-4 h-4 text-amber-400" />}
        />
      </div>

      <AnalyticsCharts />

      {/* Recent Trades Table Preview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No trades recorded yet. Start by adding your first trade.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Side</th>
                    <th className="pb-3 font-medium">PnL</th>
                    <th className="pb-3 font-medium">Notes</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {trades.slice(0, 5).map((trade) => (
                    <tr key={trade.id} className="group hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 text-slate-300">{new Date(trade.date).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-slate-200">{trade.symbol}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className={`py-3 font-medium ${trade.pnl && trade.pnl > 0 ? 'text-emerald-400' : trade.pnl && trade.pnl < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {trade.pnl ? formatCurrency(trade.pnl) : '-'}
                      </td>
                      <td className="py-3 text-slate-400 max-w-[200px] truncate">
                        {trade.notes || '-'}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs ${trade.status === 'CLOSED' ? 'text-slate-500' : 'text-blue-400'}`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleEditClick(trade)}
                          className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function StatsCard({ title, value, icon, subtext, trend }: { title: string, value: string, icon: React.ReactNode, subtext?: string, trend?: 'up' | 'down' }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

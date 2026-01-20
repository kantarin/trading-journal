"use client"

import { useState, useEffect } from "react"
import { useTrades } from "@/context/trade-context"
import { Trade } from "@/types"

export function TradeForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: Trade }) {
    const { addTrade, updateTrade } = useTrades()
    const [formData, setFormData] = useState<Partial<Trade>>({
        direction: 'LONG',
        status: 'OPEN',
        date: new Date().toISOString().split('T')[0],
        ...initialData,
        // Ensure date is truncated to YYYY-MM-DD for input type="date"
        ...(initialData?.date ? { date: new Date(initialData.date).toISOString().split('T')[0] } : {})
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: new Date(initialData.date).toISOString().split('T')[0]
            })
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.symbol || !formData.entryPrice || !formData.quantity || !formData.date) return

        const tradeData = {
            symbol: formData.symbol.toUpperCase(),
            direction: formData.direction as 'LONG' | 'SHORT',
            entryPrice: Number(formData.entryPrice),
            exitPrice: formData.exitPrice ? Number(formData.exitPrice) : undefined,
            quantity: Number(formData.quantity),
            date: new Date(formData.date).toISOString(),
            notes: formData.notes,
            setup: formData.setup,
            fees: formData.fees ? Number(formData.fees) : 0
        }

        if (initialData?.id) {
            updateTrade(initialData.id, tradeData)
        } else {
            addTrade(tradeData)
        }
        onSuccess()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Symbol</label>
                    <input
                        name="symbol"
                        value={formData.symbol || ''}
                        required
                        placeholder="BTCUSD"
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase placeholder:text-slate-600"
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date || ''}
                        required
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none block [color-scheme:dark]"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Direction</label>
                <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, direction: 'LONG' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-500' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Long
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, direction: 'SHORT' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.direction === 'SHORT' ? 'bg-rose-500/20 text-rose-500' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Short
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Entry Price</label>
                    <input
                        type="number"
                        step="any"
                        name="entryPrice"
                        value={formData.entryPrice || ''}
                        required
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Quantity</label>
                    <input
                        type="number"
                        step="any"
                        name="quantity"
                        value={formData.quantity || ''}
                        required
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Exit Price</label>
                    <input
                        type="number"
                        step="any"
                        name="exitPrice"
                        value={formData.exitPrice || ''}
                        placeholder="Optional"
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Fees</label>
                    <input
                        type="number"
                        step="any"
                        name="fees"
                        value={formData.fees || ''}
                        placeholder="0.00"
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Notes / Setup</label>
                <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes || ''}
                    className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none placeholder:text-slate-600"
                    placeholder="Why did you take this trade?"
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 cursor-pointer"
            >
                {initialData ? 'Update Trade' : 'Add Trade'}
            </button>
        </form>
    )
}

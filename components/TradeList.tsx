import React, { useState } from 'react';
import { Trade, TradeOutcome } from '../types';
import { ICONS } from '../constants';

interface TradeListProps {
    trades: Trade[];
    onSelectTrade: (trade: Trade) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onSelectTrade }) => {
    const [filter, setFilter] = useState('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const filteredTrades = trades.filter(t => {
        // Apply outcome filter
        if (filter !== 'ALL' && t.outcome !== filter) {
            return false;
        }

        // Apply date range filter
        if (startDate || endDate) {
            const tradeDate = t.date.split('T')[0]; // Extract date portion

            if (startDate && tradeDate < startDate) {
                return false;
            }

            if (endDate && tradeDate > endDate) {
                return false;
            }
        }

        return true;
    });

    const handleClearDateFilter = () => {
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trade Journal</h2>
                <div className="flex gap-2">
                    {['ALL', 'WIN', 'LOSS', 'BREAK_EVEN'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Range Filter - Compact */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full sm:w-40 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-600"
                    />
                </div>

                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full sm:w-40 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-600"
                    />
                </div>

                {(startDate || endDate) && (
                    <button
                        onClick={handleClearDateFilter}
                        className="w-full sm:w-auto px-1 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:underline transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {(startDate || endDate) && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing trades from {startDate || 'any date'} to {endDate || 'any date'}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTrades.map(trade => (
                    <div
                        key={trade.id}
                        onClick={() => onSelectTrade(trade)}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group"
                    >
                        {trade.screenshotUrl ? (
                            <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                                <img src={trade.screenshotUrl} alt="Chart" className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent dark:from-slate-900 dark:to-transparent" />
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${trade.outcome === TradeOutcome.WIN ? 'bg-emerald-500 text-emerald-950' :
                                        trade.outcome === TradeOutcome.LOSS ? 'bg-red-500 text-red-950' : 'bg-slate-500 text-slate-200'
                                        }`}>
                                        {trade.outcome}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 w-full bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600">
                                <span className="flex items-center gap-2">{ICONS.Image} No Image</span>
                            </div>
                        )}

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg">{trade.instrument}</h4>
                                    <p className="text-xs text-slate-500">{new Date(trade.date).toLocaleDateString()}</p>
                                </div>
                                <div className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span className={`px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700`}>{trade.direction}</span>
                                {trade.setup && <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">{trade.setup}</span>}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {trade.notes}
                            </p>
                        </div>
                    </div>
                ))}

                {filteredTrades.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        No trades found matching this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradeList;
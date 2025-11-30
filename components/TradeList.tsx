import React, { useState } from 'react';
import { Trade, TradeOutcome } from '../types';
import { ICONS } from '../constants';

interface TradeListProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onSelectTrade }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredTrades = trades.filter(t => {
    if (filter === 'ALL') return true;
    return t.outcome === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trade Journal</h2>
        <div className="flex gap-2">
            {['ALL', 'WIN', 'LOSS', 'BREAK_EVEN'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === f 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

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
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            trade.outcome === TradeOutcome.WIN ? 'bg-emerald-500 text-emerald-950' : 
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
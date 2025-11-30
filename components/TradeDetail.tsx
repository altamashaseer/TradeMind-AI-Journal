import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/index';
import { editTrade, removeTrade } from '../store/tradeSlice';
import { Trade, TradeOutcome } from '../types';
import { ICONS } from '../constants';
import { analyzeTradeWithAI } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface TradeDetailProps {
  trade: Trade;
  onClose: () => void;
  onEdit: (trade: Trade) => void;
}

const TradeDetail: React.FC<TradeDetailProps> = ({ trade, onClose, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | undefined>(trade.aiAnalysis);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
        const result = await analyzeTradeWithAI(trade);
        setAnalysis(result);
        
        // Save analysis to db via Redux
        const updatedTrade = { ...trade, aiAnalysis: result };
        dispatch(editTrade(updatedTrade));

    } catch (e) {
        console.error(e);
    } finally {
        setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
      if(confirm("Are you sure you want to delete this trade?")) {
          await dispatch(removeTrade(trade.id));
          onClose();
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="h-full w-full md:w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto animate-slide-in-right">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {trade.instrument}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${trade.direction === 'LONG' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10'}`}>
                        {trade.direction}
                    </span>
                </h2>
                <p className="text-sm text-slate-400">{new Date(trade.date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(trade)} className="p-2 hover:bg-slate-800 rounded-full text-indigo-400 transition-colors" title="Edit Trade">
                     {ICONS.Edit}
                </button>
                <button onClick={handleDelete} className="p-2 hover:bg-slate-800 rounded-full text-red-400 transition-colors" title="Delete Trade">
                     {ICONS.Delete}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                    {ICONS.Close}
                </button>
            </div>
        </div>

        <div className="p-6 space-y-8">
            {/* KPI Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${trade.outcome === TradeOutcome.WIN ? 'bg-emerald-500/10 border-emerald-500/30' : trade.outcome === TradeOutcome.LOSS ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                    <p className="text-sm text-slate-400 mb-1">PnL</p>
                    <p className={`text-2xl font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Setup</p>
                    <p className="text-lg font-semibold text-white">{trade.setup || 'N/A'}</p>
                </div>
            </div>

            {/* Screenshot */}
            {trade.screenshotUrl && (
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Chart Snapshot</h3>
                    <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                        <img src={trade.screenshotUrl} alt="Trade Setup" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Trader Notes</h3>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {trade.notes}
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
                        {ICONS.AI} AI Coach Analysis
                    </h3>
                    {!analysis && (
                        <button 
                            onClick={handleAnalyze} 
                            disabled={analyzing}
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {analyzing ? ICONS.Loading : 'Generate Insight'}
                        </button>
                    )}
                </div>

                {analysis ? (
                    <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-5 text-slate-300 text-sm leading-relaxed shadow-inner">
                        <ReactMarkdown 
                            components={{
                                strong: ({node, ...props}) => <span className="font-bold text-indigo-300" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />
                            }}
                        >
                            {analysis}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                        {analyzing ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="animate-spin text-indigo-500">{ICONS.Loading}</span>
                                <span>Analyzing chart patterns and psychology...</span>
                            </div>
                        ) : (
                            <p>Click "Generate Insight" to get AI feedback on this trade.</p>
                        )}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default TradeDetail;

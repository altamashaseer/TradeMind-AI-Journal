import React, { useMemo } from 'react';
import { Trade, TradeOutcome } from '../types';
import { ICONS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

interface DashboardProps {
  trades: Trade[];
  onViewTrade: (trade: Trade) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trades, onViewTrade }) => {
  const { theme } = useTheme();
  
  const stats = useMemo(() => {
    const totalTrades = trades.length;
    if (totalTrades === 0) return null;

    const wins = trades.filter(t => t.outcome === TradeOutcome.WIN);
    const losses = trades.filter(t => t.outcome === TradeOutcome.LOSS);
    
    const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
    const winRate = (wins.length / totalTrades) * 100;
    
    const avgWin = wins.length > 0 ? wins.reduce((acc, t) => acc + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0) / losses.length) : 0;
    const profitFactor = avgLoss > 0 ? (wins.reduce((acc,t) => acc + t.pnl, 0) / Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0))) : 0;

    return { totalTrades, winRate, totalPnL, avgWin, avgLoss, profitFactor };
  }, [trades]);

  const equityCurve = useMemo(() => {
    let runningPnL = 0;
    // Sort ascending for chart
    const sorted = [...trades].sort((a, b) => a.createdAt - b.createdAt);
    return sorted.map((t, index) => {
      runningPnL += t.pnl;
      return {
        name: index + 1,
        date: t.date,
        pnl: runningPnL,
        rawPnl: t.pnl
      };
    });
  }, [trades]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center max-w-md shadow-lg transition-colors duration-300">
          <div className="bg-indigo-500/10 text-indigo-500 p-4 rounded-full inline-flex mb-4">
            {ICONS.Dashboard}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to TradeMind</h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400">Start logging your trades to see your analytics and AI insights.</p>
        </div>
      </div>
    );
  }

  // Chart Styling based on Theme
  const chartStroke = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridStroke = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipText = theme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-900 dark:text-white">{ICONS.Wallet}</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Net PnL</p>
          <h3 className={`text-3xl font-bold mt-1 ${stats.totalPnL >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            ${stats.totalPnL.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg relative overflow-hidden transition-colors duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-900 dark:text-white">{ICONS.Target}</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Win Rate</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
            {stats.winRate.toFixed(1)}%
          </h3>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${stats.winRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Profit Factor</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
            {stats.profitFactor.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Goal: &gt; 1.5</p>
        </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Win / Loss</p>
           <div className="flex items-end gap-2 mt-1">
             <span className="text-xl font-bold text-emerald-500 dark:text-emerald-400">${Math.round(stats.avgWin)}</span>
             <span className="text-slate-400 dark:text-slate-500 text-sm mb-1">/</span>
             <span className="text-xl font-bold text-red-500 dark:text-red-400">${Math.round(stats.avgLoss)}</span>
           </div>
        </div>
      </div>

      {/* Equity Curve */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg transition-colors duration-300">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Equity Curve</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" stroke={chartStroke} tick={false} />
              <YAxis stroke={chartStroke} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }}
                itemStyle={{ color: tooltipText }}
                formatter={(value: any) => [`$${value}`, 'PnL']}
                labelFormatter={(label) => `Trade #${label}`}
              />
              <ReferenceLine y={0} stroke={chartStroke} strokeDasharray="3 3" />
              <Area type="monotone" dataKey="pnl" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPnL)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trades List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Trades</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Instrument</th>
                <th className="px-6 py-4">Outcome</th>
                <th className="px-6 py-4 text-right">PnL</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {trades.slice(0, 5).map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => onViewTrade(trade)}>
                  <td className="px-6 py-4">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{trade.instrument} <span className={`text-xs ml-1 px-1.5 py-0.5 rounded ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>{trade.direction}</span></td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        trade.outcome === TradeOutcome.WIN ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        trade.outcome === TradeOutcome.LOSS ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                        'bg-slate-100 dark:bg-slate-600/10 text-slate-500 dark:text-slate-400'
                     }`}>
                        {trade.outcome === TradeOutcome.WIN && ICONS.Win}
                        {trade.outcome === TradeOutcome.LOSS && ICONS.Loss}
                        {trade.outcome}
                     </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${trade.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
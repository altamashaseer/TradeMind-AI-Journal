import React, { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/index';
import { createTrade, editTrade } from '../store/tradeSlice';
import { Trade, TradeDirection, TradeOutcome } from '../types';
import { ICONS } from '../constants';

interface TradeFormProps {
  onCancel: () => void;
  initialData?: Trade | null;
}

const TradeForm: React.FC<TradeFormProps> = ({ onCancel, initialData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    instrument: initialData?.instrument || '',
    direction: initialData?.direction || TradeDirection.LONG,
    outcome: initialData?.outcome || TradeOutcome.WIN,
    pnl: initialData?.pnl || 0,
    setup: initialData?.setup || '',
    notes: initialData?.notes || '',
    screenshotUrl: initialData?.screenshotUrl || ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pnl' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
          alert("File too large. Please use an image under 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshotUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (initialData) {
        await dispatch(editTrade({ ...formData, id: initialData.id, userId: initialData.userId, createdAt: initialData.createdAt, aiAnalysis: initialData.aiAnalysis })).unwrap();
      } else {
        await dispatch(createTrade(formData as any)).unwrap();
      }
      onCancel();
    } catch (error) {
      alert("Failed to save trade: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-fade-in-up my-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Trade' : 'Log New Trade'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            {ICONS.Close}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instrument */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Instrument</label>
              <input
                required
                type="text"
                name="instrument"
                placeholder="e.g. BTCUSD"
                value={formData.instrument}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Direction */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, direction: TradeDirection.LONG }))}
                    className={`py-2 rounded-lg text-sm font-semibold border ${formData.direction === TradeDirection.LONG ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                >
                    Long
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, direction: TradeDirection.SHORT }))}
                    className={`py-2 rounded-lg text-sm font-semibold border ${formData.direction === TradeDirection.SHORT ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                >
                    Short
                </button>
              </div>
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Outcome</label>
              <select
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(TradeOutcome).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

             {/* PnL */}
             <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">PnL ($)</label>
              <input
                required
                type="number"
                name="pnl"
                step="0.01"
                value={formData.pnl}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

             {/* Setup */}
             <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Setup / Strategy</label>
              <input
                type="text"
                name="setup"
                placeholder="e.g. S/R Flip"
                value={formData.setup}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Trade Notes & Psychology</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="What was your thought process? How did you feel?"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Screenshot Upload */}
          <div>
             <label className="block text-sm font-medium text-slate-400 mb-1">Chart Screenshot</label>
             <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors text-center cursor-pointer relative">
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {formData.screenshotUrl ? (
                    <div className="relative h-40 w-full">
                        <img src={formData.screenshotUrl} alt="Preview" className="h-full w-full object-contain rounded" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium">Click to Change</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-slate-500">
                        <div className="flex justify-center mb-2 text-indigo-500">{ICONS.Image}</div>
                        <p className="text-sm">Click to upload chart screenshot</p>
                        <p className="text-xs mt-1">Max 2MB</p>
                    </div>
                )}
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? ICONS.Loading : (initialData ? 'Update Trade' : 'Save Trade')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;

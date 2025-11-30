import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/index';
import { fetchTrades } from './store/tradeSlice';
import { logout } from './store/authSlice';
import { Trade } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import TradeDetail from './components/TradeDetail';
import { ICONS } from './constants';

enum View {
  DASHBOARD = 'DASHBOARD',
  JOURNAL = 'JOURNAL'
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux Selectors
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: trades, isLoading: isLoadingTrades, backendConnected } = useSelector((state: RootState) => state.trades);

  // Local UI State
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);

  // Load trades when user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchTrades());
    }
  }, [user, dispatch]);

  // Sync selected trade with store updates
  useEffect(() => {
    if (selectedTrade) {
      const updated = trades.find(t => t.id === selectedTrade.id);
      if (updated) {
        setSelectedTrade(updated);
      } else {
        // Trade was likely deleted
        setSelectedTrade(null);
      }
    }
  }, [trades, selectedTrade]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const openNewTradeForm = () => {
      setTradeToEdit(null);
      setIsFormOpen(true);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed md:relative bottom-0 md:h-screen z-40 order-2 md:order-1">
        <div className="p-6 hidden md:block">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
             <div className="bg-indigo-600 p-1.5 rounded-lg">{ICONS.Dashboard}</div>
             TradeMind
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 flex md:block justify-around md:justify-start">
          <button 
            onClick={() => setCurrentView(View.DASHBOARD)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${currentView === View.DASHBOARD ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {ICONS.Dashboard} <span className="hidden md:inline">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(View.JOURNAL)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${currentView === View.JOURNAL ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {ICONS.Journal} <span className="hidden md:inline">Journal</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 hidden md:block">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
            {ICONS.User}
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full mt-2"
          >
            {ICONS.Logout} <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto order-1 md:order-2 pb-20 md:pb-0 relative">
        <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md z-30 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            {currentView === View.DASHBOARD ? 'Performance Dashboard' : 'Trade Journal'}
          </h1>
          <button 
            onClick={openNewTradeForm}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 text-sm"
          >
            {ICONS.Plus} <span className="hidden sm:inline">Log Trade</span>
          </button>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {!backendConnected && (
             <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-xl flex items-center justify-between">
                <div>
                    <h3 className="font-bold">Backend Connection Failed</h3>
                    <p className="text-sm mt-1">
                        Could not connect to <code>http://localhost:5000</code>. Please ensure the Express server is running locally.
                    </p>
                </div>
             </div>
          )}

          {isLoadingTrades && trades.length === 0 ? (
             <div className="h-64 flex items-center justify-center text-indigo-500">
                 {ICONS.Loading}
             </div>
          ) : (
            <>
              {currentView === View.DASHBOARD && (
                <Dashboard trades={trades} onViewTrade={setSelectedTrade} />
              )}
              {currentView === View.JOURNAL && (
                <TradeList trades={trades} onSelectTrade={setSelectedTrade} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {isFormOpen && (
        <TradeForm 
            onCancel={() => {
                setIsFormOpen(false);
                setTradeToEdit(null);
            }} 
            initialData={tradeToEdit}
        />
      )}

      {selectedTrade && (
        <TradeDetail 
            trade={selectedTrade} 
            onClose={() => setSelectedTrade(null)}
            onEdit={(trade) => {
                setTradeToEdit(trade);
                setIsFormOpen(true);
            }}
        />
      )}

    </div>
  );
};

export default App;

import React from 'react';
import { ICONS } from '../constants';

interface NavbarProps {
    title: string;
    theme: string;
    onToggleTheme: () => void;
    onLogTrade?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, theme, onToggleTheme, onLogTrade }) => {
    return (
        <header className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
                    <div className="bg-indigo-600 text-white p-1 rounded">{ICONS.Dashboard}</div>
                    TradeMind
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden md:block">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                >
                    {theme === 'dark' ? ICONS.Sun : ICONS.Moon}
                </button>
                {onLogTrade && (
                    <button
                        onClick={onLogTrade}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 text-sm"
                    >
                        {ICONS.Plus} <span className="hidden sm:inline">Log Trade</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
import React from 'react';
import { AreaChart, Wallet, BookOpen, User as UserIcon, LogOut, TrendingUp, TrendingDown, Target, BrainCircuit, Loader2, Plus, X, Search, Calendar, DollarSign, Image as ImageIcon, Pencil, Trash2, Sun, Moon } from 'lucide-react';

export const ICONS = {
    Dashboard: <AreaChart size={20} />,
    Journal: <BookOpen size={20} />,
    Wallet: <Wallet size={20} />,
    User: <UserIcon size={20} />,
    Logout: <LogOut size={20} />,
    Win: <TrendingUp className="text-emerald-500" size={20} />,
    Loss: <TrendingDown className="text-red-500" size={20} />,
    Target: <Target size={20} />,
    AI: <BrainCircuit size={18} />,
    Loading: <Loader2 className="animate-spin" size={20} />,
    Plus: <Plus size={20} />,
    Close: <X size={20} />,
    Search: <Search size={18} />,
    Calendar: <Calendar size={16} />,
    Dollar: <DollarSign size={16} />,
    Image: <ImageIcon size={16} />,
    Edit: <Pencil size={18} />,
    Delete: <Trash2 size={18} />,
    Sun: <Sun size={20} />,
    Moon: <Moon size={20} />
};

export const API_URL: string | undefined = process.env.API_URL; 
console.log('API_URL :', API_URL);
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Clock } from 'lucide-react';

type TickerItem = {
    id: number;
    message: string;
    risk: string;
    category: string;
    timestamp: string;
};

export default function LiveTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        
        const connect = () => {
            try {
                eventSource = new EventSource('http://localhost:5000/api/ticker/stream');
                
                eventSource.onopen = () => {
                    setIsConnected(true);
                    console.log('✅ Live feed connected');
                };

                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'connected' && data.analyses) {
                        if (data.analyses.length > 0) {
                            setItems(data.analyses);
                        }
                    } else if (data.message) {
                        setItems(prev => [data, ...prev].slice(0, 20));
                    }
                };

                eventSource.onerror = () => {
                    setIsConnected(false);
                    eventSource?.close();
                    // Auto-reconnect after 5 seconds
                    setTimeout(connect, 5000);
                };
            } catch (error) {
                console.error('Connection error:', error);
                setTimeout(connect, 5000);
            }
        };

        connect();

        return () => {
            eventSource?.close();
        };
    }, []);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    const getRiskDot = (risk: string) => {
        switch (risk) {
            case 'Critical': return 'bg-red-500';
            case 'High': return 'bg-orange-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };

    const formatTime = (iso: string) => {
        if (!iso) return '--';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '--';

        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        }).format(date);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-slate-800" />
                    <h3 className="font-semibold text-lg text-slate-900 tracking-tight">Live Activity</h3>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{isConnected ? 'Live' : 'Offline'}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <TrendingUp className="w-4 h-4 text-slate-400 mb-2" />
                    <p className="text-2xl font-bold text-slate-800">{items.length}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Analyses</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <Clock className="w-4 h-4 text-slate-400 mb-2" />
                    <p className="text-2xl font-bold text-slate-800">Real-time</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Status</p>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getRiskDot(item.risk)} animate-pulse`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">{item.message}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${getRiskColor(item.risk)}`}>
                                            {item.risk}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">
                                            {formatTime(item.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

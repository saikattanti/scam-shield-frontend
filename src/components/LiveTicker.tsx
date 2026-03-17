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
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-slate-900">Live Activity</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-medium text-slate-600">{isConnected ? 'Live' : 'Offline'}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                    <TrendingUp className="w-4 h-4 text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-700">{items.length}</p>
                    <p className="text-xs text-blue-600 font-medium">Analyses</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
                    <Clock className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-purple-700">Live</p>
                    <p className="text-xs text-purple-600 font-medium">Real-time</p>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getRiskDot(item.risk)} animate-pulse`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 font-medium leading-snug mb-2">{item.message}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getRiskColor(item.risk)}`}>
                                            {item.risk}
                                        </span>
                                        <span className="text-xs text-slate-500">
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

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type TickerItem = {
    id: number;
    message: string;
    risk: string;
    category: string;
    timestamp: string;
};

export default function LiveTicker() {
    const { t } = useLanguage();
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur flex flex-col min-h-115">
            <div className="pointer-events-none absolute -top-16 right-10 h-44 w-44 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-emerald-100/60 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-700" />
                    <h3 className="font-semibold text-lg text-slate-900 tracking-tight">{t('live_title')}</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{isConnected ? t('live_live') : t('live_offline')}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/80 via-white to-blue-100/50 p-4">
                    <TrendingUp className="mb-2 h-4 w-4 text-blue-600" />
                    <p className="text-2xl font-bold text-slate-900">{items.length}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('live_analyses')}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-emerald-100/50 p-4">
                    <Clock className="mb-2 h-4 w-4 text-emerald-600" />
                    <p className="text-2xl font-bold text-slate-900">{t('live_realtime')}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('live_status')}</p>
                </div>
            </div>

            {/* Feed */}
            <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {items.length === 0 ? (
                    <div className="flex h-full min-h-55 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/90 bg-white/70 px-6 text-center">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                            <Activity className="h-5 w-5 text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Waiting for new scam events</p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                            Live reports will appear here automatically when the backend stream starts receiving analyses.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getRiskDot(item.risk)} animate-pulse`}></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="mb-3 text-sm font-medium leading-relaxed text-slate-800">{item.message}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getRiskColor(item.risk)}`}>
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
                )}
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';

interface RiskGaugeProps {
    score: number;
    risk: string;
}

export default function RiskGauge({ score, risk }: RiskGaugeProps) {
    const getColor = () => {
        if (score >= 80) return '#dc2626'; // red-600
        if (score >= 50) return '#ea580c'; // orange-600
        if (score >= 30) return '#ca8a04'; // yellow-600
        return '#16a34a'; // green-600
    };

    const getBgColor = () => {
        if (score >= 80) return 'bg-red-100';
        if (score >= 50) return 'bg-orange-100';
        if (score >= 30) return 'bg-yellow-100';
        return 'bg-green-100';
    };

    const color = getColor();
    const bgColor = getBgColor();

    return (
        <div className={`flex flex-col items-center justify-center p-6 rounded-2xl ${bgColor} border-2 border-slate-200`}>
            <div className="relative w-52 h-32 flex items-end justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 120 60">
                    {/* Background Track */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 110 50"
                        stroke="#e2e8f0" // slate-200
                        strokeWidth="14"
                        fill="none"
                        strokeLinecap="round"
                    />
                    {/* Active Progress */}
                    <motion.path
                        d="M 10 50 A 40 40 0 0 1 110 50"
                        stroke={color}
                        strokeWidth="14"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: score / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.2))' }}
                    />
                </svg>
                <div className="absolute bottom-0 text-center mb-3">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{score}</span>
                        <span className="text-sm uppercase tracking-widest font-bold mt-1" style={{ color }}>{risk}</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

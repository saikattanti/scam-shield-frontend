'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Zap className="w-4 h-4 mr-2 fill-blue-500 text-blue-500" />
            AI-Powered Fraud Detection
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-center mb-4 max-w-4xl mx-auto text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Stop Scams Before They <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Happen</span>
        </h1>

        <p className="text-center mx-auto mb-8 max-w-2xl text-lg text-slate-600">
          Analyze messages, URLs, and screenshots instantly. Our AI detects fraud patterns in multiple languages to keep you safe.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Real-time Protection</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Multi-Language</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Instant Analysis</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

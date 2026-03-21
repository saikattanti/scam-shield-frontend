"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";

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
        <h1 className="text-center mb-6 max-w-4xl mx-auto text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
          Is this message safe to open? <br />
          <span className="text-blue-600 block mt-2 text-3xl md:text-4xl">
            क्या यह संदेश खोलना सुरक्षित है?
          </span>
        </h1>

        <div className="text-center mx-auto mb-10 max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-lg md:text-xl text-slate-700 font-semibold mb-3">
            Paste any suspicious message, link, or photo below. We will tell you
            if it is a scam.
          </p>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            नीचे कोई भी संदेहास्पद संदेश, लिंक या फोटो डालें। हम आपको बताएंगे कि
            यह धोखाधड़ी (scam) है या नहीं।
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-base font-bold text-slate-700">
              100% Free & Safe
            </span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-base font-bold text-slate-700">
              Works in Hindi, Tamil, Telugu
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import InputForm from "@/components/InputForm";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check if it's a Scam — ScamShield",
  description: "Paste a suspicious message, URL, or image. Our AI detects scams instantly in 12 Indian languages.",
};

export default function CheckPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      {/* Main content - full width */}
      <div className="max-w-[1400px] mx-auto px-2 pt-6 pb-16">

        {/* Page Title Row */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">AI-Powered Scam Detection</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Is this a scam?
            </h1>
            <p className="text-slate-500 mt-3 text-sm max-w-lg font-medium leading-relaxed">
              Paste a suspicious message, URL, screenshot, or voice note — our hybrid AI engine analyses it instantly across 12 Indian languages.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3">
            {/* Top right actions */}
            <div className="flex items-center gap-2 lg:mb-2">
              <a href="tel:1930" className="text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 mr-1">
                🆘 Helpline: 1930
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition-colors hidden sm:flex"
              >
                cybercrime.gov.in →
              </a>
            </div>
            <div className="hidden lg:flex items-stretch gap-3">
              {[
                { value: '98.7%', label: 'Accuracy' },
                { value: '<2s', label: 'Speed' },
                { value: '12', label: 'Languages' },
              ].map(s => (
                <div key={s.label} className="bg-white border text-center border-slate-200 rounded-3xl px-5 shadow-sm flex flex-col justify-center min-w-[100px]">
                  <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}

              <div className="bg-slate-900 rounded-3xl px-6 py-4 text-white shadow-md relative overflow-hidden flex items-center justify-between min-w-[260px] ml-1 text-left border border-slate-800">
                <div className="absolute right-0 opacity-10 z-0">
                  <ShieldCheck className="w-28 h-28 translate-x-6" />
                </div>
                <div className="z-10 relative">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">System Status</p>
                  <p className="text-xl font-black tracking-tight">All Engines Active</p>
                </div>
                <div className="relative z-10 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="mt-8">
          <InputForm />
        </div>

      </div>
    </main>
  );
}

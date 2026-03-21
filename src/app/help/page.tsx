import GotScammedAssistant from "@/components/GotScammedAssistant";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I Got Scammed — Recovery Help | ScamShield",
  description: "Describe your situation and get a personalised AI-powered recovery plan with exact Indian helpline numbers.",
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      {/* Main content - full width */}
      <div className="max-w-[1400px] mx-auto px-2 pt-6 pb-16">
        
        {/* Page Title Row */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>

            <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Recovery Assistant</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
              You've been scammed.<br/>
              <span className="text-red-600">Let's fix it.</span>
            </h1>
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
                { value: '100%', label: 'Confidential' },
                { value: '24/7', label: 'Availability' },
                { value: '<1s', label: 'Action Plan' },
              ].map(s => (
                <div key={s.label} className="bg-white border text-center border-slate-200 rounded-3xl px-5 shadow-sm flex flex-col justify-center min-w-[100px]">
                  <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}

              <div className="bg-red-900 rounded-3xl px-6 py-4 text-white shadow-md relative overflow-hidden flex items-center justify-between min-w-[260px] ml-1 text-left border border-red-800">
                <div className="absolute right-0 opacity-10 z-0">
                  <Phone className="w-28 h-28 translate-x-6" />
                </div>
                <div className="z-10 relative">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Emergency Action</p>
                  <p className="text-xl font-black tracking-tight">Call 1930 Now</p>
                </div>
                <div className="relative z-10 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="mt-8">
          <GotScammedAssistantOpen />
        </div>
      </div>
    </main>
  );
}

// Server-safe wrapper that opens the form by default
function GotScammedAssistantOpen() {
  return <GotScammedAssistant defaultOpen />;
}

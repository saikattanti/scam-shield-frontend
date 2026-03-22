"use client";

import GotScammedAssistant from "@/components/GotScammedAssistant";
import { Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HelpPage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background system: calmer emergency-support palette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(239,68,68,0.12),transparent_33%),radial-gradient(circle_at_86%_18%,rgba(251,146,60,0.10),transparent_30%),radial-gradient(circle_at_48%_90%,rgba(30,41,59,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.20] bg-[linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] bg-size-[34px_34px]" />
        <div className="absolute -left-24 top-36 h-64 w-64 rounded-full bg-red-200/35 blur-3xl" />
        <div className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute left-1/3 bottom-12 h-56 w-56 rounded-full bg-slate-300/25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-white/80 to-transparent" />
      </div>

      {/* Main content - full width */}
      <div className="relative max-w-350 mx-auto px-2 pt-28 pb-16 md:pt-32">
        {/* Page Title Row */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">
              Recovery Assistant
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
              {t("help_title_1")}
              <br />
              <span className="text-red-600">{t("help_title_2")}</span>
            </h1>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3">
            {/* Top right actions */}
            <div className="flex items-center gap-2 lg:mb-2">
              <a
                href="tel:1930"
                className="text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 mr-1"
              >
                🆘 {t("check_helpline")}
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
                { value: "100%", label: t("help_confidential") },
                { value: "24/7", label: t("help_availability") },
                { value: "<1s", label: t("help_action_plan") },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white border text-center border-slate-200 rounded-3xl px-5 shadow-sm flex flex-col justify-center min-w-25"
                >
                  <p className="text-xl font-black text-slate-900 leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                    {s.label}
                  </p>
                </div>
              ))}

              <div className="bg-red-900 rounded-3xl px-6 py-4 text-white shadow-md relative overflow-hidden flex items-center justify-between min-w-65 ml-1 text-left border border-red-800">
                <div className="absolute right-0 opacity-10 z-0">
                  <Phone className="w-28 h-28 translate-x-6" />
                </div>
                <div className="z-10 relative">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">
                    {t("help_emergency")}
                  </p>
                  <p className="text-xl font-black tracking-tight">
                    {t("help_call_now")}
                  </p>
                </div>
                <div className="relative z-10 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] shrink-0" />
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

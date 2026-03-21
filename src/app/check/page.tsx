"use client";

import InputForm from "@/components/InputForm";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckPage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background system: calm gradients + subtle security-style pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(37,99,235,0.11),transparent_34%),radial-gradient(circle_at_84%_16%,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(15,23,42,0.08),transparent_44%)]" />
        <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] bg-size-[34px_34px]" />
        <div className="absolute -left-28 top-28 h-64 w-64 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute -right-24 top-36 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute left-1/3 bottom-12 h-56 w-56 rounded-full bg-slate-300/25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-white/80 to-transparent" />
      </div>

      {/* Main content - full width */}
      <div className="relative max-w-350 mx-auto px-2 pt-6 pb-16">
        {/* Page Title Row */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">
              AI-Powered Scam Detection
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              {t("check_title")}
            </h1>
            <p className="text-slate-500 mt-3 text-sm max-w-lg font-medium leading-relaxed">
              {t("check_subtitle")}
            </p>
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
                { value: "98.7%", label: t("check_accuracy") },
                { value: "<2s", label: t("check_speed") },
                { value: "12", label: t("check_languages") },
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

              <div className="bg-slate-900 rounded-3xl px-6 py-4 text-white shadow-md relative overflow-hidden flex items-center justify-between min-w-65 ml-1 text-left border border-slate-800">
                <div className="absolute right-0 opacity-10 z-0">
                  <ShieldCheck className="w-28 h-28 translate-x-6" />
                </div>
                <div className="z-10 relative">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                    {t("check_status_title")}
                  </p>
                  <p className="text-xl font-black tracking-tight">
                    {t("check_status_ok")}
                  </p>
                </div>
                <div className="relative z-10 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0" />
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

"use client";

import AuroraBackground from "@/components/AuroraBackground";
import LiveTicker from "@/components/LiveTicker";
import MapWrapper from "@/components/MapWrapper";
import Link from "next/link";
import SlideArrowButton from "@/components/ui/slide-arrow-button";
import { ShieldCheck, AlertOctagon, Globe, Zap, Lock, Users, Mic, BarChart2, Clock, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t("home_checker_title"),
      desc: t("home_checker_desc"),
      tone: "Detect",
      style: "blue",
    },
    {
      icon: Lock,
      title: "Privacy by Design",
      desc: "OCR runs in-browser. Only scam category & signals reach AI — never your raw message.",
      tone: "Protect",
      style: "slate",
    },
    {
      icon: Globe,
      title: "URL Deep Scanner",
      desc: "Checks DNS, domain age, SSL status, shortlinks, IP URLs, and phishing patterns.",
      tone: "Inspect",
      style: "cyan",
    },
    {
      icon: Mic,
      title: "AI Call Scanning",
      desc: "Upload call recordings or voice notes. AI transcribes and detects verbal scam patterns.",
      tone: "Listen",
      style: "violet",
    },
    {
      icon: BarChart2,
      title: "Explainable AI",
      desc: "Risk score breakdown across urgency, spoofing, payment threat, link safety, and social engineering.",
      tone: "Explain",
      style: "indigo",
    },
    {
      icon: Clock,
      title: "Fraud Timeline Builder",
      desc: "Generates a legal-ready incident summary for cybercrime reporting.",
      tone: "Document",
      style: "amber",
    },
    {
      icon: Search,
      title: "Evidence Analyzer",
      desc: "Signal-by-signal risk table that explains exactly why AI flagged the content.",
      tone: "Verify",
      style: "emerald",
    },
    {
      icon: Users,
      title: "Community Threat Map",
      desc: "Real-time heatmap of confirmed scam hotspots across India.",
      tone: "Connect",
      style: "rose",
    },
  ];

  const featureLayout = [
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-2",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-2",
    "lg:col-span-3",
    "lg:col-span-3",
  ];

  const featureStyles: Record<string, string> = {
    blue: "border-blue-200/70 bg-linear-to-br from-blue-50/70 via-white to-blue-100/40",
    slate: "border-slate-200/80 bg-linear-to-br from-slate-50/80 via-white to-slate-100/60",
    cyan: "border-cyan-200/70 bg-linear-to-br from-cyan-50/70 via-white to-cyan-100/40",
    violet: "border-violet-200/70 bg-linear-to-br from-violet-50/70 via-white to-violet-100/40",
    indigo: "border-indigo-200/70 bg-linear-to-br from-indigo-50/70 via-white to-indigo-100/40",
    amber: "border-amber-200/70 bg-linear-to-br from-amber-50/70 via-white to-amber-100/40",
    emerald: "border-emerald-200/70 bg-linear-to-br from-emerald-50/70 via-white to-emerald-100/40",
    rose: "border-rose-200/70 bg-linear-to-br from-rose-50/70 via-white to-rose-100/40",
  };

  const stats = [
    { value: "98.7%", label: t("home_stats_accuracy") },
    { value: "12", label: t("home_stats_languages") },
    { value: "<2s", label: t("home_stats_speed") },
    { value: "5", label: t("home_stats_risk") },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <AuroraBackground />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
              {t("home_badge")}
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
              {t("home_headline_1")}
              <br />
              <span className="text-blue-600">{t("home_headline_2")}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
              {t("home_subtitle")}
            </p>
          </div>

          {/* Two Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SlideArrowButton
              href="/check"
              text={t("home_cta_check")}
              primaryColor="#0f172a"
              className="border-slate-200"
            />

            <SlideArrowButton
              href="/help"
              text={t("home_cta_help")}
              primaryColor="#dc2626"
              className="border-red-200"
            />
          </div>

          {/* Trust pill */}
          <p className="text-xs text-slate-400 font-medium">
            {t("home_trust")}
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-slate-100 bg-slate-50/70 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 md:mb-16 md:flex md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-blue-700">How it works</p>
              <h2 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {t("home_how_title")}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="group relative rounded-4xl border border-blue-100/80 bg-white p-8 shadow-[0_16px_40px_-24px_rgba(37,99,235,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(37,99,235,0.55)] md:p-9">
              <div className="absolute right-6 top-6 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-700">
                01
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-linear-to-br from-white to-blue-50">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900">{t("home_checker_title")}</h3>
              <p className="mb-7 max-w-md text-[15px] leading-7 text-slate-600">{t("home_checker_desc")}</p>
              <Link
                href="/check"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
              >
                {t("home_checker_link")}
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="group relative rounded-4xl border border-red-100/80 bg-white p-8 shadow-[0_16px_40px_-24px_rgba(220,38,38,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(220,38,38,0.55)] md:mt-10 md:p-9">
              <div className="absolute right-6 top-6 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-bold tracking-wider text-red-700">
                02
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-linear-to-br from-white to-red-50">
                <AlertOctagon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900">{t("home_recovery_title")}</h3>
              <p className="mb-7 max-w-md text-[15px] leading-7 text-slate-600">{t("home_recovery_desc")}</p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
              >
                {t("home_recovery_link")}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="relative overflow-hidden border-t border-slate-100 py-20 px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[12%] top-12 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute bottom-8 right-[10%] h-44 w-44 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center md:mb-14">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-700">Why ScamShield</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">{t("home_why_title")}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {features.map((f, idx) => (
              <article
                key={f.title}
                className={`feature-card-entrance group relative rounded-3xl border p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.55)] ${featureLayout[idx]} ${featureStyles[f.style]}`}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/70 backdrop-blur-sm">
                    <f.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {f.tone}
                  </span>
                </div>

                <h4 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">{f.title}</h4>
                <p className="max-w-[36ch] text-sm leading-7 text-slate-600">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Activity & Map ── */}
      <section className="relative mx-auto mb-16 max-w-7xl space-y-7 px-4 py-16">
        <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 h-105 rounded-[40px] bg-linear-to-b from-slate-100/80 via-white to-transparent" />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Community</p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{t("home_live_title")}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Real-time monitoring
          </div>
        </div>

        <LiveTicker />
        <MapWrapper />
      </section>
    </main>
  );
}

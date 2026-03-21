import AuroraBackground from "@/components/AuroraBackground";
import LiveTicker from "@/components/LiveTicker";
import MapWrapper from "@/components/MapWrapper";
import Link from "next/link";
import { ShieldCheck, AlertOctagon, Globe, Zap, Lock, Users, Mic } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "Our hybrid engine (ML + rule-based) detects scams in under 2 seconds across 12 Indian languages.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    desc: "Your messages are never stored. We use one-way SHA-256 hashes — even we can't read your data.",
  },
  {
    icon: Globe,
    title: "12 Indian Languages",
    desc: "Detects scams in English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam & more.",
  },
  {
    icon: Mic,
    title: "AI Call Scanning",
    desc: "Upload call recordings or WhatsApp voice notes. Our AI transcribes and detects deepfake verbal scams.",
  },
  {
    icon: Users,
    title: "Community Threat Map",
    desc: "Real-time heatmap of confirmed scam hotspots across India, anonymised to within 70 km.",
  },
];

const stats = [
  { value: "98.7%", label: "Detection Accuracy" },
  { value: "12", label: "Indian Languages" },
  { value: "<2s", label: "Analysis Speed" },
  { value: "0", label: "Messages Stored" },
];

export default function Home() {
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
              AI-Powered Scam Detection · Made for India
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
              Protect yourself
              <br />
              <span className="text-blue-600">from every scam.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
              Paste a suspicious message, link, photo, or <b>voice note</b> — our AI tells you instantly if it's a scam.
              Already been scammed? We generate a step-by-step recovery plan.
            </p>
          </div>

          {/* Two Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/check"
              className="group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Is this a scam?
              <span className="text-slate-400 group-hover:text-slate-300 text-sm ml-1">→</span>
            </Link>

            <Link
              href="/help"
              className="group flex items-center gap-3 bg-white hover:bg-red-50 text-slate-900 hover:text-red-700 font-semibold text-base px-8 py-4 rounded-2xl border-2 border-slate-200 hover:border-red-300 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <AlertOctagon className="w-5 h-5 text-red-500" />
              I got scammed — help me
              <span className="text-slate-400 group-hover:text-red-400 text-sm ml-1">→</span>
            </Link>
          </div>

          {/* Trust pill */}
          <p className="text-xs text-slate-400 font-medium">
            🔒 Private &amp; secure · No account needed · Free forever
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
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Two tools. One mission.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl" />
            <div className="bg-blue-50 border border-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Scam Checker</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Paste any suspicious message, URL, photo, or <b>call recording</b>. Our AI analyses text in 12 languages, transcribes voice notes, and checks links
              for phishing with Gemini-powered next steps.
            </p>
            <Link
              href="/check"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Check a message →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-400 rounded-t-3xl" />
            <div className="bg-red-50 border border-red-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Recovery Assistant</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Already been scammed? Describe what happened or upload a screenshot. Our AI identifies the scam
              type and generates a personalised 5-step recovery plan with exact Indian helpline numbers.
            </p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
            >
              Get recovery help →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-16 px-4 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Why ScamShield</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Built for every Indian</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="bg-slate-100 w-9 h-9 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-slate-700" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-2">{f.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Activity & Map ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-8 mb-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Community</p>
              <h2 className="text-xl font-bold text-slate-900">Live Scam Activity</h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time
            </span>
          </div>
          <LiveTicker />
        </div>
        <MapWrapper />
      </section>
    </main>
  );
}

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
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Emergency banner */}
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="bg-red-100 border border-red-200 rounded-xl p-2 flex-shrink-0">
            <Phone className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900">Emergency? Call 1930 now</p>
            <p className="text-xs text-red-700 mt-0.5">
              National Cyber Crime Helpline (24×7) · Or file online at{" "}
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-red-900">
                cybercrime.gov.in
              </a>
            </p>
          </div>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Recovery Assistant</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            You&apos;ve been scammed.
            <br />
            <span className="text-red-600">Let&apos;s fix it.</span>
          </h1>
          <p className="text-slate-500 mt-3 text-base leading-relaxed">
            Describe what happened or upload a screenshot. Our AI identifies the scam type and generates
            a personalised step-by-step recovery plan — including the exact apps and helplines to call.
          </p>
        </div>

        {/* The recovery assistant (opened by default on this page) */}
        <GotScammedAssistantOpen />
      </div>
    </main>
  );
}

// Server-safe wrapper that opens the form by default
function GotScammedAssistantOpen() {
  return <GotScammedAssistant defaultOpen />;
}

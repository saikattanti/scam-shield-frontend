import InputForm from "@/components/InputForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check if it's a Scam — ScamShield",
  description: "Paste a suspicious message, URL, or image. Our AI detects scams instantly in 12 Indian languages.",
};

export default function CheckPage() {
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

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Scam Checker</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Is this a scam?
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Paste a suspicious message, website link, or photo below — we&apos;ll tell you in seconds.
          </p>
        </div>

        {/* The form */}
        <InputForm />

        {/* Privacy note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Your messages are never stored. Deleted instantly after checking.
        </p>
      </div>
    </main>
  );
}

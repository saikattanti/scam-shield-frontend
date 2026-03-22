"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, Globe } from "lucide-react";
import { Language, useLanguage } from "@/context/LanguageContext";
import SlideArrowButton from "@/components/ui/slide-arrow-button";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-[100] pointer-events-none">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] px-6 py-2 pointer-events-auto">
        <div className="flex h-12 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-slate-800 transition-colors">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">ScamShield<span className="text-blue-600">.</span></span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <SlideArrowButton href="/check" text={t('nav_check')} primaryColor="#0f172a" className="scale-90" />
            <SlideArrowButton href="/help" text={t('nav_scammed')} primaryColor="#dc2626" className="scale-90" />

            <div className="ml-2 pl-3 border-l border-slate-200/50 flex items-center relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-6 pointer-events-none" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-[140px] pl-9 pr-4 py-1.5 bg-transparent text-slate-700 font-bold rounded-md focus:outline-none appearance-none cursor-pointer hover:bg-white/40 text-xs transition-all"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="gu">ગુજરાતી (GU)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="ml">മലയാളം (ML)</option>
                <option value="pa">ਪੰਜਾਬੀ (PA)</option>
                <option value="ur">اردو (UR)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-600 hover:bg-white/50 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav - also pill style */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 md:hidden bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 pointer-events-auto">
          <div className="p-6 space-y-4">
            <div className="flex flex-col gap-3">
              <SlideArrowButton href="/check" text={t('nav_check')} primaryColor="#0f172a" className="w-full" onClick={() => setIsOpen(false)} />
              <SlideArrowButton href="/help" text={t('nav_scammed')} primaryColor="#dc2626" className="w-full" onClick={() => setIsOpen(false)} />
            </div>
            <div className="pt-4 border-t border-slate-200/50 relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-7 pointer-events-none" />
              <select 
                value={language}
                onChange={(e) => { handleLanguageChange(e); setIsOpen(false); }}
                className="w-full pl-10 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl appearance-none cursor-pointer text-sm"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="gu">ગુજરાતી (GU)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="ml">മലയാളം (ML)</option>
                <option value="pa">ਪੰਜਾਬੀ (PA)</option>
                <option value="ur">اردو (UR)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
